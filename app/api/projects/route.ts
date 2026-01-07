import { getUsersProjects } from "@/lib/airtable";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const session = await getSession();

  if (!session.isLoggedIn || !session.userId) {
    return NextResponse.json({ projects: [] }, { status: 401 });
  }

  const projects = await getUsersProjects(session.userId);

  return NextResponse.json({ projects: projects ?? [] });
}
