import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import {
  isSuperAdminUser,
  getFulfillmentOrder,
  getUserFromId,
  getUserApprovedSubmissions,
  getCurrency,
  getProgressHours,
} from "@/lib/airtable";
import FulfillmentDetailActions from "./FulfillmentDetailActions";
import ProjectsList from "./ProjectsList";

const FONT = "'MADE Tommy Soft', sans-serif";

const IDV_STYLES: Record<string, React.CSSProperties> = {
  verified:         { background: "#e6f9f0", color: "#1a7a4a", border: "1.5px solid #7dd3aa" },
  ineligible:       { background: "#fde8e8", color: "#c03535", border: "1.5px solid #f0a0a0" },
  pending:          { background: "#fff4e0", color: "#b35c00", border: "1.5px solid #f5c07a" },
  needs_submission: { background: "#e8eaf8", color: "#5A5C8A", border: "1.5px solid #c0c2e8" },
};
const IDV_LABELS: Record<string, string> = {
  verified:         "Verified",
  ineligible:       "Ineligible",
  pending:          "Pending",
  needs_submission: "Needs Submission",
};

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  Unfulfilled: { bg: "#fff4e0", text: "#b35c00", border: "#f5c07a" },
  Fulfilled: { bg: "#e6f9f0", text: "#1a7a4a", border: "#7dd3aa" },
  Refunded: { bg: "#fde8e8", text: "#c03535", border: "#f0a0a0" },
};


