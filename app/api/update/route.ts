import { getSingularProject, getUsersProjects, updateProjectHours } from "@/lib/airtable";
import { getUserInfo } from "@/lib/auth";
import { getHackProjects, getProjectHours, getUserStats } from "@/lib/hackatime";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function GET() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");
  
    if (!sessionCookie) return;
  
    const value = sessionCookie.value;
    const accessToken = JSON.parse(value).accessToken;
  
    const userinfo = await getUserInfo(accessToken);
    const id = userinfo.identity.id;
    const slack_id = userinfo.identity.slack_id;

    const projects = await getUsersProjects(id)
    console.log("projects =", projects)

    for (const project of projects) {
      console.log(project)
      const found = await getSingularProject(
        userinfo.identity.id,
        project.name
      );

      updateProjectHours(found.id, await getProjectHours(slack_id, project.hackatime_name))
    }

    return NextResponse.json(
        "good"
      );
  }