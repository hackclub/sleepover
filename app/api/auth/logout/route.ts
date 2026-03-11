import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function POST() {
  const session = await getSession();
  session.destroy();

  return NextResponse.json({ success: true });
}

export async function GET() {
  return NextResponse.json(
    { error: "Use POST method for logout" },
    { status: 405 }
  );
}
