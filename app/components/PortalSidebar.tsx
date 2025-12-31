"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const navItems = [
  {
    label: "Create",
    href: "/portal",
    color: "#9AC6F6",
    icon: "/background/laptop icon.png",
  },
  {
    label: "Explore",
    href: "/portal/explore",
    color: "#93B4F2",
    icon: "/background/explore icon.png",
  },
  {
    label: "Shop",
    href: "/portal/shop",
    color: "#8FA8F0",
    icon: "/background/shop icon.png",
  },
  {
    label: "FAQ",
    href: "/faq",
    color: "#869EEC",
    icon: "/background/faq icon.png",
  },
];

type PortalSidebarProps = {
  onStateChange?: (isOpen: boolean) => void;
  initialOpen?: boolean;
};

export default function PortalSidebar({ onStateChange, initialOpen = true }: PortalSidebarProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  useEffect(() => {
    onStateChange?.(isOpen);
  }, [isOpen, onStateChange]);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
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

      {/* Sidebar */}
      <aside
        className="fixed left-0 top-0 min-h-screen z-50"
        style={{
          width: "clamp(320px, 25vw, 520px)",
          transform: isOpen
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
        <div className="relative z-10 p-8">
          {/* Logo */}
          <Link href="/" className="mt-8 ml-4 block">
            <Image
              src="/background/sleepover_logo.PNG"
              alt="Sleepover Logo"
              width={301}
              height={193}
              className="w-[250px] h-auto hover:scale-105 hover:-rotate-2 transition-transform duration-300"
            />
          </Link>

          {/* Navigation Links */}
          <nav className={`flex flex-col gap-10 mt-16 ${isOpen ? "ml-4" : "items-center"}`}>
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="relative flex items-center gap-4 font-bold leading-[1.1] hover:opacity-90 transition-transform hover:translate-x-[1px]"
                style={{ fontSize: "clamp(30px, 2.3vw, 50px)" }}
              >
                {/* Icon */}
                <Image
                  src={item.icon}
                  alt={`${item.label} icon`}
                  width={44}
                  height={44}
                  className="w-[38px] h-[38px] sm:w-[42px] sm:h-[42px] md:w-[44px] md:h-[44px]"
                />
                {/* Text container */}
                <span className="relative" style={{ display: isOpen ? "inline-block" : "none" }}>
                  {/* White stroke layer behind */}
                  <span
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      fontFamily: "'MADE Tommy Soft Outline', sans-serif",
                      color: "#FFFFFF",
                      WebkitTextStroke: "7px",
                      filter: "drop-shadow(0px 4px 0px #C6C7E4) drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.2))",
                    }}
                  >
                    {item.label}
                  </span>
                  {/* Colored text on top */}
                  <span
                    className="relative"
                    style={{
                      fontFamily: "'MADE Tommy Soft', sans-serif",
                      background:
                        "linear-gradient(180deg, #8FB1F0 0%, #7EA0EA 45%, #6D90E3 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {item.label}
                  </span>
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
