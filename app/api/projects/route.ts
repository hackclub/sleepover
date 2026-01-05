import { getProjectsCached } from "@/lib/airtable";
import { getUserInfo } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(): Promise<Response> {
  const cookieStore = await cookies(); // <-- no await
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) {
    return NextResponse.json({ projects: [] }, { status: 401 });
  }

  const { accessToken } = JSON.parse(sessionCookie.value);
  const userinfo = await getUserInfo(accessToken);

  if (!userinfo?.identity?.id) {
    return NextResponse.json({ projects: [] }, { status: 401 });
  }

  const projects = await getProjectsCached(userinfo.identity.id);

  return NextResponse.json({ projects: projects ?? [] });
}
