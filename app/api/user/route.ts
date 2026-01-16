import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { getUserFromId } from "@/lib/airtable";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const airtableUser = await getUserFromId(user.userId);

    if (!airtableUser) {
      return NextResponse.json({
        email: user.email,
        name: user.name,
      });
    }

    return NextResponse.json({
      email: user.email,
      name: user.name,
      slack_display_name: airtableUser.slack_display_name || user.name,
      slack_avatar_url: airtableUser.slack_avatar_url || null,
      slack_id: airtableUser.slack_id || null,
    });
  } catch (error) {
    console.error("Error fetching user from Airtable:", error);
    return NextResponse.json({
      email: user.email,
      name: user.name,
    });
  }
}
