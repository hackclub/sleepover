import Sidebar from "../components/Sidebar";
import BunnyTile from "../components/BunnyTile";

export default function FAQPage() {
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
          FAQ
        </h1>
        <p
          className="text-[32px] sm:text-[40px] font-medium"
          style={{
            fontFamily: "'MADE Tommy Soft', sans-serif",
            color: "#9199CB",
          }}
        >
          Welcome to Sleepover!
        </p>
        <p
          className="relative z-10 mt-8 text-[#7472A0] text-lg"
          style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
        >
          Select a topic from the sidebar to get started.
        </p>
        <p
          className="relative z-10 mt-4 text-[#7472A0] text-lg"
          style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
        >
          Please note: day-of logistics, such as schedules or suggested packing
          lists, are subject to change. We will provide more info closer to the
          event.
        </p>
      </main>
    </div>
  );
}
