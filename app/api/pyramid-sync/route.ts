import { getAllUsersWithReferralCode, getUsersProjects, upsertPyramidRecord } from "@/lib/airtable";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const UPDATE_JOB_TOKEN = process.env.UPDATE_JOB_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!UPDATE_JOB_TOKEN || authHeader !== `Bearer ${UPDATE_JOB_TOKEN}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clientIp = getClientIp(request);
    const rateLimitResult = rateLimit(`pyramid-sync:${clientIp}`, {
      windowMs: 10 * 60 * 1000,
      maxRequests: 1,
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. This job can only run once per 10 minutes." },
        { status: 429 }
      );
    }

    const allUsers = await getAllUsersWithReferralCode();
    console.log(`Processing ${allUsers.length} users with referral codes`);

    let successCount = 0;
    let errorCount = 0;

    for (const user of allUsers) {
      try {
        const { id, email, referral_code, verification_status } = user;

        if (!email || !referral_code) {
          console.log(`Skipping user with missing email or referral_code:`, user);
          continue;
        }

        // Get all projects for the user
        const projects = await getUsersProjects(id);

        // Calculate total hours
        let totalHours = 0;
        for (const project of projects) {
          totalHours += Number(project.hours) || 0;
        }

        // Count shipped projects
        const shippedProjects = projects.filter(p => p.status === "Shipped").length;

        // Upsert to pyramid table
        await upsertPyramidRecord({
          email,
          hours: totalHours,
          projects_shipped: shippedProjects,
          idv_status: verification_status || "",
          referral_code,
        });

        console.log(`Synced pyramid data for user ${email}: ${totalHours} hours, ${shippedProjects} shipped`);
        successCount++;
      } catch (userError) {
        console.error(`Error processing user ${user.email}:`, userError);
        errorCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${allUsers.length} users with referral codes`,
      successCount,
      errorCount,
    });
  } catch (error) {
    console.error("Error in pyramid sync route:", error);
    return NextResponse.json({ error: "Failed to sync pyramid table" }, { status: 500 });
  }
}
