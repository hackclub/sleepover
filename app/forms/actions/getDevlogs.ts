"use server"

import { getProjectDevlogs, getProjectById } from "@/lib/airtable"
import { requireAuth } from "@/lib/session"

export async function getDevlogs(projectId: string) {
  const session = await requireAuth()
  const userId = session.userId

  if (!projectId) {
    throw new Error("Project ID is required")
  }

  const project = await getProjectById(projectId)
  if (project.userid !== userId) {
    throw new Error("Not authorized to view these devlogs")
  }

  const devlogs = await getProjectDevlogs(projectId)
  return devlogs
}
