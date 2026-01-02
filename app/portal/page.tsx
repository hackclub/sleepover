'use server'

import { exchangeCodeForToken, getCurrentUser, getUserInfo } from "@/lib/auth";
import PortalClient from "../components/PortalClient"
import {getUsersProjects} from "@/lib/airtable"

export default async function Portal() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  var id = "ident!30fJ8d"
  var name = ""
  var projects = {}

  if (sessionCookie) {
    const value = sessionCookie?.value
    const userinfo = await getUserInfo(JSON.parse(value).accessToken)
    id = userinfo.identity.id
    name = userinfo.identity.first_name
    console.log(userinfo)

    projects = await getUsersProjects(id)
  }
  
  return <PortalClient name={name} projects={projects}/>;
}