import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken, getUserInfo } from "@/lib/auth";
import { findUserByEmail, createUser, updateUser } from "@/lib/airtable";
import { getSlackUserInfo } from "@/lib/slack";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

function getBaseUrl(request: NextRequest): string {
  // Use canonical URL from environment or derive from request URL
  if (process.env.PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL!;
  }
  // Fallback: use request origin (safer than headers)
  return request.nextUrl.origin;
}

export async function GET(request: NextRequest) {
  const clientIp = getClientIp(request);
  const rateLimitResult = rateLimit(`callback:${clientIp}`, {
    windowMs: 60000,
    maxRequests: 10,
  });

  const baseUrl = getBaseUrl(request);

  if (!rateLimitResult.success) {
    return NextResponse.redirect(new URL("/?error=rate_limited", baseUrl));
  }

  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const returnedState = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/?error=auth_failed", baseUrl));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/?error=no_code", baseUrl));
  }

  // Validate OAuth state to prevent CSRF
  const cookieStore = await cookies();
  const storedState = cookieStore.get("oauth_state")?.value;
  cookieStore.delete("oauth_state");

  // Retrieve utm_source from cookie
  const utmSource = cookieStore.get("utm_source")?.value || "";
  if (utmSource) {
    cookieStore.delete("utm_source");
  }

  if (!returnedState || !storedState || returnedState !== storedState) {
    return NextResponse.redirect(new URL("/?error=invalid_state", baseUrl));
  }

  try {
    const tokenData = await exchangeCodeForToken(code);
    const response = await getUserInfo(tokenData.access_token);
    const userInfo = response.identity;

    const email = userInfo.primary_email;
    const name = `${userInfo.first_name || ""} ${userInfo.last_name || ""}`.trim();

    // Fetch Slack profile info if slack_id exists
    const slackInfo = userInfo.slack_id ? await getSlackUserInfo(userInfo.slack_id) : null;

    console.log("Looking up user by email:", email);
    const existingUser = await findUserByEmail(email);
    console.log("findUserByEmail result:", existingUser ? `Found: ${existingUser.id}` : "Not found");

    if (existingUser) {
      await updateUser(existingUser.id, {
        name,
        slack_id: userInfo.slack_id || "",
        slack_display_name: slackInfo?.display_name || "",
        slack_avatar_url: slackInfo?.avatar_url || "",
        verification_status: userInfo.verification_status || "",
        ...(utmSource && { utm_source: utmSource }),
      });
    } else {
      console.log("Creating new user:", { id: userInfo.id, email, name });
      try {
        await createUser({
          id: userInfo.id,
          email,
          name,
          slack_id: userInfo.slack_id || "",
          slack_display_name: slackInfo?.display_name || "",
          slack_avatar_url: slackInfo?.avatar_url || "",
          verification_status: userInfo.verification_status || "",
          utm_source: utmSource,
        });
        console.log("User created successfully");
      } catch (airtableError) {
        console.error("Airtable createUser failed:", airtableError);
        throw airtableError;
      }
    }

    // Use iron-session for secure, signed session
    const session = await getSession();
    session.userId = userInfo.id;
    session.email = email;
    session.name = name;
    session.isLoggedIn = true;
    session.accessToken = tokenData.access_token;
    await session.save();

    return NextResponse.redirect(new URL("/portal", baseUrl));
  } catch (error) {
    console.error("Auth callback error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "unknown",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.redirect(new URL("/?error=auth_failed", baseUrl));
  }
}
