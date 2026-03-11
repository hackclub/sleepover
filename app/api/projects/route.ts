import { getUsersProjects, getUserFromId } from "@/lib/airtable";
import { getMultipleProjectHours, parseHackatimeProjects } from "@/lib/hackatime";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const session = await getSession();

  if (!session.isLoggedIn || !session.userId) {
    return NextResponse.json({ projects: [] }, { status: 401 });
  }

  const projects = await getUsersProjects(session.userId);

  // Get slack_id to fetch fresh hours from Hackatime (filtered to 2026)
  const userRecord = await getUserFromId(session.userId);
  const slackId = userRecord?.slack_id || "";

  // Update hours with fresh data from Hackatime (only hours since Jan 1, 2026)
  const projectsWithFreshHours = await Promise.all(
    (projects ?? []).map(async (project) => {
      if (slackId && project.hackatime_name) {
        try {
          // Parse hackatime_name as JSON array (or single string for backward compat)
          const hackatimeProjects = parseHackatimeProjects(project.hackatime_name);
          const freshHours = await getMultipleProjectHours(slackId, hackatimeProjects);
          return { ...project, hours: freshHours };
        } catch (error) {
          console.error(`Error fetching hours for ${project.hackatime_name}:`, error);
          return project;
        }
      }
      return project;
    })
  );

  return NextResponse.json({ projects: projectsWithFreshHours });
}
