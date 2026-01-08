"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import FeatherBalance from "@/app/components/FeatherBalance";
import { orderProduct } from "@/app/forms/actions/orderProduct";
import { ShopItemData } from "@/app/components/ShopItem";

export default function OrderProductPage() {
  const params = useParams();
  const router = useRouter();
  const prodId = String(params.prodid);

  const [product, setProduct] = useState<ShopItemData | null>(null);
  const [userBalance, setUserBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userAddress, setUserAddress] = useState<{
    address1: string;
    address2: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  } | null>(null);

  const fetchAddress = () => {
    fetch("/api/user/address")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error && data.address1) {
          setUserAddress({
            address1: data.address1,
            address2: data.address2,
            city: data.city,
            state: data.state,
            country: data.country,
            zip: data.zip,
          });
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    // Check if there's a cached balance in sessionStorage for instant display
    const cachedBalance = sessionStorage.getItem("userBalance");
    if (cachedBalance) {
      setUserBalance(Number(cachedBalance));
    }

    // Fetch the real balance from API and update both state and cache
    fetch("/api/user/currency")
      .then((res) => res.json())
      .then((data) => {
        setUserBalance(data.balance);
        sessionStorage.setItem("userBalance", data.balance.toString());
      })
      .catch(console.error);

    fetch(`/api/shop/${prodId}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(console.error);

    fetchAddress();

    // Refetch address when window regains focus (after editing on Hack Club auth)
    const handleFocus = () => {
      fetchAddress();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [prodId]);

  const formatAddress = () => {
    if (!userAddress) return null;
    const parts = [
      userAddress.address1,
      userAddress.address2,
      userAddress.city,
      userAddress.state,
      userAddress.zip,
      userAddress.country,
    ].filter(Boolean);
    return parts.join(", ");
  };

  const handleEditAddress = () => {
    window.open("https://auth.hackclub.com/addresses", "_blank");
  };

  const handleOrder = async () => {
    if (!product || submitting) return;
    setSubmitting(true);

    try {
      const formData = new FormData();
      await orderProduct(formData, prodId);

      // Update the balance in sessionStorage immediately for instant UI update
      const newBalance = userBalance - product.price;
      sessionStorage.setItem("userBalance", newBalance.toString());

      router.push("/portal/shop");
    } catch (error) {
      console.error("Order failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        {/* Pink gradient background */}
        <div
          className="fixed inset-0 -z-20"
          style={{
            background: "linear-gradient(to bottom, #e6a4ab, #ffe2ea)",
          }}
        />
        {/* Bunny tile pattern overlay */}
        <div
          className="fixed inset-0 -z-10 opacity-20"
          style={{
            backgroundImage: "url('/background/bunny-tile.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "210px",
          }}
        />
        <p
          className="text-[#7472a0] text-2xl font-bold"
          style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
        >
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Pink gradient background */}
      <div
        className="fixed inset-0 -z-20"
        style={{
          background: "linear-gradient(to bottom, #e6a4ab, #ffe2ea)",
        }}
      />
      {/* Bunny tile pattern overlay */}
      <div
        className="fixed inset-0 -z-10 opacity-20"
        style={{
          backgroundImage: "url('/background/bunny-tile.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "210px",
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between px-6 md:px-24 py-8 md:py-14">
        {/* Left spacer for centering */}
        <div className="flex-1" />

        {/* Back to Shop button */}
        <Link
          href="/portal/shop"
          className="flex items-center gap-2 bg-gradient-to-b from-[#c0defe] to-[#9ac6f6] border-4 border-white rounded-2xl px-6 py-3 shadow-[0px_4px_0px_0px_#c6c7e4,0px_6px_8px_0px_rgba(116,114,160,0.69)] hover:scale-105 transition-transform"
        >
          <span className="text-xl">←</span>
          <span
            className="bg-gradient-to-b from-[#7684c9] to-[#7472a0] bg-clip-text text-transparent text-xl md:text-2xl font-bold"
            style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
          >
            Back to the Shop
          </span>
        </Link>

        {/* Feather Balance */}
        <div className="flex-1 flex justify-end">
          <FeatherBalance balance={userBalance} />
        </div>
      </div>

      {/* Main Card */}
      <div className="px-6 md:px-24 pb-12">
        <div className="bg-gradient-to-b from-[#fff6e0] to-[#ffe8b2] border-4 border-white rounded-3xl shadow-[0px_4px_0px_0px_#c6c7e4,0px_6px_8px_0px_rgba(116,114,160,0.69)] p-4 md:p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Side - Item Preview */}
            <div className="flex-1 bg-gradient-to-t from-[#fff2d4] to-[#ffe8b2] rounded-2xl shadow-[0px_4px_4px_0px_rgba(116,114,160,0.33)] p-4 md:p-6 flex flex-col">
              {/* Item Image Container */}
              <div className="flex-1 bg-gradient-to-t from-[#ffe5a9] to-[#f9d588] rounded-2xl shadow-[0px_4px_4px_0px_rgba(116,114,160,0.33)] flex items-center justify-center min-h-[300px] md:min-h-[400px]">
                {product?.image && (
                  <img
                    src={product.image}
                    alt={product?.name || "Product"}
                    className="max-w-[80%] max-h-[80%] object-contain"
                  />
                )}
              </div>

              {/* Item Name */}
              <h2
                className="bg-gradient-to-b from-[#7684c9] to-[#7472a0] bg-clip-text text-transparent text-4xl md:text-5xl font-bold mt-4"
                style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
              >
                {product?.name}
              </h2>

              {/* Item Description */}
              <p
                className="bg-gradient-to-b from-[#7684c9] to-[#7472a0] bg-clip-text text-transparent text-xl md:text-2xl font-bold mt-1"
                style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
              >
                {product?.description || "Item description"}
              </p>
            </div>

            {/* Right Side - Order Form */}
            <div className="flex-1 bg-gradient-to-t from-[#fff2d4] to-[#ffe8b2] rounded-2xl shadow-[0px_4px_4px_0px_rgba(116,114,160,0.33)] p-4 md:p-6 flex flex-col gap-4">
              {/* Complete your order title */}
              <h3
                className="bg-gradient-to-b from-[#7684c9] to-[#7472a0] bg-clip-text text-transparent text-2xl md:text-3xl font-bold"
                style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
              >
                Complete your order:
              </h3>

              {/* Shipping Address Display */}
              <div className="w-full bg-gradient-to-b from-[#c0defe] to-[#9ac6f6] border-4 border-white rounded-2xl px-4 py-3 shadow-[0px_4px_0px_0px_#c6c7e4,0px_6px_8px_0px_rgba(116,114,160,0.69)]">
                <p
                  className="text-[#7472a0] text-sm font-medium mb-1"
                  style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
                >
                  Shipping Address:
                </p>
                <p
                  className="bg-gradient-to-b from-[#7684c9] to-[#7472a0] bg-clip-text text-transparent text-lg md:text-xl font-bold"
                  style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
                >
                  {formatAddress() || "No address on file"}
                </p>
              </div>

              {/* Edit Address Button */}
              <button
                onClick={handleEditAddress}
                className="self-end bg-gradient-to-t from-[#d9daf8] to-[#b5aae7] border-4 border-white rounded-2xl px-6 py-2 shadow-[0px_4px_0px_0px_#c6c7e4,0px_6px_8px_0px_rgba(116,114,160,0.69)] hover:scale-105 transition-transform"
              >
                <span
                  className="bg-gradient-to-b from-[#7684c9] to-[#7472a0] bg-clip-text text-transparent text-lg font-bold"
                  style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
                >
                  Edit Address ↗
                </span>
              </button>

              {/* Order Summary Section */}
              <div className="bg-gradient-to-b from-[#c0defe] to-[#9ac6f6] border-4 border-white rounded-2xl px-4 py-3 shadow-[0px_4px_0px_0px_#c6c7e4,0px_6px_8px_0px_rgba(116,114,160,0.69)]">
                <span
                  className="bg-gradient-to-b from-[#7684c9] to-[#7472a0] bg-clip-text text-transparent text-xl md:text-2xl font-bold"
                  style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
                >
                  Order Summary
                </span>
              </div>

              {/* Price Breakdown Card */}
              <div className="bg-gradient-to-b from-[#ffffff] to-[#ebf5ff] border-4 border-white rounded-2xl shadow-[0px_4px_0px_0px_#c6c7e4,0px_6px_8px_0px_rgba(116,114,160,0.69)] p-4 flex flex-col gap-3">
                <div className="bg-gradient-to-t from-[#ffffff] to-[#ebf5ff] rounded-2xl shadow-[0px_4px_0px_0px_#c6c7e4] p-4 flex flex-col gap-3">
                  {/* Base Price */}
                  <div className="flex items-center justify-between">
                    <span
                      className="bg-gradient-to-b from-[#7684c9] to-[#7472a0] bg-clip-text text-transparent text-lg md:text-xl font-bold"
                      style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
                    >
                      Base Price:
                    </span>
                    <div className="flex items-center gap-1">
                      <Image
                        src="/icons/feather.png"
                        alt="Feather"
                        width={24}
                        height={24}
                        className="rotate-[7deg]"
                      />
                      <span
                        className="bg-gradient-to-b from-[#7684c9] to-[#7472a0] bg-clip-text text-transparent text-lg md:text-xl font-bold"
                        style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
                      >
                        {product?.price}
                      </span>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center justify-between">
                    <span
                      className="bg-gradient-to-b from-[#7684c9] to-[#7472a0] bg-clip-text text-transparent text-lg md:text-xl font-bold"
                      style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
                    >
                      Quantity:
                    </span>
                    <div className="flex items-center gap-1">
                      <Image
                        src="/icons/feather.png"
                        alt="Feather"
                        width={24}
                        height={24}
                        className="rotate-[7deg]"
                      />
                      <span
                        className="bg-gradient-to-b from-[#7684c9] to-[#7472a0] bg-clip-text text-transparent text-lg md:text-xl font-bold"
                        style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
                      >
                        x1
                      </span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between">
                    <span
                      className="bg-gradient-to-b from-[#7684c9] to-[#7472a0] bg-clip-text text-transparent text-lg md:text-xl font-bold"
                      style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
                    >
                      Total:
                    </span>
                    <div className="flex items-center gap-1">
                      <Image
                        src="/icons/feather.png"
                        alt="Feather"
                        width={24}
                        height={24}
                        className="rotate-[7deg]"
                      />
                      <span
                        className="bg-gradient-to-b from-[#7684c9] to-[#7472a0] bg-clip-text text-transparent text-lg md:text-xl font-bold"
                        style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
                      >
                        {product?.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Get Button */}
              <div className="flex justify-center mt-2">
                <button
                  onClick={handleOrder}
                  disabled={submitting || userBalance < (product?.price || 0)}
                  className={`bg-gradient-to-t from-[#d9daf8] to-[#b5aae7] border-4 border-white rounded-2xl px-12 py-3 shadow-[0px_4px_0px_0px_#c6c7e4,0px_6px_8px_0px_rgba(116,114,160,0.69)] transition-transform ${
                    submitting || userBalance < (product?.price || 0)
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:scale-105"
                  }`}
                >
                  <span
                    className="bg-gradient-to-b from-[#7684c9] to-[#7472a0] bg-clip-text text-transparent text-xl font-bold"
                    style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
                  >
                    {submitting ? "Processing..." : "Get!"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
