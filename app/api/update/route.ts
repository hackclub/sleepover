import { getSingularProject, getUsersProjects, updateProjectHours, getUserFromId } from "@/lib/airtable";
import { getProjectHours } from "@/lib/hackatime";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";

export async function GET() {
  try {
    const session = await requireAuth();
    const id = session.userId;

    // Get slack_id from Airtable user record
    const userRecord = await getUserFromId(id);
    const slack_id = userRecord?.get("slack_id") as string || "";

    const projects = await getUsersProjects(id)
    console.log("projects =", projects)

    for (const project of projects) {
      console.log(project)
      const found = await getSingularProject(id, project.name);

      await updateProjectHours(found.id, await getProjectHours(slack_id, project.hackatime_name))
    }

    return NextResponse.json("good");
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
