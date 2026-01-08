import { getSingularProject, getUsersProjects, updateProjectHours, getAllUsers } from "@/lib/airtable";
import { getProjectHours } from "@/lib/hackatime";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get all registered users
    const allUsers = await getAllUsers();
    console.log(`Processing ${allUsers.length} users`);

    let successCount = 0;
    let errorCount = 0;

    // Process each user
    for (const user of allUsers) {
      try {
        const id = user.id;
        const slack_id = user.slack_id;

        if (!id || !slack_id) {
          console.log(`Skipping user with missing id or slack_id:`, user);
          continue;
        }

        const projects = await getUsersProjects(id);
        console.log(`User ${id} has ${projects.length} projects`);

        for (const project of projects) {
          try {
            const found = await getSingularProject(id, project.name);
            const hours = await getProjectHours(slack_id, project.hackatime_name);
            await updateProjectHours(found.id, hours);
            console.log(`Updated ${project.name} for user ${id}: ${hours} hours`);
          } catch (projectError) {
            console.error(`Error updating project ${project.name} for user ${id}:`, projectError);
          }
        }

        successCount++;
      } catch (userError) {
        console.error(`Error processing user ${user.id}:`, userError);
        errorCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${allUsers.length} users`,
      successCount,
      errorCount,
    });
  } catch (error) {
    console.error("Error in update route:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
