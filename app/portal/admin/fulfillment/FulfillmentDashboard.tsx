"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const FONT = "'MADE Tommy Soft', sans-serif";

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Unfulfilled: { bg: "#fff4e0", text: "#b35c00", border: "#f5c07a" },
  Fulfilled:   { bg: "#e6f9f0", text: "#1a7a4a", border: "#7dd3aa" },
  Refunded:    { bg: "#fde8e8", text: "#c03535", border: "#f0a0a0" },
};
const getStatusStyle = (s: string) =>
  STATUS_COLORS[s] ?? { bg: "#e8eaf8", text: "#5A5C8A", border: "#c0c2e8" };

const IDV_STYLE: Record<string, React.CSSProperties> = {
  verified:         { background: "#e6f9f0", color: "#1a7a4a", border: "1.5px solid #7dd3aa" },
  ineligible:       { background: "#fde8e8", color: "#c03535", border: "1.5px solid #f0a0a0" },
  pending:          { background: "#fff4e0", color: "#b35c00", border: "1.5px solid #f5c07a" },
  needs_submission: { background: "#e8eaf8", color: "#5A5C8A", border: "1.5px solid #c0c2e8" },
};
const IDV_LABEL: Record<string, string> = {
  verified:         "Verified",
  ineligible:       "Ineligible",
  pending:          "Pending",
  needs_submission: "Needs Submission",
};

export interface FulfillmentOrder {
  id: string;
  status: string;
  date: string;
  createdAt?: string;
  userName: string;
  email: string;
  pronouns: string;
  userid: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state_province: string;
  country: string;
  zip_code: string;
  quantity: number;
  notes: string;
  productId?: string;
  product: { name: string; price: number; image?: string; fulfillmentMethod?: string } | null;
  idvStatus: string | null;
  adminOwner: string | null;
}

