"use client";

import { useState, useEffect } from "react";
import PortalSidebar from "../../components/PortalSidebar";
import ProjectCard from "../../components/ProjectCard";
import { placeholderProjects } from "@/lib/projects";

function useGridColumns(sidebarOpen: boolean) {
  const [cols, setCols] = useState(3);

  useEffect(() => {
    const updateCols = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setCols(1);
      } else if (!sidebarOpen && width >= 1280) {
        setCols(4);
      } else {
        setCols(3);
      }
    };

    updateCols();
    window.addEventListener("resize", updateCols);
    return () => window.removeEventListener("resize", updateCols);
  }, [sidebarOpen]);

  return cols;
}

export default function ExplorePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const cols = useGridColumns(sidebarOpen);

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
        className="flex-1 p-8 md:p-12 transition-all duration-300"
        style={{
          marginLeft: sidebarOpen ? "clamp(320px, 25vw, 520px)" : "96px",
        }}
      >
        <h1 className="text-6xl md:text-8xl font-bold text-center mb-4 relative">
          <span
            className="absolute inset-0 pointer-events-none"
            style={{
              fontFamily: "'MADE Tommy Soft', sans-serif",
              WebkitTextStroke: "8px white",
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

        <p className="text-lg md:text-2xl font-bold text-center mb-12 relative">
          <span
            className="absolute inset-0 pointer-events-none"
            style={{
              fontFamily: "'MADE Tommy Soft', sans-serif",
              WebkitTextStroke: "4px white",
              color: "transparent",
            }}
          >
            need inspiration? check out awesome projects below - or click on -- to get project inspiration!
          </span>
          <span
            className="relative text-[#6c6ea0]"
            style={{
              fontFamily: "'MADE Tommy Soft', sans-serif",
              textShadow: "0px 4px 4px rgba(0,0,0,0.25)",
            }}
          >
            need inspiration? check out awesome projects below - or click on -- to get project inspiration!
          </span>
        </p>

        <div
          className={`
            grid gap-6 mx-auto transition-all duration-300
            grid-cols-1 md:grid-cols-3
            ${sidebarOpen ? "max-w-5xl" : "xl:grid-cols-4 max-w-7xl"}
          `}
        >
          {placeholderProjects.map((project, index) => {
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
