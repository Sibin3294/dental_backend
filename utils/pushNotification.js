const admin = require("./firebase");

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
