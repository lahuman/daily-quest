import { initializeApp } from "firebase/app";
import {
  getAuth,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

import { client } from "./todo/fetchHelper";


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

if (typeof window !== "undefined" && typeof window.navigator !== "undefined") {
  const messaging = getMessaging(app);
  if (isSupported()) {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("알림 권한이 허용됨");

        // 서비스 워커 등록
        navigator.serviceWorker
          .register('/firebase-messaging-sw.js')
          .then((registration) => {
            console.log("서비스 워커 등록 성공:", registration);
          })
          .catch((error) => {
            console.error("서비스 워커 등록 실패:", error);
          });

        // FCM 메세지 처리
        onMessage(messaging, (payload) => {
          console.log("메세지 수신됨: ", payload);
          new Notification(payload?.notification?.title || 'Title', {
            body: payload?.notification?.body,
            icon: payload?.notification?.icon,
          });
        });
      } else {
        console.log("알림 권한 허용 안됨");
      }
    });
  }
}

export async function getMessageToken() {
  const messaging = getMessaging(app);
  try {
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_APP_VAPID_KEY,
    });
    console.log("토큰 획득 성공:", token);
    await saveTokenToServer(token);
    return token;
  } catch (error) {
    console.error("토큰 획득 실패:", error);
    return null;
  }
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

// 서버에 토큰을 저장하는 함수
async function saveTokenToServer(token: string) {
  try {
    client(`/user/settingDeviceToken`, {
      method: "POST",
      body: {
        deviceToken: token,
      },
    }).then(() => {
      console.log("setting deviceToken");
    });
  } catch (error) {
    console.error('서버에 토큰 저장 중 오류 발생:', error);
  }
}
