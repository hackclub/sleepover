"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

const checklistItems = [
  "available on a link where anyone can try your project?",
  "source code available on a public GitHub URL?",
  "deployed on the web? (Vercel, GitHub Pages, itch.io, etc.)",
  "working and complete? (no placeholders)",
  "does your project have a filled-out readME document?",
];

export default function ShipChecklistPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  
  const [checked, setChecked] = useState<boolean[]>(
    new Array(checklistItems.length).fill(false)
  );

  const allChecked = checked.every(Boolean);

  const toggleItem = (index: number) => {
    setChecked((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const handleYeah = () => {
    if (allChecked) {
      router.push(`/portal/forms/ship/details${projectId ? `?projectId=${projectId}` : ""}`);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div
      className="min-h-screen relative font-sans"
      style={{
        background: "#C0DEFE",
      }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "url('/background/bunny-tile.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "213px 210px",
        }}
      />

      {/* Ship Title */}
      <div className="flex justify-center pt-8 relative z-10">
        <h1 className="relative font-bold text-[64px] md:text-[96px] text-center">
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
            Ship
          </span>
          {/* Text on top */}
          <span
            className="relative"
            style={{
              fontFamily: "'MADE Tommy Soft', sans-serif",
              color: "#89A8EF",
            }}
          >
            Ship
          </span>
        </h1>
      </div>

      {/* Main Card */}
      <div className="relative z-10 mx-auto mt-8 max-w-[1100px] px-4 pb-12">
        <div
          className="relative rounded-[24px] p-8 md:p-12"
          style={{
            background: "linear-gradient(180deg, #FFF2D4 42%, #FFE8B2 100%)",
            border: "8px solid white",
            boxShadow: "0px 8px 8px rgba(116,114,160,0.56)",
          }}
        >
          {/* Checklist Title */}
          <h2 className="relative text-center text-[32px] md:text-[40px] font-bold mb-6">
            {/* White stroke layer behind */}
            <span
              className="absolute inset-0 pointer-events-none"
              style={{
                fontFamily: "'MADE Tommy Soft Outline', sans-serif",
                color: "#FFFFFF",
                WebkitTextStroke: "6px",
                filter: "drop-shadow(0px 4px 0px #7472A0)",
              }}
            >
              <u>Checklist</u>
            </span>
            {/* Text on top */}
            <span
              className="relative"
              style={{
                fontFamily: "'MADE Tommy Soft', sans-serif",
                color: "#D48890",
              }}
            >
              <u>Checklist</u>
            </span>
          </h2>

          {/* Inner box */}
          <div
            className="rounded-[24px] p-6 md:p-8"
            style={{
              background: "linear-gradient(to top, #FFF2D4 42%, #FFE8B2 100%)",
              boxShadow: "0px 4px 4px rgba(116,114,160,0.29)",
            }}
          >
            {/* Is your project... */}
            <p
              className="text-center text-[24px] md:text-[28px] font-medium mb-8 underline"
              style={{
                fontFamily: "'MADE Tommy Soft', sans-serif",
                color: "#7472A0",
              }}
            >
              Is your project...
            </p>

            {/* Checklist items */}
            <div className="space-y-4">
              {checklistItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 cursor-pointer"
                  onClick={() => toggleItem(index)}
                >
                  {/* Checkbox or Star */}
                  <div className="flex-shrink-0 w-[50px] h-[50px] flex items-center justify-center">
                    {checked[index] ? (
                      <Image
                        src="/icons/star.svg"
                        alt="Checked"
                        width={55}
                        height={50}
                        className="transform rotate-[-9deg]"
                      />
                    ) : (
                      <div
                        className="w-[36px] h-[36px] rounded-[6px] bg-white"
                        style={{
                          border: "4px solid white",
                          boxShadow:
                            "0px 4px 0px #C6C7E4, 0px 9px 9px rgba(116,114,160,0.62), inset 4px 8px 8px rgba(108,110,160,0.6)",
                        }}
                      />
                    )}
                  </div>
                  <p
                    className="text-[20px] md:text-[28px] font-medium"
                    style={{
                      fontFamily: "'MADE Tommy Soft', sans-serif",
                      color: "#7472A0",
                    }}
                  >
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          {/* YEAH! Button */}
          <button
            onClick={handleYeah}
            disabled={!allChecked}
            className={`relative rounded-[16px] px-8 py-3 transition-transform ${
              allChecked
                ? "hover:scale-105 cursor-pointer"
                : "opacity-50 cursor-not-allowed"
            }`}
            style={{
              background: "linear-gradient(180deg, #869BE7 0%, #B2BDF1 100%)",
              border: "4px solid white",
              boxShadow: "0px 4px 0px #C6C7E4, 0px 6px 8px rgba(116,114,160,0.69)",
            }}
          >
            <div
              className="absolute inset-[4px] rounded-[12px] pointer-events-none"
              style={{
                background: "linear-gradient(to top, #849AE7 0%, #B2BDF1 68%)",
                boxShadow: "0px 2px 2px rgba(116,114,160,0.33)",
              }}
            />
            <span
              className="relative z-10 text-[24px] md:text-[32px] font-bold"
              style={{
                fontFamily: "'MADE Tommy Soft', sans-serif",
                color: "#4E5DA9",
              }}
            >
              YEAH!
            </span>
          </button>

          {/* Go Back Button */}
          <button
            onClick={handleGoBack}
            className="relative rounded-[16px] px-6 py-3 transition-transform hover:scale-105"
            style={{
              background: "linear-gradient(180deg, #6078C4 0%, #6F96DD 100%)",
              border: "4px solid white",
              boxShadow: "0px 4px 0px #C6C7E4, 0px 6px 8px rgba(116,114,160,0.69)",
            }}
          >
            <div
              className="absolute inset-[4px] rounded-[12px] pointer-events-none"
              style={{
                background: "linear-gradient(180deg, #96B5E4 0%, #5790FA 100%)",
                boxShadow: "0px 2px 2px rgba(23,20,88,0.33)",
              }}
            />
            <div
              className="relative z-10 text-center"
              style={{
                fontFamily: "'MADE Tommy Soft', sans-serif",
                color: "#4E5DA9",
              }}
            >
              <p className="text-[16px] md:text-[20px] font-bold">wait...</p>
              <p className="text-[12px] md:text-[14px] font-bold">(go back)</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
