import Image from "next/image";

export interface ProjectData {
  id: string;
  fields: any;
  variant: "blue" | "yellow";
}

interface ProjectCardProps {
  project: ProjectData;
  variant?: "blue" | "yellow";
}

export default function ProjectCard({ project, variant }: ProjectCardProps) {
  console.log("SCREENSHOT =", project.fields.Screenshot[0].url)

  const cardVariant = variant ?? project.variant;
  const isBlue = cardVariant === "blue";

  const cardGradient = isBlue
    ? "from-[#c0defe] to-[#9ac6f6]"
    : "from-[#fff3d7] to-[#ffe8b2]";

  const innerGradient = isBlue
    ? "from-[#93b4f2] to-[#c0defe]"
    : "from-[#ffe8b2] to-[#fffcf4]";

  return (
    <div
      className={`
        relative flex flex-col
        bg-gradient-to-b ${cardGradient}
        border-8 border-white
        rounded-[32px]
        shadow-[4px_8px_8px_0px_rgba(108,110,160,0.6)]
        w-full
        aspect-square
        p-4
      `}
    >
      <p
        className="text-[#6c6ea0] text-xl md:text-2xl font-bold text-center drop-shadow-[0px_4px_4px_rgba(116,114,160,0.62)]"
        style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
      >
        {project.fields.Project}
      </p>

      <div
        className={`
          flex-[2]
          bg-gradient-to-b ${innerGradient}
          rounded-[24px]
          opacity-80
          shadow-[0px_4px_4px_0px_rgba(116,114,160,0.29)]
          mt-3
          flex items-center justify-center
          overflow-hidden
        `}
      >
        <div
          className="bg-[rgba(108,110,160,0.5)] rounded-[24px] w-[90%] h-[90%] flex items-center justify-center"
        >
          {project.fields.Screenshot ? (
            <Image
              src={project.fields.Screenshot[0].url}
              alt={project.fields.Project}
              width="1000"
              height="1000"
              className="rounded-[24px]"
            />
          ) : (
            <p
              className="text-[#6c6ea0] text-xl font-bold italic rotate-[-15deg] text-center"
              style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
            >
              project screenshot
            </p>
          )}
        </div>
      </div>

      <p
        className="text-[#6c6ea0] text-lg md:text-xl font-bold text-center mt-3 drop-shadow-[0px_4px_4px_rgba(116,114,160,0.62)]"
        style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
      >
        by {project.fields.displayname}
      </p>

      <p
        className="text-[#6c6ea0] text-sm md:text-base font-bold text-center mt-2 drop-shadow-[0px_4px_4px_rgba(116,114,160,0.62)] line-clamp-3"
        style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
      >
        {project.fields.Description}
      </p>
    </div>
  );
}
