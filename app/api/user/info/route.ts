import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getPrimaryAddress, getUserInfo } from "@/lib/auth";
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

    // Get user info and primary address
    const [userInfo, primaryAddress] = await Promise.all([
      getUserInfo(accessToken),
      getPrimaryAddress(accessToken)
    ]);

    const identity = userInfo.identity || userInfo;

    // Combine user info with primary address
    const result = {
      firstName: identity.first_name || "",
      lastName: identity.last_name || "",
      email: identity.email || session.email || "",
      birthday: identity.birthday || "",
      address1: primaryAddress?.line_1 || "",
      address2: primaryAddress?.line_2 || "",
      city: primaryAddress?.city || "",
      state: primaryAddress?.state || "",
      country: primaryAddress?.country || "",
      zip: primaryAddress?.postal_code || "",
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching address:", error);
    return NextResponse.json({ error: "Failed to fetch address" }, { status: 500 });
  }
}
