import { NextResponse } from "next/server";
import { getShopItems } from "@/lib/airtable";

export async function GET() {
  try {
    const items = await getShopItems();
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Failed to fetch shop items:", error);
    return NextResponse.json({ error: "Failed to fetch shop items" }, { status: 500 });
  }
}
