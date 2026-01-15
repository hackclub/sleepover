"use server"

import { updateProjectHackatime, getProjectById } from "@/lib/airtable"
import { revalidateTag } from "next/cache"
import { requireAuth } from "@/lib/session"

export async function updateProjectHackatimeAction(projectId: string, hackatime_name: string) {
  const session = await requireAuth()
  const userId = session.userId

  if (!projectId) {
    throw new Error("Project ID is required")
  }

  const project = await getProjectById(projectId)
  if (project.userid !== userId) {
    throw new Error("Not authorized to update this project")
  }

  if (!hackatime_name || !hackatime_name.trim()) {
    throw new Error("Hackatime project name cannot be empty")
  }

  const record = await updateProjectHackatime(projectId, hackatime_name.trim())

  revalidateTag("projects", "max")

  return {
    success: true,
    project: {
      id: record.id,
      hackatime_name: record.get("hackatime_name") as string,
    }
  }
}