export default function FulfillmentDashboard({
  initialOrders,
  adminDisplayName,
}: {
  initialOrders: FulfillmentOrder[];
  adminDisplayName: string;
}) {
  const router = useRouter();
  const [orders, setOrders] = useState<FulfillmentOrder[]>(initialOrders);
  const [statusFilter, setStatusFilter] = useState("All");
  const [prizeFilter, setPrizeFilter] = useState("All");
  const [idvFilter, setIdvFilter] = useState("All");
  const [userSearch, setUserSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const prizeOptions = ["All", ...Array.from(new Set(orders.map((o) => o.product?.name || "Unknown"))).sort()];

  const filtered = orders.filter((o) => {
    if (statusFilter !== "All" && o.status !== statusFilter) return false;
    if (prizeFilter !== "All" && (o.product?.name || "Unknown") !== prizeFilter) return false;
    if (idvFilter !== "All" && (o.idvStatus || "") !== idvFilter) return false;
    if (userSearch && !o.userName.toLowerCase().includes(userSearch.toLowerCase()) && !o.email.toLowerCase().includes(userSearch.toLowerCase())) return false;
    return true;
  });

  const total = orders.length;
  const unfulfilled = orders.filter((o) => o.status === "Unfulfilled").length;
  const fulfilled = orders.filter((o) => o.status === "Fulfilled").length;
  const totalFeathers = orders.reduce((sum, o) => sum + (o.product?.price ?? 0) * (o.quantity || 1), 0);

  async function patchStatus(id: string, status: string) {
    setUpdatingId(id);
    await fetch("/api/admin/fulfillment", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recordId: id, status }),
    });
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    setUpdatingId(null);
  }

  async function patchOwner(id: string, owner: string | null) {
    setUpdatingId(id);
    await fetch("/api/admin/fulfillment", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recordId: id, owner }),
    });
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, adminOwner: owner } : o)));
    setUpdatingId(null);
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundImage: "url('/background/tile.png')", backgroundRepeat: "repeat", fontFamily: FONT }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-10 flex items-center gap-4 px-6 py-4"
        style={{
          background: "linear-gradient(180deg, rgba(217,218,248,0.97) 0%, rgba(255,240,253,0.97) 100%)",
          borderBottom: "2px solid #c8caf0",
          backdropFilter: "blur(8px)",
        }}
      >
        <Link
          href="/portal/admin"
          className="text-sm font-semibold px-3 py-1.5 rounded-full transition-opacity hover:opacity-70"
          style={{ background: "#e8eaf8", color: "#5A5C8A", border: "1.5px solid #c0c2e8" }}
        >
          ← Admin
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "#5A5C8A" }}>
          Fulfillment
        </h1>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6 items-center">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-full text-sm font-semibold outline-none"
            style={{ background: "rgba(255,255,255,0.9)", border: "1.5px solid #c0c2e8", color: "#4a4c78", fontFamily: FONT }}
          >
            {["All", "Unfulfilled", "Fulfilled", "Refunded"].map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>

          <select
            value={prizeFilter}
            onChange={(e) => setPrizeFilter(e.target.value)}
            className="px-4 py-2 rounded-full text-sm font-semibold outline-none"
            style={{ background: "rgba(255,255,255,0.9)", border: "1.5px solid #c0c2e8", color: "#4a4c78", fontFamily: FONT }}
          >
            {prizeOptions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <select
            value={idvFilter}
            onChange={(e) => setIdvFilter(e.target.value)}
            className="px-4 py-2 rounded-full text-sm font-semibold outline-none"
            style={{ background: "rgba(255,255,255,0.9)", border: "1.5px solid #c0c2e8", color: "#4a4c78", fontFamily: FONT }}
          >
            <option value="All">All IDV</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="needs_submission">Needs Submission</option>
            <option value="ineligible">Ineligible</option>
          </select>

          <input
            type="text"
            placeholder="Search by user..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="px-4 py-2 rounded-full text-sm outline-none flex-1 min-w-[180px]"
            style={{ background: "rgba(255,255,255,0.9)", border: "1.5px solid #c0c2e8", color: "#4a4c78", fontFamily: FONT }}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Orders", value: total },
            { label: "Unfulfilled", value: unfulfilled },
            { label: "Fulfilled", value: fulfilled },
            { label: "Total Feathers Spent", value: totalFeathers.toLocaleString() },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-2xl p-4 text-center" style={{ background: "rgba(255,255,255,0.9)", border: "2px solid #dde0f8", boxShadow: "0 2px 8px rgba(108,110,160,0.08)" }}>
              <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "#8a8cb0" }}>{label}</p>
              <p className="text-2xl font-bold" style={{ color: "#4a4c78" }}>{value}</p>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center py-12 text-sm" style={{ color: "#8a8cb0" }}>No orders match the current filters.</p>
        )}

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((order) => {
            const style = getStatusStyle(order.status);
            const isDigital = order.product?.fulfillmentMethod?.toLowerCase().includes("digital");
            const addressParts = [order.address_line_1, order.address_line_2, order.city, order.state_province, order.zip_code, order.country].filter(Boolean);
            return (
              <div
                key={order.id}
                className="rounded-2xl p-5 cursor-pointer transition-shadow hover:shadow-md"
                style={{ background: "rgba(255,255,255,0.95)", border: "2px solid #dde0f8", boxShadow: "0 2px 8px rgba(108,110,160,0.08)" }}
                onClick={() => router.push(`/portal/admin/fulfillment/${order.id}`)}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-base leading-snug" style={{ color: "#3a3c68" }}>
                    {order.product?.name || "(unknown item)"}
                    {order.quantity > 1 && <span className="ml-1 text-sm font-normal" style={{ color: "#8a8cb0" }}>×{order.quantity}</span>}
                  </h3>
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{ background: style.bg, color: style.text, border: `1.5px solid ${style.border}` }}
                  >
                    {order.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-sm mb-1" style={{ color: "#5a5c8a" }}>
                  <span className="font-semibold">{order.userName || "(no name)"}</span>
                  {order.pronouns && <span className="ml-1 text-xs" style={{ color: "#9a9cb8" }}>({order.pronouns})</span>}
                </p>
                {order.email && (
                  <p className="text-xs mb-1" style={{ color: "#8a8cb0" }}>{order.email}</p>
                )}
                {order.idvStatus && (
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full mb-2 inline-block"
                    style={IDV_STYLE[order.idvStatus] ?? IDV_STYLE.pending}
                  >
                    IDV: {IDV_LABEL[order.idvStatus] ?? order.idvStatus}
                  </span>
                )}

                <div className="flex gap-4 text-xs mb-2" style={{ color: "#6c6ea0" }}>
                  {order.product?.price !== undefined && (
                    <span>Price: <span className="font-semibold" style={{ color: "#4a4c78" }}>{order.product.price * (order.quantity || 1)} feathers</span></span>
                  )}
                  {order.date && (
                    <span>Ordered: <span className="font-semibold" style={{ color: "#4a4c78" }}>{order.date}</span></span>
                  )}
                </div>
                {order.adminOwner && (
                  <p className="text-xs mb-2 font-semibold" style={{ color: "#6D90E3" }}>
                    Owner: {order.adminOwner}
                  </p>
                )}

                {addressParts.length > 0 && (
                  <p className="text-xs mb-2 leading-snug" style={{ color: "#7a7ca8" }}>{addressParts.join(", ")}</p>
                )}
                {order.notes && (
                  <p className="text-xs mb-3 italic" style={{ color: "#8a8cb0" }}>{order.notes}</p>
                )}

                <div className="flex gap-2 mt-3 flex-wrap">
                  {order.status !== "Fulfilled" && (
                    <button
                      onClick={(e) => { e.stopPropagation(); patchStatus(order.id, "Fulfilled"); }}
                      disabled={updatingId === order.id}
                      className="px-3 py-1.5 rounded-full text-xs font-bold transition-all disabled:opacity-40"
                      style={{ background: "#e6f9f0", color: "#1a7a4a", border: "1.5px solid #7dd3aa" }}
                    >
                      {updatingId === order.id ? "..." : "Mark Fulfilled"}
                    </button>
                  )}
                  {order.status !== "Unfulfilled" && (
                    <button
                      onClick={(e) => { e.stopPropagation(); patchStatus(order.id, "Unfulfilled"); }}
                      disabled={updatingId === order.id}
                      className="px-3 py-1.5 rounded-full text-xs font-bold transition-all disabled:opacity-40"
                      style={{ background: "#fff4e0", color: "#b35c00", border: "1.5px solid #f5c07a" }}
                    >
                      {updatingId === order.id ? "..." : "Mark Unfulfilled"}
                    </button>
                  )}
                  {order.adminOwner !== adminDisplayName ? (
                    <button
                      onClick={(e) => { e.stopPropagation(); patchOwner(order.id, adminDisplayName); }}
                      disabled={updatingId === order.id}
                      className="px-3 py-1.5 rounded-full text-xs font-bold transition-all disabled:opacity-40"
                      style={{ background: "linear-gradient(180deg, #8FB1F0 0%, #6D90E3 100%)", color: "white", border: "1.5px solid #6D90E3" }}
                    >
                      {updatingId === order.id ? "..." : order.adminOwner ? "Reassign to me" : "Claim"}
                    </button>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); patchOwner(order.id, null); }}
                      disabled={updatingId === order.id}
                      className="px-3 py-1.5 rounded-full text-xs font-bold transition-all disabled:opacity-40"
                      style={{ background: "#f4f5fb", color: "#5A5C8A", border: "1.5px solid #c0c2e8" }}
                    >
                      {updatingId === order.id ? "..." : "Unclaim"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
