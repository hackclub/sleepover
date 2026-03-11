import { NextResponse } from "next/server";
import { getCurrency } from "@/lib/airtable";
import { requireAuth } from "@/lib/session";

export async function GET() {
  try {
    const session = await requireAuth();
    const balance = await getCurrency(session.userId);

    return NextResponse.json({
      balance: balance ?? 0
    });
  } catch (error) {
    return NextResponse.json({ balance: 0 }, { status: 401 });
  }
}
