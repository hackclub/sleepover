"use client";

import { useState } from "react";
import Image from "next/image";
import { onboardingSlides } from "@/lib/onboardingSlides";

interface OnboardingNovelProps {
  onComplete: () => void;
  userName?: string;
}

export default function OnboardingNovel({ onComplete, userName = "friend" }: OnboardingNovelProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slide = onboardingSlides[currentSlide];
  
  const dialogText = slide.dialogText.replace("{your name}", userName);

  const handleClick = () => {
    if (currentSlide < onboardingSlides.length - 1) {
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
      {/* Semi-transparent overlay to dim the background */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Dialog box at the bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        {/* Yellow accent bar with character name */}
        <div
          className="h-[70px] w-full flex items-center px-8"
          style={{
            background: "linear-gradient(180deg, #FFF2D4 0%, #FFE8B2 100%)",
          }}
        >
          <p
            className="text-[#6c6ea0] text-3xl font-bold ml-[300px]"
            style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
          >
            {slide.characterName}
          </p>
        </div>

        {/* Pink dialog area - extends to bottom */}
        <div
          className="w-full px-8 pt-6 pb-12"
          style={{
            background: "linear-gradient(180deg, #FFE2EA 0%, #FFEBF6 100%)",
          }}
        >
          <div className="max-w-4xl mx-auto ml-[300px]">
            {/* Dialog text */}
            <p
              className="text-[#6c6ea0] text-2xl font-bold mb-4"
              style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
            >
              {dialogText}
            </p>

            {/* Click to continue */}
            {slide.subText && (
              <p
                className="text-[#7472a0] text-base"
                style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
              >
                {slide.subText}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Character image */}
      <div className="absolute bottom-[10px] left-[30px] w-[220px] h-[280px]">
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


    </div>
  );
}
