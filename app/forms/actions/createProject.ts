"use server"

import { getProjectsTable, getUserFromId } from "@/lib/airtable" // or Airtable init here
import { getProjectHours } from "@/lib/hackatime";
import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";
import { requireAuth } from "@/lib/session";

export async function createProject(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim()
  const desc = String(formData.get("desc") ?? "").trim()
  const project = String(formData.get("project") ?? "").trim()

  const session = await requireAuth();
  const id = session.userId;

  // Input validation
  if (!name) return { error: "Name is required" }
  if (name.length > 200) return { error: "Name too long (max 200 characters)" }
  if (desc.length > 5000) return { error: "Description too long (max 5000 characters)" }
  if (project.length > 200) return { error: "Project identifier too long (max 200 characters)" }

  // Get slack_id from Airtable user record
  const userRecord = await getUserFromId(id);
  const slackid = userRecord?.slack_id || "";

  const hours = await getProjectHours(slackid, project)

  const table = await getProjectsTable()
  await table.create({
    userid: id,
    name: name,
    desc: desc,
    hackatime_name: project,
    hours: hours,
  })

  revalidateTag("projects", "max");

  redirect("/portal")
}