const admin = require("../config/firebaseAdmin");

exports.sendPushToMany = async (tokens, title, body, data = {}) => {
  if (!tokens || !tokens.length) return;

  const message = {
    notification: {
      title,
      body,
    },
    data,
    tokens,
  };

  // ✅ Firebase Admin v11+
  const response = await admin.messaging().sendEachForMulticast(message);

  console.log("Push response:", response);
};
