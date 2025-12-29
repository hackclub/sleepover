"use client";

import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import Image from "next/image";
import { useRef } from "react";

type Slide = {
  src: string;
  alt: string;
  label: string;
  cloudBg: string;
};

function CloudCard({ slide }: { slide: Slide }) {
  return (
    <div className="relative w-[260px] sm:w-[300px] lg:w-[320px]">
      {/* Cloud background image */}
      <Image
        src={slide.cloudBg}
        alt=""
        width={320}
        height={280}
        className="w-full h-auto"
      />

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="relative w-[180px] h-[140px]">
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            className="object-contain drop-shadow"
            sizes="(min-width: 1024px) 180px, 180px"
          />
        </div>

      </div>

      {/* Curved text label */}
      <svg
        viewBox="0 0 260 60"
        className="absolute bottom-[10%] left-[55%] -translate-x-1/2 w-[85%]"
      >
        <defs>
          <path
            id={`curve-${slide.label.replace(/\s/g, "")}`}
            d="M 25 30 Q 145 80 250 25"
            fill="transparent"
          />
        </defs>
        {/* White background stroke */}
        <text
          style={{
            fontFamily: "'MADE Tommy Soft', sans-serif",
            fontWeight: 700,
            fontSize: "20px",
          }}
        >
          <textPath
            href={`#curve-${slide.label.replace(/\s/g, "")}`}
            startOffset="50%"
            textAnchor="middle"
            fill="white"
            stroke="white"
            strokeWidth="10"
            strokeLinejoin="round"
          >
            {slide.label}
          </textPath>
        </text>
        {/* Blue fill text */}
        <text
          style={{
            fontFamily: "'MADE Tommy Soft', sans-serif",
            fontWeight: 700,
            fontSize: "20px",
          }}
        >
          <textPath
            href={`#curve-${slide.label.replace(/\s/g, "")}`}
            startOffset="50%"
            textAnchor="middle"
            fill="#586AB0"
          >
            {slide.label}
          </textPath>
        </text>
      </svg>
    </div>
  );
}

export default function AutoplayCarousel({
  slides,
  speed = 1.2, // higher = faster (try 0.8–2.5)
}: {
  slides: Slide[];
  speed?: number;
}) {
  // duplicate slides for seamless feel
  const loopSlides = [...slides, ...slides];

  const autoScroll = useRef(
    AutoScroll({
      playOnInit: true,
      speed,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      startDelay: 0,
    })
  );

  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      containScroll: false,
      dragFree: true,
    },
    [autoScroll.current]
  );

  return (
    <div ref={emblaRef} className="overflow-hidden w-full">
      <div className="flex items-center gap-8">
        {loopSlides.map((s, i) => (
          <div
            key={i}
            // ~4 across on desktop, fewer on smaller screens
            className="shrink-0 flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_25%] flex justify-center"
          >
            <CloudCard slide={s} />
          </div>
        ))}
      </div>
    </div>
  );
}
