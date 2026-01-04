"use client";

import { useState } from "react";
import { createProject } from "@/app/forms/actions/createProject";

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewProjectModal({ isOpen, onClose }: NewProjectModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await createProject(formData);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-[100]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90%] max-w-[520px]">
        {/* Main container with gradient background */}
        <div
          className="relative rounded-[30px] overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #FFF0FD 0%, #D9DAF8 100%)",
            boxShadow: "0px 4px 4px rgba(116,114,160,0.62)",
          }}
        >
          {/* Pink header bar */}
          <div
            className="w-full h-[70px] md:h-[85px]"
            style={{
              background: "linear-gradient(180deg, #FFE5E8 27%, #EBC0CC 100%)",
            }}
          />

          {/* Title positioned over the header */}
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

          {/* Form content */}
          <form action={handleSubmit} className="px-6 md:px-10 pb-8 pt-4">
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
                  boxShadow: "0px 4px 4px rgba(116,114,160,0.62), inset 2px 4px 8px rgba(116,114,160,0.29)",
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
                  boxShadow: "0px 4px 4px rgba(116,114,160,0.62), inset 2px 4px 8px rgba(116,114,160,0.29)",
                }}
              />
            </div>

            {/* Link Hackatime Button (non-functional) */}
            <div className="relative mb-6">
              <button
                type="button"
                disabled
                className="w-full rounded-[16px] py-3 cursor-not-allowed"
                style={{
                  background: "linear-gradient(180deg, #FFF6E0 0%, #FFE8B2 100%)",
                  border: "4px solid white",
                  boxShadow: "0px 4px 0px #C6C7E4, 0px 6px 8px rgba(116,114,160,0.69)",
                }}
              >
                {/* Inner highlight */}
                <div
                  className="absolute inset-[4px] rounded-[12px] pointer-events-none"
                  style={{
                    background: "linear-gradient(180deg, #FFFCF4 12%, #FFE8B2 100%)",
                    boxShadow: "0px 2px 2px rgba(116,114,160,0.33)",
                  }}
                />
                <span
                  className="relative z-10 text-[20px] md:text-[24px] font-bold"
                  style={{
                    fontFamily: "'MADE Tommy Soft', sans-serif",
                    background: "linear-gradient(180deg, #7684C9 0%, #7472A0 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Link Hackatime Project
                </span>
              </button>
            </div>

            {/* Save and Close buttons */}
            <div className="flex justify-center gap-4">
              {/* Save Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="relative rounded-[16px] px-8 py-2.5 transition-transform hover:scale-105 disabled:opacity-70"
                style={{
                  background: "linear-gradient(0deg, #9AC6F6 0%, #93B4F2 100%)",
                  border: "4px solid white",
                  boxShadow: "0px 4px 0px #C6C7E4, 0px 6px 8px rgba(116,114,160,0.69)",
                }}
              >
                {/* Inner highlight */}
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

              {/* Close Button */}
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
                {/* Inner highlight */}
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
