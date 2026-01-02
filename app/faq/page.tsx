"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import BunnyTile from "../components/BunnyTile";

export default function FAQPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      className="font-sans min-h-screen relative"
      style={{ backgroundColor: "#C0DEFE" }}
    >
      <BunnyTile />
      <Sidebar />

      {/* Main Content */}
      <main
        className="relative z-10 p-6 md:p-12 pt-20 md:pt-12 transition-all duration-300"
        style={{ marginLeft: isMobile ? "0px" : "420px" }}
      >
        <h1
          className="text-[40px] sm:text-[56px] md:text-[80px] font-bold mb-4"
          style={{
            fontFamily: "'MADE Tommy Soft', sans-serif",
            color: "#8183B8",
            textShadow: "0px 4px 0px #FFFFFF",
            WebkitTextStroke: isMobile ? "2px #FFFFFF" : "3px #FFFFFF",
          }}
        >
          FAQ
        </h1>
        <p
          className="text-[24px] sm:text-[32px] md:text-[40px] font-medium"
          style={{
            fontFamily: "'MADE Tommy Soft', sans-serif",
            color: "#9199CB",
          }}
        >
          Welcome to Sleepover!
        </p>
        <p
          className="relative z-10 mt-6 md:mt-8 text-[#7472A0] text-base md:text-lg"
          style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
        >
          Select a topic from the sidebar to get started.
        </p>
        <p
          className="relative z-10 mt-3 md:mt-4 text-[#7472A0] text-base md:text-lg"
          style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
        >
          Please note: day-of logistics, such as schedules or suggested packing
          lists, are subject to change. We will provide more info closer to the
          event.
        </p>
      </main>
    </div>
  );
}
