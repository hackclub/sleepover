"use client";

import { useState } from "react";
import PortalSidebar from "../components/PortalSidebar";
import BunnyTile from "../components/BunnyTile";
import CountdownProgressBar from "../components/CountdownProgressBar";

export default function FAQPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const contentOffset = isSidebarOpen ? "clamp(360px, 28vw, 600px)" : "140px";

  return (
    <div
      className="font-sans min-h-screen relative"
      style={{ backgroundColor: "#C0DEFE" }}
    >
      <BunnyTile />
      <PortalSidebar onStateChange={setIsSidebarOpen} />

      <main
        className="relative z-10 transition-[margin-left] duration-300 p-8 md:p-12 pt-8 flex flex-col items-center"
        style={{ marginLeft: contentOffset, marginRight: "32px" }}
      >
        {/* Create Heading */}
        <div
          className="flex justify-center mb-8 w-full transition-all duration-300"
          style={{ maxWidth: isSidebarOpen ? "960px" : "1120px" }}
        >
          <h1 className="relative font-bold text-[72px] leading-[90px] text-center">
            {/* White stroke layer behind */}
            <span
              className="absolute inset-0 pointer-events-none"
              style={{
                fontFamily: "'MADE Tommy Soft Outline', sans-serif",
                color: "#FFFFFF",
                WebkitTextStroke: "10px",
                filter:
                  "drop-shadow(0px 4px 0px #C6C7E4) drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.2))",
              }}
            >
              Create
            </span>
            {/* Gradient text on top */}
            <span
              className="relative"
              style={{
                fontFamily: "'MADE Tommy Soft', sans-serif",
                background: "linear-gradient(180deg, #B7C1F2 0%, #89A8EF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Create
            </span>
          </h1>
        </div>

        <CountdownProgressBar isSidebarOpen={isSidebarOpen} />

        {/* Figma 3-box layout: two small left, one large right */}
        <section
          className="w-full flex justify-center mt-6"
          style={{ maxWidth: isSidebarOpen ? "1060px" : "1220px" }}
        >
          <div className="flex w-full gap-6">
            {/* Left column with two small boxes (nodes 132:86 and 132:98) */}
            <div
              className="flex flex-col gap-6"
              style={{ width: "clamp(240px, 28%, 300px)" }}
            >
              {/* Small box #1 */}
              <div
                className="rounded-[30px] overflow-hidden"
                style={{
                  height: "301px",
                  background: "linear-gradient(180deg, #FFE2E9 0%, #FFF0FD 100%)",
                  boxShadow: "0px 4px 4px rgba(116,114,160,0.62)",
                }}
              >
                <div
                  style={{
                    height: "66px",
                    background: "linear-gradient(180deg, #FFF2D4 0%, #FFE8B2 100%)",
                    boxShadow: "0px 4px 0px #C6C7E4",
                  }}
                />
                <div style={{ height: "calc(100% - 66px)" }} />
              </div>

              {/* Small box #2 */}
              <div
                className="rounded-[30px] overflow-hidden"
                style={{
                  height: "262px",
                  background: "linear-gradient(180deg, #FFE2E9 0%, #FFF0FD 100%)",
                  boxShadow: "0px 4px 4px rgba(116,114,160,0.62)",
                }}
              >
                <div
                  style={{
                    height: "58px",
                    background: "linear-gradient(180deg, #FFF2D4 0%, #FFE8B2 100%)",
                    boxShadow: "0px 4px 0px #C6C7E4",
                  }}
                />
                <div style={{ height: "calc(100% - 58px)" }} />
              </div>
            </div>

            {/* Right large box (node 132:177) */}
            <div className="flex-1" style={{ width: "clamp(520px, 60%, 760px)" }}>
              <div
                className="rounded-[30px] overflow-hidden"
                style={{
                  minHeight: "588px",
                  background: "linear-gradient(180deg, #D9DAF8 0%, #FFF0FD 100%)",
                  boxShadow: "0px 4px 4px rgba(116,114,160,0.62)",
                }}
              >
                <div
                  className="flex items-center justify-between px-6"
                  style={{
                    height: "96px",
                    background: "linear-gradient(180deg, #FFE5E8 0%, #EBC0CC 100%)",
                    boxShadow: "0px 4px 0px #C6C7E4",
                  }}
                >
                  {/* Left: Label "Your Projects" (layered outline + clipped text) */}
                  <h2 className="relative font-bold leading-[normal] m-0" aria-label="Your Projects" style={{ fontSize: "24px", display: "inline-block" }}>
                    {/* White stroke layer behind */}
                    <span
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        fontFamily: "'MADE Tommy Soft Outline', sans-serif",
                        color: "#FFFFFF",
                        WebkitTextStroke: "2px",
                        zIndex: 0,
                       
                      }}
                    >
                      Your Projects
                    </span>
                    {/* Clipped text on top, keeping color scheme */}
                    <span
                      className="relative"
                      style={{
                        fontFamily: "'MADE Tommy Soft', sans-serif",
                        background: "linear-gradient(180deg, #6C6EA0 0%, #6C6EA0 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        fontWeight: 700,
                        zIndex: 1,
                      }}
                    >
                      Your Projects
                    </span>
                  </h2>

                  {/* Right: "new project +" group (node 115:1855) */}
                  <div className="flex items-center gap-3 select-none">
                    <h3
                      className="relative font-bold leading-[normal] m-0"
                      aria-label="new project"
                      style={{ fontSize: "24px", display: "inline-block" }}
                    >
                      {/* White stroke layer behind */}
                      <span
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          fontFamily: "'MADE Tommy Soft Outline', sans-serif",
                          color: "#FFFFFF",
                          WebkitTextStroke: "4px",
                          filter: "drop-shadow(0px 2px 0px #C6C7E4)",
                          zIndex: 0,
                        }}
                      >
                        new project
                      </span>
                      {/* Gradient text on top */}
                      <span
                        className="relative"
                        style={{
                          fontFamily: "'MADE Tommy Soft', sans-serif",
                          background:
                            "linear-gradient(180deg, #93B4F2 0%, #8FA8F0 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                          fontWeight: 700,
                          zIndex: 1,
                        }}
                      >
                        new project
                      </span>
                    </h3>
                    <span
                      className="leading-[32px]"
                      style={{
                        fontFamily: "'MADE Tommy Soft', sans-serif",
                        fontSize: "72px",
                        background: "linear-gradient(180deg, #93B4F2 0%, #8FA8F0 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                      aria-hidden
                    >
                      +
                    </span>
                  </div>
                </div>
                <div style={{ height: "calc(100% - 96px)" }} />
              </div>
            </div>
          </div>
        </section>


      </main>
    </div>
  );
}
