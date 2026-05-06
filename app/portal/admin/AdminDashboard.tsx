"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const REVIEW_GUIDELINES = [
  {
    title: "Definitions",
    items: [
      {
        label: "Shipped Project",
        text: "A project that is code-complete, published on source control (e.g., GitHub), and easily experienceable (live website or clear local setup instructions taking <2 minutes). It should be polished, with a descriptive README and minimal bugs/visual glitches.",
      },
    ],
  },
  {
    title: "Review Process",
    items: [
      {
        label: "Initial Checks",
        text: "Verify project is a Shipped Project (see definition above). Assess if reported time is realistic for the project. Confirm approximately one commit per hour (sample a few random commits and optionally skim others).",
      },
      {
        label: "Decision Making",
        text: "Assume good faith by default. If rejecting, provide actionable feedback for resubmission. If unsure, approve the project.",
      },
      {
        label: "Good Example Ship Message",
        text: 'Reviewed by @Reem. This project seems to have taken -- hours and the author had -- commits total, first one made --. The project made with ---. AI is not used/AI is less than 30%',
      },
    ],
  },
];

type EventType = "huddle" | "challenge" | "social" | "deadline";


interface DmEntry {
  sender: string;
  message: string;
  timestamp: string;
}

interface Submission {
  id: string;
  project: string;
  description: string;
  displayname: string;
  email: string;
  hours: number;
  overrideHours?: number;
  playableUrl: string;
  codeUrl: string;
  screenshot: unknown;
  status: string;
  ysws: string;
  challenge: string;
  slack_id?: string;
  pronouns?: string;
  dm_history: DmEntry[];
  createdAt?: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  description: string;
  type: EventType;
  joinUrl?: string;
}

const TYPE_STYLES: Record<EventType, { bg: string; border: string; label: string; dot: string }> = {
  huddle: { bg: "#ddeeff", border: "#9AC6F6", label: "Huddle", dot: "#6D90E3" },
  challenge: { bg: "#fce8ed", border: "#DFA1AA", label: "Challenge", dot: "#DFA1AA" },
  social: { bg: "#fff8e6", border: "#FFE8B2", label: "Social", dot: "#f0c060" },
  deadline: { bg: "#f5dde3", border: "#c47a8a", label: "Deadline", dot: "#c47a8a" },
};

const STATUS_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  Approved: { bg: "#e6f9ee", color: "#2d8a55", border: "#86d8a8" },
  Rejected: { bg: "#fde8e8", color: "#c03535", border: "#f0a0a0" },
  Pending: { bg: "#fff8e1", color: "#9a7a10", border: "#f0d070" },
};

const STATUS_LABEL: Record<string, string> = {
  Approved: "Approved",
  Rejected: "Changes Needed",
  Pending: "Pending",
};

const FONT = "'MADE Tommy Soft', sans-serif";


function parseDate(dateStr: string | undefined | null): Date {
  if (!dateStr) return new Date(NaN);
  const datePart = dateStr.split("T")[0];
  return new Date(datePart + "T00:00:00");
}

