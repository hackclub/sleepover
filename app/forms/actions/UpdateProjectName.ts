"use server"

import { updateProjectName, getProjectById } from "@/lib/airtable"
import { revalidateTag } from "next/cache"
import { requireAuth } from "@/lib/session"

export async function updateProjectNameAction(projectId: string, name: string) {
  const session = await requireAuth()
  const userId = session.userId

  if (!projectId) {
    throw new Error("Project ID is required")
  }

  const project = await getProjectById(projectId)
  if (project.userid !== userId) {
    throw new Error("Not authorized to update this project")
  }

  if (!name || !name.trim()) {
    throw new Error("Project name cannot be empty")
  }

  const record = await updateProjectName(projectId, name.trim())

  revalidateTag("projects", "max")

  return {
    success: true,
    project: {
      id: record.id,
      name: record.get("name") as string,
    }
  }
}