export default async function FulfillmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) redirect("/?error=auth_required");
  const admin = await isSuperAdminUser(user.userId);
  if (!admin) redirect("/portal?error=unauthorized");

  const order = await getFulfillmentOrder(id);
  if (!order) redirect("/portal/admin");

  const [userInfo, projects, feathers, hoursShipped, adminInfo] = await Promise.all([
    order.userid ? getUserFromId(order.userid) : null,
    order.userid ? getUserApprovedSubmissions(order.userid) : [],
    order.userid ? getCurrency(order.userid) : 0,
    order.userid ? getProgressHours(order.userid) : 0,
    getUserFromId(user.userId),
  ]);
  const idvStatus = userInfo?.verification_status || null;
  const adminSlackHandle = adminInfo?.slack_id ? `<@${adminInfo.slack_id}>` : `@${adminInfo?.slack_display_name || user.name || "admin"}`;

  const statusStyle =
    STATUS_STYLES[order.status] ?? { bg: "#e8eaf8", text: "#5A5C8A", border: "#c0c2e8" };
  const addressParts = [
    order.address_line_1,
    order.address_line_2,
    order.city,
    order.state_province,
    order.zip_code,
    order.country,
  ].filter(Boolean);

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: "url('/background/tile.png')",
        backgroundRepeat: "repeat",
        fontFamily: FONT,
      }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-10 flex items-center gap-4 px-6 py-4"
        style={{
          background:
            "linear-gradient(180deg, rgba(217,218,248,0.97) 0%, rgba(255,240,253,0.97) 100%)",
          borderBottom: "2px solid #c8caf0",
          backdropFilter: "blur(8px)",
        }}
      >
        <Link
          href="/portal/admin/fulfillment"
          className="text-sm font-semibold px-3 py-1.5 rounded-full transition-opacity hover:opacity-70"
          style={{ background: "#e8eaf8", color: "#5A5C8A", border: "1.5px solid #c0c2e8" }}
        >
          ← Fulfillment
        </Link>
        <h1 className="text-xl md:text-2xl font-bold" style={{ color: "#5A5C8A" }}>
          Fulfillment Detail
        </h1>
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full ml-auto"
          style={{ background: statusStyle.bg, color: statusStyle.text, border: `1.5px solid ${statusStyle.border}` }}
        >
          {order.status.toUpperCase()}
        </span>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order card */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,0.95)",
              border: "2px solid #dde0f8",
              boxShadow: "0 2px 8px rgba(108,110,160,0.08)",
            }}
          >
            <h2 className="text-lg font-bold mb-4" style={{ color: "#4a4c78" }}>
              Order
            </h2>
            <div className="flex flex-col gap-2.5 text-sm" style={{ color: "#5a5c8a" }}>
              <Row label="Product" value={order.product?.name || "(unknown)"} />
              <Row label="Quantity" value={String(order.quantity)} />
              <Row
                label="Price"
                value={
                  order.product
                    ? `${order.product.price * order.quantity} feathers`
                    : "—"
                }
              />
              <Row label="Date" value={order.date || "—"} />
              {addressParts.length > 0 && (
                <div className="flex gap-2">
                  <span className="font-semibold min-w-[90px]" style={{ color: "#8a8cb0" }}>
                    Address
                  </span>
                  <span className="leading-snug">{addressParts.join(", ")}</span>
                </div>
              )}
              {order.notes && (
                <div className="flex gap-2">
                  <span className="font-semibold min-w-[90px]" style={{ color: "#8a8cb0" }}>
                    Notes
                  </span>
                  <span className="italic">{order.notes}</span>
                </div>
              )}
            </div>
          </div>

          {/* User card */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,0.95)",
              border: "2px solid #dde0f8",
              boxShadow: "0 2px 8px rgba(108,110,160,0.08)",
            }}
          >
            <h2 className="text-lg font-bold mb-4" style={{ color: "#4a4c78" }}>
              User
            </h2>
            {userInfo ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  {userInfo.slack_avatar_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={userInfo.slack_avatar_url}
                      alt=""
                      className="w-12 h-12 rounded-full"
                      style={{ border: "2px solid #dde0f8" }}
                    />
                  )}
                  <div>
                    <p className="font-bold text-base" style={{ color: "#3a3c68" }}>
                      {userInfo.name || order.userName || "(no name)"}
                    </p>
                    {order.pronouns && (
                      <p className="text-xs" style={{ color: "#9a9cb8" }}>
                        {order.pronouns}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 text-sm" style={{ color: "#5a5c8a" }}>
                  <Row label="Email" value={userInfo.email || order.email || "—"} />
                  {userInfo.slack_id && (
                    <div className="flex gap-2 items-center">
                      <span className="font-semibold min-w-[90px]" style={{ color: "#8a8cb0" }}>
                        Slack
                      </span>
                      <a
                        href={`https://hackclub.slack.com/team/${userInfo.slack_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold transition-opacity hover:opacity-70"
                        style={{ color: "#6D90E3" }}
                      >
                        @{userInfo.slack_display_name || userInfo.slack_id} ↗
                      </a>
                    </div>
                  )}
                  <div className="flex gap-2 items-center">
                    <span className="font-semibold min-w-[90px]" style={{ color: "#8a8cb0" }}>
                      Feathers
                    </span>
                    <span className="font-bold text-base" style={{ color: "#4a4c78" }}>
                      {Number(feathers).toLocaleString()} 🪶
                    </span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="font-semibold min-w-[90px]" style={{ color: "#8a8cb0" }}>
                      Hours Shipped
                    </span>
                    <span className="font-semibold" style={{ color: "#4a4c78" }}>
                      {Number(hoursShipped).toLocaleString()}h
                    </span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="font-semibold min-w-[90px]" style={{ color: "#8a8cb0" }}>
                      IDV Status
                    </span>
                    {idvStatus ? (
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={IDV_STYLES[idvStatus] ?? IDV_STYLES.pending}
                      >
                        {IDV_LABELS[idvStatus] ?? idvStatus}
                      </span>
                    ) : (
                      <span className="text-sm" style={{ color: "#8a8cb0" }}>—</span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm" style={{ color: "#8a8cb0" }}>
                No user info found.
              </p>
            )}
          </div>
        </div>

        {/* Fulfillment instructions */}
        {order.product?.fulfillmentMethod && (
          <div
            className="rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,0.95)",
              border: "2px solid #dde0f8",
              boxShadow: "0 2px 8px rgba(108,110,160,0.08)",
            }}
          >
            <h2 className="text-lg font-bold mb-3" style={{ color: "#4a4c78", fontFamily: FONT }}>
              Fulfillment Instructions
            </h2>
            <p className="text-sm whitespace-pre-wrap" style={{ color: "#5a5c8a", fontFamily: FONT }}>
              {linkifyText(order.product.fulfillmentMethod)}
            </p>
          </div>
        )}

        {/* Actions: status + DM */}
        <FulfillmentDetailActions
          orderId={order.id}
          initialStatus={order.status}
          initialOwner={order.adminOwner ?? null}
          initialDmHistory={order.dmHistory ?? null}
          email={order.email || userInfo?.email || ""}
          productName={order.product?.name || "order"}
          adminSlackHandle={adminSlackHandle}
          adminDisplayName={adminInfo?.slack_display_name || user.name || user.email || "admin"}
        />

        {/* Projects */}
        <ProjectsList projects={projects} />
      </main>
    </div>
  );
}

function linkifyText(text: string): React.ReactNode {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) =>
    urlRegex.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="underline transition-opacity hover:opacity-70"
        style={{ color: "#6D90E3" }}
      >
        {part}
      </a>
    ) : (
      part
    )
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="font-semibold min-w-[90px]" style={{ color: "#8a8cb0" }}>
        {label}
      </span>
      <span>{value}</span>
    </div>
  );
}
