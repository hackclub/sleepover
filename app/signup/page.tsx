"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ReferralCapture from "../components/ReferralCapture";

function SignupContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const registered = searchParams.get("registered") === "true";

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        background: "linear-gradient(180deg, #C7D6FF 0%, #E8D5F2 50%, #FFFFFF 100%)",
      }}
    >
      <ReferralCapture />
      <h1
        className="text-[32px] sm:text-[48px] md:text-[64px] font-bold text-center mb-8"
        style={{
          fontFamily: "'MADE Tommy Soft', sans-serif",
          color: "#6C6EA0",
        }}
      >
        {registered ? "You're registered!" : "Welcome!"}
      </h1>
      <p
        className="text-[18px] sm:text-[24px] text-center mb-4"
        style={{
          fontFamily: "'MADE Tommy Soft', sans-serif",
          color: "#8183B8",
        }}
      >
        {registered
          ? "Thanks for signing up for Sleepover!"
          : email
          ? `You signed up with: ${email}`
          : "Sign in to continue"}
      </p>
      {!registered && (
        <a
          href="/api/auth/login"
          className="mt-8 px-8 py-4 rounded-[20px] text-white text-[20px] sm:text-[24px] font-bold hover:opacity-90 transition-opacity"
          style={{
            fontFamily: "'MADE Tommy Soft', sans-serif",
            background: "linear-gradient(0.68deg, #C7D6FF 0.59%, #548CEB 95.89%)",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
          }}
        >
          Continue with Hack Club
        </a>
      )}
      {registered && (
        <a
          href="/"
          className="mt-8 px-8 py-4 rounded-[20px] text-white text-[20px] sm:text-[24px] font-bold hover:opacity-90 transition-opacity"
          style={{
            fontFamily: "'MADE Tommy Soft', sans-serif",
            background: "linear-gradient(0.68deg, #C7D6FF 0.59%, #548CEB 95.89%)",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
          }}
        >
          Back to Home
        </a>
      )}
    </main>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
}
