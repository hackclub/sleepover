import Image from "next/image";

interface FeatherBalanceProps {
  balance: number;
}

export default function FeatherBalance({ balance }: FeatherBalanceProps) {
  return (
    <div className="relative flex items-center gap-0.5 md:gap-1 bg-[#d9daf8] border-[3px] md:border-[6px] border-white rounded-full px-2 py-1 md:px-4 md:py-2 shadow-[0px_4px_0px_0px_#b5aae7]">
      <Image
        src="/icons/feather.png"
        alt="Feather"
        width={40}
        height={40}
        className="drop-shadow-[0px_2px_4px_#6c6ea0] -rotate-[7deg] w-6 h-6 md:w-10 md:h-10"
      />
      <span
        className="text-[#7790e5] text-xl md:text-3xl font-bold text-center"
        style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
      >
        {balance}
      </span>
    </div>
  );
}
