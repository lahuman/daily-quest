"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styled from "styled-components";
import Loading from "@/components/Loading";

const LoginContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  padding: 2rem;
  
  @media (min-width: 768px) {
    max-width: 480px;
  }
`;

const LoginHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
`;

const LoginContent = styled.div`
  background: #f3f4f6;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: #1a73e8;
  color: white;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #1557b0;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export default function Login() {
  const { loginGoogle, currentUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function callHelper(fun: Function) {
    return async function (...args: any) {
      try {
        setError("");
        setLoading(true);
        await fun(...args);
        setLoading(false);
        router.push("/");
      } catch (e: unknown | any) {
        setError(e.message);
        setLoading(false);
      }
    };
  }

  async function onLoginGoogle(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (loginGoogle) {
      const makeCall = callHelper(loginGoogle);
      await makeCall();
    }
  }

  useEffect(() => {
    if (currentUser) {
      router.push("/");
    }
  }, [currentUser, router]);

  return (
    <>
      {loading && <Loading />}
      <div className="min-h-screen flex items-center justify-center px-4">
        <LoginContainer>
          <LoginHeader>
            <Image
              className="h-12 w-12 rounded-full ring-2 ring-indigo-600"
              src="/ironMan.png"
              alt="lahuman"
              width={48}
              height={48}
            />
            <h1 className="text-2xl font-semibold text-gray-900">Daily Quests</h1>
          </LoginHeader>

          <LoginContent>
            <p className="text-sm text-gray-600 leading-relaxed">
              The program designed for daily missions is an innovative tool
              developed to aid in individual growth and goal attainment. Its
              core focus revolves around helping users set new challenges and
              objectives each day and assisting them in accomplishing those
              goals.
            </p>
          </LoginContent>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}

          <GoogleButton
            onClick={onLoginGoogle}
            disabled={loading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M7 11v2.4h3.97c-.16 1.029-1.2 3.02-3.97 3.02-2.39 0-4.34-1.979-4.34-4.42 0-2.44 1.95-4.42 4.34-4.42 1.36 0 2.27.58 2.79 1.08l1.9-1.83c-1.22-1.14-2.8-1.83-4.69-1.83-3.87 0-7 3.13-7 7s3.13 7 7 7c4.04 0 6.721-2.84 6.721-6.84 0-.46-.051-.81-.111-1.16h-6.61zm0 0 17"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
            Continue with Google
          </GoogleButton>
        </LoginContainer>
      </div>
    </>
  );
}
