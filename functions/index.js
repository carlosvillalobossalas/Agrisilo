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
    // Obtener tokens de usuarios
    const usersSnap = await admin.firestore().collection("Users").get();
    const tokens = usersSnap.docs
      .map((doc) => doc.data().fcmToken)
      .filter((t) => t);

    logger.info(`Found ${tokens.length} users with FCM tokens`);

    if (tokens.length === 0) {
      logger.warn("No FCM tokens found for any user");
      return;
    }

    const message = {
      notification: {
        title: "Nuevo evento creado",
        body: `Se creó el evento: ${eventData.name}`
      },
      tokens,
    };

    const response = await admin.messaging().sendMulticast(message);
    logger.info("Notifications sent:", {
      successCount: response.successCount,
      failureCount: response.failureCount
    });

    return response;
  } catch (error) {
    logger.error("Error sending notifications:", error);
    throw error;
  }
});
