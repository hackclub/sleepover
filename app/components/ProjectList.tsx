"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { deleteProject } from "@/app/forms/actions/deleteProject";
import GradientText from "./GradientText";
import DeleteConfirmModal from "./DeleteConfirmModal";

function TrashIcon() {
  return (
    <Image src="/icons/trashcan.png" alt="trash" width={16} height={18} />
  );
}

export default function ProjectList({ projects: initialProjects }: { projects: any[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; name: string } | null>(null);

  const handleDeleteClick = (projectId: string, projectName: string) => {
    setProjectToDelete({ id: projectId, name: projectName });
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    
    setDeletingId(projectToDelete.id);
    try {
      await deleteProject(projectToDelete.id);
      window.location.reload();
    } catch (error) {
      console.error(error);
      setDeletingId(null);
      setProjectToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setProjectToDelete(null);
  };

  return (
    <div className="w-full px-4 md:px-6 py-4 space-y-6">
      {projects.map((p: any) => (
        <div
          key={p.id}
          className="flex items-center justify-between gap-4"
        >
          <div className="flex-1 min-w-0">
            {/* Project Name */}
            <Link href={`/portal/projects/${p.id}`}><h3 className="text-2xl md:text-4xl">
              <GradientText
                gradient="linear-gradient(180deg, #7791E6 0%, #7472A0 100%)"
                strokeWidth="6px"
              >
                {p.name}
              </GradientText>
            </h3></Link>

            {/* Hours + Star + Hackatime Project */}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-base md:text-lg">
                <GradientText
                  gradient="linear-gradient(180deg, #93B4F2 0%, #6988E0 100%)"
                  strokeWidth="4px"
                >
                  {p.hours ? `${p.hours.toFixed(2)} hours` : "##.# hours"}
                </GradientText>
              </span>

              <Image src="/icons/star.svg" alt="star" width={24} height={24} />

              <span className="text-base md:text-lg">
                <GradientText
                  gradient="linear-gradient(180deg, #B5AAE7 0%, #D488AD 100%)"
                  strokeWidth="4px"
                >
                  {p.hackatime_name || "hackatime project"}
                </GradientText>
              </span>
            </div>

            {/* Delete button */}
            <button
              onClick={() => handleDeleteClick(p.id, p.name)}
              disabled={deletingId === p.id}
              className="flex items-center gap-1 mt-1 cursor-pointer disabled:opacity-50"
            >
              <TrashIcon />
              <span
                className="text-sm font-bold opacity-75"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  color: "#B94D6F",
                }}
              >
                {deletingId === p.id ? "deleting..." : "delete project"}
              </span>
            </button>
          </div>

          {/* SHIP! Button */}
          <Link href={`/portal/forms/ship?projectId=${p.id}`}>
            <button
              className="relative flex items-center justify-center rounded-2xl transition-transform hover:scale-105 cursor-pointer"
              style={{
                width: "127px",
                height: "53px",
                background: "linear-gradient(180deg, #FFF6E0 0%, #FFE8B2 100%)",
                border: "4px solid white",
                boxShadow: "0px 4px 0px 0px #C6C7E4, 0px 6px 8px 0px rgba(116,114,160,0.69)",
                borderRadius: "16px",
              }}
            >
              <div
                className="absolute inset-[4px] rounded-xl"
                style={{
                  background: "linear-gradient(0deg, #FFF2D4 12%, #FFE8B2 100%)",
                  boxShadow: "0px 2px 2px 0px rgba(116,114,160,0.33)",
                  borderRadius: "12px",
                }}
              />
              <span className="relative z-10 text-2xl">
                <GradientText
                  gradient="linear-gradient(180deg, #7684C9 0%, #7472A0 100%)"
                  strokeWidth="2px"
                >
                  SHIP!
                </GradientText>
              </span>
            </button>
          </Link>
        </div>
      ))}

      {projects.length === 0 && (
        <p
          className="text-center py-8 text-lg"
          style={{
            fontFamily: "'MADE Tommy Soft', sans-serif",
            color: "#7472A0",
          }}
        >
          No projects yet. Create your first one!
        </p>
      )}

      <DeleteConfirmModal
        isOpen={projectToDelete !== null}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isDeleting={deletingId !== null}
        projectName={projectToDelete?.name}
      />
    </div>
  );
}
