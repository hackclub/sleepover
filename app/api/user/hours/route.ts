import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserInfo } from "@/lib/auth";
import { getUserHoursCached } from "@/lib/airtable";

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) {
    return NextResponse.json({ projects: [] });
  }

  let accessToken: string;
  try {
    ({ accessToken } = JSON.parse(sessionCookie.value));
  } catch {
    return NextResponse.json({ error: "Invalid session cookie" }, { status: 400 });
  }

  const userinfo = await getUserInfo(accessToken);
  const userId = userinfo?.identity?.id;

  if (!userId) {
    return NextResponse.json({ error: "Missing user id" }, { status: 500 });
  }

  const hours = await getUserHoursCached(userId);

  return NextResponse.json({ hours: hours ?? 0 });
}