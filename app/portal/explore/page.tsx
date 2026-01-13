"use client";

import { useState, useEffect } from "react";
import PortalSidebar from "../../components/PortalSidebar";
import ProjectCard, { ProjectData } from "../../components/ProjectCard";
import { getGallery } from "@/lib/airtable";
import GradientText from "@/app/components/GradientText";

function useGridColumns(sidebarOpen: boolean, isMobile: boolean) {
  const [cols, setCols] = useState(3);

  useEffect(() => {
    const updateCols = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setCols(1);
      } else if (width < 768) {
        setCols(2);
      } else if (!sidebarOpen && width >= 1280) {
        setCols(4);
      } else {
        setCols(3);
      }
    };

    updateCols();
    window.addEventListener("resize", updateCols);
    return () => window.removeEventListener("resize", updateCols);
  }, [sidebarOpen, isMobile]);

  return cols;
}

export default function ExplorePage() {
  const [projects, SetProjects] = useState<ProjectData[]>([]);

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        console.log("GALLERY ==", data)
        SetProjects(data.data)
      })
      .catch(console.error);
    }, []);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const cols = useGridColumns(sidebarOpen, isMobile);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      className="min-h-screen flex"
      style={{
        backgroundImage: "url('/background/tile.png')",
        backgroundRepeat: "repeat",
      }}
    >
      <PortalSidebar onStateChange={setSidebarOpen} />

      <main
        className="flex-1 p-4 md:p-8 lg:p-12 pt-16 md:pt-8 transition-all duration-300"
        style={{
          marginLeft: isMobile ? "0px" : sidebarOpen ? "clamp(320px, 25vw, 520px)" : "96px",
        }}
      >
        <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold text-center mb-4 relative">
          <span
            className="absolute inset-0 pointer-events-none"
            style={{
              fontFamily: "'MADE Tommy Soft', sans-serif",
              WebkitTextStroke: isMobile ? "5px white" : "8px white",
              color: "transparent",
              filter: "drop-shadow(0px 4px 0px #c6c7e4)",
            }}
          >
            Gallery
          </span>
          <span
            className="relative bg-gradient-to-b from-[#b7c1f2] to-[#89a8ef] bg-clip-text"
            style={{
              fontFamily: "'MADE Tommy Soft', sans-serif",
              WebkitTextFillColor: "transparent",
            }}
          >
            Gallery
          </span>
        </h1>

        <p className="text-base md:text-lg lg:text-2xl text-center mb-8 md:mb-12 px-2">
          <GradientText
            gradient="#6c6ea0"
            strokeWidth={isMobile ? "2px" : "4px"}
          >
            need inspiration? check out awesome projects below - or click on -- to get project inspiration!
          </GradientText>
        </p>

        <div
          className={`
            grid gap-4 md:gap-6 mx-auto transition-all duration-300
            grid-cols-1 md:grid-cols-2
            ${sidebarOpen ? "max-w-5xl" : "xl:grid-cols-3 max-w-7xl"}
          `}
        >
          {projects.map((project, index) => {
            const row = Math.floor(index / cols);
            const col = index % cols;
            const isBlue = (row + col) % 2 === 0;
            return (
              <ProjectCard
                key={project.id}
                project={project}
                variant={isBlue ? "blue" : "yellow"}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}
