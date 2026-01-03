"use server"

import { getProjectsTable, shipProjectTable } from "@/lib/airtable" // or Airtable init here
import { getUserInfo } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function shipProject(formData: FormData, project: string) {

  shipProjectTable(project)

  redirect("/portal")
}