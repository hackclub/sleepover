"use server"

import { getProjectsTable, getProjectById } from "@/lib/airtable"
import { revalidatePath, revalidateTag } from "next/cache"
import { requireAuth } from "@/lib/session"

export async function deleteProject(projectId: string) {
  if (!projectId) return { error: "Project ID is required" }

  const session = await requireAuth()
  const userId = session.userId

  const project = await getProjectById(projectId)
  if (!project) {
    return { error: "Project not found" }
  }

  if (project.userid !== userId) {
    throw new Error("Not authorized to delete this project")
  }

  try {
    const table = getProjectsTable()
    await table.destroy(projectId)
    
    revalidateTag("projects", "max")
    revalidatePath("/portal")
    return { success: true }
  } catch (error) {
    console.error("Delete project error:", error)
    throw error
  }
}
