import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { findUserByEmail, updateUser } from "@/lib/airtable";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { referral_code } = await request.json();
    if (!referral_code) {
      return NextResponse.json({ error: "referral_code required" }, { status: 400 });
    }

    const airtableUser = await findUserByEmail(user.email);
    if (airtableUser) {
      // Only update if referral_code not already set (immutable)
      const currentReferral = airtableUser.get("referral_code");
      if (!currentReferral) {
        await updateUser(airtableUser.id, { referral_code });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Referral code update error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
