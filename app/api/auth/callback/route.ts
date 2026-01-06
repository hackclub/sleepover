import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken, getUserInfo } from "@/lib/auth";
import { findUserByEmail, createUser, updateUser } from "@/lib/airtable";
import { getSlackUserInfo } from "@/lib/slack";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

function getBaseUrl(request: NextRequest): string {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  return `${protocol}://${host}`;
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

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      await updateUser(existingUser.id, {
        name,
        slack_id: userInfo.slack_id || "",
        slack_display_name: slackInfo?.display_name || "",
        slack_avatar_url: slackInfo?.avatar_url || "",
        verification_status: userInfo.verification_status || "",
      });
    } else {
      await createUser({
        id: userInfo.id,
        email,
        name,
        slack_id: userInfo.slack_id || "",
        slack_display_name: slackInfo?.display_name || "",
        slack_avatar_url: slackInfo?.avatar_url || "",
        verification_status: userInfo.verification_status || "",
      });
    }

    // Use iron-session for secure, signed session
    const session = await getSession();
    session.userId = userInfo.id;
    session.email = email;
    session.name = name;
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.redirect(new URL("/portal", baseUrl));
  } catch (error) {
    console.error("Auth callback error:", error instanceof Error ? error.message : "unknown");
    return NextResponse.redirect(new URL("/?error=auth_failed", baseUrl));
  }
}
