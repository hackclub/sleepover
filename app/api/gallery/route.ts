import { NextResponse } from "next/server";
import { getGallery } from "@/lib/airtable";

export async function GET() {
  try {
    const data = await getGallery();
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Failed to fetch gallery items:", error);
    return NextResponse.json({ error: "Failed to fetch gallery items" }, { status: 500 });
  }
}
