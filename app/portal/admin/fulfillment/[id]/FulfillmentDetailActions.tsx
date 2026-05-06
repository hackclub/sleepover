"use client";

import { useState } from "react";

const FONT = "'MADE Tommy Soft', sans-serif";

export default function FulfillmentDetailActions({
  orderId,
  initialStatus,
  initialOwner,
  initialDmHistory,
  email,
  productName,
  adminSlackHandle,
  adminDisplayName,
}: {
  orderId: string;
  initialStatus: string;
  initialOwner: string | null;
  initialDmHistory: string | null;
  email: string;
  productName: string;
  adminSlackHandle: string;
  adminDisplayName: string;
}) {
  const templates = [
    `Your ${productName} has been fulfilled by ${adminSlackHandle}`,
    `Hi! I'm looking to get your Sleepover order fulfilled - would you want a card grant for this or for the Sleepover to fulfil your order?`,
    `hey! i'm ${adminSlackHandle} and i'm fulfilling your sleepover order. what customization would you want on your item? (color typically)`,
    `hey! we need you to verify your identity before you earn prizes, can you go to https://auth.hackclub.com and do that? tysm! - ${adminSlackHandle}`,
  ];
  const [status, setStatus] = useState(initialStatus);
  const [owner, setOwner] = useState(initialOwner);
  const [updating, setUpdating] = useState(false);
  const [dmMessage, setDmMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [dmResult, setDmResult] = useState<{ ok: boolean; text: string } | null>(null);
  type DmEntry = { ts: string; sender: string; message: string }; // matches parseFulfillmentDmHistory shape
  function parseDmHistory(raw: string | null): DmEntry[] {
    if (!raw) return [];
    try { return JSON.parse(raw) as DmEntry[]; } catch { return []; }
  }
  const [dmHistory, setDmHistory] = useState<DmEntry[]>(parseDmHistory(initialDmHistory));

  async function patchStatus(newStatus: string) {
    setUpdating(true);
    await fetch("/api/admin/fulfillment", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recordId: orderId, status: newStatus }),
    });
    setStatus(newStatus);
    setUpdating(false);
  }

  async function patchOwner(newOwner: string | null) {
    setUpdating(true);
    await fetch("/api/admin/fulfillment", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recordId: orderId, owner: newOwner }),
    });
    setOwner(newOwner);
    setUpdating(false);
  }

  async function sendDm() {
    if (!dmMessage.trim()) return;
    setSending(true);
    setDmResult(null);
    try {
      const res = await fetch("/api/admin/fulfillment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message: dmMessage, orderId }),
      });
      const data = await res.json();
      if (data.success) {
        setDmResult({ ok: true, text: "Sent!" });
        if (data.newEntry) {
          setDmHistory((prev) => [...prev, data.newEntry]);
        }
        setDmMessage("");
      } else {
        setDmResult({ ok: false, text: data.error || "Failed to send" });
      }
    } catch {
      setDmResult({ ok: false, text: "Network error" });
    }
    setSending(false);
  }


  return (
    <div className="flex flex-col gap-6">
      {/* Status + Owner */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: "rgba(255,255,255,0.95)",
          border: "2px solid #dde0f8",
          boxShadow: "0 2px 8px rgba(108,110,160,0.08)",
        }}
      >
        <h2 className="text-lg font-bold mb-4" style={{ color: "#4a4c78", fontFamily: FONT }}>
          Status
        </h2>
        <div className="flex gap-3 flex-wrap items-center mb-4">
          <span className="text-sm font-semibold" style={{ color: "#8a8cb0", fontFamily: FONT }}>
            Current: <span style={{ color: "#4a4c78" }}>{status}</span>
          </span>
          {status !== "Fulfilled" && (
            <button
              onClick={() => patchStatus("Fulfilled")}
              disabled={updating}
              className="px-4 py-2 rounded-full text-sm font-bold transition-all disabled:opacity-40"
              style={{ background: "#e6f9f0", color: "#1a7a4a", border: "1.5px solid #7dd3aa", fontFamily: FONT }}
            >
              {updating ? "..." : "Mark Fulfilled"}
            </button>
          )}
          {status !== "Unfulfilled" && (
            <button
              onClick={() => patchStatus("Unfulfilled")}
              disabled={updating}
              className="px-4 py-2 rounded-full text-sm font-bold transition-all disabled:opacity-40"
              style={{ background: "#fff4e0", color: "#b35c00", border: "1.5px solid #f5c07a", fontFamily: FONT }}
            >
              {updating ? "..." : "Mark Unfulfilled"}
            </button>
          )}
        </div>
        <div className="flex gap-3 flex-wrap items-center pt-3" style={{ borderTop: "1.5px solid #eeeef8" }}>
          <span className="text-sm font-semibold" style={{ color: "#8a8cb0", fontFamily: FONT }}>
            Owner: <span style={{ color: "#4a4c78" }}>{owner || "Unclaimed"}</span>
          </span>
          {owner !== adminDisplayName ? (
            <button
              onClick={() => patchOwner(adminDisplayName)}
              disabled={updating}
              className="px-4 py-2 rounded-full text-sm font-bold transition-all disabled:opacity-40"
              style={{
                background: "linear-gradient(180deg, #8FB1F0 0%, #6D90E3 100%)",
                color: "white",
                border: "2px solid #6D90E3",
                boxShadow: "0 2px 8px rgba(109,144,227,0.4)",
                fontFamily: FONT,
              }}
            >
              {updating ? "..." : owner ? "Reassign to me" : "Claim"}
            </button>
          ) : (
            <button
              onClick={() => patchOwner(null)}
              disabled={updating}
              className="px-4 py-2 rounded-full text-sm font-bold transition-all disabled:opacity-40"
              style={{ background: "#f4f5fb", color: "#5A5C8A", border: "1.5px solid #c0c2e8", fontFamily: FONT }}
            >
              {updating ? "..." : "Unclaim"}
            </button>
          )}
        </div>
      </div>

      {/* DM box */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: "rgba(255,255,255,0.95)",
          border: "2px solid #dde0f8",
          boxShadow: "0 2px 8px rgba(108,110,160,0.08)",
        }}
      >
        <h2 className="text-lg font-bold mb-1" style={{ color: "#4a4c78", fontFamily: FONT }}>
          Send Slack DM
        </h2>
        <p className="text-xs mb-4" style={{ color: "#8a8cb0", fontFamily: FONT }}>
          to {email}
        </p>

        {/* Message history */}
        {dmHistory.length > 0 && (
          <div
            className="rounded-xl p-3 mb-4 flex flex-col gap-1.5 max-h-48 overflow-y-auto"
            style={{ background: "#f4f5fb", border: "1.5px solid #e0e2f4" }}
          >
            <p className="text-xs font-bold mb-1" style={{ color: "#8a8cb0", fontFamily: FONT }}>
              Message history
            </p>
            {dmHistory.map((entry, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold" style={{ color: "#6D90E3", fontFamily: FONT }}>
                  {entry.sender} · {entry.ts}
                </span>
                <span className="text-xs" style={{ color: "#3a3c68", fontFamily: FONT }}>{entry.message}</span>
              </div>
            ))}
          </div>
        )}

        {/* Template buttons */}
        <div className="flex flex-col gap-2 mb-3">
          {templates.map((t, i) => (
            <button
              key={i}
              onClick={() => setDmMessage(t)}
              className="text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
              style={{ background: "#e8eaf8", color: "#5A5C8A", border: "1.5px solid #c0c2e8", fontFamily: FONT }}
            >
              {t}
            </button>
          ))}
        </div>

        <textarea
          value={dmMessage}
          onChange={(e) => setDmMessage(e.target.value)}
          placeholder="Write your message..."
          rows={4}
          className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none mb-3"
          style={{
            background: "#f4f5fb",
            border: "1.5px solid #c0c2e8",
            color: "#3a3c68",
            fontFamily: FONT,
          }}
        />
        <div className="flex items-center gap-3">
          <button
            onClick={sendDm}
            disabled={sending || !dmMessage.trim()}
            className="px-5 py-2 rounded-full text-sm font-bold transition-all disabled:opacity-40"
            style={{
              background: "linear-gradient(180deg, #8FB1F0 0%, #6D90E3 100%)",
              color: "white",
              border: "2px solid #6D90E3",
              boxShadow: "0 2px 8px rgba(109,144,227,0.4)",
              fontFamily: FONT,
            }}
          >
            {sending ? "Sending..." : "Send"}
          </button>
          {dmResult && (
            <span
              className="text-sm font-semibold"
              style={{ color: dmResult.ok ? "#1a7a4a" : "#c03535", fontFamily: FONT }}
            >
              {dmResult.text}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
