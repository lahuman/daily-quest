import { initializeApp } from "firebase/app";
import {
  getAuth,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// import { getAnalytics } from "firebase/analytics";

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
});
const isSupported = () =>
  "Notification" in window &&
  "serviceWorker" in navigator &&
  "PushManager" in window;

if (isSupported()) {
  const messaging = getMessaging(app);

    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("알림 권한이 허용됨");

        // FCM 메세지 처리
      } else {
        console.log("알림 권한 허용 안됨");
      }
    });

  // 메세지가 수신되면 역시 콘솔에 출력합니다.
  onMessage(messaging, (payload) => {
    console.log("Message received. ", payload);
  });
}

export async function getMessageToken() {
  const messaging = getMessaging(app);
  const token = await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_APP_VAPID_KEY,
  });

  return token;
}

export const auth = getAuth(app);

export const signOutAccount = async () => {
  await signOut(auth);
  return auth.signOut();
};

// 구글 로그인
const gProvider = new GoogleAuthProvider();
export const signInWithGoogle = async () => {
  await signInWithPopup(auth, gProvider);
};
