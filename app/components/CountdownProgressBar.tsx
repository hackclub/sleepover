type CountdownProgressBarProps = {
  isSidebarOpen?: boolean;
};

export default function CountdownProgressBar({ isSidebarOpen = true }: CountdownProgressBarProps) {
  // Static display until backend is implemented
  const timeLeft = "15 hours left until Sleepover!";
  const progress = 50; // Static 50% progress
  const containerWidth = isSidebarOpen ? "1050px" : "1200px";
  const horizontalPadding = isSidebarOpen ? "48px" : "64px";

  return (
    <div
      className="relative w-full h-[150px] mx-auto transition-all duration-300"
      style={{
        maxWidth: containerWidth,
        background: "linear-gradient(0deg, #D9DAF8 0%, #FFF0FD 100%)",
        boxShadow: "0px 4px 8px rgba(108, 110, 160, 0.6)",
        borderRadius: "30px",
        paddingLeft: horizontalPadding,
        paddingRight: horizontalPadding,
        paddingTop: "20px",
        paddingBottom: "20px",
      }}
    >
      <div className="flex flex-col items-center justify-between h-full gap-4">
        <h2 className="relative font-bold text-[36px] leading-[44px] text-center">
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
            {timeLeft}
          </span>
          <span
            className="relative"
            style={{
              fontFamily: "'MADE Tommy Soft', sans-serif",
              background: "linear-gradient(180deg, #7791E6 0%, #7472A0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {timeLeft}
          </span>
        </h2>

        <div
          className="w-full"
          style={{
            height: "40px",
            background: "linear-gradient(270deg, #FFE3E6 0%, #FFF2D4 100%)",
            border: "4px solid #FFFFFF",
            boxShadow:
              "0px 4px 0px #EAEBFF, 0px 6px 6px rgba(116, 114, 160, 0.4), inset 2px 4px 8px rgba(108, 110, 160, 0.6)",
            borderRadius: "50px",
          }}
        >
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(180deg, #FFE5E8 0%, #EDB5BC 100%)",
              boxShadow:
                "0px 4px 0px #E6A4AB, 2px 6px 4px rgba(116, 114, 160, 0.86)",
              borderRadius: "50px",
            }}
          />
        </div>
      </div>
    </div>
  );
}
