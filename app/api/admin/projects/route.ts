import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { isAdminUser, getAllSubmissions, updateSubmissionStatus, appendSubmissionDm } from "@/lib/airtable";
import { projectReviewMessage } from "@/lib/bot";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) return null;
  const admin = await isAdminUser(user.userId);
  if (!admin) return null;
  return user;
}

export async function GET() {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const submissions = await getAllSubmissions();
    return NextResponse.json(submissions);
  } catch (err) {
    console.error("Failed to fetch submissions:", err);
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { recordId, status, shipJustification, overrideHours } = await request.json();
    if (!recordId || !["Approved", "Rejected", "Pending"].includes(status)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    await updateSubmissionStatus(recordId, status, shipJustification, overrideHours ? Number(overrideHours) : undefined);
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Failed to update submission:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { recordId, message, email } = await request.json();
    if (!recordId || !message || !email) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    let slackError: string | undefined;
    try {
      await projectReviewMessage(email, message);
    } catch (slackErr) {
      console.error("Slack DM failed (still recording in history):", slackErr);
      slackError = slackErr instanceof Error ? slackErr.message : "Slack delivery failed";
    }

    const entry = {
      sender: user.name || user.email || "Admin",
      message,
      timestamp: new Date().toISOString(),
    };
    const history = await appendSubmissionDm(recordId, entry);

    return NextResponse.json({ success: true, history, slackError });
  } catch (err) {
    console.error("Failed to send DM:", err);
    return NextResponse.json({ error: "Failed to send DM" }, { status: 500 });
  }
}
