import { getMessagingClient } from "./firebase";
import { getToken, onMessage } from "firebase/messaging";

export const requestNotificationPermission = async () => {
  try {
    const messaging = getMessagingClient();
    if (!messaging) return;

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    console.log("FCM TOKEN:", token);

    return token;
  } catch (err) {
    console.log("Notification error:", err);
  }
};

export const listenNotifications = () => {
  const messaging = getMessagingClient();
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    console.log("Foreground notification:", payload);

    alert(payload.notification?.title || "New alert received");
  });
};