import Sidebar from "../../components/Sidebar";
import BunnyTile from "../../components/BunnyTile";

export default function WhatIsSleepover() {
  return (
    <div
      className="font-sans min-h-screen relative"
      style={{ backgroundColor: "#C0DEFE" }}
    >
      <BunnyTile />
      <Sidebar />

      {/* Main Content */}
      <main className="relative z-10 ml-[420px] p-12">
        <h1
          className="text-[64px] sm:text-[80px] font-bold mb-4"
          style={{
            fontFamily: "'MADE Tommy Soft', sans-serif",
            color: "#8183B8",
            textShadow: "0px 4px 0px #FFFFFF",
            WebkitTextStroke: "3px #FFFFFF",
          }}
        >
          What is Sleepover?
        </h1>
      </main>
    </div>
  );
}
