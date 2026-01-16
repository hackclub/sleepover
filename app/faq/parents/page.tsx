"use client";

import { useState, useEffect, Suspense } from "react";
import Sidebar from "../../components/Sidebar";
import BunnyTile from "../../components/BunnyTile";
import GradientText from "../../components/GradientText";
import ReferralCapture from "../../components/ReferralCapture";

export default function ParentsGuide() {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const contentOffset = isMobile ? "0px" : isSidebarOpen ? "clamp(360px, 28vw, 600px)" : "140px";

  return (
    <div
      className="font-sans min-h-screen relative"
      style={{ backgroundColor: "#C0DEFE" }}
    >
      <Suspense fallback={null}>
        <ReferralCapture />
      </Suspense>
      <BunnyTile />
      <Sidebar onStateChange={setIsSidebarOpen} />

      {/* Main Content */}
      <main
        className="relative z-10 transition-[margin-left] duration-300 p-4 md:p-8 lg:p-12 pt-16 md:pt-8 flex flex-col items-center"
        style={{ 
          marginLeft: contentOffset, 
          marginRight: isMobile ? "0px" : "32px" 
        }}
      >
        <div
          className="w-full transition-all duration-300"
          style={{ maxWidth: isSidebarOpen ? "960px" : "1120px" }}
        >
          {/* Title */}
          <h1 className="text-[40px] md:text-[72px] leading-[50px] md:leading-[90px] text-center mb-6 md:mb-8">
            <GradientText
              gradient="linear-gradient(180deg, #B7C1F2 0%, #89A8EF 100%)"
              strokeWidth="10px"
            >
              Parent's Guide
            </GradientText>
          </h1>

          {/* Content */}
          <div className="space-y-8">
            {/* What is Hack Club */}
            <div>
              <h2 className="text-[24px] md:text-[36px] mb-3">
                <GradientText
                  gradient="linear-gradient(180deg, #B7C1F2 0%, #89A8EF 100%)"
                  strokeWidth="6px"
                >
                  What is Hack Club?
                </GradientText>
              </h2>
              <p
                className="text-[16px] md:text-[20px] leading-relaxed"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  fontWeight: "bold",
                  color: "#6C6EA0",
                  textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)",
                }}
              >
                Hack Club is a 501(c)(3) nonprofit organization whose mission is to foster a wholesome generation of coders, makers, founders, and builders. Hack Club is a network of hundreds of student-led computer science clubs and an online community of over 50,000 high school makers from around the world. Hack Club programs are free and accessible to all high school students. We support teenagers in making real projects in the real world. Hack Club is supported by notable figures in the tech industry, including GitHub founder Tom Preston-Werner, Dell Founder Michael Dell and executives at Apple, Facebook, Microsoft, and GitHub, as well as many up-and-coming tech startups.
              </p>
            </div>

            {/* What is Sleepover */}
            <div>
              <h2 className="text-[24px] md:text-[36px] mb-3">
                <GradientText
                  gradient="linear-gradient(180deg, #B7C1F2 0%, #89A8EF 100%)"
                  strokeWidth="6px"
                >
                  What is Sleepover?
                </GradientText>
              </h2>
              <p
                className="text-[16px] md:text-[20px] leading-relaxed"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  fontWeight: "bold",
                  color: "#6C6EA0",
                  textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)",
                }}
              >
                Sleepover is a slumber-party style hackathon led by teen girls, for teen girls. Code 30 hours from now until April 15th, 2025 and fly out to Chicago, Illinois to make friends, eat amazing food, and code. Along the way, your child can earn prizes such as plushies, Airpods, iPads and more, all for building projects.
              </p>
            </div>

            {/* What are the costs associated */}
            <div>
              <h2 className="text-[24px] md:text-[36px] mb-3">
                <GradientText
                  gradient="linear-gradient(180deg, #B7C1F2 0%, #89A8EF 100%)"
                  strokeWidth="6px"
                >
                  What are the costs associated?
                </GradientText>
              </h2>
              <p
                className="text-[16px] md:text-[20px] leading-relaxed"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  fontWeight: "bold",
                  color: "#6C6EA0",
                  textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)",
                }}
              >
                Participation in the event is entirely free, but there are requirements for entry that your child must meet. Without completing the coding requirements for the event, your child will not get an invite to Sleepover. We will cover expenses at the event for the entire three-day experience, including meals and activities. Participants are generally responsible for their own travel to Chicago, but we are able to offer travel grants.
              </p>
            </div>

            {/* Safety */}
            <div>
              <h2 className="text-[24px] md:text-[36px] mb-3">
                <GradientText
                  gradient="linear-gradient(180deg, #B7C1F2 0%, #89A8EF 100%)"
                  strokeWidth="6px"
                >
                  Safety
                </GradientText>
              </h2>
              <p
                className="text-[16px] md:text-[20px] leading-relaxed"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  fontWeight: "bold",
                  color: "#6C6EA0",
                  textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)",
                }}
              >
                Hack Club is committed to creating a safe and comfortable environment for students at our events. As with previous Hack Club events Hack Club staff have undergone background checks (both at the state and federal level). Adult team members are on-site with attendees throughout the event. We will have support available and a way for you and your child to contact us if needed. During the event, a toll-free staff helpline (+1 855-625-HACK) will be available if you have any questions.
              </p>
            </div>
          </div>
        </div>
    </main>
    </div>
  );
}
