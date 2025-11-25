const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.notifyOnEventCreated = onDocumentCreated("Events/{eventId}", async (event) => {
  const snap = event.data;
  if (!snap) return;

  const eventData = snap.data();

  // Obtener tokens de usuarios
  const usersSnap = await admin.firestore().collection("Users").get();
  const tokens = usersSnap.docs
    .map((doc) => doc.data().fcmToken)
    .filter((t) => t);

  if (tokens.length === 0) return;

  const message = {
    notification: {
      title: "Nuevo evento creado",
      body: `Se creó el evento: ${eventData.name}`
    },
    tokens,
  };

  return admin.messaging().sendMulticast(message);
});
