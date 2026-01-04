"use client";

import { useState, useEffect } from "react";
import PortalSidebar from "../../components/PortalSidebar";
import BunnyTile from "../../components/BunnyTile";
import FeatherBalance from "../../components/FeatherBalance";
import ShopItem, { ShopItemData } from "../../components/ShopItem";

export default function ShopPage() {
  const [userBalance, setUserBalance] = useState(0);
  const [shopItems, setShopItems] = useState<ShopItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [colCount, setColCount] = useState(2);

  useEffect(() => {
    fetch("/api/user/currency")
      .then((res) => res.json())
      .then((data) => setUserBalance(data.balance))
      .catch(console.error);

    fetch("/api/shop")
      .then((res) => res.json())
      .then((data) => {
        setShopItems(data.items);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const updateColCount = () => {
      const width = window.innerWidth;
      if (isMobile) {
        setColCount(2);
      } else if (sidebarOpen) {
        setColCount(width >= 1024 ? 3 : 2);
      } else {
        setColCount(width >= 1024 ? 4 : 3);
      }
    };
    updateColCount();
    window.addEventListener("resize", updateColCount);
    return () => window.removeEventListener("resize", updateColCount);
  }, [isMobile, sidebarOpen]);

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
            {loading ? (
              <p
                className="col-span-full text-center text-[#6c6ea0] text-xl font-bold"
                style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
              >
                Loading shop...
              </p>
            ) : (
              shopItems.map((item, index) => {
                const row = Math.floor(index / colCount);
                const col = index % colCount;
                const variant = (row + col) % 2 === 0 ? "pink" : "purple";
                return (
                  <ShopItem
                    key={item.id}
                    item={item}
                    canBuy={userBalance >= item.price}
                    variant={variant}
                  />
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
