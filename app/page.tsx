"use client";

import Image from "next/image";

export default function Home() {
  return (
    <main className="relative z-10">
      <div className="relative w-full flex">
        <span
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pb-2 font-bold text-[12px] sm:text-[16px] md:text-[22px] min-[1792px]:text-[40px] leading-[16px] sm:leading-[22px] md:leading-[30px] min-[1792px]:leading-[50px] z-10 px-2 whitespace-nowrap"
          style={{
            fontFamily: "'MADE Tommy Soft', sans-serif",
            background: "linear-gradient(357.47deg, #282A5A -128.92%, #2E3367 -26.66%, #38417B 130.45%, #424F90 389.82%)",
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
        
        {/* Video placeholder */}
        <div
          className="w-[280px] h-[185px] sm:w-[350px] sm:h-[230px] md:w-[450px] md:h-[300px] min-[1792px]:w-[513px] min-[1792px]:h-[338px] rounded-[15px]"
          style={{
            background: "linear-gradient(180deg, #919ED5 0%, #9199CB 60.1%, #9199CB 100%)",
          }}
        />
      </div>

      {/* Email signup */}
      <form className="w-full mt-8 flex items-center justify-center gap-4" onSubmit={(e) => e.preventDefault()}>
        <input
          type="email"
          placeholder="enter your email..."
          className="w-[280px] sm:w-[350px] md:w-[499px] h-[50px] md:h-[65px] rounded-[20px] px-6 text-[18px] md:text-[24px] font-bold text-center outline-none"
          style={{
            fontFamily: "'MADE Tommy Soft', sans-serif",
            background: "#FFFCF6",
            border: "3px solid #FFFFFF",
            boxShadow: "0px 6px 4px rgba(0, 0, 0, 0.25), inset 0px 6px 10px 2px rgba(0, 0, 0, 0.25)",
            color: "#BBC8ED",
          }}
        />
        
        {/* GO button */}
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
    </main>
  );
}
