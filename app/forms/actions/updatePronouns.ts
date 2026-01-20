"use server"

import { updateUserPronouns } from "@/lib/airtable"
import { requireAuth } from "@/lib/session";

export async function updatePronouns(pronouns: string) {
  const session = await requireAuth();
  const userId = session.userId;

  if (!pronouns) {
    throw new Error("Pronouns are required")
  }

  await updateUserPronouns(userId, pronouns);

  return { success: true };
}
