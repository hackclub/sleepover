"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function ShipDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  
  const [step1Confirmed, setStep1Confirmed] = useState(false);
  const [githubUrl, setGithubUrl] = useState("");
  const [projectUrl, setProjectUrl] = useState("");

  const handleStep1Yeah = () => {
    setStep1Confirmed(true);
  };

  const handleNext = () => {
    router.push(`/portal/forms/ship/info${projectId ? `?projectId=${projectId}` : ""}`);
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div
      className="min-h-screen relative font-sans pb-12"
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
      <div className="relative z-10 mx-auto mt-8 max-w-[1200px] px-4">
        <div
          className="relative rounded-[24px] p-6 md:p-10"
          style={{
            background: "linear-gradient(180deg, #FFF2D4 42%, #FFE8B2 100%)",
            border: "8px solid white",
            boxShadow: "0px 8px 8px rgba(116,114,160,0.56)",
          }}
        >
          {/* Project Details Title */}
          <h2 className="relative text-[32px] md:text-[40px] font-bold mb-6">
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
              Project Details
            </span>
            {/* Gradient text on top */}
            <span
              className="relative"
              style={{
                fontFamily: "'MADE Tommy Soft', sans-serif",
                color: "#D48890",
              }}
            >
              Project Details
            </span>
          </h2>

          {/* Step 1 */}
          <p
            className="text-[24px] md:text-[32px] font-bold mb-4"
            style={{
              fontFamily: "'MADE Tommy Soft', sans-serif",
              color: "#A8AAEB",
              textShadow: "0px 4px 0px #7472A0",
            }}
          >
            1. Verify current information:
          </p>

          {/* Project Info Box */}
          <div
            className="rounded-[24px] p-6 mb-6"
            style={{
              background: "linear-gradient(to top, #FFF2D4 42%, #FFE8B2 100%)",
              boxShadow: "0px 4px 4px rgba(116,114,160,0.29)",
            }}
          >
            <div className="flex flex-wrap gap-8">
              {/* Left column - Project Info */}
              <div className="flex-1 min-w-[280px]">
                <h3
                  className="text-[36px] md:text-[48px] font-bold"
                  style={{
                    fontFamily: "'MADE Tommy Soft', sans-serif",
                    background: "linear-gradient(180deg, #7791E6 0%, #7472A0 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "0px 2px 0px #7472A0",
                  }}
                >
                  project name
                </h3>

                {/* Hours */}
                <div className="flex items-center gap-2 mt-2">
                  <Image
                    src="/icons/star.svg"
                    alt="star"
                    width={28}
                    height={25}
                  />
                  <span
                    className="text-[20px] md:text-[24px] font-bold underline"
                    style={{
                      fontFamily: "'MADE Tommy Soft', sans-serif",
                      background: "linear-gradient(180deg, #93B4F2 0%, #6988E0 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    ##.# hours
                  </span>
                </div>
                <p
                  className="text-[16px] md:text-[20px] font-bold opacity-75 ml-[36px]"
                  style={{
                    fontFamily: "'MADE Tommy Soft', sans-serif",
                    color: "#6C6EA0",
                  }}
                >
                  (##.# art, ##.# code)
                </p>

                {/* Description */}
                <div className="flex items-start gap-2 mt-4">
                  <Image
                    src="/icons/star.svg"
                    alt="star"
                    width={28}
                    height={25}
                    className="mt-1"
                  />
                  <div>
                    <span
                      className="text-[20px] md:text-[24px] font-bold underline"
                      style={{
                        fontFamily: "'MADE Tommy Soft', sans-serif",
                        background: "linear-gradient(180deg, #93B4F2 0%, #6988E0 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      description:
                    </span>
                    <p
                      className="text-[14px] md:text-[16px] font-bold mt-2 max-w-[300px]"
                      style={{
                        fontFamily: "'MADE Tommy Soft', sans-serif",
                        color: "#7472A0",
                      }}
                    >
                      yap yap yap yap yap yap yap yap yap yap yap yap yap yap
                      yap yap yap yap yap yap yap yap yap yap yap yap yap yap
                      yap yap yap yap yap yap yap yap
                    </p>
                  </div>
                </div>
              </div>

              {/* Right columns - Hackatime & Lapse */}
              <div className="flex gap-8 flex-wrap">
                {/* Hackatime Projects */}
                <div className="text-center">
                  <h4
                    className="text-[24px] md:text-[32px] font-bold underline mb-4"
                    style={{
                      fontFamily: "'MADE Tommy Soft', sans-serif",
                      background: "linear-gradient(180deg, #B5AAE7 0%, #D488AD 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    hackatime project(s):
                  </h4>
                  {[1, 2].map((i) => (
                    <div key={i} className="mb-2">
                      <p
                        className="text-[16px] md:text-[20px] font-bold underline"
                        style={{
                          fontFamily: "'MADE Tommy Soft', sans-serif",
                          background: "linear-gradient(180deg, #7791E6 0%, #7472A0 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        hackatime project name
                      </p>
                      <p
                        className="text-[14px] md:text-[16px] font-bold underline"
                        style={{
                          fontFamily: "'MADE Tommy Soft', sans-serif",
                          background: "linear-gradient(180deg, #93B4F2 0%, #6988E0 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        ##.# hours
                      </p>
                    </div>
                  ))}
                </div>

                {/* Lapse Timelapses */}
                <div className="text-center">
                  <h4
                    className="text-[24px] md:text-[32px] font-bold underline mb-4"
                    style={{
                      fontFamily: "'MADE Tommy Soft', sans-serif",
                      background: "linear-gradient(180deg, #B5AAE7 0%, #D488AD 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    lapse timelapses:
                  </h4>
                  {[1, 2].map((i) => (
                    <div key={i} className="mb-2">
                      <p
                        className="text-[16px] md:text-[20px] font-bold underline"
                        style={{
                          fontFamily: "'MADE Tommy Soft', sans-serif",
                          background: "linear-gradient(180deg, #7791E6 0%, #7472A0 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        lapse timelapse name
                      </p>
                      <p
                        className="text-[14px] md:text-[16px] font-bold underline"
                        style={{
                          fontFamily: "'MADE Tommy Soft', sans-serif",
                          background: "linear-gradient(180deg, #93B4F2 0%, #6988E0 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        ##.# hours
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* "this look good?" text and Step 1 buttons */}
          <div className="text-center mb-8">
            <p
              className="text-[20px] md:text-[24px] font-bold mb-4 underline"
              style={{
                fontFamily: "'MADE Tommy Soft', sans-serif",
                background: "linear-gradient(180deg, #7791E6 0%, #7472A0 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              this look good?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleStep1Yeah}
                className={`relative rounded-[16px] px-6 py-2 transition-transform hover:scale-105 ${
                  step1Confirmed ? "ring-2 ring-green-400" : ""
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
                  className="relative z-10 text-[18px] md:text-[24px] font-bold"
                  style={{
                    fontFamily: "'MADE Tommy Soft', sans-serif",
                    color: "#4E5DA9",
                  }}
                >
                  YEAH!
                </span>
              </button>
              <button
                onClick={handleGoBack}
                className="relative rounded-[16px] px-4 py-2 transition-transform hover:scale-105"
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
                  <p className="text-[10px] md:text-[14px] font-bold">(go back)</p>
                </div>
              </button>
            </div>
          </div>

          {/* Step 2 */}
          <p
            className="text-[24px] md:text-[32px] font-bold mb-4"
            style={{
              fontFamily: "'MADE Tommy Soft', sans-serif",
              color: "#A8AAEB",
              textShadow: "0px 4px 0px #7472A0",
            }}
          >
            2. Add more information:
          </p>

          {/* Step 2 form box */}
          <div
            className="rounded-[24px] p-6 mb-6"
            style={{
              background: "linear-gradient(to top, #FFF2D4 42%, #FFE8B2 100%)",
              boxShadow: "0px 4px 4px rgba(116,114,160,0.29)",
            }}
          >
            {/* Screenshot */}
            <div className="mb-6">
              <label
                className="block text-[24px] md:text-[28px] font-medium mb-2"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  color: "#7472A0",
                }}
              >
                Screenshot
              </label>
              <div
                className="w-[200px] h-[130px] rounded-[12px] flex items-center justify-center cursor-pointer"
                style={{
                  background: "#E7AAB2",
                  opacity: 0.5,
                  boxShadow: "0px 4px 8px #6C6EA0",
                }}
              >
                <span
                  className="text-[16px] md:text-[20px] font-medium"
                  style={{
                    fontFamily: "'MADE Tommy Soft', sans-serif",
                    color: "#D48890",
                  }}
                >
                  upload image here
                </span>
              </div>
            </div>

            {/* GitHub Repo */}
            <div className="mb-4">
              <label
                className="block text-[24px] md:text-[28px] font-medium mb-2"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  color: "#7472A0",
                }}
              >
                Link to GitHub Repo
              </label>
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full rounded-[12px] px-4 py-3 text-[#6C6EA0] text-lg outline-none"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  background: "white",
                  boxShadow: "0px 4px 4px rgba(116,114,160,0.62), inset 2px 4px 8px rgba(116,114,160,0.29)",
                }}
              />
            </div>

            {/* Shipped Project Link */}
            <div className="mb-4">
              <label
                className="block text-[24px] md:text-[28px] font-medium mb-2"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  color: "#7472A0",
                }}
              >
                Link to Shipped Project
              </label>
              <input
                type="text"
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                className="w-full rounded-[12px] px-4 py-3 text-[#6C6EA0] text-lg outline-none"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  background: "white",
                  boxShadow: "0px 4px 4px rgba(116,114,160,0.62), inset 2px 4px 8px rgba(116,114,160,0.29)",
                }}
              />
            </div>
          </div>

          {/* NEXT buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={handleNext}
              className="relative rounded-[16px] px-6 py-2 transition-transform hover:scale-105"
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
                className="relative z-10 text-[18px] md:text-[24px] font-bold"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  color: "#4E5DA9",
                }}
              >
                NEXT!
              </span>
            </button>
            <button
              onClick={handleGoBack}
              className="relative rounded-[16px] px-4 py-2 transition-transform hover:scale-105"
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
                <p className="text-[10px] md:text-[14px] font-bold">(go back)</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
