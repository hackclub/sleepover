"use client";

import { useEffect, useMemo, useState } from "react";
import { createProject } from "@/app/forms/actions/createProject";

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewProjectModal({ isOpen, onClose }: NewProjectModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [projects, setProjects] = useState<string[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [projectsError, setProjectsError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    setLoadingProjects(true);
    setProjectsError(null);

    fetch("/api/user/projects")
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => {
        const list = Array.isArray(data.projects) ? data.projects.map(String) : [];
        setProjects(list);
      })
      .catch((err) => {
        console.error(err);
        setProjects([]);
        setProjectsError("Could not load Hackatime projects.");
      })
      .finally(() => setLoadingProjects(false));
  }, [isOpen]);

  // ✅ Deduplicate so keys are unique and dropdown doesn't show duplicates
  const uniqueProjects = useMemo(() => Array.from(new Set(projects)), [projects]);

  if (!isOpen) return null;

  // ✅ IMPORTANT: use onSubmit (NOT action=...) so client code runs and can close modal
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      await createProject(formData);
      // Force full page reload to show new project
      window.location.href = "/portal";
    } catch (error: any) {
      // Next.js redirect throws NEXT_REDIRECT - still reload to show new project
      if (error?.digest?.includes("NEXT_REDIRECT")) {
        window.location.href = "/portal";
        return;
      }
      console.error(error);
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-[100]" onClick={onClose} />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90%] max-w-[520px]">
        <div
          className="relative rounded-[30px] overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #FFF0FD 0%, #D9DAF8 100%)",
            boxShadow: "0px 4px 4px rgba(116,114,160,0.62)",
          }}
        >
          {/* Header bar */}
          <div
            className="w-full h-[70px] md:h-[85px]"
            style={{
              background: "linear-gradient(180deg, #FFE5E8 27%, #EBC0CC 100%)",
            }}
          />

          {/* Title */}
          <h2
            className="absolute top-4 md:top-5 left-1/2 -translate-x-1/2 text-[32px] md:text-[40px] font-bold whitespace-nowrap"
            style={{
              fontFamily: "'MADE Tommy Soft', sans-serif",
              color: "#6C6EA0",
              textShadow: "0px 2px 2px rgba(108,110,160,0.6)",
            }}
          >
            New Project
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 md:px-10 pb-8 pt-4">
            {/* Project Name */}
            <div className="mb-4">
              <label
                className="block text-[20px] md:text-[24px] font-bold mb-2"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  background: "linear-gradient(180deg, #7685CB 0%, #7472A0 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Project Name
              </label>
              <input
                name="name"
                required
                className="w-full rounded-[12px] px-4 py-3 text-[#6C6EA0] text-lg outline-none"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  background: "white",
                  boxShadow:
                    "0px 4px 4px rgba(116,114,160,0.62), inset 2px 4px 8px rgba(116,114,160,0.29)",
                }}
              />
            </div>

            {/* Project Description */}
            <div className="mb-6">
              <label
                className="block text-[20px] md:text-[24px] font-bold mb-2"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  background: "linear-gradient(180deg, #586AB0 0%, #6C6EA0 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Project Description
              </label>
              <textarea
                name="desc"
                rows={5}
                className="w-full rounded-[12px] px-4 py-3 text-[#6C6EA0] text-lg outline-none resize-none"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  background: "white",
                  boxShadow:
                    "0px 4px 4px rgba(116,114,160,0.62), inset 2px 4px 8px rgba(116,114,160,0.29)",
                }}
              />
            </div>

            {/* Hackatime Select (styled) */}
            <div className="relative mb-6">
              <label
                className="block text-[20px] md:text-[24px] font-bold mb-2"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  background: "linear-gradient(180deg, #7684C9 0%, #7472A0 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Link Hackatime Project
              </label>

              <div
                className="relative rounded-[16px] isolate"
                style={{
                  background: "linear-gradient(180deg, #FFF6E0 0%, #FFE8B2 100%)",
                  border: "4px solid white",
                  boxShadow: "0px 4px 0px #C6C7E4, 0px 6px 8px rgba(116,114,160,0.69)",
                }}
              >
                <div
                  className="absolute inset-[4px] rounded-[12px] pointer-events-none z-0"
                  style={{
                    background: "linear-gradient(180deg, #FFFCF4 12%, #FFE8B2 100%)",
                    boxShadow: "0px 2px 2px rgba(116,114,160,0.33)",
                  }}
                />

                <select
                  name="project"
                  required
                  defaultValue=""
                  className="relative z-10 w-full appearance-none bg-transparent px-4 py-3 pr-10 text-[20px] md:text-[24px] font-bold outline-none cursor-pointer"
                  style={{
                    fontFamily: "'MADE Tommy Soft', sans-serif",
                    background: "linear-gradient(180deg, #7684C9 0%, #7472A0 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {loadingProjects ? (
                    <option value="">Loading Hackatime projects…</option>
                  ) : uniqueProjects.length === 0 ? (
                    <option value="">
                      {projectsError ? "Failed to load projects" : "No Hackatime projects found"}
                    </option>
                  ) : (
                    <>
                      <option value="" disabled>
                        Select a Hackatime project…
                      </option>
                      {uniqueProjects.map((project) => (
                        <option key={project} value={project} style={{ color: "#6C6EA0" }}>
                          {project}
                        </option>
                      ))}
                    </>
                  )}
                </select>

                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#6C6EA0] z-10">
                  ▼
                </div>
              </div>

              {projectsError && (
                <div
                  className="mt-2 text-sm"
                  style={{ color: "#6C6EA0", fontFamily: "'MADE Tommy Soft', sans-serif" }}
                >
                  {projectsError}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4">
              <button
                type="submit"
                disabled={isSubmitting || loadingProjects || uniqueProjects.length === 0}
                className="relative rounded-[16px] px-8 py-2.5 transition-transform hover:scale-105 disabled:opacity-70"
                style={{
                  background: "linear-gradient(0deg, #9AC6F6 0%, #93B4F2 100%)",
                  border: "4px solid white",
                  boxShadow: "0px 4px 0px #C6C7E4, 0px 6px 8px rgba(116,114,160,0.69)",
                }}
              >
                <div
                  className="absolute inset-[4px] rounded-[12px] pointer-events-none"
                  style={{
                    background: "linear-gradient(180deg, #C0DEFE 12%, #9AC6F6 100%)",
                    boxShadow: "0px 2px 2px rgba(116,114,160,0.33)",
                  }}
                />
                <span
                  className="relative z-10 text-[16px] md:text-[18px] font-bold"
                  style={{
                    fontFamily: "'MADE Tommy Soft', sans-serif",
                    background: "linear-gradient(180deg, #7684C9 0%, #7472A0 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {isSubmitting ? "Loading..." : "Save"}
                </span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="relative rounded-[16px] px-8 py-2.5 transition-transform hover:scale-105"
                style={{
                  background: "linear-gradient(180deg, #FFE2EA 0%, #E6A4AB 100%)",
                  border: "4px solid white",
                  boxShadow: "0px 4px 0px #C6C7E4, 0px 6px 8px rgba(116,114,160,0.69)",
                }}
              >
                <div
                  className="absolute inset-[4px] rounded-[12px] pointer-events-none"
                  style={{
                    background: "linear-gradient(180deg, #EBC0CC 12%, #FFE3E6 100%)",
                    boxShadow: "0px 2px 2px rgba(116,114,160,0.33)",
                  }}
                />
                <span
                  className="relative z-10 text-[16px] md:text-[18px] font-bold"
                  style={{
                    fontFamily: "'MADE Tommy Soft', sans-serif",
                    background: "linear-gradient(180deg, #7684C9 0%, #7472A0 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Close
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
