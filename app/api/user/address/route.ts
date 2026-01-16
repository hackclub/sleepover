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
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      firstName: airtableUser.firstName,
      lastName: airtableUser.lastName,
      email: airtableUser.email || user.email,
      birthdate: airtableUser.birthdate,
      address1: airtableUser.address1,
      address2: airtableUser.address2,
      city: airtableUser.city,
      state: airtableUser.state,
      country: airtableUser.country,
      zip: airtableUser.zip,
    });
  } catch (error) {
    console.error("Error fetching user address:", error);
    return NextResponse.json({ error: "Failed to fetch address" }, { status: 500 });
  }
}
