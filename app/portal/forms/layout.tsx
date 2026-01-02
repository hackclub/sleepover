"use client";

import BunnyTile from "@/app/components/BunnyTile";
import PortalSidebar from "@/app/components/PortalSidebar";
import { useEffect, useState } from "react";

export default function PortalLayout({
  title,
  subtitle,
  children,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
      <PortalSidebar onStateChange={setSidebarOpen} />

      <main
        className="min-h-screen py-6 md:py-8 px-4 md:px-8 transition-all duration-300 pt-16 md:pt-8"
        style={{
          marginLeft: isMobile
            ? "0px"
            : sidebarOpen
              ? "clamp(320px, 25vw, 520px)"
              : "96px",
          marginRight: isMobile ? "0px" : "32px",
        }}
      >
        <div className="max-w-6xl mx-auto">
          {(title || subtitle) && (
            <header className="mb-6 md:mb-8">
              {title && (
                <h1
                  className="text-5xl md:text-6xl lg:text-8xl font-bold text-center bg-gradient-to-b from-[#7c95e6] to-[#91b0ed] bg-clip-text text-transparent drop-shadow-[0px_4px_4px_rgba(0,0,0,0.51)]"
                  style={{
                    fontFamily: "'MADE Tommy Soft', sans-serif",
                    WebkitTextStroke: isMobile ? "2px white" : "3px white",
                  }}
                >
                  {title}
                </h1>
              )}

              {subtitle && (
                <p
                  className="text-[#6c6ea0] text-lg md:text-xl lg:text-2xl font-bold text-center mt-3 drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
                  style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
                >
                  {subtitle}
                </p>
              )}
            </header>
          )}

          {children}
        </div>
      </main>
    </div>
  );
}
