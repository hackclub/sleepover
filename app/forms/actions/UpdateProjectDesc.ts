"use server"

import { updateProjectDesc, getProjectById } from "@/lib/airtable"
import { revalidateTag } from "next/cache"
import { requireAuth } from "@/lib/session"

export async function updateProjectDescAction(projectId: string, desc: string) {
  const session = await requireAuth()
  const userId = session.userId

  if (!projectId) {
    throw new Error("Project ID is required")
  }

  const project = await getProjectById(projectId)
  if (project.userid !== userId) {
    throw new Error("Not authorized to update this project")
  }

  if (!desc || !desc.trim()) {
    throw new Error("Project description cannot be empty")
  }

  const record = await updateProjectDesc(projectId, desc.trim())

  revalidateTag("projects", "max")

  return {
    success: true,
    project: {
      id: record.id,
      desc: record.get("desc") as string,
    }
  }
}
