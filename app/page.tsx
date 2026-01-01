"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AutoplayCarousel from "./components/Carousel";
import { slides } from "@/app/data/slides";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      router.push("/api/auth/login");
    }
  };
  return (
    <main className="relative z-10 min-h-screen overflow-hidden pb-40">
      {/* Blue diagonal cutout background (anchored, non-tiling, masked) */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-[300px] sm:top-[400px] md:top-[542px] h-[600px] sm:h-[800px] md:h-[1100px] pt-30"
        style={{ zIndex: -1 }}
        aria-hidden
      >
        <div
          className="w-full h-full drop-shadow-[0_25px_35px_rgba(0,0,0,0.4)]"
          style={{
            clipPath: "polygon(0 300px, 100% 0, 100% 100%, 0 calc(100% - 300px))",
            backgroundImage: "url('/background/blue_cutout.webp')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        />
      </div>

      {/* Tiled background section - under blue cutout, extends to bottom */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-[700px] sm:top-[900px] md:top-[1100px] bottom-0"
        style={{ zIndex: -2 }}
        aria-hidden
      >
        {/* Tile background with dark overlay */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: "url('/background/tile.png')",
            backgroundRepeat: "repeat",
          }}
        />
        {/* Gradient fade to white */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: "linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.5) 70%, #FFFFFF 100%)",
          }}
        />
      </div>

      <div className="relative w-full flex">
        <span
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pb-2 font-bold text-[12px] sm:text-[16px] md:text-[22px] min-[1792px]:text-[40px] leading-[16px] sm:leading-[22px] md:leading-[30px] min-[1792px]:leading-[50px] z-10 px-2 whitespace-nowrap"
          style={{
            fontFamily: "'MADE Tommy Soft', sans-serif",
            background:
              "linear-gradient(357.47deg, #282A5A -128.92%, #2E3367 -26.66%, #38417B 130.45%, #424F90 389.82%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          }}
        >
          hack club&apos;s athena initiative presents:
        </span>

        <span
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pb-2 font-bold text-[12px] sm:text-[16px] md:text-[22px] min-[1792px]:text-[40px] leading-[16px] sm:leading-[22px] md:leading-[30px] min-[1792px]:leading-[50px] text-white z-10 px-2 whitespace-nowrap"
          style={{
            fontFamily: "'MADE Tommy Soft Outline', sans-serif",
            WebkitTextStroke: "0.5px #FFFFFF",
          }}
        >
          hack club&apos;s athena initiative presents:
        </span>

        <Image
          src="/background/sleepover_banner 1.png"
          alt="Sleepover Banner"
          width={960}
          height={200}
          className="w-full md:w-1/2 h-auto"
          priority
        />
        <Image
          src="/background/sleepover_banner 1.png"
          alt="Sleepover Banner"
          width={960}
          height={200}
          className="hidden md:block w-1/2 h-auto"
          priority
        />
      </div>

      <div className="w-full mt-8 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16">
        <Image
          src="/background/sleepover_logo.PNG"
          alt="Sleepover Logo"
          width={700}
          height={500}
          className="w-72 sm:w-96 md:w-[550px] min-[1792px]:w-[600px] h-auto"
        />

        <div
          className="w-[280px] h-[185px] sm:w-[350px] sm:h-[230px] md:w-[450px] md:h-[300px] min-[1792px]:w-[513px] min-[1792px]:h-[338px] rounded-[15px]"
          style={{
            background: "linear-gradient(180deg, #919ED5 0%, #9199CB 60.1%, #9199CB 100%)",
          }}
        />
      </div>

      <form
        className="w-full mt-8 flex items-center justify-center gap-4"
        onSubmit={handleEmailSubmit}
      >
        <input
          type="email"
          placeholder="enter your email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-[280px] sm:w-[350px] md:w-[499px] h-[50px] md:h-[65px] rounded-[20px] px-6 text-[18px] md:text-[24px] font-bold text-center outline-none"
          style={{
            fontFamily: "'MADE Tommy Soft', sans-serif",
            background: "#FFFCF6",
            border: "3px solid #FFFFFF",
            boxShadow:
              "0px 6px 4px rgba(0, 0, 0, 0.25), inset 0px 6px 10px 2px rgba(0, 0, 0, 0.25)",
            color: "#BBC8ED",
          }}
        />

        <button
          type="submit"
          className="relative w-[80px] h-[60px] md:w-[103px] md:h-[76px] rounded-[20px] cursor-pointer active:scale-95 transition-transform"
          style={{
            background: "#FFFFFF",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div
            className="absolute inset-[2px] rounded-[20px]"
            style={{
              background: "linear-gradient(0deg, #7472A0 17.31%, #DFA1AA 100%)",
            }}
          />
          <div
            className="absolute inset-[5px] rounded-[20px] flex items-center justify-center"
            style={{
              background: "linear-gradient(0.68deg, #DFA2AD 0.59%, #AD8FB5 95.89%)",
              boxShadow: "inset 0px 4px 4px rgba(0, 0, 0, 0.25)",
            }}
          >
            <span
              className="text-[24px] md:text-[32px] font-bold text-white"
              style={{
                fontFamily: "'MADE Tommy Soft', sans-serif",
                textShadow: "0px 6px 4px rgba(0, 0, 0, 0.25)",
              }}
            >
              GO!!
            </span>
          </div>
        </button>
      </form>

      <div className="relative w-full mt-8 flex justify-center">
        <p
          className="absolute text-center font-bold text-[24px] sm:text-[32px] md:text-[40px] leading-[50px]"
          style={{
            fontFamily: "'MADE Tommy Soft', sans-serif",
            color: "#FFFFFF",
            WebkitTextStroke: "6px #FFFFFF",
          }}
        >
          a program for teenage girls to:
        </p>
        <p
          className="relative text-center font-bold text-[24px] sm:text-[32px] md:text-[40px] leading-[50px]"
          style={{
            fontFamily: "'MADE Tommy Soft', sans-serif",
            color: "#8183B8",
            textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          }}
        >
          a program for teenage girls to:
        </p>
      </div>

      {/* Sticker collage group */}
      <div className="w-full flex justify-center -mt-4 ">
        <Image
          src="/background/group.png"
          alt="Sleepover Sticker Collage"
          width={1200}
          height={900}
          className="w-full max-w-[1200px] h-auto"
        />
      </div>

      {/* Code → Earn Prizes! heading */}
      <div className="relative w-full mt-8 sm:mt-12 md:mt-16 pb-6 sm:pb-10 flex justify-center px-4">
        {/* White outline layer behind */}
        <h2
          className="absolute text-center pb-10 font-bold text-[28px] sm:text-[48px] md:text-[64px] lg:text-[96px] leading-[1.2]"
          style={{
            fontFamily: "'MADE Tommy Soft', sans-serif",
            color: "#FFFFFF",
            WebkitTextStroke: "8px #FFFFFF",
            textShadow: "0px 6px 4px rgba(0, 0, 0, 0.35)",
          }}
        >
          Code → Earn Prizes!
        </h2>
        {/* Blue fill layer on top */}
        <h2
          className="relative text-center font-bold text-[28px] sm:text-[48px] md:text-[64px] lg:text-[96px] leading-[1.2]"
          style={{
            fontFamily: "'MADE Tommy Soft', sans-serif",
            color: "#98c4edff",
          }}
        >
          Code → Earn Prizes!
        </h2>
      </div>
<AutoplayCarousel slides={slides} speed={1.3} />

      {/* ready? text */}
      <div className="relative w-full mt-8 sm:mt-12 md:mt-16 flex justify-center">
        {/* White outline layer */}
        <span
          className="absolute text-center font-bold text-[32px] sm:text-[48px] md:text-[64px] leading-[1.2]"
          style={{
            fontFamily: "'MADE Tommy Soft Outline', sans-serif",
            color: "#FFFFFF",
            WebkitTextStroke: "4px #FFFFFF",
            textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          }}
        >
          ready?
        </span>
        {/* Gradient fill layer */}
        <span
          className="relative text-center font-bold text-[32px] sm:text-[48px] md:text-[64px] leading-[1.2]"
          style={{
            fontFamily: "'MADE Tommy Soft', sans-serif",
            background: "linear-gradient(180deg, #435090 21.93%, #3D4884 38.93%, #5264AC 58.54%, #5D72BB 68.22%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          ready?
        </span>
      </div>

      {/* LET'S HAVE AN AWESOME SLEEPOVER!! text */}
      <div className="relative w-full mt-4 flex justify-center px-4">
        {/* White outline layer */}
        <h2
          className="absolute text-center font-medium text-[18px] sm:text-[32px] md:text-[48px] lg:text-[64px] leading-[1.2]"
          style={{
            fontFamily: "'MADE Tommy Soft Outline', sans-serif",
            color: "#FFFFFF",
            WebkitTextStroke: "6px #FFFFFF",
            textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          }}
        >
          LET&apos;S HAVE AN AWESOME SLEEPOVER!!
        </h2>
        {/* Gradient fill layer */}
        <h2
          className="relative text-center font-medium text-[18px] sm:text-[32px] md:text-[48px] lg:text-[64px] leading-[1.2]"
          style={{
            fontFamily: "'MADE Tommy Soft', sans-serif",
            background: "linear-gradient(180deg, #6A78B9 40.62%, #797FB9 47.22%, #8E89B9 56.39%, #9A8EB9 64.27%, #A091B9 70.87%, #AB96B9 75.27%, #B39AB9 78.75%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          LET&apos;S HAVE AN AWESOME SLEEPOVER!!
        </h2>
      </div>

      {/* Sign Up & FAQ Buttons */}
      <div className="w-full mt-8 sm:mt-12 flex items-center justify-center gap-4 sm:gap-8 flex-wrap px-4">
        {/* Sign Up Button */}
        <a
          href="/api/auth/login"
          className="relative w-[220px] sm:w-[280px] h-[100px] sm:h-[128px] rounded-[20px] cursor-pointer active:scale-95 transition-transform block"
          style={{
            background: "#FFFFFF",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div
            className="absolute inset-[6px] rounded-[20px]"
            style={{
              background: "linear-gradient(0deg, #6C8BE1 0%, #91BAF2 100%)",
              backdropFilter: "blur(2px)",
            }}
          />
          <div
            className="absolute inset-[14px] rounded-[20px] flex flex-col items-center justify-center"
            style={{
              background: "linear-gradient(0.68deg, #C7D6FF 0.59%, #548CEB 95.89%)",
              boxShadow: "inset 0px 4px 4px rgba(0, 0, 0, 0.25)",
            }}
          >
            <span
              className="text-[32px] sm:text-[48px] font-bold text-white"
              style={{
                fontFamily: "'MADE Tommy Soft', sans-serif",
                textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
              }}
            >
              SIGN UP
            </span>
            <span
              className="text-[20px] sm:text-[28px] font-normal text-white -mt-4"
              style={{
                fontFamily: "'MADE Tommy Soft', sans-serif",
                textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
              }}
            >
              (or sign in)
            </span>
          </div>
        </a>

        {/* FAQ Button */}
        <Link
          href="/faq"
          className="relative w-[220px] sm:w-[289px] h-[100px] sm:h-[129px] rounded-[20px] cursor-pointer active:scale-95 transition-transform"
          style={{
            background: "#FFFFFF",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div
            className="absolute inset-[4px] rounded-[20px]"
            style={{
              background: "linear-gradient(0deg, #7472A0 17.31%, #DFA1AA 100%)",
              boxShadow: "2px 2px 10px 4px #FFFBFB",
              backdropFilter: "blur(2px)",
            }}
          />
          <div
            className="absolute inset-[14px] rounded-[20px] flex items-center justify-center"
            style={{
              background: "linear-gradient(0.68deg, #DFA2AD 0.59%, #AD8FB5 95.89%)",
              boxShadow: "inset 0px 4px 4px rgba(0, 0, 0, 0.25)",
            }}
          >
            <span
              className="text-[48px] sm:text-[72px] font-bold text-white"
              style={{
                fontFamily: "'MADE Tommy Soft', sans-serif",
                textShadow: "0px 6px 4px rgba(0, 0, 0, 0.25)",
              }}
            >
              FAQ
            </span>
          </div>
        </Link>
      </div>

      {/* Back to Top */}
      <div className="w-full flex justify-center mt-12 sm:mt-16 md:mt-20">
        <a
          href="#"
          className="cursor-pointer hover:opacity-80 transition-opacity animate-bounce text-[20px] sm:text-[28px] md:text-[32px]"
          style={{
            fontFamily: "'MADE Tommy Soft', sans-serif",
            fontWeight: 400,
            lineHeight: "1.25",
            color: "#6C6EA0",
            animation: "float 2s ease-in-out infinite",
            textShadow: "0px 4px 8px rgba(255, 255, 255, 0.8)",
          }}
        >
          back to top ↑
        </a>
      </div>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      {/* Footer Text */}
      <div className="w-full flex flex-col items-center mt-8 sm:mt-12 gap-2 px-4">
        <span
          className="text-[18px] sm:text-[24px] md:text-[32px]"
          style={{
            fontFamily: "'MADE Tommy Soft', sans-serif",
            fontWeight: 400,
            lineHeight: "1.25",
            textAlign: "center",
            color: "#9DC9F7",
          }}
        >
          made with &lt;3 by teens, for teens
        </span>
        <a
          href="https://hackclub.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[14px] sm:text-[18px] md:text-[24px] transition-all hover:underline hover:decoration-wavy hover:underline-offset-4"
          style={{
            fontFamily: "'MADE Tommy Soft', sans-serif",
            fontWeight: 400,
            lineHeight: "1.25",
            textAlign: "center",
            color: "#7591E2",
          }}
        >
          Hack Club 2026
        </a>
      </div>

    </main>
  );
}
