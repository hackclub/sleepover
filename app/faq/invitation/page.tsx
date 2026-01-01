"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import BunnyTile from "../../components/BunnyTile";

export default function Invitation() {
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
          Invitation
        </h1>
      </main>
    </div>
  );
}
