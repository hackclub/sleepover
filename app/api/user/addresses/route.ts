import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserAddresses } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const sessionData = JSON.parse(sessionCookie.value);
    const accessToken = sessionData.accessToken;

    if (!accessToken) {
      return NextResponse.json({ error: "No access token" }, { status: 401 });
    }

    const addresses = await getUserAddresses(accessToken);
    console.log("Addresses from Hack Club auth:", addresses);

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 });
  }
}
