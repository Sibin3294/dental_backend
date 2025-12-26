import admin from "../config/firebaseAdmin.js";



exports.sendPushToMany = async (tokens, title, body, data = {}) => {
  if (!tokens.length) return;

  const message = {
    notification: {
      title,
      body,
    },
    data,
    tokens,
  };

  await admin.messaging().sendMulticast(message);
};
