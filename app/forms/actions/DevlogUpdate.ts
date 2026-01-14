"use server"

import { updateDevlogEntry, getDevlogsTable, getProjectById } from "@/lib/airtable"
import { revalidateTag } from "next/cache"
import { requireAuth } from "@/lib/session"

export async function updateDevlog(devlogId: string, text: string) {
  const session = await requireAuth()
  const userId = session.userId

  if (!devlogId) {
    throw new Error("Devlog ID is required")
  }

  const devlog = await getDevlogsTable().find(devlogId)
  const projectIds = devlog.get("project") as string[]
  if (!projectIds || projectIds.length === 0) {
    throw new Error("Devlog not found")
  }

  const project = await getProjectById(projectIds[0])
  if (project.userid !== userId) {
    throw new Error("Not authorized to update this devlog")
  }

  await updateDevlogEntry(devlogId, text)

  revalidateTag("projects", "max")

  return { success: true }
}
