import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { isSuperAdminUser, getAllFulfillmentOrders, updateFulfillmentStatus, updateFulfillmentOwner, appendFulfillmentDmHistory, getUserFromId } from "@/lib/airtable";
import { projectReviewMessage } from "@/lib/bot";

const RECORD_ID_RE = /^rec[A-Za-z0-9]{14}$/;
const ALLOWED_STATUSES = new Set(["Unfulfilled", "Fulfilled", "Refunded"]);

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) return null;
  const admin = await isSuperAdminUser(user.userId);
  if (!admin) return null;
  return user;
}

export async function GET() {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const orders = await getAllFulfillmentOrders();
    return NextResponse.json(orders);
  } catch (err) {
    console.error("Failed to fetch fulfillment orders:", err);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { email, message, orderId } = await request.json();
    if (!email || !message) {
      return NextResponse.json({ error: "Missing email or message" }, { status: 400 });
    }
    if (typeof message !== "string" || message.length > 4000) {
      return NextResponse.json({ error: "Message too long" }, { status: 400 });
    }
    if (orderId && !RECORD_ID_RE.test(orderId)) {
      return NextResponse.json({ error: "Invalid orderId" }, { status: 400 });
    }
    const adminInfo = await getUserFromId(user.userId);
    const adminName = adminInfo?.slack_display_name || user.name || user.email || "admin";
    await projectReviewMessage(email, message);
    let newEntry: { ts: string; sender: string; message: string } | null = null;
    if (orderId) {
      newEntry = await appendFulfillmentDmHistory(orderId, adminName, message);
    }
    return NextResponse.json({ success: true, newEntry });
  } catch (err) {
    console.error("Failed to send fulfillment DM:", err);
    return NextResponse.json({ error: "Failed to send DM" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await request.json();
    const { recordId } = body;
    if (!recordId || !RECORD_ID_RE.test(recordId)) {
      return NextResponse.json({ error: "Invalid recordId" }, { status: 400 });
    }
    if ("status" in body) {
      if (!ALLOWED_STATUSES.has(body.status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      await updateFulfillmentStatus(recordId, body.status);
    } else if ("owner" in body) {
      const owner = body.owner === null ? null : String(body.owner).slice(0, 100);
      await updateFulfillmentOwner(recordId, owner);
    } else {
      return NextResponse.json({ error: "Missing status or owner" }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to update fulfillment:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
