"use server"

import { getProjectsTable } from "@/lib/airtable"
import { revalidatePath, revalidateTag } from "next/cache"

export async function deleteProject(projectId: string) {
  if (!projectId) return { error: "Project ID is required" }

  console.log("Attempting to delete project:", projectId)
  
  try {
    const table = getProjectsTable()
    await table.destroy(projectId)
    console.log("Successfully deleted project:", projectId)
    
    revalidateTag("projects")
    revalidatePath("/portal")
    return { success: true }
  } catch (error) {
    console.error("Delete project error:", error)
    throw error
  }
}
