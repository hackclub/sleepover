import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
  // Content
  children: ReactNode;

  // Optional navigation
  href?: string;
  onClick?: () => void;

  // Size configuration (supports responsive breakpoints)
  size?: {
    width?: {
      base?: string;    // Default width
      sm?: string;      // Small breakpoint (640px+)
      md?: string;      // Medium breakpoint (768px+)
      lg?: string;      // Large breakpoint (1024px+)
    };
    height?: {
      base?: string;
      sm?: string;
      md?: string;
      lg?: string;
    };
  };

  // Color configuration
  colors?: {
    outerBorder?: string;           // White border color
    innerGradient?: string;         // Middle layer gradient
    buttonGradient?: string;        // Inner button gradient
    shadow?: string;                // Box shadow color
    innerShadow?: string;           // Inner layer shadow
  };

  // Content styling (applies to the inner content area)
  contentClassName?: string;

  // Additional styling
  className?: string;
  disabled?: boolean;
}

export default function Button({
  children,
  href,
  onClick,
  size = {},
  colors = {},
  contentClassName = "",
  className = "",
  disabled = false,
}: ButtonProps) {
  // Default sizes
  const defaultSize = {
    width: { base: "220px", sm: "289px" },
    height: { base: "100px", sm: "129px" },
  };

  // Default colors (based on the FAQ button)
  const defaultColors = {
    outerBorder: "#FFFFFF",
    innerGradient: "linear-gradient(0deg, #7472A0 17.31%, #DFA1AA 100%)",
    buttonGradient: "linear-gradient(0.68deg, #DFA2AD 0.59%, #AD8FB5 95.89%)",
    shadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
    innerShadow: "2px 2px 10px 4px #FFFBFB",
  };

  // Merge with defaults
  const finalSize = {
    width: { ...defaultSize.width, ...size.width },
    height: { ...defaultSize.height, ...size.height },
  };

  const finalColors = { ...defaultColors, ...colors };

  // Build responsive width classes
  const widthClasses = [
    finalSize.width.base && `w-[${finalSize.width.base}]`,
    finalSize.width.sm && `sm:w-[${finalSize.width.sm}]`,
    finalSize.width.md && `md:w-[${finalSize.width.md}]`,
    finalSize.width.lg && `lg:w-[${finalSize.width.lg}]`,
  ].filter(Boolean).join(" ");

  // Build responsive height classes
  const heightClasses = [
    finalSize.height.base && `h-[${finalSize.height.base}]`,
    finalSize.height.sm && `sm:h-[${finalSize.height.sm}]`,
    finalSize.height.md && `md:h-[${finalSize.height.md}]`,
    finalSize.height.lg && `lg:h-[${finalSize.height.lg}]`,
  ].filter(Boolean).join(" ");

  const buttonContent = (
    <>
      <div
        className="absolute inset-[4px] rounded-[20px]"
        style={{
          background: finalColors.innerGradient,
          boxShadow: finalColors.innerShadow,
          backdropFilter: "blur(2px)",
        }}
      />
      <div
        className={`absolute inset-[14px] rounded-[20px] flex items-center justify-center ${contentClassName}`}
        style={{
          background: finalColors.buttonGradient,
          boxShadow: "inset 0px 4px 4px rgba(0, 0, 0, 0.25)",
        }}
      >
        {children}
      </div>
    </>
  );

  const baseClasses = `relative ${widthClasses} ${heightClasses} rounded-[20px] ${
    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer active:scale-95"
  } transition-transform ${className}`;

  const baseStyle = {
    background: finalColors.outerBorder,
    boxShadow: finalColors.shadow,
  };

  // Render as Link if href is provided, otherwise as button
  if (href && !disabled) {
    return (
      <Link href={href} className={baseClasses} style={baseStyle}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
      style={baseStyle}
    >
      {buttonContent}
    </button>
  );
}
