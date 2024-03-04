importScripts("swenv.js"); // this file should have all the environment variables declared, allowing you to use process.env.ANY_KEY_YOU_DEFINED
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

self.addEventListener("install", function (e) {
  console.log("fcm sw install..");
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  console.log("fcm sw activate..");
});

self.addEventListener("push", function (e) {
  console.log("push message!!");
  const data = e.data?.json() ?? {};
  const resultData = data.notification;
  const notificationTitle = resultData.title;
  const notificationOptions = {
    body: resultData.body,
    icon: "https://217.142.255.104.nip.io/ironMan.png", // 웹 푸시 이미지는 icon
    // tag: resultData.tag,
    data: {
      url: data.data.url,
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", function (event) {
  console.log("notification click");
  const url = event?.notification?.data?.url || "/";
  event.notification.close();
  event.waitUntil(clients.openWindow(url));
});

messaging.onBackgroundMessage((event) => {
  console.log("[firebase-messaging-sw.js] Received background message ", event);
  if (event && event?.notification) {
    const notificationTitle = event.notification.title;
    const notificationOptions = {
      body: event.notification.body,
      icon: "https://217.142.255.104.nip.io/ironMan.png", // 웹 푸시 이미지는 icon
      data: {
        url: event.data.url,
      },
    };
    const voidPromise = self.registration?.showNotification(
      notificationTitle,
      notificationOptions
    );
    return voidPromise;
  }
});
