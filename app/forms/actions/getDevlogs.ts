"use server"

import { getProjectDevlogs } from "@/lib/airtable"

export async function getDevlogs(projectId: string) {
  const devlogs = await getProjectDevlogs(projectId)
  return devlogs
}
