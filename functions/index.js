const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.notifyOnEventCreated = onDocumentCreated("Events/{eventId}", async (event) => {
  const snap = event.data;
  if (!snap) {
    logger.warn("No event data found");
    return;
  }

  const eventData = snap.data();
  logger.info("New event created:", { eventId: event.params.eventId, eventName: eventData.name });

  try {
    logger.info("Getting users with FCM tokens...");
    
    // Obtener tokens de usuarios
    const usersSnap = await admin.firestore().collection("Users").get();
    const allTokenData = usersSnap.docs.map((doc) => ({
      userId: doc.id,
      token: doc.data().fcmToken
    }));

    // Filtrar tokens válidos
    const validTokens = allTokenData.filter(
      (t) => t.token && typeof t.token === 'string' && t.token.trim().length > 100
    );

    logger.info(`Found ${allTokenData.length} users total, ${validTokens.length} with valid FCM tokens`);

    if (validTokens.length === 0) {
      logger.warn("No valid FCM tokens found for any user");
      return;
    }

    const message = {
      notification: {
        title: "Nuevo evento creado",
        body: `Se creó el evento: ${eventData.name}`
      },
      data: {
        eventId: event.params.eventId,
        type: 'new_event',
        eventName: eventData.name
      }
    };

    // Enviar a cada token individualmente para mejor diagnóstico
    logger.info(`Attempting to send notifications to ${validTokens.length} tokens...`);
    const results = [];
    
    for (const tokenData of validTokens) {
      try {
        const result = await admin.messaging().send({
          ...message,
          token: tokenData.token
        });
        logger.info(`✅ Sent to ${tokenData.userId}:`, { messageId: result });
        results.push({ userId: tokenData.userId, success: true, messageId: result });
      } catch (error) {
        logger.warn(`❌ Failed to send to ${tokenData.userId}:`, { 
          token: tokenData.token.substring(0, 20) + '...', 
          error: error.code 
        });
        results.push({ userId: tokenData.userId, success: false, error: error.code });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;
    
    logger.info("Notification sending completed:", {
      successCount,
      failureCount,
      total: validTokens.length
    });

    return { successCount, failureCount, results };
  } catch (error) {
    logger.error("Error sending notifications:", error);
    throw error;
  }
});

// Cloud Function que se ejecuta cada 5 minutos para verificar recordatorios pendientes
exports.checkScheduledReminders = onSchedule("every 5 minutes", async (event) => {
  logger.info("🔔 Checking for scheduled reminders...");

  try {
    const now = admin.firestore.Timestamp.now();
    const fiveMinutesAgo = admin.firestore.Timestamp.fromMillis(now.toMillis() - (5 * 60 * 1000));

    // Buscar recordatorios que deben enviarse (entre hace 5 minutos y ahora, y no enviados)
    const remindersSnap = await admin.firestore()
      .collection("Reminders")
      .where("sent", "==", false)
      .where("reminderDate", ">=", fiveMinutesAgo)
      .where("reminderDate", "<=", now)
      .get();

    if (remindersSnap.empty) {
      logger.info("No reminders to send at this time");
      return { sent: 0 };
    }

    logger.info(`Found ${remindersSnap.size} reminders to send`);

    const results = [];

    for (const reminderDoc of remindersSnap.docs) {
      const reminder = reminderDoc.data();
      const reminderId = reminderDoc.id;

      try {
        // Obtener información del evento
        const eventDoc = await admin.firestore().collection("Events").doc(reminder.eventId).get();
        
        if (!eventDoc.exists) {
          logger.warn(`Event ${reminder.eventId} not found for reminder ${reminderId}`);
          // Marcar como enviado para no intentar de nuevo
          await reminderDoc.ref.update({ sent: true });
          continue;
        }

        const eventData = eventDoc.data();

        // Obtener tokens de los usuarios especificados en el recordatorio
        const usersSnap = await admin.firestore()
          .collection("Users")
          .where(admin.firestore.FieldPath.documentId(), "in", reminder.userIds)
          .get();

        const validTokens = usersSnap.docs
          .map(doc => ({
            userId: doc.id,
            token: doc.data().fcmToken
          }))
          .filter(t => t.token && typeof t.token === 'string' && t.token.trim().length > 100);

        if (validTokens.length === 0) {
          logger.warn(`No valid FCM tokens found for reminder ${reminderId}`);
          await reminderDoc.ref.update({ sent: true });
          continue;
        }

        logger.info(`Sending reminder ${reminderId} to ${validTokens.length} users`);

        const message = {
          notification: {
            title: "Recordatorio de evento",
            body: `Recordatorio: ${eventData.name}`
          },
          data: {
            eventId: reminder.eventId,
            type: 'reminder',
            eventName: eventData.name,
            reminderId: reminderId
          }
        };

        // Enviar notificación a cada usuario
        const sendResults = [];
        for (const tokenData of validTokens) {
          try {
            const result = await admin.messaging().send({
              ...message,
              token: tokenData.token
            });
            logger.info(`✅ Reminder sent to ${tokenData.userId}:`, { messageId: result });
            sendResults.push({ userId: tokenData.userId, success: true });
          } catch (error) {
            logger.warn(`❌ Failed to send reminder to ${tokenData.userId}:`, { error: error.code });
            sendResults.push({ userId: tokenData.userId, success: false, error: error.code });
          }
        }

        // Marcar recordatorio como enviado
        await reminderDoc.ref.update({ 
          sent: true,
          sentAt: admin.firestore.FieldValue.serverTimestamp()
        });

        results.push({
          reminderId,
          eventName: eventData.name,
          usersNotified: sendResults.filter(r => r.success).length,
          totalUsers: validTokens.length
        });

      } catch (error) {
        logger.error(`Error processing reminder ${reminderId}:`, error);
      }
    }

    logger.info("Reminder check completed:", {
      totalReminders: remindersSnap.size,
      processed: results.length
    });

    return { sent: results.length, details: results };
  } catch (error) {
    logger.error("Error checking reminders:", error);
    throw error;
  }
});
