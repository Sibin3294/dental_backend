import admin from "../config/firebaseAdmin"; // the file from step 2

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
