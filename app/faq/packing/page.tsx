"use client";

import { useState, useEffect, Suspense } from "react";
import Sidebar from "../../components/Sidebar";
import BunnyTile from "../../components/BunnyTile";
import GradientText from "../../components/GradientText";
import ReferralCapture from "../../components/ReferralCapture";

export default function PackingList() {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const contentOffset = isMobile ? "0px" : isSidebarOpen ? "clamp(360px, 28vw, 600px)" : "140px";

  return (
    <div
      className="font-sans min-h-screen relative"
      style={{ backgroundColor: "#C0DEFE" }}
    >
      <Suspense fallback={null}>
        <ReferralCapture />
      </Suspense>
      <BunnyTile />
      <Sidebar onStateChange={setIsSidebarOpen} />

      {/* Main Content */}
      <main
        className="relative z-10 transition-[margin-left] duration-300 p-4 md:p-8 lg:p-12 pt-16 md:pt-8 flex flex-col items-center"
        style={{ 
          marginLeft: contentOffset, 
          marginRight: isMobile ? "0px" : "32px" 
        }}
      >
        <div
          className="flex justify-center mb-6 md:mb-8 w-full transition-all duration-300"
          style={{ maxWidth: isSidebarOpen ? "960px" : "1120px" }}
        >
          <h1 className="text-[48px] md:text-[72px] leading-[60px] md:leading-[90px] text-center">
            <GradientText
              gradient="linear-gradient(180deg, #B7C1F2 0%, #89A8EF 100%)"
              strokeWidth="10px"
            >
              Packing List
            </GradientText>
          </h1>
        </div>

        <p className="text-[24px] sm:text-[32px] md:text-[40px] text-center">
          <GradientText
            gradient="linear-gradient(180deg, #B7C1F2 0%, #89A8EF 100%)"
            strokeWidth="6px"
          >
            Coming Soon!
          </GradientText>
        </p>
      </main>
    </div>
  );
}
