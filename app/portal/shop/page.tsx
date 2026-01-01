"use client";

import { useState, useEffect } from "react";
import PortalSidebar from "../../components/PortalSidebar";
import BunnyTile from "../../components/BunnyTile";
import FeatherBalance from "../../components/FeatherBalance";
import ShopItem, { ShopItemData } from "../../components/ShopItem";

const shopItems: ShopItemData[] = [
  { id: "1", name: "super cool prize", price: 67, variant: "pink", image: "/prizes/airpods_pro.png" },
  { id: "2", name: "super cool prize", price: 67, variant: "purple", image: "/prizes/meta_quest.png" },
  { id: "3", name: "super cool prize", price: 67, variant: "pink", image: "/prizes/digital_camera.png" },
  { id: "4", name: "super cool prize", price: 67, variant: "pink" },
  { id: "5", name: "super cool prize", price: 67, variant: "purple" },
  { id: "6", name: "super cool prize", price: 67, variant: "pink" },
  { id: "7", name: "super cool prize", price: 67, variant: "purple" },
  { id: "8", name: "super cool prize", price: 67, variant: "pink" },
  { id: "9", name: "super cool prize", price: 67, variant: "purple" },
];

export default function ShopPage() {
  const userBalance = 0;
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
          marginLeft: isMobile ? "0px" : sidebarOpen ? "clamp(320px, 25vw, 520px)" : "96px",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
            <div className="hidden md:block flex-1" />
            <h1
              className="text-5xl md:text-6xl lg:text-8xl font-bold text-center bg-gradient-to-b from-[#7c95e6] to-[#91b0ed] bg-clip-text text-transparent drop-shadow-[0px_4px_4px_rgba(0,0,0,0.51)]"
              style={{
                fontFamily: "'MADE Tommy Soft', sans-serif",
                WebkitTextStroke: isMobile ? "2px white" : "3px white",
              }}
            >
              Shop
            </h1>
            <div className="md:flex-1 flex justify-center md:justify-end">
              <FeatherBalance balance={userBalance} />
            </div>
          </div>

          <p
            className="text-[#6c6ea0] text-lg md:text-xl lg:text-2xl font-bold text-center mb-6 md:mb-8 drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
            style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
          >
            redeem your feathers for prizes here!
          </p>

          <div
            className={`
              grid gap-4 md:gap-6 transition-all duration-300
              grid-cols-2
              ${isMobile 
                ? "grid-cols-2" 
                : sidebarOpen 
                  ? "sm:grid-cols-2 lg:grid-cols-3" 
                  : "sm:grid-cols-3 lg:grid-cols-4"
              }
            `}
          >
            {shopItems.map((item) => (
              <ShopItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
