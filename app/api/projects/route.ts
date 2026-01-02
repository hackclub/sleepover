import { NextResponse } from "next/server";
import { getUserInfo } from "@/lib/auth";
import { getUsersProjects } from "@/lib/airtable";

export async function GET() {

  const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");
    var projects = {}
  
    if (sessionCookie) {
      const value = sessionCookie?.value
      const userinfo = await getUserInfo(JSON.parse(value).accessToken)
      const id = userinfo.identity.id
      projects = await getUsersProjects(id)
    }

  return NextResponse.json({
    projects: projects
  });
}
