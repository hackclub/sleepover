import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { getUserFromId } from "@/lib/airtable";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    console.log("Fetching address for userId:", user.userId);
    const airtableUser = await getUserFromId(user.userId);
    
    if (!airtableUser) {
      console.log("No user found in Airtable for userId:", user.userId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Helper to get first element if array, or value directly
    const getField = (field: unknown): string => {
      if (Array.isArray(field)) {
        return String(field[0] || "");
      }
      return String(field || "");
    };

    const address1 = getField(airtableUser.get("Address Line 1 (from Hack Clubbers)"));
    const address2 = getField(airtableUser.get("Address Line 2 (from Hack Clubbers)"));
    const city = getField(airtableUser.get("City (from Hack Clubbers)"));
    const state = getField(airtableUser.get("State (from Hack Clubbers)"));
    const country = getField(airtableUser.get("Country (from Hack Clubbers)"));
    const zip = getField(airtableUser.get("ZIP (from Hack Clubbers)"));

    console.log("Address data:", { address1, address2, city, state, country, zip });

    return NextResponse.json({
      firstName: getField(airtableUser.get("First Name")),
      lastName: getField(airtableUser.get("Last Name")),
      email: airtableUser.get("email") || user.email,
      birthdate: getField(airtableUser.get("Birthday (from Hack Clubbers)")),
      address1,
      address2,
      city,
      state,
      country,
      zip,
    });
  } catch (error) {
    console.error("Error fetching user address:", error);
    return NextResponse.json({ error: "Failed to fetch address" }, { status: 500 });
  }
}
