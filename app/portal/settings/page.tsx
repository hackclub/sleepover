"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PortalSidebar from "../../components/PortalSidebar";
import BunnyTile from "../../components/BunnyTile";
import GradientText from "../../components/GradientText";

export default function SettingsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    avatar: "",
    currency: 0,
    projectCount: 0,
    totalHours: 0,
  });
  const [hackatimeData, setHackatimeData] = useState({
    hasHackatime: false,
    projects: [] as string[],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userRes, currencyRes, projectCountRes, hoursRes, hackatimeRes] = await Promise.all([
          fetch("/api/user"),
          fetch("/api/user/currency"),
          fetch("/api/user/project-count"),
          fetch("/api/user/hours"),
          fetch("/api/user/projects"),
        ]);

        const user = await userRes.json();
        const currency = await currencyRes.json();
        const projectCount = await projectCountRes.json();
        const hours = await hoursRes.json();
        const hackatime = await hackatimeRes.json();

        setUserData({
          name: user.slack_display_name || user.name || "",
          avatar: user.slack_avatar_url || "",
          currency: currency.balance || 0,
          projectCount: projectCount.count || 0,
          totalHours: hours.hours || 0,
        });

        setHackatimeData({
          hasHackatime: hackatime.hasHackatime || false,
          projects: hackatime.projects || [],
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const contentOffset = isMobile ? "0px" : isSidebarOpen ? "clamp(360px, 28vw, 600px)" : "140px";

  return (
    <div
      className="font-sans min-h-screen relative"
      style={{ backgroundColor: "#C0DEFE" }}
    >
      <div>
        <BunnyTile />
        <PortalSidebar onStateChange={setIsSidebarOpen} />
      </div>

      <main
        className={`relative z-10 transition-[margin-left] duration-300 p-4 md:p-8 lg:p-12 pt-16 md:pt-8`}
        style={{
          marginLeft: contentOffset,
          marginRight: isMobile ? "0px" : "32px"
        }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl mb-8 text-center">
            <GradientText
              gradient="linear-gradient(180deg, #7791E6 0%, #7472A0 100%)"
              strokeWidth="8px"
            >
              Settings
            </GradientText>
          </h1>

          {isLoading ? (
            <div className="text-center">
              <GradientText
                gradient="linear-gradient(180deg, #7791E6 0%, #7472A0 100%)"
                strokeWidth="6px"
              >
                Loading...
              </GradientText>
            </div>
          ) : (
            <div className="space-y-6">
              {/* User Profile Section */}
              <div
                className="rounded-[24px] md:rounded-[30px] p-6 md:p-8"
                style={{
                  background: "linear-gradient(180deg, #FFE2E9 0%, #FFF0FD 100%)",
                  boxShadow: "0px 4px 4px rgba(116,114,160,0.62)",
                }}
              >
                <div className="flex items-center gap-6 mb-6">
                  {userData.avatar && (
                    <img
                      src={userData.avatar}
                      alt="Profile"
                      className="w-20 h-20 md:w-24 md:h-24 rounded-full"
                      style={{
                        boxShadow: "0px 2px 4px rgba(116,114,160,0.4)",
                      }}
                    />
                  )}
                  <div>
                    <h2 className="text-3xl md:text-4xl">
                      <GradientText
                        gradient="linear-gradient(180deg, #7791E6 0%, #7472A0 100%)"
                        strokeWidth="6px"
                      >
                        {userData.name}
                      </GradientText>
                    </h2>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    className="rounded-[16px] p-4 text-center"
                    style={{
                      background: "linear-gradient(180deg, #FFF2D4 0%, #FFE8B2 100%)",
                      boxShadow: "0px 2px 0px #9799b63a",
                    }}
                  >
                    <div className="text-lg">
                      <GradientText
                        gradient="linear-gradient(180deg, #7791E6 0%, #7472A0 100%)"
                        strokeWidth="4px"
                      >
                        Currency
                      </GradientText>
                    </div>
                    <div className="text-3xl mt-2">
                      <GradientText
                        gradient="linear-gradient(180deg, #7791E6 0%, #7472A0 100%)"
                        strokeWidth="6px"
                      >
                        {userData.currency} feathers
                      </GradientText>
                    </div>
                  </div>

                  <div
                    className="rounded-[16px] p-4 text-center"
                    style={{
                      background: "linear-gradient(180deg, #FFF2D4 0%, #FFE8B2 100%)",
                      boxShadow: "0px 2px 0px #9799b63a",
                    }}
                  >
                    <div className="text-lg">
                      <GradientText
                        gradient="linear-gradient(180deg, #7791E6 0%, #7472A0 100%)"
                        strokeWidth="4px"
                      >
                        Projects
                      </GradientText>
                    </div>
                    <div className="text-3xl mt-2">
                      <GradientText
                        gradient="linear-gradient(180deg, #7791E6 0%, #7472A0 100%)"
                        strokeWidth="6px"
                      >
                        {userData.projectCount}
                      </GradientText>
                    </div>
                  </div>

                  <div
                    className="rounded-[16px] p-4 text-center"
                    style={{
                      background: "linear-gradient(180deg, #FFF2D4 0%, #FFE8B2 100%)",
                      boxShadow: "0px 2px 0px #9799b63a",
                    }}
                  >
                    <div className="text-lg">
                      <GradientText
                        gradient="linear-gradient(180deg, #7791E6 0%, #7472A0 100%)"
                        strokeWidth="4px"
                      >
                        Hours Shipped
                      </GradientText>
                    </div>
                    <div className="text-3xl mt-2">
                      <GradientText
                        gradient="linear-gradient(180deg, #7791E6 0%, #7472A0 100%)"
                        strokeWidth="6px"
                      >
                        {userData.totalHours}
                      </GradientText>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hackatime Section */}
              <div
                className="rounded-[24px] md:rounded-[30px] overflow-hidden"
                style={{
                  background: "linear-gradient(180deg, #FFE2E9 0%, #FFF0FD 100%)",
                  boxShadow: "0px 4px 4px rgba(116,114,160,0.62)",
                }}
              >
                <div
                  className="p-4 md:p-6"
                  style={{
                    background: "linear-gradient(180deg, #FFF2D4 0%, #FFE8B2 100%)",
                    boxShadow: "0px 2px 0px #9799b63a",
                  }}
                >
                  <h2 className="text-2xl md:text-3xl text-center">
                    <GradientText
                      gradient="linear-gradient(180deg, #7791E6 0%, #7472A0 100%)"
                      strokeWidth="6px"
                    >
                      Hackatime Projects
                    </GradientText>
                  </h2>
                </div>

                <div className="p-6 md:p-8">
                  {hackatimeData.hasHackatime ? (
                    <div>
                      {hackatimeData.projects.length > 0 ? (
                        <div className="space-y-3">
                          {hackatimeData.projects.map((project, index) => (
                            <div
                              key={index}
                            >
                              <GradientText
                                gradient="linear-gradient(180deg, #7791E6 0%, #7472A0 100%)"
                                strokeWidth="4px"
                              >
                                {project}
                              </GradientText>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-lg">
                          <GradientText
                            gradient="linear-gradient(180deg, #7791E6 0%, #7472A0 100%)"
                            strokeWidth="4px"
                          >
                            No Hackatime projects found
                          </GradientText>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="text-lg">
                        <GradientText
                          gradient="linear-gradient(180deg, #7791E6 0%, #7472A0 100%)"
                          strokeWidth="4px"
                        >
                          You don&apos;t have a Hackatime account connected
                        </GradientText>
                      </div>
                      <div className="space-y-6 text-left max-w-2xl mx-auto">
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold">
                            <GradientText
                              gradient="linear-gradient(180deg, #7791E6 0%, #7472A0 100%)"
                              strokeWidth="5px"
                            >
                              What is Hackatime?
                            </GradientText>
                          </h3>
                          <p className="text-base leading-relaxed">
                            <GradientText
                              gradient="linear-gradient(180deg, #7791E6 0%, #7472A0 100%)"
                              strokeWidth="3px"
                            >
                              Hackatime is a free tool from Hack Club that shows you how much time you spend coding. You can see what other Hack Clubbers are building too!
                            </GradientText>
                          </p>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-xl font-semibold">
                            <GradientText
                              gradient="linear-gradient(180deg, #7791E6 0%, #7472A0 100%)"
                              strokeWidth="5px"
                            >
                              How do I set it up?
                            </GradientText>
                          </h3>

                          <div className="space-y-3">
                            <div className="flex gap-3">
                              <span className="text-base font-semibold flex-shrink-0">
                                <GradientText
                                  gradient="linear-gradient(180deg, #7791E6 0%, #7472A0 100%)"
                                  strokeWidth="4px"
                                >
                                  Step 1:
                                </GradientText>
                              </span>
                              <p className="text-base leading-relaxed">
                                <GradientText
                                  gradient="linear-gradient(180deg, #7791E6 0%, #7472A0 100%)"
                                  strokeWidth="3px"
                                >
                                  Go{" "}
                                </GradientText>
                                <Link
                                  href="https://hackatime.hackclub.com/minimal_login"
                                  className="text-[#7791E6] font-semibold underline hover:opacity-80 transition-opacity mx-1"
                                >
                                  here
                                </Link>{" "}
                                <GradientText
                                  gradient="linear-gradient(180deg, #7791E6 0%, #7472A0 100%)"
                                  strokeWidth="3px"
                                >
                                  and create a Hackatime account using <strong>Hack Club Auth</strong>, or the <strong>same email</strong> used by your Hack Club Slack account.
                                </GradientText>
                              </p>
                            </div>

                            <div className="flex gap-3">
                              <span className="text-base font-semibold flex-shrink-0">
                                <GradientText
                                  gradient="linear-gradient(180deg, #7791E6 0%, #7472A0 100%)"
                                  strokeWidth="4px"
                                >
                                  Step 2:
                                </GradientText>
                              </span>
                              <p className="text-base leading-relaxed">
                                <GradientText
                                  gradient="linear-gradient(180deg, #7791E6 0%, #7472A0 100%)"
                                  strokeWidth="3px"
                                >
                                  Follow the{" "}
                                </GradientText>
                                <Link
                                  href="https://hackatime.hackclub.com/my/wakatime_setup"
                                  className="text-[#7791E6] font-semibold underline hover:opacity-80 transition-opacity mx-1"
                                >
                                  instructions
                                </Link>{" "}
                                <GradientText
                                  gradient="linear-gradient(180deg, #7791E6 0%, #7472A0 100%)"
                                  strokeWidth="3px"
                                >
                                  to install the Wakatime extension in your code editor to track your coding time.
                                </GradientText>
                              </p>
                            </div>

                            <div className="flex gap-3">
                              <span className="text-base font-semibold flex-shrink-0">
                                <GradientText
                                  gradient="linear-gradient(180deg, #7791E6 0%, #7472A0 100%)"
                                  strokeWidth="4px"
                                >
                                  Step 3:
                                </GradientText>
                              </span>
                              <p className="text-base leading-relaxed">
                                <GradientText
                                  gradient="linear-gradient(180deg, #7791E6 0%, #7472A0 100%)"
                                  strokeWidth="3px"
                                >
                                  Go to{" "}
                                </GradientText>
                                <Link
                                  href="https://hackatime.hackclub.com/"
                                  className="text-[#7791E6] font-semibold underline hover:opacity-80 transition-opacity mx-1"
                                >
                                  hackatime.hackclub.com
                                </Link>{" "}
                                <GradientText
                                  gradient="linear-gradient(180deg, #7791E6 0%, #7472A0 100%)"
                                  strokeWidth="3px"
                                >
                                  and log in. Come back to Sleepover, and see if your account is shown.
                                </GradientText>
                              </p>
                            </div>

                            <div className="flex gap-3">
                              <span className="text-base font-semibold flex-shrink-0">
                                <GradientText
                                  gradient="linear-gradient(180deg, #7791E6 0%, #7472A0 100%)"
                                  strokeWidth="4px"
                                >
                                  Step 4:
                                </GradientText>
                              </span>
                              <p className="text-base leading-relaxed">
                                <GradientText
                                  gradient="linear-gradient(180deg, #7791E6 0%, #7472A0 100%)"
                                  strokeWidth="3px"
                                >
                                  After you install Wakatime in your code editor, start coding, and see the projects pop up!
                                </GradientText>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}