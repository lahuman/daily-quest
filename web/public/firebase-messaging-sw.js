importScripts("swenv.js");

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
});

const messaging = firebase.messaging();


messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] 백그라운드 메시지 수신 ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("install", function (e) {
  console.log("fcm sw install..");
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  console.log("fcm sw activate..");
});

// 푸시 메시지 수신 이벤트
self.addEventListener("push", function (e) {
  const data = e.data?.json() ?? {};
  const notificationTitle = data.notification.title;
  const notificationOptions = {
    body: data.notification.body,
    icon: data.notification.icon,
    data: {
      url: data.data.url,
    },
  };

  e.waitUntil(self.registration.showNotification(notificationTitle, notificationOptions));
});

self.addEventListener("notificationclick", function (event) {
  const url = event.notification.data.url || "/";
  event.notification.close();
  event.waitUntil(clients.openWindow(url));
});
