"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Login() {

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();



  return (
    <>
      <section className="h-screen">
        <div className="container h-full px-6 py-24">
          <div className="g-6 flex h-full flex-wrap items-center justify-center lg:justify-between">
            {/* <!-- Left column container with background--> */}
            <div className="mb-12 md:mb-0 md:w-8/12 lg:w-6/12">
              <h4 className="mb-6 text-xl font-semibold">
                <img
                  className="inline-block h-12 w-12 rounded-full ring-2 ring-white"
                  src="https://lahuman.github.io/assets/img/logo.png"
                  alt="lahuman"
                />
                TODO EXAMPLE
              </h4>

              <p className="text-sm">
                {window.localStorage.getItem('token')}
              </p>
            </div>

            {/* <!-- Right column container with form --> */}
            <div className="md:w-8/12 lg:ml-6 lg:w-5/12">
                {/* <!-- Email input --> */}
                {error && <div className="text-rose-600	">{error}</div>}
    
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
