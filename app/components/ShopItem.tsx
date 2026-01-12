import Image from "next/image";
import Link from "next/link";

export interface ShopItemData {
  id: string;
  name: string;
  description?: string;
  price: number;
  availability?: string;
  image?: string;
}

interface ShopItemProps {
  item: ShopItemData;
  canBuy: boolean;
  variant: "pink" | "purple";
  alreadyPurchased?: boolean;
}

export default function ShopItem({ item, canBuy, variant, alreadyPurchased = false }: ShopItemProps) {
  const isPink = variant === "pink";

  // Check if this is the sticker sheet and user has already purchased it
  const isStickerSheet = item.id === "rec4wZN4c2OdkWMnc";
  const isLocked = !canBuy || (isStickerSheet && alreadyPurchased);

  const cardGradient = isPink
    ? "from-[#ebc0cc] to-[#dfa2ad]"
    : "from-[#e7e3fa] to-[#b3b3ed]";

  const innerGradient = isPink
    ? "from-[#dfa2ad] to-[#ebc0cc]"
    : "from-[#a8aaeb] to-[#ebe4fa]";

  const cardContent = (
    <div
      className={`
        relative flex flex-col
        bg-gradient-to-b ${cardGradient}
        border-[6px] border-white
        rounded-[32px]
        shadow-[4px_8px_8px_0px_rgba(108,110,160,0.6)]
        w-full
        p-3 pb-4
        transition-all duration-200
        ${!isLocked
          ? "hover:scale-105 hover:shadow-[6px_12px_12px_0px_rgba(108,110,160,0.7)] cursor-pointer"
          : "opacity-50 grayscale cursor-not-allowed"
        }
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
          aspect-square
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
          <img
            src={item.image}
            alt={item.name}
            className="object-contain max-h-[80%] max-w-[80%]"
          />
        )}
      </div>

      <div className="flex items-center justify-center gap-1 mt-3">
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

      {item.description && (
        <p
          className="text-[#6c6ea0] text-sm md:text-base font-bold text-center mt-2"
          style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
        >
          {item.description}
        </p>
      )}

      {item.availability && (
        <p
          className="text-[#6C6EA0] text-lg font-bold text-center mt-1"
          style={{ 
            fontFamily: "'MADE Tommy Soft', sans-serif",
          }}
        >
          {item.availability}
        </p>
      )}

      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center rounded-[32px]">
          <div className="bg-[#6c6ea0]/80 text-white px-3 py-1 rounded-full text-sm font-bold text-center"
            style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}>
            {isStickerSheet && alreadyPurchased
              ? "🔒 Can only purchase sticker sheet once!"
              : "🔒 Not enough feathers"
            }
          </div>
        </div>
      )}
    </div>
  );

  if (!isLocked) {
    return (
      <Link href={`/portal/forms/order/${item.id}`}>
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
