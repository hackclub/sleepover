import { getProjectsCached } from "@/lib/airtable";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET(): Promise<Response> {
  const session = await getSession();

  if (!session.isLoggedIn || !session.userId) {
    return NextResponse.json({ projects: [] }, { status: 401 });
  }

  const projects = await getProjectsCached(session.userId);

  return NextResponse.json({ projects: projects ?? [] });
}
