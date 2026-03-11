import { NextResponse } from "next/server";
import { getUserOrders } from "@/lib/airtable";
import { getCurrentUser } from "@/lib/session";
import { rejectCrossOrigin } from "@/lib/security";

export async function GET(request: Request) {
  const crossOriginError = rejectCrossOrigin(request);
  if (crossOriginError) return crossOriginError;

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
