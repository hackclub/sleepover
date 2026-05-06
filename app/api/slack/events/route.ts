export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { appendIncomingDmBySlackId } from "@/lib/airtable";

function verifySlackSignature(signingSecret: string, body: string, timestamp: string, signature: string): boolean {
  try {
    if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
    const hmac = `v0=${crypto.createHmac("sha256", signingSecret).update(`v0:${timestamp}:${body}`).digest("hex")}`;
    const a = Buffer.from(hmac);
    const b = Buffer.from(signature);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const signingSecret = process.env.SLACK_SIGNING_SECRET;
  if (!signingSecret) {
    console.error("SLACK_SIGNING_SECRET is not set — rejecting all Slack events");
    return new NextResponse("Service Unavailable", { status: 503 });
  }

  let body: string;
  let payload: Record<string, unknown>;

  try {
    body = await request.text();
    payload = JSON.parse(body);
  } catch {
    return new NextResponse("Bad Request", { status: 400 });
  }

  // Verify signature for ALL requests including url_verification
  const timestamp = request.headers.get("x-slack-request-timestamp") ?? "";
  const signature = request.headers.get("x-slack-signature") ?? "";
  if (!verifySlackSignature(signingSecret, body, timestamp, signature)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // URL verification challenge (after signature check)
  if (payload.type === "url_verification") {
    return new NextResponse(payload.challenge as string, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  if (payload.type !== "event_callback") {
    return NextResponse.json({ ok: true });
  }

  const event = payload.event as Record<string, unknown>;

  // Only handle DMs, skip bot messages, edits, deletes
  if (
    event.type !== "message" ||
    event.channel_type !== "im" ||
    event.bot_id ||
    event.subtype
  ) {
    return NextResponse.json({ ok: true });
  }

  const slackUserId = event.user as string;
  const text = ((event.text as string) || "").slice(0, 4000);

  if (slackUserId && text.trim()) {
    appendIncomingDmBySlackId(slackUserId, slackUserId, text).catch(console.error);
  }

  return NextResponse.json({ ok: true });
}
