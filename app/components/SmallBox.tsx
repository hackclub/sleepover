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
  const boxHeight = height || (isMobile ? "200px" : "301px");
  const headerHeight = isMobile ? "50px" : "66px";

  return (
    <div
      className="rounded-[24px] md:rounded-[30px] overflow-hidden"
      style={{
        height: boxHeight,
        background: "linear-gradient(180deg, #FFE2E9 0%, #FFF0FD 100%)",
        boxShadow: "0px 4px 4px rgba(116,114,160,0.62)",
      }}
    >
      <div
        className="flex justify-center"
        style={{
          height: headerHeight,
          background: "linear-gradient(180deg, #FFF2D4 0%, #FFE8B2 100%)",
          boxShadow: "0px 2px 0px #9799b63a",
          paddingLeft: "8%",
          paddingRight: "8%",
          paddingTop: "4%",
        }}
      >
        <span style={{ fontSize: "2em" }}>
          <GradientText
            gradient="linear-gradient(180deg, #7791E6 0%, #7472A0 100%)"
            strokeWidth="6px"
          >
            {header}
          </GradientText>
        </span>
      </div>
      <div
        className="text-center"
        style={{
          height: `calc(100% - ${headerHeight})`,
          padding: "8%",
        }}
      >
        {children && childrenPosition === "above" && (
          <div className="mt-1 mb-2">
            {children}
          </div>
        )}
        <div className={children && childrenPosition === "below" ? "-mt-1" : undefined}>
          <span style={{ fontSize: "1.4em" }}>
            <GradientText
              gradient="linear-gradient(180deg, #7791E6 0%, #7472A0 100%)"
              strokeWidth="6px"
            >
              {body}
            </GradientText>
          </span>
        </div>
        {children && childrenPosition === "below" && (
          <div className="mt-2">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
