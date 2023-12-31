"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
      <section className="h-screen">
        <div className="container h-full px-6 py-24">
          <div className="g-6 flex h-full flex-wrap items-center justify-center lg:justify-between">
            {/* <!-- Left column container with background--> */}
            <div className="mb-12 md:mb-0 md:w-8/12 lg:w-6/12">
              <h4 className="mb-6 text-xl font-semibold">
                <Image
                  className="inline-block h-12 w-12 rounded-full ring-2 ring-white"
                  src="/ironMan.png"
                  alt="lahuman"
                  width={100}
                  height={100}
                />
                Daily Quests
              </h4>

              <p className="text-sm">
                The program designed for daily missions is an innovative tool
                developed to aid in individual growth and goal attainment. Its
                core focus revolves around helping users set new challenges and
                objectives each day and assisting them in accomplishing those
                goals. With a user-friendly interface and personalized features,
                the program is designed to seamlessly integrate into users daily
                routines.
              </p>
            </div>

            {/* <!-- Right column container with form --> */}
            <div className="md:w-8/12 lg:ml-6 lg:w-5/12">
              {/* <!-- Email input --> */}
              {error && <div className="text-rose-600	">{error}</div>}

              {/* <!-- Social login buttons --> */}
              <button
                className="mb-3 flex w-full items-center justify-center rounded bg-primary px-7 pb-2.5 pt-3 text-center text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                style={{ backgroundColor: "#1a73e8" }}
                onClick={onLoginGoogle}
                disabled={loading}
              >
                {/* <!-- google --> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  fill="currentColor"
                  style={{ color: "#ea4335" }}
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M7 11v2.4h3.97c-.16 1.029-1.2 3.02-3.97 3.02-2.39 0-4.34-1.979-4.34-4.42 0-2.44 1.95-4.42 4.34-4.42 1.36 0 2.27.58 2.79 1.08l1.9-1.83c-1.22-1.14-2.8-1.83-4.69-1.83-3.87 0-7 3.13-7 7s3.13 7 7 7c4.04 0 6.721-2.84 6.721-6.84 0-.46-.051-.81-.111-1.16h-6.61zm0 0 17"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  />
                </svg>
                Continue with Google
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
