// utils/pushNotification.js
const admin = require("../config/firebaseAdmin");

exports.sendPushToMany = async (tokens, title, body, data = {}) => {
  if (!tokens || !tokens.length) return;

  const message = {
    notification: { title, body },
    data,
    tokens,
  };

  await admin.messaging().sendMulticast(message);
};
