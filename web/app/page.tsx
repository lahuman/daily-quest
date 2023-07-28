"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    setError("");

    try {
      await logout();
      router.push("/login");
    } catch {
      setError("Failed to log out");
    }
  }

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    } else {
      setError("Logging.....");
      fetch(`${process.env.NEXT_PUBLIC_API_HOST}/user/signIn`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // logout();
          window.localStorage.setItem("token", JSON.stringify(data));
          router.push("/todo");
        });
    }
  }, [currentUser]);

  return (
    <>
      <section className="h-screen">
          <div className="bg-white bg-opacity-60 z-10 h-full w-full flex items-center justify-center">
            <div className="flex items-center">
              <span className="text-3xl mr-4">Loading</span>
              <svg
                className="animate-spin h-8 w-8 text-gray-800"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
        </div>
      </section>
      {/* <section className="h-screen">
        <div className="container h-full px-6 py-24">
          {error && <div className="text-rose-600	">{error}</div>}
          <div className="mb-12 md:mb-0 md:w-8/12 lg:w-6/12">
            <h4 className="mb-6 text-xl font-semibold">
              Login User Information
            </h4>
            <strong>Email:</strong> {currentUser?.email}
            <br></br>
            <strong>displayName:</strong> {currentUser?.displayName}
            <br></br>
            <button
              type="button"
              className="inline-block rounded border-2 border-danger px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-danger transition duration-150 ease-in-out hover:border-danger-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-danger-600 focus:border-danger-600 focus:text-danger-600 focus:outline-none focus:ring-0 active:border-danger-700 active:text-danger-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10"
              style={{ backgroundColor: "#ea4335", color: "#ffffff" }}
              onClick={() => {
                if (typeof navigator.clipboard == "undefined") {
                  console.log("navigator.clipboard");
                  var textArea = document.createElement("textarea");
                  textArea.value = currentUser.accessToken;
                  textArea.style.position = "fixed"; //avoid scrolling to bottom
                  document.body.appendChild(textArea);
                  textArea.focus();
                  textArea.select();

                  try {
                    var successful = document.execCommand("copy");
                    var msg = successful ? "successful" : "unsuccessful";
                    console.log(msg);
                  } catch (err) {
                    console.log("Was not possible to copy te text: ", err);
                  }

                  document.body.removeChild(textArea);
                  return;
                }
                navigator.clipboard.writeText(currentUser.accessToken).then(
                  function () {
                    console.log(`successful!`);
                  },
                  function (err) {
                    console.log("unsuccessful!", err);
                  }
                );
              }}
            >
              Copy accessToken
            </button>
            <div className="w-100 text-center mt-2">
              <button
                onClick={handleLogout}
                className="inline-block w-full rounded bg-primary px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                style={{ backgroundColor: "#1a73e8" }}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </section> */}
    </>
  );
}
