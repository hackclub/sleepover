import { getProjectById, updateProjectName } from "@/lib/airtable";
import { requireAuth } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
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
