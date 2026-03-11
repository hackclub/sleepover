import Link from "next/link";

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        background: "linear-gradient(180deg, #C7D6FF 0%, #E8D5F2 50%, #FFFFFF 100%)",
      }}
    >
      <h1
        className="text-[120px] sm:text-[180px] font-bold"
        style={{
          fontFamily: "'MADE Tommy Soft', sans-serif",
          color: "#8183B8",
          textShadow: "0px 4px 0px #FFFFFF",
        }}
      >
        404
      </h1>
      <p
        className="text-[24px] sm:text-[32px] text-center mb-8"
        style={{
          fontFamily: "'MADE Tommy Soft', sans-serif",
          color: "#9199CB",
        }}
      >
        Oops! This page doesn't exist.
      </p>
      <Link
        href="/"
        className="px-8 py-4 rounded-[20px] text-white text-[20px] sm:text-[24px] font-bold hover:opacity-90 transition-opacity"
        style={{
          fontFamily: "'MADE Tommy Soft', sans-serif",
          background: "linear-gradient(0.68deg, #C7D6FF 0.59%, #548CEB 95.89%)",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
        }}
      >
        Back to Home
      </Link>
    </main>
  );
}
