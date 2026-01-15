import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getUserAddresses } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const accessToken = session.accessToken;

    if (!accessToken) {
      return NextResponse.json({ error: "No access token" }, { status: 401 });
    }

    const addresses = await getUserAddresses(accessToken);

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 });
  }
}
