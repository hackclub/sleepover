"use client";

import { useState, useEffect } from "react";
import PortalSidebar from "../components/PortalSidebar";
import BunnyTile from "../components/BunnyTile";
import CountdownProgressBar from "../components/CountdownProgressBar";
import OnboardingNovel from "../components/OnboardingNovel";
import ProjectList from "../components/ProjectList";
import NewProjectModal from "../components/NewProjectModal";

export default function PortalPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);
  const [userProjects, setProjects] = useState<any[] | null>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data.projects);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }

    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        if (data.name) {
          const firstName = data.name.split(" ")[0];
          setUserName(firstName);
        }
      })
      .catch(() => {});
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    setShowOnboarding(false);
  };
  
  const contentOffset = isMobile ? "0px" : isSidebarOpen ? "clamp(360px, 28vw, 600px)" : "140px";

  console.log(userProjects)

  return (
    <div
      className="font-sans min-h-screen relative"
      style={{ backgroundColor: "#C0DEFE" }}
    >
      {/* Disable interactions when onboarding is showing */}
      <div className={showOnboarding ? "pointer-events-none" : ""}>
        <BunnyTile />
        <PortalSidebar onStateChange={setIsSidebarOpen} />
      </div>

      {showOnboarding && (
        <OnboardingNovel onComplete={handleOnboardingComplete} userName={userName} />
      )}

      <NewProjectModal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
      />

      <main
        className={`relative z-10 transition-[margin-left] duration-300 p-4 md:p-8 lg:p-12 pt-16 md:pt-8 flex flex-col items-center ${showOnboarding ? "pointer-events-none" : ""}`}
        style={{ 
          marginLeft: contentOffset, 
          marginRight: isMobile ? "0px" : "32px" 
        }}
      >
        {/* Create Heading */}
        <div
          className="flex justify-center mb-6 md:mb-8 w-full transition-all duration-300"
          style={{ maxWidth: isSidebarOpen ? "960px" : "1120px" }}
        >
          <h1 className="relative font-bold text-[48px] md:text-[72px] leading-[60px] md:leading-[90px] text-center">
            {/* White stroke layer behind */}
            <span
              className="absolute inset-0 pointer-events-none"
              style={{
                fontFamily: "'MADE Tommy Soft Outline', sans-serif",
                color: "#FFFFFF",
                WebkitTextStroke: "10px",
                filter:
                  "drop-shadow(0px 4px 0px #C6C7E4) drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.2))",
              }}
            >
              Create
            </span>
            {/* Gradient text on top */}
            <span
              className="relative"
              style={{
                fontFamily: "'MADE Tommy Soft', sans-serif",
                background: "linear-gradient(180deg, #B7C1F2 0%, #89A8EF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Create
            </span>
          </h1>
        </div>

        <CountdownProgressBar isSidebarOpen={isSidebarOpen} />

        {/* Figma 3-box layout: two small left, one large right */}
        <section
          className="w-full flex justify-center mt-6"
          style={{ maxWidth: isSidebarOpen ? "1060px" : "1220px" }}
        >
          <div className="flex flex-col md:flex-row w-full gap-4 md:gap-6">
            {/* Left column with two small boxes */}
            <div
              className="flex flex-col gap-4 md:gap-6 w-full md:w-auto"
              style={{ width: isMobile ? "100%" : "clamp(240px, 28%, 300px)" }}
            >
              {/* Small box #1 */}
              <div
                className="rounded-[24px] md:rounded-[30px] overflow-hidden"
                style={{
                  height: isMobile ? "200px" : "301px",
                  background: "linear-gradient(180deg, #FFE2E9 0%, #FFF0FD 100%)",
                  boxShadow: "0px 4px 4px rgba(116,114,160,0.62)",
                }}
              >
                <div
                  style={{
                    height: isMobile ? "50px" : "66px",
                    background: "linear-gradient(180deg, #FFF2D4 0%, #FFE8B2 100%)",
                    boxShadow: "0px 2px 0px #9799b63a",
                  }}
                />
                <div style={{ height: isMobile ? "calc(100% - 50px)" : "calc(100% - 66px)" }} />
              </div>

              {/* Small box #2 */}
              <div
                className="rounded-[24px] md:rounded-[30px] overflow-hidden"
                style={{
                  height: isMobile ? "180px" : "262px",
                  background: "linear-gradient(180deg, #FFE2E9 0%, #FFF0FD 100%)",
                  boxShadow: "0px 4px 4px rgba(116,114,160,0.62)",
                }}
              >
                <div
                  style={{
                    height: isMobile ? "44px" : "58px",
                    background: "linear-gradient(180deg, #FFF2D4 0%, #FFE8B2 100%)",
                    boxShadow: "0px 2px 0px #9799b63a",
                  }}
                />
                <div style={{ height: isMobile ? "calc(100% - 44px)" : "calc(100% - 58px)" }} />
              </div>
            </div>

            {/* Right large box */}
            <div className="flex-1 w-full" style={{ minWidth: 0 }}>
              <div
                className="rounded-[24px] md:rounded-[30px] overflow-hidden"
                style={{
                  minHeight: isMobile ? "400px" : "588px",
                  background: "linear-gradient(180deg, #D9DAF8 0%, #FFF0FD 100%)",
                  boxShadow: "0px 4px 4px rgba(116,114,160,0.62)",
                }}
              >
                <div
                  className="flex items-center justify-between px-4 md:px-6"
                  style={{
                    height: isMobile ? "70px" : "96px",
                    background: "linear-gradient(180deg, #FFE5E8 0%, #EBC0CC 100%)",
                    boxShadow: "0px 2px 0px #c1c3e891",
                  }}
                >
                  {/* Left: Label "Your Projects" */}
                  <h2
                    className="relative font-bold"
                    style={{
                      fontSize: isMobile ? "18px" : "24px",
                      margin: 0,
                    }}
                  >
                    {/* White stroke layer behind */}
                    <span
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        fontFamily: "'MADE Tommy Soft Outline', sans-serif",
                        color: "#FFFFFF",
                        WebkitTextStroke: "4px",
                        filter:
                          "drop-shadow(0px 2px 0px #C6C7E4) drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.2))",
                      }}
                    >
                      Your Projects
                    </span>
                    {/* Gradient text on top */}
                    <span
                      className="relative"
                      style={{
                        fontFamily: "'MADE Tommy Soft', sans-serif",
                        background: "linear-gradient(180deg, #9A9EF7 0%, #6C6EA0 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      Your Projects
                    </span>
                  </h2>

                  {/* Right: "new project +" group */}
                  <button
                    onClick={() => setShowNewProjectModal(true)}
                    className="flex items-center gap-1 md:gap-2 select-none cursor-pointer"
                    style={{
                      fontWeight: 700,
                    }}
                  >
                    {/* "new project" text */}
                    <span
                      className="relative"
                      style={{ fontSize: isMobile ? "16px" : "24px" }}
                    >
                      {/* White stroke layer behind */}
                      <span
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          fontFamily: "'MADE Tommy Soft Outline', sans-serif",
                          color: "#FFFFFF",
                          WebkitTextStroke: "4px",
                          filter:
                            "drop-shadow(0px 2px 0px #C6C7E4) drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.2))",
                        }}
                      >
                        new project
                      </span>
                      {/* Gradient text on top */}
                      <span
                        className="relative"
                        style={{
                          fontFamily: "'MADE Tommy Soft', sans-serif",
                          background: "linear-gradient(180deg, #93B4F2 0%, #8FA8F0 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        new project
                      </span>
                    </span>
                    {/* "+" text */}
                    <span
                      className="relative"
                      style={{
                        fontSize: isMobile ? "32px" : "48px",
                        lineHeight: "32px",
                      }}
                    >
                      {/* White stroke layer behind */}
                      <span
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          fontFamily: "'MADE Tommy Soft Outline', sans-serif",
                          color: "#FFFFFF",
                          WebkitTextStroke: "6px",
                          filter:
                            "drop-shadow(0px 2px 0px #C6C7E4) drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.2))",
                        }}
                      >
                        +
                      </span>
                      {/* Gradient text on top */}
                      <span
                        className="relative"
                        style={{
                          fontFamily: "'MADE Tommy Soft', sans-serif",
                          background: "linear-gradient(180deg, #93B4F2 0%, #8FA8F0 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        +
                      </span>
                    </span>
                  </button>
                </div>
                <div style={{ height: isMobile ? "calc(100% - 70px)" : "calc(100% - 96px)" }} />
                {userProjects === null ? (
                  <div className="flex items-center justify-center py-8">
                    <span style={{ fontFamily: "'MADE Tommy Soft', sans-serif", color: "#6C6EA0" }}>
                      Loading...
                    </span>
                  </div>
                ) : (
                  <ul>
                    <ProjectList projects={userProjects}/>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}