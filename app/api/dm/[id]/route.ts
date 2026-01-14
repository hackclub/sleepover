import { NextRequest, NextResponse } from "next/server";
import { getUserFromId } from "@/lib/airtable";
import { projectReviewMessage } from "@/lib/bot";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const INTERNAL_DM_TOKEN = process.env.INTERNAL_DM_TOKEN;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!INTERNAL_DM_TOKEN || authHeader !== `Bearer ${INTERNAL_DM_TOKEN}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clientIp = getClientIp(request);
    const rateLimitResult = rateLimit(`dm:${clientIp}`, {
      windowMs: 60000,
      maxRequests: 20,
    });

    if (!rateLimitResult.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const { id } = await params;

    const body = await request.json();
    const dmMsg = body?.dmMsg;

    if (!dmMsg || typeof dmMsg !== "string") {
      return NextResponse.json({ error: "dmMsg is required" }, { status: 400 });
    }

    if (dmMsg.length > 2000) {
      return NextResponse.json(
        { error: "dmMsg exceeds maximum length of 2000 characters" },
        { status: 400 }
      );
    }

    const user = await getUserFromId(id);
    const email = user?.get?.("email");

    if (!email) {
      return NextResponse.json({ error: "User email not found" }, { status: 404 });
    }

    await projectReviewMessage(email, dmMsg);

    return NextResponse.json({ message: "good" }, { status: 200 });
  } catch (error) {
    console.error("error", error);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
}
