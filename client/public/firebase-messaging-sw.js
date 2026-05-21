importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyB44lDHSQ5E33oMK7c5X8SeTy0xakim4L0",
  authDomain: "alert-naija.firebaseapp.com",
  projectId: "alert-naija",
  messagingSenderId: "793477786569",
  appId: "1:793477786569:web:4e3d84f573d5a988e61618",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(
    payload.notification.title,
    {
      body: payload.notification.body,
    }
  );
});