"use server"

import { createDevlogEntry } from "@/lib/airtable"
import { redirect } from "next/navigation"
import { revalidateTag } from "next/cache"

export async function createDevlog(formData: FormData, projectId: string) {
  console.log(formData.get("date") as string)

  const date = (formData.get("date") as string).slice(0, 10);
  const text = formData.get("text") as string

  const record = await createDevlogEntry(projectId, date, text)

  console.log("Created devlog:", record)

  revalidateTag("projects", "max")

  redirect("/portal")
}
