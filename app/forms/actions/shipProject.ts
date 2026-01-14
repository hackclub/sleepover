"use server"

import { getProjectById, shipProjectTable } from "@/lib/airtable"
import { requireAuth } from "@/lib/session";

export async function shipProject(formData: FormData, projectId: string) {
  const session = await requireAuth()
  const userId = session.userId

  if (!projectId) {
    throw new Error("Project ID is required")
  }

  const project = await getProjectById(projectId)
  if (!project) {
    throw new Error("Project not found")
  }

  if (project.userid !== userId) {
    throw new Error("Not authorized to ship this project")
  }

  const info = {
    playable_url: String(formData.get("playable") ?? ""),
    code_url: String(formData.get("code") ?? ""),
    screenshot: formData.get("screenshot") as File,
    github: String(formData.get("github") ?? ""),
    firstName: String(formData.get("firstName") ?? ""),
    lastName: String(formData.get("lastName") ?? ""),
    email: String(formData.get("email") ?? ""),
    birthdate: String(formData.get("birthdate") ?? ""),
    address1: String(formData.get("address1") ?? ""),
    address2: String(formData.get("address2") ?? ""),
    city: String(formData.get("city") ?? ""),
    state: String(formData.get("state") ?? ""),
    zip: String(formData.get("zip") ?? ""),
    country: String(formData.get("country") ?? ""),
  }

  await shipProjectTable(projectId, info)

  return { success: true }
}