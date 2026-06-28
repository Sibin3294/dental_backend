const { getFirebaseAdmin } = require("../config/firebaseAdmin");

exports.sendPushToMany = async (tokens, title, body, data = {}) => {
  if (!tokens || !tokens.length) return;

  const admin = getFirebaseAdmin();
  if (!admin) {
    console.warn("Push skipped — Firebase not configured");
    return;
  }

  const message = {
    notification: { title, body },
    data,
    tokens,
  };

  const response = await admin.messaging().sendEachForMulticast(message);
  console.log("Push response:", response.successCount, "sent,", response.failureCount, "failed");
};
