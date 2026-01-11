"use server"

import { updateProjectHackatime } from "@/lib/airtable"
import { revalidateTag } from "next/cache"

export async function updateProjectHackatimeAction(projectId: string, hackatime_name: string) {
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
