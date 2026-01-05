"use server"

import { getProjectsTable, shipProjectTable } from "@/lib/airtable" // or Airtable init here
import { getUserInfo } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function shipProject(formData: FormData, project: string) {

  const info = {
    playable_url: String(formData.get("playable")),
    code_url: String(formData.get("code")),
    screenshot: formData.get("screenshot") as File,
  }

  shipProjectTable(project, info)

  redirect("/portal")
}