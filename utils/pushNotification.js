import { messaging } from "../config/firebaseAdmin.js";



export async function sendPushToMany(tokens, title, body, data = {}) {
  if (!tokens.length) return;

  const message = {
    notification: {
      title,
      body,
    },
    data,
    tokens,
  };

  await messaging().sendMulticast(message);
}
