"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import GradientText from "./GradientText";

const navItems = [
  { label: "What is Sleepover?", href: "/faq/sleepover", color: "#9AC6F6" },
  { label: "Parents Guide", href: "/faq/parents", color: "#8FA8F0" },
  { label: "Travel Guide", href: "/faq/travel", color: "#869EEC" },
  { label: "Packing List", href: "/faq/packing", color: "#7791E6" },
];

type SidebarProps = {
  onStateChange?: (isOpen: boolean) => void;
  initialOpen?: boolean;
};

export default function Sidebar({ onStateChange, initialOpen = true }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && isOpen) {
        setIsOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    onStateChange?.(isMobile ? false : isOpen);
  }, [isOpen, isMobile, onStateChange]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleNavClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      {isMobile && (
        <button
          onClick={handleToggle}
          className="fixed top-4 left-4 z-[70] p-3 rounded-full transition-all duration-300 hover:scale-110"
          style={{
            background: "linear-gradient(180deg, #D9DAF8 0%, #FFF0FD 100%)",
            boxShadow: "0px 4px 8px rgba(108, 110, 160, 0.5)",
          }}
        >
          <span
            className="text-[24px] font-bold"
            style={{
              fontFamily: "'MADE Tommy Soft', sans-serif",
              color: "#7472A0",
            }}
          >
            {isOpen ? "✕" : "☰"}
          </span>
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Desktop Toggle Button */}
      {!isMobile && (
        <button
          onClick={handleToggle}
          className="fixed bottom-8 z-[60] p-3 rounded-full transition-all duration-300 hover:scale-110"
          style={{
            left: isOpen ? "calc(clamp(320px, 25vw, 520px) - 40px)" : "80px",
            background: "linear-gradient(180deg, #D9DAF8 0%, #FFF0FD 100%)",
            boxShadow: "0px 4px 8px rgba(108, 110, 160, 0.5)",
          }}
        >
          <span
            className="text-[24px] font-bold"
            style={{
              fontFamily: "'MADE Tommy Soft', sans-serif",
              color: "#7472A0",
            }}
          >
            {isOpen ? "←" : "☰"}
          </span>
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 min-h-screen z-50 ${
          isMobile ? "w-[280px]" : ""
        }`}
        style={{
          width: isMobile ? "280px" : "clamp(320px, 25vw, 520px)",
          transform: isMobile
            ? isOpen
              ? "translateX(0)"
              : "translateX(-100%)"
            : isOpen
            ? "translateX(0)"
            : "translateX(calc(-100% + 96px))",
          transition: "transform 320ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* Sidebar background image */}
        <div
          className="absolute inset-0 h-full"
          style={{
            backgroundImage: "url('/background/Sidebar.png')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% 100%",
            backgroundPosition: "top left",
          }}
        />

        {/* Content overlay */}
        <div className={`relative z-10 p-6 md:p-8 ${isMobile ? "pt-16" : ""}`}>
          {/* Logo */}
          <Link href="/" className="mt-8 ml-2 md:ml-4 block">
            <Image
              src="/background/sleepover_logo.PNG"
              alt="Sleepover Logo"
              width={301}
              height={193}
              className="w-[180px] md:w-[250px] h-auto hover:scale-105 hover:-rotate-2 transition-transform duration-300"
            />
          </Link>

          {/* Navigation Links */}
          <nav className={`flex flex-col gap-8 md:gap-10 mt-12 md:mt-16 ${isOpen ? "ml-2 md:ml-4" : "items-center"}`}>
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={handleNavClick}
                className="block font-bold leading-[1.1] hover:opacity-90 transition-transform hover:translate-x-[1px]"
                style={{ fontSize: isMobile ? "22px" : "clamp(26px, 2vw, 40px)", display: isOpen ? "block" : "none" }}
              >
                <GradientText
                  gradient="linear-gradient(180deg, #8FB1F0 0%, #7EA0EA 45%, #6D90E3 100%)"
                  strokeWidth={isMobile ? "5px" : "7px"}
                >
                  {item.label}
                </GradientText>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
