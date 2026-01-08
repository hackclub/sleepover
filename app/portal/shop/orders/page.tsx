"use client";

import { useState, useEffect } from "react";
import PortalSidebar from "../../../components/PortalSidebar";
import BunnyTile from "../../../components/BunnyTile";
import Image from "next/image";

interface OrderProduct {
  name: string;
  price: number;
  image?: string;
}

interface OrderAddress {
  line1: string;
  line2: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

interface Order {
  id: string;
  date: string;
  status: string;
  product: OrderProduct | null;
  address: OrderAddress;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    fetch("/api/shop/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch orders:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatAddress = (address: OrderAddress) => {
    const parts = [
      address.line1,
      address.line2,
      address.city,
      address.state,
      address.zip,
      address.country,
    ].filter((part) => part && part.trim() !== "");

    return parts.join(", ");
  };

  return (
    <div
      className="font-sans min-h-screen relative"
      style={{ backgroundColor: "#C0DEFE" }}
    >
      <div className="z-0">
        <BunnyTile />
      </div>
      <PortalSidebar onStateChange={setSidebarOpen} />

      <main
        className="min-h-screen py-6 md:py-8 px-4 md:px-8 transition-all duration-300 pt-16 md:pt-8 z-10 relative"
        style={{
          marginLeft: isMobile ? "0px" : sidebarOpen ? "clamp(320px, 25vw, 520px)" : "96px",
        }}
      >
        <div className="max-w-5xl mx-auto">
          <h1
            className="text-5xl md:text-6xl lg:text-8xl font-bold text-center mb-8 bg-gradient-to-b from-[#7c95e6] to-[#91b0ed] bg-clip-text text-transparent drop-shadow-[0px_4px_4px_rgba(0,0,0,0.51)]"
            style={{
              fontFamily: "'MADE Tommy Soft', sans-serif",
              WebkitTextStroke: isMobile ? "2px white" : "3px white",
            }}
          >
            My Orders
          </h1>

          {loading ? (
            <p
              className="text-center text-[#6c6ea0] text-xl font-bold"
              style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
            >
              Loading orders...
            </p>
          ) : orders.length === 0 ? (
            <div
              className="text-center p-8 rounded-2xl"
              style={{
                background: "linear-gradient(180deg, #FFFFFF 0%, #F5F0FF 100%)",
                boxShadow: "0px 4px 12px rgba(108, 110, 160, 0.3)",
              }}
            >
              <p
                className="text-[#6c6ea0] text-xl font-bold"
                style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
              >
                No orders yet! Visit the shop to redeem your feathers.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-6 rounded-2xl"
                  style={{
                    background: "linear-gradient(180deg, #FFFFFF 0%, #F5F0FF 100%)",
                    boxShadow: "0px 4px 12px rgba(108, 110, 160, 0.3)",
                    border: "3px solid white",
                  }}
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Product Image */}
                    {order.product?.image && (
                      <div className="flex-shrink-0">
                        <Image
                          src={order.product.image}
                          alt={order.product.name}
                          width={120}
                          height={120}
                          className="rounded-lg object-cover"
                          style={{
                            boxShadow: "0px 2px 8px rgba(108, 110, 160, 0.3)",
                          }}
                        />
                      </div>
                    )}

                    {/* Order Details */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <h2
                          className="text-2xl md:text-3xl font-bold text-[#5A5C8A]"
                          style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
                        >
                          {order.product?.name || "Unknown Item"}
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p
                            className="text-sm font-bold text-[#8B8DAE] uppercase tracking-wide"
                            style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
                          >
                            Order Date
                          </p>
                          <p
                            className="text-lg font-bold text-[#6c6ea0]"
                            style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
                          >
                            {formatDate(order.date)}
                          </p>
                        </div>

                        <div>
                          <p
                            className="text-sm font-bold text-[#8B8DAE] uppercase tracking-wide"
                            style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
                          >
                            Price
                          </p>
                          <p
                            className="text-lg font-bold text-[#6c6ea0]"
                            style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
                          >
                            {order.product?.price || 0} feathers
                          </p>
                        </div>
                      </div>

                      <div>
                        <p
                          className="text-sm font-bold text-[#8B8DAE] uppercase tracking-wide mb-1"
                          style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
                        >
                          Shipping Address
                        </p>
                        <p
                          className="text-base font-bold text-[#6c6ea0]"
                          style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
                        >
                          {formatAddress(order.address) || "No address provided"}
                        </p>
                      </div>

                      <div>
                        <p
                          className="text-sm font-bold text-[#8B8DAE] uppercase tracking-wide"
                          style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}
                        >
                          Status
                        </p>
                        <span
                          className="inline-block px-4 py-1 rounded-full text-sm font-bold"
                          style={{
                            fontFamily: "'MADE Tommy Soft', sans-serif",
                            background: order.status === "Fulfilled"
                              ? "linear-gradient(180deg, #93E8B8 0%, #B5F0CE 100%)"
                              : "linear-gradient(180deg, #F0D293 0%, #F5E5B5 100%)",
                            color: order.status === "Fulfilled" ? "#2D6B4A" : "#8A6B2D",
                            border: "2px solid white",
                            boxShadow: "0px 2px 4px rgba(116, 114, 160, 0.3)",
                          }}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
