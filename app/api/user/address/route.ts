import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getUserAddresses } from "@/lib/auth";
import { rejectCrossOrigin } from "@/lib/security";

export async function GET(request: Request) {
  const crossOriginError = rejectCrossOrigin(request);
  if (crossOriginError) return crossOriginError;

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

    // Return the first address if available, or empty object
    const address = addresses.length > 0 ? addresses[0] : {};

    return NextResponse.json(address);
  } catch (error) {
    console.error("Error fetching address:", error);
    return NextResponse.json({ error: "Failed to fetch address" }, { status: 500 });
  }
}
