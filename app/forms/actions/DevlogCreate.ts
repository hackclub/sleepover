"use server"

import { createDevlogEntry, getProjectById } from "@/lib/airtable"
import { redirect } from "next/navigation"
import { revalidateTag } from "next/cache"
import { requireAuth } from "@/lib/session"

export async function createDevlog(formData: FormData, projectId: string) {
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
    throw new Error("Not authorized to add devlogs to this project")
  }

  const rawDate = formData.get("date") as string | null
  const text = (formData.get("text") as string | null) ?? ""

  if (!rawDate) {
    throw new Error("Date is required")
  }

  const date = rawDate.slice(0, 10)

  const record = await createDevlogEntry(projectId, date, text)

  console.log("Created devlog:", record)

  revalidateTag("projects", "max")

  redirect("/portal")
}
