import { getSingularProject, getUsersProjects, updateProjectHours, getAllUsers } from "@/lib/airtable";
import { getProjectHours } from "@/lib/hackatime";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { triggerPyramidSync } from "@/lib/pyramidSync";

const UPDATE_JOB_TOKEN = process.env.UPDATE_JOB_TOKEN;

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!UPDATE_JOB_TOKEN || authHeader !== `Bearer ${UPDATE_JOB_TOKEN}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clientIp = getClientIp(request);
    const rateLimitResult = rateLimit(`update-job:${clientIp}`, {
      windowMs: 10 * 60 * 1000,
      maxRequests: 1,
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. This job can only run once per 10 minutes." },
        { status: 429 }
      );
    }

    const allUsers = await getAllUsers();

    let successCount = 0;
    let errorCount = 0;

    var count = 0;

    for (const user of allUsers) {
      try {
        const id = user.id;
        const slack_id = user.slack_id;

        if (!id || !slack_id) {
          continue;
        }

        const projects = await getUsersProjects(id);

        for (const project of projects) {
          try {
            const found = await getSingularProject(id, project.name);
            if (!found) continue;
            const hours = await getProjectHours(slack_id, project.hackatime_name);
            await updateProjectHours(found.id, hours);
            count++;
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

    // Trigger pyramid sync in background after hours are updated
    triggerPyramidSync();

    return NextResponse.json({
      success: true,
      message: `Processed ${allUsers.length} users and ${count} projects`,
      successCount,
      errorCount,
    });
  } catch (error) {
    console.error("Error in update route:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
