import { NextResponse } from "next/server";
import { getGallery } from "@/lib/airtable";

export async function GET() {
  try {
    const records = await getGallery();

    // Only return public fields needed for the gallery display
    // Excludes all personal information (addresses, emails, birthdates, etc.)
    const sanitizedData = records.map((record) => ({
      id: record.id,
      fields: {
        Project: record.get("Project") as string,
        Screenshot: record.get("Screenshot") as any,
        displayname: record.get("displayname") as string,
        Description: record.get("Description") as string,
      }
    }));

    return NextResponse.json({ data: sanitizedData });
  } catch (error) {
    console.error("Failed to fetch gallery items:", error);
    return NextResponse.json({ error: "Failed to fetch gallery items" }, { status: 500 });
  }
}
