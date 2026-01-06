"use server"

import { updateDevlogEntry } from "@/lib/airtable"
import { revalidateTag } from "next/cache"

export async function updateDevlog(devlogId: string, text: string) {
  await updateDevlogEntry(devlogId, text)

  console.log("Updated devlog:", devlogId)

  revalidateTag("projects", "max")

  return { success: true }
}
