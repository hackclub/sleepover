import { NextResponse } from "next/server";
import { getUserOrders } from "@/lib/airtable";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await getUserOrders(user.userId);
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Failed to fetch user orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
