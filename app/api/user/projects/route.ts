import { getHackProjects } from "@/lib/hackatime";
import { getUserFromId } from "@/lib/airtable";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";

export async function GET() {
  try {
    const session = await requireAuth();

    // Get slack_id from Airtable user record
    const userRecord = await getUserFromId(session.userId);
    const slackId = userRecord?.get("slack_id") as string || "";

    const projects = await getHackProjects(slackId);

    console.log("API PROJECTS =", projects)

    return NextResponse.json({
      projects: projects ?? []
    });
  } catch (error) {
    return NextResponse.json({ projects: [] });
  }
}
