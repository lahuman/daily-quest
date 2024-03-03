"use client";
import React, { useContext, useState, useEffect, ReactNode } from "react";
import { auth, signInWithGoogle, signOutAccount, getMessageToken } from "@/app/firebase";
import { User } from "firebase/auth";


export interface AuthContextType {
  currentUser?: User | null | undefined;
  loginGoogle?: () => Promise<void>;
  logout?: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType>({});

export function useAuth() {
  return useContext(AuthContext);
}

export function getFirebaseToken() {
  return getMessageToken();
}
export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>();
  const [loading, setLoading] = useState(true);

  // 구글 로그인
  async function loginGoogle() {
    await signInWithGoogle();
    auth?.currentUser
      ?.getIdToken(/* forceRefresh */ true)
      .then(function (idToken) {
        // Send token to your backend via HTTPS
        // ...
        // console.log(idToken);
        console.log(getMessageToken())
      })
      .catch(function (error) {
        // Handle error
      });
  }

  // 로그아웃
  function logout() {
    return signOutAccount();
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loginGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
