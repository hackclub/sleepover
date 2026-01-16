"use server"

import { getProjectById, shipProjectTable } from "@/lib/airtable"
import { requireAuth } from "@/lib/session";
import { triggerPyramidSync } from "@/lib/pyramidSync";

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
    ysws: formData.get("ysws") === "true",
    challenge: formData.get("challenge") === "true",
  }

  // Input validation
  if (info.playable_url.length > 2048) {
    throw new Error("Playable URL too long (max 2048 characters)")
  }
  if (info.code_url.length > 2048) {
    throw new Error("Code URL too long (max 2048 characters)")
  }
  if (info.github.length > 100) {
    throw new Error("GitHub username too long (max 100 characters)")
  }
  if (info.firstName.length > 100 || info.lastName.length > 100) {
    throw new Error("Name fields too long (max 100 characters)")
  }
  if (info.address1.length > 200 || info.address2.length > 200) {
    throw new Error("Address fields too long (max 200 characters)")
  }

  await shipProjectTable(projectId, info)

  // Trigger pyramid sync in background (non-blocking)
  triggerPyramidSync(userId)

  return { success: true }
}