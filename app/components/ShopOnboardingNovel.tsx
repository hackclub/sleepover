"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { shopOnboardingSlides } from "@/lib/shopOnboardingSlides";

interface ShopOnboardingNovelProps {
  onComplete: () => void;
}

export default function ShopOnboardingNovel({ onComplete }: ShopOnboardingNovelProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const slide = shopOnboardingSlides[currentSlide];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!hasStarted) return;
    
    setDisplayedText("");
    setIsTyping(true);
    let index = 0;
    
    const audio = new Audio("/sounds/animal-talking.mp3");
    audio.volume = 0.3;
    audio.loop = true;
    audio.playbackRate = 0.9;
    audio.play().catch(() => {});
    
    const interval = setInterval(() => {
      if (index < slide.dialogText.length) {
        setDisplayedText(slide.dialogText.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        audio.pause();
        audio.currentTime = 0;
        clearInterval(interval);
      }
    }, 50);
    return () => {
      audio.pause();
      audio.currentTime = 0;
      clearInterval(interval);
    };
  }, [currentSlide, slide.dialogText, hasStarted]);

  const handleClick = () => {
    if (!hasStarted) {
      setHasStarted(true);
      return;
    }
    if (isTyping) return;
    if (currentSlide < shopOnboardingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] cursor-pointer"
      onClick={handleClick}
    >
      <div className="absolute inset-0 bg-black/20" />

      <div 
        className={`absolute z-10 ${
          isMobile 
            ? "bottom-[180px] left-1/2 -translate-x-1/2 w-[140px] h-[180px]" 
            : "bottom-[10px] left-[30px] w-[220px] h-[280px]"
        }`}
      >
        <Image
          src={slide.characterImage}
          alt={slide.characterName}
          fill
          className="object-contain object-bottom"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <div
          className="h-[50px] md:h-[70px] w-full flex items-center px-4 md:px-8"
          style={{
            background: "linear-gradient(180deg, #FFF2D4 0%, #FFE8B2 100%)",
          }}
        >
          <p
            className={`text-[#6c6ea0] text-xl md:text-3xl font-bold ${
              isMobile ? "mx-auto" : "ml-[300px]"
            }`}
            style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
          >
            {slide.characterName}
          </p>
        </div>

        <div
          className="w-full px-4 md:px-8 pt-4 md:pt-6 pb-8 md:pb-12"
          style={{
            background: "linear-gradient(180deg, #FFE2EA 0%, #FFEBF6 100%)",
          }}
        >
          <div className={`max-w-4xl ${isMobile ? "mx-auto text-center" : "ml-[300px]"}`}>
            <p
              className="text-[#6c6ea0] text-lg md:text-2xl font-bold mb-2 md:mb-4"
              style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
            >
              {displayedText}
              {isTyping && <span className="animate-pulse">|</span>}
            </p>

            {!hasStarted ? (
              <p
                className="text-[#7472a0] text-sm md:text-base animate-pulse"
                style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
              >
                click to start!
              </p>
            ) : slide.subText && !isTyping ? (
              <p
                className="text-[#7472a0] text-sm md:text-base"
                style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
              >
                {slide.subText}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
