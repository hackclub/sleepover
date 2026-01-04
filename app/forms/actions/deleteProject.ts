"use server"

import { getProjectsTable } from "@/lib/airtable"
import { revalidatePath } from "next/cache"

export async function deleteProject(projectId: string) {
  if (!projectId) return { error: "Project ID is required" }

  const table = await getProjectsTable()
  await table.destroy(projectId)

  revalidatePath("/portal")
  return { success: true }
}
