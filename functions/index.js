const { onDocumentCreated } = require("firebase-functions/v2/firestore");
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
