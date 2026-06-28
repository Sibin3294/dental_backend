const admin = require("firebase-admin");

let initialized = false;

function getFirebaseAdmin() {
  if (initialized) return admin;

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    console.warn("FIREBASE_SERVICE_ACCOUNT not set — push notifications disabled");
    return null;
  }

  try {
    const serviceAccount = JSON.parse(raw);
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
    initialized = true;
    return admin;
  } catch (err) {
    console.error("Failed to initialize Firebase Admin:", err.message);
    return null;
  }
}

module.exports = { getFirebaseAdmin };
