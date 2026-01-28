"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { onboardingSlides } from "@/lib/onboardingSlides";

interface OnboardingNovelProps {
  onComplete: (pronouns?: string) => void;
  userName?: string;
}

export default function OnboardingNovel({ onComplete, userName = "friend" }: OnboardingNovelProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [selectedPronouns, setSelectedPronouns] = useState<string>("");
  const slide = onboardingSlides[currentSlide];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  
  const dialogText = slide.dialogText.replace("{your name}", userName);

  useEffect(() => {
    setDisplayedText("");
    setIsTyping(true);
    let index = 0;
    
    // Create audio for typing sound
    const audio = new Audio("/sounds/animal-talking.mp3");
    audio.volume = 0.3;
    audio.loop = true;
    audio.playbackRate = 0.9;
    audio.play().catch(() => {});
    
    const interval = setInterval(() => {
      if (index < dialogText.length) {
        setDisplayedText(dialogText.slice(0, index + 1));
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
  }, [currentSlide, dialogText]);

  const handleClick = () => {
    if (isTyping) return;

    // If this slide requires input and none is selected, don't proceed
    if (slide.requiresInput && !selectedPronouns) {
      return;
    }

    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete(selectedPronouns);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[100] ${slide.requiresInput ? "" : "cursor-pointer"}`}
      onClick={slide.requiresInput ? undefined : handleClick}
    >
      {/* Semi-transparent overlay to dim the background */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Character image - positioned differently on mobile */}
      <div 
        className={`absolute z-10 ${
          isMobile 
            ? `${slide.requiresInput ? "bottom-[280px]" : "bottom-[140px]"} left-[10px] w-[80px] h-[100px]`
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

      {/* Dialog box at the bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        {/* Yellow accent bar with character name */}
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

        {/* Pink dialog area - extends to bottom */}
        <div
          className="w-full px-4 md:px-8 pt-3 md:pt-6 pb-6 md:pb-12"
          style={{
            background: "linear-gradient(180deg, #FFE2EA 0%, #FFEBF6 100%)",
          }}
        >
          <div className={`max-w-4xl ${isMobile ? "mx-auto text-center" : "ml-[300px]"}`}>
            {/* Dialog text */}
            <p
              className="text-[#6c6ea0] text-base md:text-2xl font-bold mb-2 md:mb-4"
              style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
            >
              {displayedText}
              {isTyping && <span className="animate-pulse">|</span>}
            </p>

            {/* Radio buttons for pronouns selection */}
            {slide.requiresInput && slide.inputType === "radio" && slide.inputOptions && !isTyping && (
              <div className="flex flex-wrap gap-2 md:gap-4 my-3 md:my-4 items-center justify-center md:justify-start">
                {slide.inputOptions.map((option) => (
                  <label
                    key={option}
                    className={`cursor-pointer flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl transition-all ${
                      selectedPronouns === option
                        ? "bg-[#7684c9] text-white"
                        : "bg-white/60 text-[#6c6ea0] hover:bg-white/80"
                    }`}
                    style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPronouns(option);
                    }}
                  >
                    <input
                      type="radio"
                      name="pronouns"
                      value={option}
                      checked={selectedPronouns === option}
                      onChange={() => setSelectedPronouns(option)}
                      className="w-4 h-4"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="text-sm md:text-lg font-bold">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Click to continue */}
            {slide.subText && !slide.requiresInput && (
              <p
                className="text-[#7472a0] text-sm md:text-base"
                style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
              >
                {slide.subText}
              </p>
            )}

            {/* Continue button for input slides */}
            {slide.requiresInput && !isTyping && (
              <button
                onClick={handleClick}
                disabled={!selectedPronouns}
                className={`mt-4 px-6 py-2 rounded-xl text-base md:text-lg font-bold transition-all ${
                  selectedPronouns
                    ? "bg-[#7684c9] text-white hover:bg-[#6073b8] cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
              >
                Continue →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
