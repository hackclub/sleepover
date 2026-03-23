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

        <div className="w-full text-left space-y-6" style={{ maxWidth: isSidebarOpen ? "960px" : "1120px" }}>
          <p className="text-[16px] md:text-[20px] leading-relaxed" style={{ fontFamily: "'MADE Tommy Soft', sans-serif", fontWeight: "bold", color: "#6C6EA0", textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)" }}>
            Please see our Suggested Packing List for an idea of what to bring. Remember that we will be in Chicago (the windy city!) in April and will be subject to the elements. Make sure to check the weather forecast leading up to the event!
          </p>
          <p className="text-[16px] md:text-[20px] leading-relaxed" style={{ fontFamily: "'MADE Tommy Soft', sans-serif", fontWeight: "bold", color: "#6C6EA0", textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)" }}>
            We would advise bringing one suitcase carry on and one backpack for carry on. Travel grants do not cover any form of luggage fees you may incur.
          </p>

          <div>
            <h2 className="text-[24px] md:text-[36px] mb-3">
              <GradientText gradient="linear-gradient(180deg, #B7C1F2 0%, #89A8EF 100%)" strokeWidth="6px">
                Carry On (Suitcase)
              </GradientText>
            </h2>
            <ul className="list-disc list-inside space-y-2 text-[16px] md:text-[20px]" style={{ fontFamily: "'MADE Tommy Soft', sans-serif", fontWeight: "bold", color: "#6C6EA0", textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)" }}>
              <li>Sleeping bag + pillow</li>
              <li>Toiletries
                <ul className="list-disc list-inside ml-6 space-y-2 mt-2">
                  <li>Deodorant (there&apos;s no shower at the venue - please bring!)</li>
                  <li>Toothbrush and toothpaste (airplane-size approved)</li>
                  <li>Skincare</li>
                  <li>Contacts (if needed)</li>
                </ul>
              </li>
              <li>Pajamas (1-2x)</li>
              <li>Bottoms (3x pants)</li>
              <li>Tops (3x shirts)</li>
              <li>Sweatshirt/hoodie</li>
              <li>Outerwear (Chicago Spring can be chilly!)</li>
              <li>Undergarments (5 days worth)</li>
              <li>Socks (3 pairs)</li>
              <li>Leave space for merch!</li>
            </ul>
          </div>

          <div>
            <h2 className="text-[24px] md:text-[36px] mb-3">
              <GradientText gradient="linear-gradient(180deg, #B7C1F2 0%, #89A8EF 100%)" strokeWidth="6px">
                Backpack
              </GradientText>
            </h2>
            <ul className="list-disc list-inside space-y-2 text-[16px] md:text-[20px]" style={{ fontFamily: "'MADE Tommy Soft', sans-serif", fontWeight: "bold", color: "#6C6EA0", textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)" }}>
              <li>Tech:
                <ul className="list-disc list-inside ml-6 space-y-2 mt-2">
                  <li>Laptop</li>
                  <li>Laptop Charger</li>
                  <li>Phone Charger</li>
                  <li>Phone</li>
                  <li>Headphones</li>
                </ul>
              </li>
              <li>Wallet</li>
              <li>Water bottle</li>
              <li>Form of ID (for check in)</li>
              <li>Any medicine</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
