import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { rejectCrossOrigin } from "@/lib/security";

export async function GET(request: Request) {
  const crossOriginError = rejectCrossOrigin(request);
  if (crossOriginError) return crossOriginError;

  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user });
}
