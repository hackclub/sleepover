import { getHackProjects, isHackatime } from "@/lib/hackatime";
import { getUserFromId } from "@/lib/airtable";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";

export async function GET() {
  try {
    const session = await requireAuth();

    // Get slack_id from Airtable user record
    const userRecord = await getUserFromId(session.userId);
    const slackId = userRecord?.slack_id || "";

    const hasHackatime = await isHackatime(slackId);
    const projects = hasHackatime ? await getHackProjects(slackId) : [];

    return NextResponse.json({
      projects: projects ?? [],
      hasHackatime
    });
  } catch (error) {
    return NextResponse.json({ projects: [], hasHackatime: false });
  }
}
