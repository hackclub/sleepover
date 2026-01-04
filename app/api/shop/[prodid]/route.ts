import { NextResponse } from "next/server";
import { getProductsTable } from "@/lib/airtable";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ prodid: string }> }
) {
  try {
    const { prodid } = await params;
    const record = await getProductsTable().find(prodid);

    if (!record) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: record.id,
      name: record.get("item_friendly_name") as string,
      description: (record.get("description") as string) || undefined,
      price: record.get("price") as number,
      availability: (record.get("availability") as string) || undefined,
      image: (record.get("image") as string) || undefined,
    });
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
