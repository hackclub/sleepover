"use server"

import { updateProjectDesc } from "@/lib/airtable"
import { revalidateTag } from "next/cache"

export async function updateProjectDescAction(projectId: string, desc: string) {
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
