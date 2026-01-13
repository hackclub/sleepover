import { useEffect, useState } from "react";
import GradientText from "./GradientText";

type CountdownProgressBarProps = {
  isSidebarOpen?: boolean;
};

export default function CountdownProgressBar({ isSidebarOpen = true }: CountdownProgressBarProps) {
  const [hours, setHours] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      fetch("/api/user/hours")
        .then((res) => res.json())
        .then((data) => {
          setHours(data.hours ?? 0);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setHours(0);
          setLoading(false);
        });
    }, []);

  var timeLeft = ""
  var progress = 0

  if (loading || hours === null) {
    timeLeft = "Loading your progress..."
    progress = 0
  } else if (hours >= 30) {
    timeLeft = "Congrats! You have earned enough hours for Sleepover!"
    progress = 100
  } else {
    const hoursLeft = (30 - hours)
    progress = 100*(hours/30)
    timeLeft = `You have ${hoursLeft} hours left to qualify for Sleepover!`
  }

  return (
    <div
      className="relative w-full h-auto mx-auto transition-all duration-300 px-4 md:px-8 lg:px-12 py-4 md:py-5"
      style={{
        maxWidth: isSidebarOpen ? "1050px" : "1200px",
        background: "linear-gradient(0deg, #D9DAF8 0%, #FFF0FD 100%)",
        boxShadow: "0px 4px 8px rgba(108, 110, 160, 0.6)",
        borderRadius: "24px",
      }}
    >
      <div className="flex flex-col items-center justify-center gap-3 md:gap-4">
        <h2 className="text-[20px] sm:text-[28px] md:text-[36px] leading-[28px] sm:leading-[36px] md:leading-[44px] text-center">
          <GradientText
            gradient="linear-gradient(180deg, #7791E6 0%, #7472A0 100%)"
            strokeWidth="6px"
          >
            {timeLeft}
          </GradientText>
        </h2>

        <div
          className="w-full"
          style={{
            height: "32px",
            minHeight: "32px",
            background: "linear-gradient(270deg, #FFE3E6 0%, #FFF2D4 100%)",
            border: "3px solid #FFFFFF",
            boxShadow:
              "0px 4px 0px #EAEBFF, 0px 6px 6px rgba(116, 114, 160, 0.4), inset 2px 4px 8px rgba(108, 110, 160, 0.6)",
            borderRadius: "50px",
          }}
        >
          <div
            className="transition-all duration-300"
            style={{
              width: `${progress}%`,
              height: "100%",
              minHeight: "26px",
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
