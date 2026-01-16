"use client";

import { useState, useEffect, Suspense } from "react";
import Sidebar from "../../components/Sidebar";
import BunnyTile from "../../components/BunnyTile";
import GradientText from "../../components/GradientText";
import ReferralCapture from "../../components/ReferralCapture";

export default function WhatIsSleepover() {
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
          className="w-full transition-all duration-300"
          style={{ maxWidth: isSidebarOpen ? "960px" : "1120px" }}
        >
          {/* Title */}
          <h1 className="text-[36px] md:text-[64px] leading-[50px] md:leading-[80px] text-center mb-6 md:mb-8">
            <GradientText
              gradient="linear-gradient(180deg, #B7C1F2 0%, #89A8EF 100%)"
              strokeWidth="10px"
            >
              What is Sleepover?
            </GradientText>
          </h1>

          {/* Content */}
          <div className="space-y-8">
            <p
              className="text-[16px] md:text-[20px] leading-relaxed"
              style={{
                fontFamily: "'MADE Tommy Soft', sans-serif",
                color: "#6C6EA0",
                textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)",
              }}
            >
              Sleepover is a cozy, slumber party style hackathon for teen girls. Sleepover is a part of Hack Club's Athena Initiative, designed to encourage girls to code and 'ship' technical projects.
            </p>

            {/* When and Where */}
            <div>
              <h2 className="text-[24px] md:text-[36px] mb-3">
                <GradientText
                  gradient="linear-gradient(180deg, #B7C1F2 0%, #89A8EF 100%)"
                  strokeWidth="6px"
                >
                  When and Where is Sleepover?
                </GradientText>
              </h2>
              <p
                className="text-[16px] md:text-[20px] leading-relaxed"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  color: "#6C6EA0",
                  textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)",
                }}
              >
                On April 24th, 2026 - April 26th, 2026, you will fly out to Chicago, Illinois for the coziest sleepover of your life - building projects, making friends, and snacking all night.
              </p>
            </div>

            {/* Who can participate */}
            <div>
              <h2 className="text-[24px] md:text-[36px] mb-3">
                <GradientText
                  gradient="linear-gradient(180deg, #B7C1F2 0%, #89A8EF 100%)"
                  strokeWidth="6px"
                >
                  Who can participate?
                </GradientText>
              </h2>
              <p
                className="text-[16px] md:text-[20px] leading-relaxed"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  color: "#6C6EA0",
                  textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)",
                }}
              >
                Anyone aged 13-18 can participate and get invited after completing the required hours!
              </p>
            </div>

            {/* How do I get invited */}
            <div>
              <h2 className="text-[24px] md:text-[36px] mb-3">
                <GradientText
                  gradient="linear-gradient(180deg, #B7C1F2 0%, #89A8EF 100%)"
                  strokeWidth="6px"
                >
                  How do I get invited?
                </GradientText>
              </h2>
              <p
                className="text-[16px] md:text-[20px] leading-relaxed mb-4"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  color: "#6C6EA0",
                  textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)",
                }}
              >
                Code 30 hours over the next three months (by April 15th) to get invited. That's just ten hours each month!
              </p>
              <p
                className="text-[16px] md:text-[20px] leading-relaxed"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  color: "#6C6EA0",
                  textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)",
                }}
              >
                Along the way, you can earn prizes by coding. For each hour you code, you'll earn feathers, which can be used to buy prizes in the shop.
              </p>
            </div>

            {/* How do I track my hours */}
            <div>
              <h2 className="text-[24px] md:text-[36px] mb-3">
                <GradientText
                  gradient="linear-gradient(180deg, #B7C1F2 0%, #89A8EF 100%)"
                  strokeWidth="6px"
                >
                  How do I track my hours?
                </GradientText>
              </h2>
              <p
                className="text-[16px] md:text-[20px] leading-relaxed mb-4"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  color: "#6C6EA0",
                  textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)",
                }}
              >
                Hours are tracked by Hackatime, which you can set up for your IDE!
              </p>
              <p
                className="text-[16px] md:text-[20px] leading-relaxed"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  color: "#6C6EA0",
                  textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)",
                }}
              >
                You can also track art hours using Lapse! Art cannot be more than 30% of your project.
              </p>
            </div>

            {/* What if I'm a beginner */}
            <div>
              <h2 className="text-[24px] md:text-[36px] mb-3">
                <GradientText
                  gradient="linear-gradient(180deg, #B7C1F2 0%, #89A8EF 100%)"
                  strokeWidth="6px"
                >
                  What if I'm a beginner?
                </GradientText>
              </h2>
              <p
                className="text-[16px] md:text-[20px] leading-relaxed"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  color: "#6C6EA0",
                  textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)",
                }}
              >
                No worries! We'll have monthly challenges, guided live workshops, and coding lock in sessions for you to get started on!
              </p>
            </div>

            {/* Who can I contact */}
            <div>
              <h2 className="text-[24px] md:text-[36px] mb-3">
                <GradientText
                  gradient="linear-gradient(180deg, #B7C1F2 0%, #89A8EF 100%)"
                  strokeWidth="6px"
                >
                  Who can I contact for more information?
                </GradientText>
              </h2>
              <p
                className="text-[16px] md:text-[20px] leading-relaxed"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  color: "#6C6EA0",
                  textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)",
                }}
              >
                Reach out to us at{" "}
                <a
                  href="mailto:athena@hackclub.com"
                  className="underline hover:opacity-80"
                  style={{ color: "#7684C9" }}
                >
                  athena@hackclub.com
                </a>{" "}
                or on Hack Club's Slack - in the #athena-initiative channel.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
