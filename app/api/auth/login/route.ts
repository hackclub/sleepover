import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAuthorizationUrl, generateOAuthState } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const clientIp = getClientIp(request);
  const rateLimitResult = rateLimit(`login:${clientIp}`, {
    windowMs: 60000,
    maxRequests: 10,
  });

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
  }

  const cookieStore = await cookies();
  const state = generateOAuthState();

  cookieStore.set("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 300, // 5 minutes
    path: "/",
  });

  // Capture utm_source and store in cookie
  const utmSource = request.nextUrl.searchParams.get("utm_source");
  if (utmSource) {
    cookieStore.set("utm_source", utmSource, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 300, // 5 minutes
      path: "/",
    });
  }

  const authUrl = getAuthorizationUrl(state);
  return NextResponse.redirect(authUrl);
}
