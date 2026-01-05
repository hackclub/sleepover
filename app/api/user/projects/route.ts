import { getUserInfo } from "@/lib/auth";
import { getHackProjects } from "@/lib/hackatime";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");
  
    if (!sessionCookie) return null;
  
    const value = sessionCookie.value;
    const accessToken = JSON.parse(value).accessToken;
  
    const userinfo = await getUserInfo(accessToken);
    const slackId = userinfo.identity.slack_id;
  
    const projects = await getHackProjects(slackId);

    console.log("API PROJECTS =", projects)
    
    return NextResponse.json({
      projects: projects ?? []
    });
  }
  