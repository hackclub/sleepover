"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { updateProjectNameAction } from "@/app/forms/actions/UpdateProjectName";
import { updateProjectDescAction } from "@/app/forms/actions/UpdateProjectDesc";

interface ProjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

interface Project {
  id: string;
  name: string;
  desc: string;
  hours: number;
  hackatime_name: string;
  userid: string;
}

export default function ProjectDetailModal({ isOpen, onClose, projectId }: ProjectDetailModalProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState<string>("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState<string>("");
  const [projectDesc, setProjectDesc] = useState<string>("");
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [tempDesc, setTempDesc] = useState<string>("");
  const [hackatimeName, setHackatimeName] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen || !projectId) return;

    async function fetchProject() {
      setLoading(true);
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        if (res.ok) {
          const data = await res.json();
          setProject(data.project);
          setProjectName(data.project.name);
          setProjectDesc(data.project.desc || "");
          setHackatimeName(data.project.hackatime_name || "");
        }
      } catch (error) {
        console.error("Failed to fetch project:", error);
      }
      setLoading(false);
    }

    fetchProject();
  }, [isOpen, projectId]);

  const handleEditName = () => {
    setTempName(projectName);
    setIsEditingName(true);
  };

  const handleCancelNameEdit = () => {
    setTempName("");
    setIsEditingName(false);
  };

  const handleNameFormSubmit = async (formData: FormData) => {
    const newName = formData.get("projectName") as string;
    if (!newName?.trim()) return;

    try {
      const result = await updateProjectNameAction(projectId, newName);
      if (result.success) {
        setProjectName(result.project.name);
        setIsEditingName(false);
        setTempName("");
      }
    } catch (error) {
      console.error("Error updating project name:", error);
    }
  };

  const handleEditDesc = () => {
    setTempDesc(projectDesc);
    setIsEditingDesc(true);
  };

  const handleCancelDescEdit = () => {
    setTempDesc("");
    setIsEditingDesc(false);
  };

  const handleDescFormSubmit = async (formData: FormData) => {
    const newDesc = formData.get("projectDesc") as string;
    if (!newDesc?.trim()) return;

    try {
      const result = await updateProjectDescAction(projectId, newDesc);
      if (result.success) {
        setProjectDesc(result.project.desc);
        setIsEditingDesc(false);
        setTempDesc("");
      }
    } catch (error) {
      console.error("Error updating project description:", error);
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-[100]"
        onClick={onClose}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90%] max-w-[600px] max-h-[80vh] overflow-y-auto">
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
            Project Details
          </h2>

          {/* Content */}
          <div className="px-6 md:px-10 pb-8 pt-4">
            {loading ? (
              <div className="text-center py-8">
                <p
                  className="text-[20px]"
                  style={{
                    fontFamily: "'MADE Tommy Soft', sans-serif",
                    color: "#7472A0",
                  }}
                >
                  Loading...
                </p>
              </div>
            ) : (
              <>
                {/* Project Name Section */}
                <div className="mb-6">
                  {isEditingName ? (
                    <form
                      action={async (formData) => {
                        await handleNameFormSubmit(formData);
                      }}
                      className="space-y-3"
                    >
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
                        type="text"
                        name="projectName"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="w-full rounded-[12px] px-4 py-3 text-[#6C6EA0] text-lg outline-none"
                        style={{
                          fontFamily: "'MADE Tommy Soft', sans-serif",
                          background: "white",
                          boxShadow:
                            "0px 4px 4px rgba(116,114,160,0.62), inset 2px 4px 8px rgba(116,114,160,0.29)",
                        }}
                        placeholder="Project name"
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="px-4 py-2 text-sm rounded-lg font-bold transition-opacity hover:opacity-80"
                          style={{
                            fontFamily: "'MADE Tommy Soft', sans-serif",
                            background: "linear-gradient(180deg, #93B4F2 0%, #6988E0 100%)",
                            color: "white",
                          }}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelNameEdit}
                          className="px-4 py-2 text-sm rounded-lg font-bold transition-opacity hover:opacity-80"
                          style={{
                            fontFamily: "'MADE Tommy Soft', sans-serif",
                            background: "#E8E8E8",
                            color: "#7472A0",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <label
                          className="block text-[20px] md:text-[24px] font-bold"
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
                        <button
                          onClick={handleEditName}
                          className="px-3 py-1 text-sm rounded-lg font-bold transition-opacity hover:opacity-80"
                          style={{
                            fontFamily: "'MADE Tommy Soft', sans-serif",
                            background: "#E8E8E8",
                            color: "#7472A0",
                          }}
                        >
                          Edit
                        </button>
                      </div>
                      <p
                        className="text-[18px] md:text-[20px]"
                        style={{
                          fontFamily: "'MADE Tommy Soft', sans-serif",
                          color: "#6C6EA0",
                        }}
                      >
                        {projectName || "No name"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Description Section */}
                <div className="mb-6">
                  {isEditingDesc ? (
                    <form
                      action={async (formData) => {
                        await handleDescFormSubmit(formData);
                      }}
                      className="space-y-3"
                    >
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
                        Description
                      </label>
                      <textarea
                        name="projectDesc"
                        value={tempDesc}
                        onChange={(e) => setTempDesc(e.target.value)}
                        rows={5}
                        className="w-full rounded-[12px] px-4 py-3 text-[#6C6EA0] text-lg outline-none resize-none"
                        style={{
                          fontFamily: "'MADE Tommy Soft', sans-serif",
                          background: "white",
                          boxShadow:
                            "0px 4px 4px rgba(116,114,160,0.62), inset 2px 4px 8px rgba(116,114,160,0.29)",
                        }}
                        placeholder="Project description"
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="px-4 py-2 text-sm rounded-lg font-bold transition-opacity hover:opacity-80"
                          style={{
                            fontFamily: "'MADE Tommy Soft', sans-serif",
                            background: "linear-gradient(180deg, #93B4F2 0%, #6988E0 100%)",
                            color: "white",
                          }}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelDescEdit}
                          className="px-4 py-2 text-sm rounded-lg font-bold transition-opacity hover:opacity-80"
                          style={{
                            fontFamily: "'MADE Tommy Soft', sans-serif",
                            background: "#E8E8E8",
                            color: "#7472A0",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <label
                          className="block text-[20px] md:text-[24px] font-bold"
                          style={{
                            fontFamily: "'MADE Tommy Soft', sans-serif",
                            background: "linear-gradient(180deg, #586AB0 0%, #6C6EA0 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                          }}
                        >
                          Description
                        </label>
                        <button
                          onClick={handleEditDesc}
                          className="px-3 py-1 text-sm rounded-lg font-bold transition-opacity hover:opacity-80"
                          style={{
                            fontFamily: "'MADE Tommy Soft', sans-serif",
                            background: "#E8E8E8",
                            color: "#7472A0",
                          }}
                        >
                          Edit
                        </button>
                      </div>
                      <p
                        className="text-[16px] md:text-[18px]"
                        style={{
                          fontFamily: "'MADE Tommy Soft', sans-serif",
                          color: "#6C6EA0",
                        }}
                      >
                        {projectDesc || "No description yet"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Hackatime Project Section */}
                <div className="mb-6">
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
                    Hackatime Project
                  </label>
                  <p
                    className="text-[16px] md:text-[18px]"
                    style={{
                      fontFamily: "'MADE Tommy Soft', sans-serif",
                      color: "#6C6EA0",
                    }}
                  >
                    {hackatimeName || "No hackatime project linked"}
                  </p>
                </div>

                {/* Close Button */}
                <div className="flex justify-center">
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
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}
