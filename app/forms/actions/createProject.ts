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

  // Get slack_id from Airtable user record
  const userRecord = await getUserFromId(id);
  const slackid = userRecord?.get("slack_id") as string || "";

  if (!name) return { error: "Name is required" }

  const hours = await getProjectHours(slackid, project)

  const table = await getProjectsTable()
  const record = await table.create({
    userid: id,
    name: name,
    desc: desc,
    hackatime_name: project,
    hours: hours,
  })

  revalidateTag("projects", "max");

  console.log("record =", record)
  redirect("/portal")
}