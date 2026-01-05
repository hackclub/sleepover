import { getUserHoursCached } from "@/lib/airtable";
import { getUserInfo } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) {
    return Response.json({ projects: [] });
  }

  const { accessToken } = JSON.parse(sessionCookie.value);
  const userinfo = await getUserInfo(accessToken);
  const userId = userinfo.identity.id;

  const hours = await getUserHoursCached(userId);

  return Response.json({ hours });
}