"use server"

import { getProjectsTable, getUserFromId } from "@/lib/airtable" // or Airtable init here
import { getMultipleProjectHours } from "@/lib/hackatime";
import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";
import { requireAuth } from "@/lib/session";

export async function createProject(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim()
  const desc = String(formData.get("desc") ?? "").trim()

  // Get all selected projects (could be multiple)
  const projects = formData.getAll("projects[]").map(p => String(p).trim()).filter(p => p.length > 0)

  const session = await requireAuth();
  const id = session.userId;

  // Input validation
  if (!name) return { error: "Name is required" }
  if (name.length > 200) return { error: "Name too long (max 200 characters)" }
  if (desc.length > 5000) return { error: "Description too long (max 5000 characters)" }
  if (projects.length === 0) return { error: "At least one Hackatime project is required" }

  // Get slack_id from Airtable user record
  const userRecord = await getUserFromId(id);
  const slackid = userRecord?.slack_id || "";

  // Calculate combined hours from all selected projects
  const hours = await getMultipleProjectHours(slackid, projects)

  // Store projects as JSON array
  const hackatimeNameJson = JSON.stringify(projects)

  const table = await getProjectsTable()
  await table.create({
    userid: id,
    name: name,
    desc: desc,
    hackatime_name: hackatimeNameJson,
    hours: hours,
  })

  revalidateTag("projects", "max");

  redirect("/portal")
}