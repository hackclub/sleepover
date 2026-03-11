"use client";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
  projectName?: string;
}

export default function DeleteConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  isDeleting = false,
  projectName,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[100]" onClick={onCancel} />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90%] max-w-[400px]">
        <div
          className="relative rounded-[30px] overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #FFF0FD 0%, #D9DAF8 100%)",
            boxShadow: "0px 4px 4px rgba(116,114,160,0.62)",
          }}
        >
          {/* Header bar */}
          <div
            className="w-full h-[60px] md:h-[70px]"
            style={{
              background: "linear-gradient(180deg, #FFE5E8 27%, #EBC0CC 100%)",
            }}
          />

          {/* Title */}
          <h2
            className="absolute top-3 md:top-4 left-1/2 -translate-x-1/2 text-[24px] md:text-[32px] font-bold whitespace-nowrap"
            style={{
              fontFamily: "'MADE Tommy Soft', sans-serif",
              color: "#B94D6F",
              textShadow: "0px 2px 2px rgba(185,77,111,0.4)",
            }}
          >
            Delete Project?
          </h2>

          {/* Content */}
          <div className="px-6 md:px-8 pb-6 pt-4 text-center">
            <p
              className="text-[16px] md:text-[18px] mb-6"
              style={{
                fontFamily: "'MADE Tommy Soft', sans-serif",
                color: "#6C6EA0",
              }}
            >
              Are you sure you want to delete{" "}
              {projectName ? (
                <span className="font-bold">&quot;{projectName}&quot;</span>
              ) : (
                "this project"
              )}
              ? This action cannot be undone.
            </p>

            {/* Buttons */}
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={onConfirm}
                disabled={isDeleting}
                className="relative rounded-[16px] px-6 py-2.5 transition-transform hover:scale-105 disabled:opacity-70 cursor-pointer"
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
                  className="relative z-10 text-[14px] md:text-[16px] font-bold"
                  style={{
                    fontFamily: "'MADE Tommy Soft', sans-serif",
                    color: "#B94D6F",
                  }}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </span>
              </button>

              <button
                type="button"
                onClick={onCancel}
                disabled={isDeleting}
                className="relative rounded-[16px] px-6 py-2.5 transition-transform hover:scale-105 disabled:opacity-70 cursor-pointer"
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
                  className="relative z-10 text-[14px] md:text-[16px] font-bold"
                  style={{
                    fontFamily: "'MADE Tommy Soft', sans-serif",
                    background: "linear-gradient(180deg, #7684C9 0%, #7472A0 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Go Back
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
