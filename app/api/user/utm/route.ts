import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { findUserByEmail, updateUser } from "@/lib/airtable";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { utm_source } = await request.json();
    if (!utm_source) {
      return NextResponse.json({ error: "utm_source required" }, { status: 400 });
    }

    const airtableUser = await findUserByEmail(user.email);
    if (airtableUser) {
      // Only update if utm_source not already set
      const currentUtm = airtableUser.get("utm_source");
      if (!currentUtm) {
        await updateUser(airtableUser.id, { utm_source });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("UTM update error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
