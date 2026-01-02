import Image from "next/image";

export interface ShopItemData {
  id: string;
  name: string;
  price: number;
  image?: string;
  variant: "pink" | "purple";
}

interface ShopItemProps {
  item: ShopItemData;
}

export default function ShopItem({ item }: ShopItemProps) {
  const isPink = item.variant === "pink";

  const cardGradient = isPink
    ? "from-[#ebc0cc] to-[#dfa2ad]"
    : "from-[#e7e3fa] to-[#b3b3ed]";

  const innerGradient = isPink
    ? "from-[#dfa2ad] to-[#ebc0cc]"
    : "from-[#a8aaeb] to-[#ebe4fa]";

  return (
    <div
      className={`
        relative flex flex-col
        bg-gradient-to-b ${cardGradient}
        border-[6px] border-white
        rounded-[32px]
        shadow-[4px_8px_8px_0px_rgba(108,110,160,0.6)]
        w-full aspect-square
        p-3
      `}
    >
      <p
        className="text-[#6c6ea0] text-lg md:text-xl font-bold text-center drop-shadow-[0px_4px_4px_rgba(116,114,160,0.62)]"
        style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
      >
        {item.name}
      </p>

      <div
        className={`
          flex-1
          bg-gradient-to-b ${innerGradient}
          rounded-[24px]
          opacity-80
          shadow-[0px_4px_4px_0px_rgba(116,114,160,0.29)]
          mt-2
          flex items-center justify-center
          overflow-hidden
        `}
      >
        {item.image && (
          <Image
            src={item.image}
            alt={item.name}
            width={160}
            height={160}
            className="object-contain max-h-[80%] max-w-[80%]"
          />
        )}
      </div>

      <div className="flex items-center justify-center gap-1 mt-2">
        <Image
          src="/icons/feather.png"
          alt="Feather"
          width={28}
          height={28}
          className="drop-shadow-[0px_2px_4px_#6c6ea0]"
        />
        <span
          className="text-[#6c6ea0] text-2xl font-bold drop-shadow-[0px_4px_4px_rgba(116,114,160,0.62)]"
          style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
        >
          {item.price}
        </span>
      </div>
    </div>
  );
}
