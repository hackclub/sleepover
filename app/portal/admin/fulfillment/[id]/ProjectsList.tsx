"use client";

import { useState } from "react";

const FONT = "'MADE Tommy Soft', sans-serif";

interface Project {
  id: string;
  project: string;
  hoursRaw: number;
  feathers: number;
  playableUrl: string | null;
  codeUrl: string | null;
}

export default function ProjectsList({ projects }: { projects: Project[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const totalFeathers = projects.reduce((sum, p) => sum + p.feathers, 0);

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "rgba(255,255,255,0.95)",
        border: "2px solid #dde0f8",
        boxShadow: "0 2px 8px rgba(108,110,160,0.08)",
      }}
    >
      <div className="flex items-baseline gap-4 mb-4">
        <h2 className="text-lg font-bold" style={{ color: "#4a4c78", fontFamily: FONT }}>
          Projects ({projects.length})
        </h2>
        <span className="text-sm font-semibold" style={{ color: "#6D90E3", fontFamily: FONT }}>
          {totalFeathers} feathers total
        </span>
      </div>
      {projects.length === 0 ? (
        <p className="text-sm" style={{ color: "#8a8cb0", fontFamily: FONT }}>No projects found.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {projects.map((p) => {
            const isOpen = openId === p.id;
            return (
              <div key={p.id} style={{ border: "1.5px solid #e0e2f4", borderRadius: "12px", overflow: "hidden" }}>
                <button
                  onClick={() => setOpenId(isOpen ? null : p.id)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:opacity-80"
                  style={{ background: "#f4f5fb", fontFamily: FONT }}
                >
                  <span className="font-semibold text-sm truncate flex-1 min-w-0" style={{ color: "#3a3c68" }}>
                    {p.project}
                  </span>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-sm font-bold" style={{ color: "#6D90E3" }}>
                      {p.feathers} 🪶
                    </span>
                    <span className="text-xs" style={{ color: "#8a8cb0" }}>{isOpen ? "▲" : "▼"}</span>
                  </div>
                </button>
                {isOpen && (
                  <div className="px-4 py-3 flex flex-col gap-2" style={{ background: "white" }}>
                    <div className="flex gap-6 text-sm flex-wrap">
                      <span style={{ color: "#8a8cb0", fontFamily: FONT }}>
                        Hours logged:{" "}
                        <span className="font-semibold" style={{ color: "#4a4c78" }}>{p.hoursRaw}h</span>
                      </span>
                      <span style={{ color: "#8a8cb0", fontFamily: FONT }}>
                        Feathers awarded:{" "}
                        <span className="font-semibold" style={{ color: "#4a4c78" }}>{p.feathers} 🪶</span>
                      </span>
                    </div>
                    <div className="flex gap-3 flex-wrap mt-1">
                      {p.playableUrl && (
                        <a
                          href={p.playableUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold px-3 py-1.5 rounded-full transition-opacity hover:opacity-70"
                          style={{ background: "#e6f9f0", color: "#1a7a4a", border: "1.5px solid #7dd3aa", fontFamily: FONT }}
                        >
                          Playable ↗
                        </a>
                      )}
                      {p.codeUrl && (
                        <a
                          href={p.codeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold px-3 py-1.5 rounded-full transition-opacity hover:opacity-70"
                          style={{ background: "#e8eaf8", color: "#5A5C8A", border: "1.5px solid #c0c2e8", fontFamily: FONT }}
                        >
                          GitHub ↗
                        </a>
                      )}
                      {!p.playableUrl && !p.codeUrl && (
                        <span className="text-xs" style={{ color: "#8a8cb0", fontFamily: FONT }}>No links provided</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
