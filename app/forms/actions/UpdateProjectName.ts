"use server"

import { updateProjectName } from "@/lib/airtable"
import { revalidateTag } from "next/cache"

export async function updateProjectNameAction(projectId: string, name: string) {
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
