"use server"

import { getProjectsTable, shipProjectTable } from "@/lib/airtable" // or Airtable init here
import { getUserInfo } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function shipProject(formData: FormData, project: string) {

  const info = {
    playable_url: String(formData.get("playable")),
    code_url: String(formData.get("code")),
    screenshot: formData.get("screenshot") as File,
    github: String(formData.get("github")),
    firstName: String(formData.get("firstName")),
    lastName: String(formData.get("lastName")),
    email: String(formData.get("email")),
    birthdate: String(formData.get("birthdate")),
    address1: String(formData.get("address1")),
    address2: String(formData.get("address2")),
    city: String(formData.get("city")),
    state: String(formData.get("state")),
    zip: String(formData.get("zip")),
    country: String(formData.get("country")),
  }

  await shipProjectTable(project, info)

  redirect("/portal")
}