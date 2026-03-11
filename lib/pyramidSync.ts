import { getAllUsersWithReferralCode, getUsersProjects, upsertPyramidRecord } from "./airtable";

// Simple in-memory throttle to prevent overlapping syncs
let lastSyncTime = 0;
let isSyncing = false;
const SYNC_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes minimum between full syncs

export async function syncPyramidTable(userId?: string) {
  // Prevent overlapping syncs
  if (isSyncing) {
    console.log("[Pyramid Sync] Sync already in progress, skipping");
    return;
  }

  // Throttle full syncs to prevent excessive API calls
  const now = Date.now();
  if (!userId && now - lastSyncTime < SYNC_COOLDOWN_MS) {
    console.log("[Pyramid Sync] Cooldown active, skipping full sync");
    return;
  }

  isSyncing = true;
  try {
    if (userId) {
      // Single user sync (fast)
      await syncSingleUser(userId);
    } else {
      // Full sync
      lastSyncTime = now;
      await syncAllUsers();
    }
  } catch (error) {
    console.error("[Pyramid Sync] Error:", error);
  } finally {
    isSyncing = false;
  }
}

async function syncSingleUser(userId: string) {
  try {
    console.log(`[Pyramid Sync] Syncing user: ${userId}`);

    const allUsers = await getAllUsersWithReferralCode();
    const user = allUsers.find((u) => u.id === userId);

    if (!user) {
      console.log(`[Pyramid Sync] User ${userId} has no referral code, skipping`);
      return;
    }

    const { id, email, referral_code, verification_status } = user;

    if (!email || !referral_code) {
      console.log(`[Pyramid Sync] User ${userId} missing email or referral_code`);
      return;
    }

    const projects = await getUsersProjects(id);
    let totalHours = 0;
    for (const project of projects) {
      totalHours += Number(project.hours) || 0;
    }

    const shippedProjects = projects.filter((p) => p.status === "Shipped").length;

    await upsertPyramidRecord({
      email,
      hours: totalHours,
      projects_shipped: shippedProjects,
      idv_status: verification_status || "",
      referral_code,
    });

    console.log(`[Pyramid Sync] Synced ${email}: ${totalHours}h, ${shippedProjects} shipped`);
  } catch (error) {
    console.error(`[Pyramid Sync] Error syncing user ${userId}:`, error);
  }
}

async function syncAllUsers() {
  try {
    console.log("[Pyramid Sync] Starting full sync");

    const allUsers = await getAllUsersWithReferralCode();
    console.log(`[Pyramid Sync] Processing ${allUsers.length} users with referral codes`);

    let successCount = 0;
    let errorCount = 0;

    for (const user of allUsers) {
      try {
        const { id, email, referral_code, verification_status } = user;

        if (!email || !referral_code) {
          console.log(`[Pyramid Sync] Skipping user with missing email or referral_code:`, user);
          continue;
        }

        const projects = await getUsersProjects(id);
        let totalHours = 0;
        for (const project of projects) {
          totalHours += Number(project.hours) || 0;
        }

        const shippedProjects = projects.filter((p) => p.status === "Shipped").length;

        await upsertPyramidRecord({
          email,
          hours: totalHours,
          projects_shipped: shippedProjects,
          idv_status: verification_status || "",
          referral_code,
        });

        successCount++;
      } catch (userError) {
        console.error(`[Pyramid Sync] Error processing user ${user.email}:`, userError);
        errorCount++;
      }
    }

    console.log(`[Pyramid Sync] Complete: ${successCount} success, ${errorCount} errors`);
  } catch (error) {
    console.error("[Pyramid Sync] Fatal error:", error);
  }
}

// Non-blocking sync (fire-and-forget)
export function triggerPyramidSync(userId?: string) {
  // Don't await - let it run in the background
  syncPyramidTable(userId).catch((err) => {
    console.error("[Pyramid Sync] Background sync failed:", err);
  });
}