function formatTime(time: string): string {
  // Handles both "HH:MM" (from type="time") and legacy free-text like "7:00 PM ET"
  if (!time) return "";
  if (time.includes("AM") || time.includes("PM")) return time;
  const [h, m] = time.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return time;
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

const EMPTY_EVENT = { title: "", date: "", time: "", description: "", type: "huddle" as EventType, joinUrl: "" };

// Convert "7:00 PM" → "19:00" for <input type="time">
function timeToInput(time: string): string {
  if (!time) return "";
  if (!time.includes("AM") && !time.includes("PM")) return time;
  const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return "";
  let h = parseInt(match[1]);
  const m = match[2];
  const period = match[3].toUpperCase();
  if (period === "AM" && h === 12) h = 0;
  if (period === "PM" && h !== 12) h += 12;
  return `${String(h).padStart(2, "0")}:${m}`;
}

export default function AdminDashboard({ userName, isSuperAdmin }: { userName: string; isSuperAdmin: boolean }) {
  const [tab, setTab] = useState<"projects" | "calendar" | "leaderboard">("projects");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("Pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [newEvent, setNewEvent] = useState(EMPTY_EVENT);
  const [adding, setAdding] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(EMPTY_EVENT);
  const [dmMessage, setDmMessage] = useState("");
  const [sendingDm, setSendingDm] = useState(false);
  const [approveFormOpen, setApproveFormOpen] = useState(false);
  const [shipJustification, setShipJustification] = useState("");
  const [overrideHours, setOverrideHours] = useState("");
  const [userComment, setUserComment] = useState("");
  const [rejectFormOpen, setRejectFormOpen] = useState(false);
  const [rejectMessage, setRejectMessage] = useState("");
  const [dmError, setDmError] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/projects");
    const data = await res.json();
    setSubmissions(data);
    setLoading(false);
  }, []);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/calendar");
    const data = await res.json();
    setEvents(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (tab === "projects" || tab === "leaderboard") fetchSubmissions();
    else if (tab === "calendar") fetchEvents();
  }, [tab, fetchSubmissions, fetchEvents]);

  async function updateStatus(recordId: string, status: "Approved" | "Rejected" | "Pending", justification?: string, comment?: string, email?: string, hoursOverride?: number) {
    setUpdatingId(recordId);
    const patchRes = await fetch("/api/admin/projects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recordId, status, shipJustification: justification, overrideHours: hoursOverride }),
    });
    if (!patchRes.ok) {
      const patchData = await patchRes.json().catch(() => ({}));
      setDmError(`Failed to update status: ${patchData.error || patchRes.statusText}`);
      setUpdatingId(null);
      return;
    }
    let newHistory: DmEntry[] | undefined;
    if (comment && email) {
      const dmRes = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recordId, message: comment, email }),
      });
      const dmData = await dmRes.json();
      if (dmData.history) newHistory = dmData.history;
      if (dmData.slackError) setDmError(`Recorded in history, but Slack DM failed: ${dmData.slackError}`);
      else if (!dmRes.ok) setDmError(dmData.error || "Failed to record DM history");
      else setDmError(null);
    }
    const overrideUpdate = hoursOverride !== undefined ? { overrideHours: hoursOverride } : {};
    setSubmissions((prev) =>
      prev.map((s) => (s.id === recordId ? { ...s, status, ...overrideUpdate, ...(newHistory ? { dm_history: newHistory } : {}) } : s))
    );
    if (newHistory) {
      setSelectedSubmission((prev) => prev && prev.id === recordId ? { ...prev, status, ...overrideUpdate, dm_history: newHistory! } : prev);
    } else {
      setSelectedSubmission((prev) => prev && prev.id === recordId ? { ...prev, status, ...overrideUpdate } : prev);
    }
    setUpdatingId(null);
  }

  async function addEvent() {
    if (!newEvent.title || !newEvent.date || !newEvent.description) return;
    setAdding(true);
    const payload = {
      ...newEvent,
      time: newEvent.time ? formatTime(newEvent.time) : undefined,
      joinUrl: newEvent.joinUrl || undefined,
    };
    const res = await fetch("/api/admin/calendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const created = await res.json();
    if (created.error || !created.id) {
      console.error("Failed to create event:", created.error);
      setAdding(false);
      return;
    }
    setEvents((prev) => [...prev, created].sort((a, b) => (a.date ?? "").localeCompare(b.date ?? "")));
    setNewEvent(EMPTY_EVENT);
    setAdding(false);
  }

  async function deleteEvent(eventId: string) {
    setUpdatingId(eventId);
    await fetch("/api/admin/calendar", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId }),
    });
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    setUpdatingId(null);
  }

  function startEdit(event: CalendarEvent) {
    setEditingId(event.id);
    setEditForm({
      title: event.title,
      date: event.date,
      time: timeToInput(event.time ?? ""),
      description: event.description,
      type: event.type,
      joinUrl: event.joinUrl ?? "",
    });
  }

  async function saveEdit(eventId: string) {
    if (!editForm.title || !editForm.date || !editForm.description) return;
    setUpdatingId(eventId);
    const payload = {
      eventId,
      ...editForm,
      time: editForm.time ? formatTime(editForm.time) : null,
      joinUrl: editForm.joinUrl || null,
    };
    const res = await fetch("/api/admin/calendar", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const updated = await res.json();
    if (!updated.error) {
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? updated : e)).sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""))
      );
    }
    setEditingId(null);
    setUpdatingId(null);
  }

  const filteredSubmissions = submissions
    .filter((s) => statusFilter === "All" || s.status === statusFilter)
    .filter((s) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        s.project?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.displayname?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const order: Record<string, number> = { Pending: 0, Rejected: 1, Approved: 2 };
      return (order[a.status] ?? 3) - (order[b.status] ?? 3);
    });

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
        className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
        style={{
          background: "linear-gradient(180deg, rgba(217,218,248,0.97) 0%, rgba(255,240,253,0.97) 100%)",
          borderBottom: "2px solid #c8caf0",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="flex items-center gap-4">
          <Link
            href="/portal"
            className="text-sm font-semibold px-3 py-1.5 rounded-full transition-opacity hover:opacity-70"
            style={{ background: "#e8eaf8", color: "#5A5C8A", border: "1.5px solid #c0c2e8" }}
          >
            ← Portal
          </Link>
          <h1
            className="text-2xl md:text-3xl font-bold"
            style={{ color: "#5A5C8A" }}
          >
            Admin Dashboard
          </h1>
        </div>
        <span
          className="text-sm font-semibold px-3 py-1.5 rounded-full"
          style={{ background: "#e8eaf8", color: "#7A7CA8", border: "1.5px solid #c0c2e8" }}
        >
          {userName}
        </span>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-3 mb-8">
          {(["projects", "calendar", "leaderboard"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-5 py-2.5 rounded-full font-bold text-base transition-all"
              style={{
                background: tab === t ? "linear-gradient(180deg, #8FB1F0 0%, #6D90E3 100%)" : "#e8eaf8",
                color: tab === t ? "white" : "#5A5C8A",
                border: `2px solid ${tab === t ? "#6D90E3" : "#c0c2e8"}`,
                boxShadow: tab === t ? "0 2px 8px rgba(109,144,227,0.4)" : "none",
              }}
            >
              {t === "projects" ? "Project Review" : t === "calendar" ? "Calendar" : "Leaderboard"}
            </button>
          ))}
          {isSuperAdmin && (
            <Link
              href="/portal/admin/fulfillment"
              className="px-5 py-2.5 rounded-full font-bold text-base transition-all"
              style={{ background: "#e8eaf8", color: "#5A5C8A", border: "2px solid #c0c2e8" }}
            >
              Fulfillment
            </Link>
          )}
        </div>

        {/* PROJECT REVIEW TAB */}
        {tab === "projects" && !selectedSubmission && (
          <div>
            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by project, description, or user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-full text-sm outline-none"
                style={{
                  background: "rgba(255,255,255,0.9)",
                  border: "1.5px solid #c0c2e8",
                  color: "#4a4c78",
                  fontFamily: FONT,
                }}
              />
            </div>

            {/* Filter */}
            <div className="flex gap-2 mb-6 flex-wrap items-center">
              {["All", "Pending", "Approved", "Rejected"].map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
                  style={{
                    background: statusFilter === f ? "#5A5C8A" : "#e8eaf8",
                    color: statusFilter === f ? "white" : "#5A5C8A",
                    border: `1.5px solid ${statusFilter === f ? "#5A5C8A" : "#c0c2e8"}`,
                  }}
                >
                  {f}
                  {f !== "All" && (
                    <span
                      className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full"
                      style={{
                        background: statusFilter === f ? "rgba(255,255,255,0.25)" : "#d0d2f0",
                        color: statusFilter === f ? "white" : "#7A7CA8",
                      }}
                    >
                      {submissions.filter((s) => s.status === f).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {loading ? (
              <p style={{ color: "#7A7CA8" }} className="text-center py-16">
                Loading submissions...
              </p>
            ) : filteredSubmissions.length === 0 ? (
              <p style={{ color: "#7A7CA8" }} className="text-center py-16">
                No submissions found.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSubmissions.map((s) => {
                  const statusStyle = STATUS_STYLES[s.status] ?? STATUS_STYLES.Pending;
                  const screenshots = Array.isArray(s.screenshot) ? s.screenshot : [];
                  const thumb = screenshots[0]?.thumbnails?.large?.url ?? screenshots[0]?.url;
                  const dmCount = s.dm_history?.length ?? 0;

                  return (
                    <button
                      key={s.id}
                      onClick={() => { setSelectedSubmission(s); setApproveFormOpen(false); setRejectFormOpen(false); setShipJustification(""); setUserComment(""); setRejectMessage(""); }}
                      className="rounded-2xl text-left w-full transition-all hover:scale-[1.01] hover:shadow-lg overflow-hidden"
                      style={{
                        background: "rgba(255,255,255,0.92)",
                        border: `2px solid ${statusStyle.border}`,
                        boxShadow: "0 2px 8px rgba(108,110,160,0.08)",
                      }}
                    >
                      {thumb ? (
                        <img src={thumb} alt="screenshot" className="w-full h-36 object-cover" style={{ borderBottom: `1.5px solid ${statusStyle.border}` }} />
                      ) : (
                        <div className="w-full h-36 flex items-center justify-center" style={{ background: "#eef0fc", borderBottom: `1.5px solid ${statusStyle.border}` }}>
                          <span style={{ color: "#b0b2d8", fontSize: "32px" }}>🖼</span>
                        </div>
                      )}
                      <div className="p-4">
                        <p className="font-bold text-base mb-0.5 truncate" style={{ color: "#4a4c78" }}>
                          {s.project || "Untitled"}
                        </p>
                        <p className="text-sm truncate mb-3" style={{ color: "#9a9cca" }}>
                          by {s.displayname || s.email}
                        </p>
                        <div className="flex flex-wrap gap-1.5 items-center">
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ background: statusStyle.bg, color: statusStyle.color, border: `1.5px solid ${statusStyle.border}` }}>
                            {STATUS_LABEL[s.status] ?? s.status}
                          </span>
                          {(s.overrideHours ?? s.hours) > 0 && (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "#eef2ff", color: "#6D90E3", border: "1.5px solid #c0cef8" }}>
                              {s.overrideHours ?? s.hours}h
                            </span>
                          )}
                          {dmCount > 0 && (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full ml-auto" style={{ background: "#f0f1fb", color: "#7A7CA8", border: "1.5px solid #c0c2e8" }}>
                              {dmCount} msg{dmCount !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* REVIEW DETAIL VIEW */}
        {tab === "projects" && selectedSubmission && (() => {
          const s = selectedSubmission;
          const statusStyle = STATUS_STYLES[s.status] ?? STATUS_STYLES.Pending;
          const screenshots = Array.isArray(s.screenshot) ? s.screenshot : [];

          return (
            <div>
              {/* Back + title bar */}
              <div
                className="flex items-center gap-3 mb-6 p-4 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.92)", border: `2px solid ${statusStyle.border}`, boxShadow: "0 2px 8px rgba(108,110,160,0.08)" }}
              >
                <button
                  onClick={() => { setSelectedSubmission(null); setRejectFormOpen(false); setRejectMessage(""); }}
                  className="px-3 py-1.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-70 flex-shrink-0"
                  style={{ background: "#e8eaf8", color: "#5A5C8A", border: "1.5px solid #c0c2e8" }}
                >
                  ← Back
                </button>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold truncate" style={{ color: "#4a4c78" }}>{s.project || "Untitled"}</h2>
                  <p className="text-xs" style={{ color: "#9a9cca" }}>by {s.displayname || s.email}</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full flex-shrink-0" style={{ background: statusStyle.bg, color: statusStyle.color, border: `1.5px solid ${statusStyle.border}` }}>
                  {STATUS_LABEL[s.status] ?? s.status}
                </span>
              </div>

              <div className="flex flex-col lg:flex-row gap-5 items-start">
                {/* LEFT — always-open guidelines */}
                <div className="w-full lg:w-80 flex-shrink-0 lg:sticky lg:top-24">
                  <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.92)", border: "2px solid #dde0f8", boxShadow: "0 2px 8px rgba(108,110,160,0.08)" }}>
                    <p className="font-bold mb-4" style={{ color: "#5A5C8A", fontSize: "15px" }}>Review Guidelines</p>
                    {REVIEW_GUIDELINES.map((section) => (
                      <div key={section.title} className="mb-5 last:mb-0">
                        <p className="font-bold uppercase tracking-wide mb-3" style={{ color: "#9a9cca", fontSize: "11px" }}>{section.title}</p>
                        {section.items.map((item) => (
                          <div key={item.label} className="mb-4 last:mb-0">
                            <p className="font-bold mb-1" style={{ color: "#5A5C8A", fontSize: "13px" }}>{item.label}</p>
                            <p className="leading-relaxed" style={{ color: "#6c6ea0", fontSize: "13px" }}>{item.text}</p>
                          </div>
                        ))}
                      </div>
                    ))}
                    <div className="mt-4 rounded-xl px-4 py-3" style={{ background: "#fff0f0", border: "2px solid #f8b4b4" }}>
                      <p className="font-black leading-snug" style={{ color: "#c0392b", fontSize: "14px" }}>⚠️ REJECT A PROJECT IF THE PRONOUNS ARE HE/HIM</p>
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex-1 min-w-0 flex flex-col gap-4">

                  {/* Submitter + meta */}
                  <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.92)", border: "2px solid #dde0f8", boxShadow: "0 2px 8px rgba(108,110,160,0.08)" }}>
                    <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: "#9a9cca" }}>Submitter</p>
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <p className="font-bold text-base" style={{ color: "#4a4c78" }}>{s.displayname || "—"}</p>
                      {s.pronouns && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "#f0f1fb", color: "#7A7CA8", border: "1.5px solid #c0c2e8" }}>
                          {s.pronouns}
                        </span>
                      )}
                      <p className="text-sm" style={{ color: "#9a9cca" }}>{s.email}</p>
                      {s.slack_id && (
                        <a href={`https://hackclub.slack.com/team/${s.slack_id}`} target="_blank" rel="noopener noreferrer"
                          className="text-xs font-semibold px-2.5 py-1 rounded-full transition-opacity hover:opacity-70 ml-auto"
                          style={{ background: "#e8f5e9", color: "#2d8a55", border: "1.5px solid #86d8a8" }}>
                          Open in Slack ↗
                        </a>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {(s.overrideHours ?? s.hours) > 0 && (
                        <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ background: "#eef2ff", color: "#6D90E3", border: "1.5px solid #c0cef8" }}>
                          {s.overrideHours ? `${s.overrideHours}h override` : `${s.hours}h reported`}
                        </span>
                      )}
                      {s.ysws && (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "#fff8e1", color: "#9a7a10", border: "1.5px solid #f0d070" }}>
                          YSWS: {s.ysws}
                        </span>
                      )}
                      {s.challenge && (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "#fce8ed", color: "#c03535", border: "1.5px solid #f0a0a0" }}>
                          {s.challenge}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Project details */}
                  <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.92)", border: "2px solid #dde0f8", boxShadow: "0 2px 8px rgba(108,110,160,0.08)" }}>
                    <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: "#9a9cca" }}>Project</p>
                    {s.description && (
                      <p className="text-sm mb-4 leading-relaxed" style={{ color: "#6c6ea0" }}>{s.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {s.playableUrl && (
                        <a href={s.playableUrl} target="_blank" rel="noopener noreferrer"
                          className="text-sm px-4 py-2 rounded-full font-bold transition-opacity hover:opacity-70"
                          style={{ background: "linear-gradient(180deg, #8FB1F0 0%, #6D90E3 100%)", color: "white", border: "2px solid #6D90E3" }}>
                          Live Demo ↗
                        </a>
                      )}
                      {s.codeUrl && (
                        <a href={s.codeUrl} target="_blank" rel="noopener noreferrer"
                          className="text-sm px-4 py-2 rounded-full font-bold transition-opacity hover:opacity-70"
                          style={{ background: "#e8eaf8", color: "#5A5C8A", border: "2px solid #c0c2e8" }}>
                          View Code ↗
                        </a>
                      )}
                    </div>
                    {screenshots.length > 0 && (
                      <div className="flex flex-wrap gap-3">
                        {screenshots.map((sc: any, i: number) => {
                          const url = sc?.thumbnails?.large?.url ?? sc?.url;
                          return url ? (
                            <img key={i} src={url} alt={`screenshot ${i + 1}`} className="rounded-xl object-cover w-full"
                              style={{ maxWidth: "480px", height: "220px", border: "1.5px solid #dde0f8" }} />
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>

                  {/* Decision */}
                  <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.92)", border: `2px solid ${statusStyle.border}`, boxShadow: `0 2px 12px ${statusStyle.border}40` }}>
                    <div className="flex items-center gap-2 mb-4">
                      <p className="text-sm font-bold" style={{ color: "#4a4c78" }}>Decision</p>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ background: statusStyle.bg, color: statusStyle.color, border: `1.5px solid ${statusStyle.border}` }}>
                        Current: {STATUS_LABEL[s.status] ?? s.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-1">
                      {(["Approved", "Rejected", "Pending"] as const).map((st) => {
                        const style = STATUS_STYLES[st];
                        const isActive = s.status === st;
                        const isFormOpen = (st === "Approved" && approveFormOpen) || (st === "Rejected" && rejectFormOpen);
                        return (
                          <button
                            key={st}
                            disabled={isActive || updatingId === s.id}
                            onClick={async () => {
                              if (st === "Approved") {
                                setApproveFormOpen((prev) => !prev);
                                setRejectFormOpen(false);
                                setShipJustification("");
                                setOverrideHours("");
                                setUserComment("Your project has been approved for Sleepover! Congrats on shipping 🎉 You'll receive your reward once the YSWS system processes your submission.");
                              } else if (st === "Rejected") {
                                setRejectFormOpen((prev) => !prev);
                                setApproveFormOpen(false);
                                setRejectMessage("");
                              } else {
                                await updateStatus(s.id, st);
                                setApproveFormOpen(false);
                                setRejectFormOpen(false);
                              }
                            }}
                            className="py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50 flex flex-col items-center gap-1"
                            style={{
                              background: isActive ? style.bg : isFormOpen ? style.bg : "#f4f5fc",
                              color: isActive || isFormOpen ? style.color : "#7A7CA8",
                              border: `2px solid ${isActive || isFormOpen ? style.border : "#dde0f8"}`,
                              boxShadow: isActive ? `0 2px 10px ${style.border}60` : "none",
                            }}
                          >
                            <span style={{ fontSize: "18px" }}>
                              {st === "Approved" ? "✓" : st === "Rejected" ? "↩" : "⏸"}
                            </span>
                            <span>{updatingId === s.id ? "…" : STATUS_LABEL[st]}</span>
                          </button>
                        );
                      })}
                    </div>

                    {rejectFormOpen && (
                      <div className="mt-4 flex flex-col gap-3 rounded-xl p-4" style={{ background: "#fdf4f4", border: "1.5px solid #f0a0a0" }}>
                        <label className="text-sm font-bold" style={{ color: "#c03535" }}>What needs to change?</label>
                        <p className="text-xs -mt-2" style={{ color: "#b0b2d8" }}>This message will be sent to the user via Slack DM</p>
                        <textarea
                          value={rejectMessage}
                          onChange={(e) => setRejectMessage(e.target.value)}
                          placeholder="Explain what changes are needed for resubmission…"
                          rows={4}
                          className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none"
                          style={{ background: "#ffffff", border: "1.5px solid #f0a0a0", color: "#4a4c78", fontFamily: FONT }}
                        />
                        <div className="flex gap-2">
                          <button
                            disabled={!rejectMessage.trim() || updatingId === s.id}
                            onClick={async () => {
                              await updateStatus(s.id, "Rejected", undefined, rejectMessage.trim(), s.email);
                              setRejectFormOpen(false);
                              setRejectMessage("");
                            }}
                            className="px-5 py-2 rounded-full font-bold text-sm transition-all disabled:opacity-40"
                            style={{ background: "linear-gradient(180deg, #f0a0a0 0%, #c03535 100%)", color: "white", border: "2px solid #c03535", boxShadow: "0 2px 8px rgba(192,53,53,0.3)" }}
                          >
                            {updatingId === s.id ? "Saving..." : "Send DM & Mark Changes Needed"}
                          </button>
                          <button onClick={() => { setRejectFormOpen(false); setRejectMessage(""); }}
                            className="px-4 py-2 rounded-full font-bold text-sm"
                            style={{ background: "#f0f1fb", color: "#5A5C8A", border: "2px solid #c0c2e8" }}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {approveFormOpen && (
                      <div className="mt-4 flex flex-col gap-3 rounded-xl p-4" style={{ background: "#f0faf4", border: "1.5px solid #86d8a8" }}>
                        <div>
                          <label className="text-sm font-bold block mb-1" style={{ color: "#2d8a55" }}>Approved hours <span style={{ color: "#9a9cca", fontWeight: 400 }}>(Fill this in with the amount of hours that the project is approved for)</span></label>
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={overrideHours}
                            onChange={(e) => setOverrideHours(e.target.value)}
                            placeholder={s.overrideHours ? `Current override: ${s.overrideHours}h` : `Submitted: ${s.hours || "—"}`}
                            className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                            style={{ background: "#ffffff", border: "1.5px solid #86d8a8", color: "#4a4c78", fontFamily: FONT }}
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-sm font-bold" style={{ color: "#2d8a55" }}>Override hour justification <span style={{ color: "#c03535" }}>*</span></label>
                            <button
                              type="button"
                              onClick={() => setShipJustification("Reviewed by @Reem. This project seems to have taken -- hours and the author had -- commits total, first one made --. The project made with ---. AI is not used/AI is less than 30%")}
                              className="text-xs px-2.5 py-1 rounded-full font-semibold transition-opacity hover:opacity-70"
                              style={{ background: "#e8f5e9", color: "#2d8a55", border: "1.5px solid #86d8a8" }}
                            >
                              Copy template
                            </button>
                          </div>
                          <p className="text-xs mb-2" style={{ color: "#b0b2d8" }}>Internal note — not shown to the user</p>
                          <textarea
                            value={shipJustification}
                            onChange={(e) => setShipJustification(e.target.value)}
                            placeholder="Reviewed by @Reem. This project seems to have taken -- hours and the author had -- commits total, first one made --. The project made with ---. AI is not used/AI is less than 30% "
                            rows={3}
                            className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none"
                            style={{ background: "#ffffff", border: "1.5px solid #86d8a8", color: "#4a4c78", fontFamily: FONT }}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-bold block mb-1" style={{ color: "#2d8a55" }}>Message for user <span style={{ color: "#9a9cca", fontWeight: 400 }}>(optional)</span></label>
                          <textarea
                            value={userComment}
                            onChange={(e) => setUserComment(e.target.value)}
                            placeholder="Congrats message or notes to send via Slack DM…"
                            rows={3}
                            className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none"
                            style={{ background: "#ffffff", border: "1.5px solid #86d8a8", color: "#4a4c78", fontFamily: FONT }}
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            disabled={!shipJustification.trim() || updatingId === s.id}
                            onClick={async () => {
                              const hrs = overrideHours ? parseFloat(overrideHours) : undefined;
                              await updateStatus(s.id, "Approved", shipJustification.trim(), userComment.trim() || undefined, s.email, hrs);
                              setApproveFormOpen(false);
                              setShipJustification("");
                              setOverrideHours("");
                              setUserComment("");
                            }}
                            className="px-5 py-2 rounded-full font-bold text-sm transition-all disabled:opacity-40"
                            style={{ background: "linear-gradient(180deg, #86d8a8 0%, #2d8a55 100%)", color: "white", border: "2px solid #2d8a55", boxShadow: "0 2px 8px rgba(45,138,85,0.3)" }}
                          >
                            {updatingId === s.id ? "Saving..." : "Confirm Approval"}
                          </button>
                          <button onClick={() => { setApproveFormOpen(false); setShipJustification(""); setOverrideHours(""); setUserComment(""); }}
                            className="px-4 py-2 rounded-full font-bold text-sm"
                            style={{ background: "#f0f1fb", color: "#5A5C8A", border: "2px solid #c0c2e8" }}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Review History */}
                  <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.92)", border: "2px solid #dde0f8", boxShadow: "0 2px 8px rgba(108,110,160,0.08)" }}>
                    {dmError && (
                      <div className="mb-3 px-3 py-2 rounded-xl text-xs font-semibold" style={{ background: "#fff3cd", color: "#856404", border: "1.5px solid #ffc107" }}>
                        {dmError}
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-bold" style={{ color: "#4a4c78" }}>Review History</p>
                      {s.dm_history.length > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#eef2ff", color: "#6D90E3", border: "1.5px solid #c0cef8" }}>
                          {s.dm_history.length} message{s.dm_history.length !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    {s.dm_history.length === 0 ? (
                      <p className="text-sm text-center py-6" style={{ color: "#b0b2d8" }}>No messages sent to this user yet.</p>
                    ) : (
                      <div className="flex flex-col gap-2 mb-4">
                        {s.dm_history.map((entry, i) => (
                          <div key={i} className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#e8eaf8", color: "#5A5C8A", border: "1.5px solid #c0c2e8" }}>
                                {entry.sender}
                              </span>
                              <span className="text-xs" style={{ color: "#b0b2d8" }}>
                                {new Date(entry.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })} at {new Date(entry.timestamp).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                              </span>
                            </div>
                            <div className="rounded-xl rounded-tl-sm px-4 py-3 ml-2" style={{ background: "#f4f5fc", border: "1.5px solid #e0e2f4" }}>
                              <p className="text-sm leading-relaxed" style={{ color: "#4a4c78", whiteSpace: "pre-wrap" }}>{entry.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-3 pt-4" style={{ borderTop: "1.5px solid #eef0fb" }}>
                      <p className="text-xs font-bold mb-2" style={{ color: "#9a9cca" }}>Send a new message</p>
                      <textarea
                        value={dmMessage}
                        onChange={(e) => setDmMessage(e.target.value)}
                        placeholder={`Message ${s.displayname || s.email} on Slack…`}
                        rows={3}
                        className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none mb-2"
                        style={{ background: "#f4f5fc", border: "1.5px solid #c0c2e8", color: "#4a4c78", fontFamily: FONT }}
                      />
                      <button
                        disabled={sendingDm || !dmMessage.trim()}
                        onClick={async () => {
                          setSendingDm(true);
                          const res = await fetch("/api/admin/projects", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ recordId: s.id, message: dmMessage.trim(), email: s.email }),
                          });
                          const data = await res.json();
                          if (data.history) {
                            setSelectedSubmission((prev) => prev ? { ...prev, dm_history: data.history } : prev);
                            setSubmissions((prev) => prev.map((sub) => sub.id === s.id ? { ...sub, dm_history: data.history } : sub));
                            setDmMessage("");
                          }
                          setSendingDm(false);
                        }}
                        className="px-5 py-2 rounded-full font-bold text-sm transition-all disabled:opacity-40"
                        style={{ background: "linear-gradient(180deg, #8FB1F0 0%, #6D90E3 100%)", color: "white", border: "2px solid #6D90E3", boxShadow: "0 2px 8px rgba(109,144,227,0.4)" }}
                      >
                        {sendingDm ? "Sending…" : "Send DM"}
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          );
        })()}

        {/* CALENDAR TAB */}
        {tab === "calendar" && (
          <div>
            {/* Add event form */}
            <div
              className="rounded-2xl p-5 mb-8"
              style={{
                background: "rgba(255,255,255,0.9)",
                border: "2px solid #dde0f8",
                boxShadow: "0 2px 8px rgba(108,110,160,0.08)",
              }}
            >
              <h2 className="text-lg font-bold mb-4" style={{ color: "#4a4c78" }}>
                Add Event
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <input
                  placeholder="Title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent((p) => ({ ...p, title: e.target.value }))}
                  className="px-3 py-2 rounded-xl text-sm font-semibold outline-none"
                  style={{
                    background: "#f2f3fc",
                    border: "1.5px solid #c0c2e8",
                    color: "#4a4c78",
                    fontFamily: FONT,
                  }}
                />
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent((p) => ({ ...p, date: e.target.value }))}
                  className="px-3 py-2 rounded-xl text-sm font-semibold outline-none"
                  style={{
                    background: "#f2f3fc",
                    border: "1.5px solid #c0c2e8",
                    color: "#4a4c78",
                    fontFamily: FONT,
                  }}
                />
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent((p) => ({ ...p, time: e.target.value }))}
                  className="px-3 py-2 rounded-xl text-sm font-semibold outline-none"
                  style={{
                    background: "#f2f3fc",
                    border: "1.5px solid #c0c2e8",
                    color: newEvent.time ? "#4a4c78" : "#9a9cca",
                    fontFamily: FONT,
                  }}
                />
                <select
                  value={newEvent.type}
                  onChange={(e) =>
                    setNewEvent((p) => ({ ...p, type: e.target.value as EventType }))
                  }
                  className="px-3 py-2 rounded-xl text-sm font-semibold outline-none"
                  style={{
                    background: "#f2f3fc",
                    border: "1.5px solid #c0c2e8",
                    color: "#4a4c78",
                    fontFamily: FONT,
                  }}
                >
                  <option value="huddle">Huddle</option>
                  <option value="challenge">Challenge</option>
                  <option value="social">Social</option>
                  <option value="deadline">Deadline</option>
                </select>
              </div>
              <textarea
                placeholder="Description"
                value={newEvent.description}
                onChange={(e) => setNewEvent((p) => ({ ...p, description: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 rounded-xl text-sm font-semibold outline-none resize-none mb-3"
                style={{
                  background: "#f2f3fc",
                  border: "1.5px solid #c0c2e8",
                  color: "#4a4c78",
                  fontFamily: FONT,
                }}
              />
              <input
                placeholder="Join link (Zoom, Slack huddle, etc.) — optional"
                value={newEvent.joinUrl}
                onChange={(e) => setNewEvent((p) => ({ ...p, joinUrl: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl text-sm font-semibold outline-none mb-3"
                style={{
                  background: "#f2f3fc",
                  border: "1.5px solid #c0c2e8",
                  color: "#4a4c78",
                  fontFamily: FONT,
                }}
              />
              <button
                onClick={addEvent}
                disabled={adding || !newEvent.title || !newEvent.date || !newEvent.description}
                className="px-5 py-2 rounded-full font-bold text-sm transition-all disabled:opacity-40"
                style={{
                  background: "linear-gradient(180deg, #8FB1F0 0%, #6D90E3 100%)",
                  color: "white",
                  border: "2px solid #6D90E3",
                  boxShadow: "0 2px 8px rgba(109,144,227,0.4)",
                }}
              >
                {adding ? "Adding..." : "Add Event"}
              </button>
            </div>

            {/* Events list */}
            {loading ? (
              <p style={{ color: "#7A7CA8" }} className="text-center py-16">
                Loading events...
              </p>
            ) : events.length === 0 ? (
              <p style={{ color: "#7A7CA8" }} className="text-center py-16">
                No calendar events yet.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {events.map((event, i) => {
                  const style = TYPE_STYLES[event.type] ?? TYPE_STYLES.huddle;
                  const isEditing = editingId === event.id;

                  if (isEditing) {
                    return (
                      <div
                        key={event.id ?? `event-${i}`}
                        className="rounded-2xl p-5"
                        style={{ background: "rgba(255,255,255,0.95)", border: "2px solid #9AC6F6" }}
                      >
                        <p className="text-xs font-bold mb-3" style={{ color: "#6D90E3" }}>Editing event</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                          <input
                            placeholder="Title"
                            value={editForm.title}
                            onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
                            className="px-3 py-2 rounded-xl text-sm font-semibold outline-none"
                            style={{ background: "#f2f3fc", border: "1.5px solid #c0c2e8", color: "#4a4c78", fontFamily: FONT }}
                          />
                          <input
                            type="date"
                            value={editForm.date}
                            onChange={(e) => setEditForm((p) => ({ ...p, date: e.target.value }))}
                            className="px-3 py-2 rounded-xl text-sm font-semibold outline-none"
                            style={{ background: "#f2f3fc", border: "1.5px solid #c0c2e8", color: "#4a4c78", fontFamily: FONT }}
                          />
                          <input
                            type="time"
                            value={editForm.time}
                            onChange={(e) => setEditForm((p) => ({ ...p, time: e.target.value }))}
                            className="px-3 py-2 rounded-xl text-sm font-semibold outline-none"
                            style={{ background: "#f2f3fc", border: "1.5px solid #c0c2e8", color: editForm.time ? "#4a4c78" : "#9a9cca", fontFamily: FONT }}
                          />
                          <select
                            value={editForm.type}
                            onChange={(e) => setEditForm((p) => ({ ...p, type: e.target.value as EventType }))}
                            className="px-3 py-2 rounded-xl text-sm font-semibold outline-none"
                            style={{ background: "#f2f3fc", border: "1.5px solid #c0c2e8", color: "#4a4c78", fontFamily: FONT }}
                          >
                            <option value="huddle">Huddle</option>
                            <option value="challenge">Challenge</option>
                            <option value="social">Social</option>
                            <option value="deadline">Deadline</option>
                          </select>
                        </div>
                        <textarea
                          placeholder="Description"
                          value={editForm.description}
                          onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                          rows={3}
                          className="w-full px-3 py-2 rounded-xl text-sm font-semibold outline-none resize-y mb-3"
                          style={{ background: "#f2f3fc", border: "1.5px solid #c0c2e8", color: "#4a4c78", fontFamily: FONT }}
                        />
                        <input
                          placeholder="Join link — optional"
                          value={editForm.joinUrl}
                          onChange={(e) => setEditForm((p) => ({ ...p, joinUrl: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl text-sm font-semibold outline-none mb-3"
                          style={{ background: "#f2f3fc", border: "1.5px solid #c0c2e8", color: "#4a4c78", fontFamily: FONT }}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdit(event.id)}
                            disabled={updatingId === event.id || !editForm.title || !editForm.date || !editForm.description}
                            className="px-4 py-1.5 rounded-full text-xs font-bold transition-all disabled:opacity-40"
                            style={{ background: "linear-gradient(180deg, #8FB1F0 0%, #6D90E3 100%)", color: "white", border: "2px solid #6D90E3" }}
                          >
                            {updatingId === event.id ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-4 py-1.5 rounded-full text-xs font-bold transition-all"
                            style={{ background: "#e8eaf8", color: "#5A5C8A", border: "1.5px solid #c0c2e8" }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={event.id ?? `event-${i}`}
                      className="rounded-2xl p-4 flex items-start gap-4"
                      style={{
                        background: style.bg,
                        border: `2px solid ${style.border}`,
                      }}
                    >
                      {/* Date chip */}
                      <div
                        className="rounded-xl px-3 py-1.5 text-center flex-shrink-0"
                        style={{
                          background: "white",
                          border: `1.5px solid ${style.border}`,
                          minWidth: "52px",
                        }}
                      >
                        <p
                          className="text-[10px] font-bold uppercase tracking-wide leading-none"
                          style={{ color: style.dot }}
                        >
                          {(() => { const d = parseDate(event.date); return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-US", { month: "short" }); })()}
                        </p>
                        <p
                          className="text-xl font-bold leading-tight"
                          style={{ color: "#4a4c78" }}
                        >
                          {(() => { const d = parseDate(event.date); return isNaN(d.getTime()) ? "?" : String(d.getDate()); })()}
                        </p>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold" style={{ color: "#4a4c78" }}>
                            {event.title}
                          </h3>
                          <span
                            className="text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{
                              background: "white",
                              color: style.dot,
                              border: `1.5px solid ${style.border}`,
                            }}
                          >
                            {style.label}
                          </span>
                        </div>
                        {event.time && (
                          <p className="text-xs mt-0.5" style={{ color: "#7472A0" }}>
                            {formatTime(event.time)}
                          </p>
                        )}
                        {event.joinUrl && (
                          <a
                            href={event.joinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold mt-1 inline-block transition-opacity hover:opacity-70"
                            style={{ color: "#6D90E3" }}
                          >
                            Join ↗
                          </a>
                        )}
                        <p className="text-sm mt-1" style={{ color: "#6c6ea0", whiteSpace: "pre-wrap" }}>
                          {event.description}
                        </p>
                      </div>

                      {/* Edit + Delete */}
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <button
                          onClick={() => startEdit(event)}
                          disabled={!!editingId || updatingId === event.id}
                          className="px-3 py-1.5 rounded-full text-xs font-bold transition-all disabled:opacity-40"
                          style={{
                            background: "#e8eaf8",
                            color: "#5A5C8A",
                            border: "1.5px solid #c0c2e8",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteEvent(event.id)}
                          disabled={updatingId === event.id}
                          className="px-3 py-1.5 rounded-full text-xs font-bold transition-all disabled:opacity-40"
                          style={{
                            background: "#fde8e8",
                            color: "#c03535",
                            border: "1.5px solid #f0a0a0",
                          }}
                        >
                          {updatingId === event.id ? "..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* LEADERBOARD TAB */}
        {tab === "leaderboard" && (() => {
          const now = new Date();
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

          // Build reviewer counts
          const allTimeCounts: Record<string, number> = {};
          const weeklyCounts: Record<string, number> = {};
          const waitTimes: number[] = [];

          for (const sub of submissions) {
            if (!sub.dm_history || sub.dm_history.length === 0) continue;
            // First DM = first review action; compute wait from createdAt
            if (sub.createdAt) {
              const created = new Date(sub.createdAt).getTime();
              const firstDm = new Date(sub.dm_history[0].timestamp).getTime();
              if (!isNaN(created) && !isNaN(firstDm) && firstDm >= created) {
                waitTimes.push(firstDm - created);
              }
            }
            for (const dm of sub.dm_history) {
              if (!dm.sender) continue;
              allTimeCounts[dm.sender] = (allTimeCounts[dm.sender] ?? 0) + 1;
              const dmDate = new Date(dm.timestamp);
              if (dmDate >= weekAgo) {
                weeklyCounts[dm.sender] = (weeklyCounts[dm.sender] ?? 0) + 1;
              }
            }
          }

          const toRanked = (counts: Record<string, number>) =>
            Object.entries(counts).sort((a, b) => b[1] - a[1]);

          const allTimeRanked = toRanked(allTimeCounts);
          const weeklyRanked = toRanked(weeklyCounts);

          const avgWaitMs = waitTimes.length > 0 ? waitTimes.reduce((a, b) => a + b, 0) / waitTimes.length : null;
          const fmtWait = (ms: number) => {
            const hrs = ms / (1000 * 60 * 60);
            if (hrs < 24) return `${hrs.toFixed(1)}h`;
            return `${(hrs / 24).toFixed(1)}d`;
          };

          const medalColors = ["#FFD700", "#C0C0C0", "#CD7F32"];

          const LeaderboardTable = ({ ranked, title }: { ranked: [string, number][]; title: string }) => (
            <div className="rounded-2xl p-5 mb-6" style={{ background: "rgba(255,255,255,0.9)", border: "2px solid #dde0f8", boxShadow: "0 2px 8px rgba(108,110,160,0.08)" }}>
              <h2 className="text-lg font-bold mb-4" style={{ color: "#4a4c78" }}>{title}</h2>
              {ranked.length === 0 ? (
                <p className="text-sm" style={{ color: "#8a8cb0" }}>No data yet.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {ranked.map(([sender, count], i) => (
                    <div key={sender} className="flex items-center gap-3 rounded-xl px-4 py-2.5" style={{ background: i === 0 ? "#fffbe6" : "#f4f5fb", border: `1.5px solid ${i === 0 ? "#f0d070" : "#e0e2f4"}` }}>
                      <span className="text-lg font-bold w-6 text-center" style={{ color: medalColors[i] ?? "#8a8cb0" }}>
                        {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
                      </span>
                      <span className="flex-1 font-semibold text-sm" style={{ color: "#4a4c78" }}>@{sender}</span>
                      <span className="text-sm font-bold" style={{ color: "#6D90E3" }}>{count} review{count !== 1 ? "s" : ""}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );

          return (
            <div>
              {avgWaitMs !== null && (
                <div className="rounded-2xl p-5 mb-6 flex items-center gap-4" style={{ background: "rgba(255,255,255,0.9)", border: "2px solid #dde0f8", boxShadow: "0 2px 8px rgba(108,110,160,0.08)" }}>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "#8a8cb0" }}>Average Wait Time</p>
                    <p className="text-3xl font-bold" style={{ color: "#6D90E3" }}>{fmtWait(avgWaitMs)}</p>
                    <p className="text-xs mt-1" style={{ color: "#8a8cb0" }}>From submission to first DM ({waitTimes.length} measured)</p>
                  </div>
                </div>
              )}
              <LeaderboardTable ranked={weeklyRanked} title="Weekly Leaderboard (Last 7 Days)" />
              <LeaderboardTable ranked={allTimeRanked} title="All-Time Leaderboard" />
            </div>
          );
        })()}
      </main>
    </div>
  );
}
