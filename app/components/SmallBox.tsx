import GradientText from "./GradientText";

interface SmallBoxProps {
  header: string;
  body: string;
  children?: React.ReactNode;
  height?: string;
  isMobile?: boolean;
  childrenPosition?: "above" | "below";
}

export default function SmallBox({ header, body, children, height, isMobile = false, childrenPosition = "below" }: SmallBoxProps) {
  const headerHeight = isMobile ? "44px" : "66px";

  return (
    <div
      className="rounded-[20px] md:rounded-[30px] overflow-hidden"
      style={{
        minHeight: height || (isMobile ? "160px" : "301px"),
        background: "linear-gradient(180deg, #FFE2E9 0%, #FFF0FD 100%)",
        boxShadow: "0px 4px 4px rgba(116,114,160,0.62)",
      }}
    >
      <div
        className="flex justify-center items-center"
        style={{
          height: headerHeight,
          background: "linear-gradient(180deg, #FFF2D4 0%, #FFE8B2 100%)",
          boxShadow: "0px 2px 0px #9799b63a",
          paddingLeft: "8%",
          paddingRight: "8%",
        }}
      >
        <span className="text-xl md:text-2xl">
          <GradientText
            gradient="linear-gradient(180deg, #7791E6 0%, #7472A0 100%)"
            strokeWidth={isMobile ? "4px" : "6px"}
          >
            {header}
          </GradientText>
        </span>
      </div>
      <div
        className="text-center px-3 py-3 md:p-[8%]"
      >
        {children && childrenPosition === "above" && (
          <div className="mt-1 mb-2">
            {children}
          </div>
        )}
        {body && (
          <div className={children && childrenPosition === "below" ? "mt-2 md:mt-3" : "mt-2 md:mt-3"}>
            <span className="text-base md:text-xl leading-tight">
              <GradientText
                gradient="linear-gradient(180deg, #7791E6 0%, #7472A0 100%)"
                strokeWidth={isMobile ? "4px" : "6px"}
              >
                {body}
              </GradientText>
            </span>
          </div>
        )}
        {children && childrenPosition === "below" && (
          <div className="mt-4 md:mt-8">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
