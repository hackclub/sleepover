import { NextResponse } from "next/server";
import { getUserHoursCached } from "@/lib/airtable";
import { requireAuth } from "@/lib/session";

export async function GET() {
  try {
    const session = await requireAuth();
    const hours = await getUserHoursCached(session.userId);

    return NextResponse.json({ hours: hours ?? 0 });
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
