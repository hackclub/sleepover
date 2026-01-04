"use server"

import { getProjectsTable } from "@/lib/airtable" // or Airtable init here
import { getUserInfo } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function createProject(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim()
  const desc = String(formData.get("desc") ?? "").trim()
  const project = String(formData.get("project") ?? "").trim()

  const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");
    var id = "ident!30fJ8d"
  
    if (sessionCookie) {
      const value = sessionCookie?.value
      const userinfo = await getUserInfo(JSON.parse(value).accessToken)
      id = userinfo.identity.id
    }

  if (!name) return { error: "Name is required" }

  const table = await getProjectsTable()
  const record = await table.create({
    userid: id,
    name: name,
    desc: desc,
    hackatime_name: project
  })

  console.log("record =", record)
  redirect("/portal")
}