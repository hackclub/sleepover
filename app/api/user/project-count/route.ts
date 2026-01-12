import { NextResponse } from "next/server";
import { getUsersProjects } from "@/lib/airtable";
import { requireAuth } from "@/lib/session";

export async function GET() {
  try {
    const session = await requireAuth();
    const projects = await getUsersProjects(session.userId);

    return NextResponse.json({ count: projects?.length ?? 0 });
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
