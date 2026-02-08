import { getProjectById, updateProjectName, getUserFromId, updateProjectHours } from "@/lib/airtable";
import { getMultipleProjectHours, parseHackatimeProjects } from "@/lib/hackatime";
import { requireAuth } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const project = await getProjectById(id);

    // Verify the project belongs to the user
    if (project.userid !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch fresh hours from Hackatime and update Airtable
    const userRecord = await getUserFromId(session.userId);
    const slackId = userRecord?.slack_id || "";

    if (slackId && project.hackatime_name) {
      try {
        // Parse hackatime_name as JSON array (or single string for backward compat)
        const hackatimeProjects = parseHackatimeProjects(project.hackatime_name);
        const freshHours = await getMultipleProjectHours(slackId, hackatimeProjects);

        // Update the hours in Airtable so they're persisted
        await updateProjectHours(id, freshHours);

        // Update the project object to return fresh hours
        project.hours = freshHours;
      } catch (error) {
        console.error(`Error fetching hours for ${project.hackatime_name}:`, error);
        // Continue with stale hours if fetch fails
      }
    }

    return NextResponse.json({ project });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error fetching project:", error);
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const project = await getProjectById(id);

    // Verify the project belongs to the user
    if (project.userid !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }

    const updatedProject = await updateProjectName(id, name.trim());

    return NextResponse.json({
      project: {
        id: updatedProject.id,
        name: updatedProject.get("name"),
      }
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}
