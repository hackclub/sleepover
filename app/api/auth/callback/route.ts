import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken, getUserInfo } from "@/lib/auth";
import { findUserByEmail, createUser, updateUser } from "@/lib/airtable";
import { getSlackUserInfo } from "@/lib/slack";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/?error=auth_failed", request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/?error=no_code", request.url));
  }

  try {
    const tokenData = await exchangeCodeForToken(code);
    const response = await getUserInfo(tokenData.access_token);
    const userInfo = response.identity;
    
    console.log("Full response from Hack Club:", JSON.stringify(response, null, 2));
    console.log("User info from Hack Club:", JSON.stringify(userInfo, null, 2));

    const email = userInfo.primary_email;
    const name = `${userInfo.first_name || ""} ${userInfo.last_name || ""}`.trim();
    
    // Fetch Slack profile info if slack_id exists
    console.log("Slack ID from Hack Club:", userInfo.slack_id);
    const slackInfo = userInfo.slack_id ? await getSlackUserInfo(userInfo.slack_id) : null;
    console.log("Slack info:", slackInfo);

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

    const cookieStore = await cookies();
    cookieStore.set("session", JSON.stringify({
      email,
      name,
      accessToken: tokenData.access_token,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return NextResponse.redirect(new URL("/portal", request.url));
  } catch (error) {
    console.error("Auth callback error:", error);
    const errorMessage = error instanceof Error ? error.message : "unknown";
    return NextResponse.redirect(new URL(`/?error=${encodeURIComponent(errorMessage)}`, request.url));
  }
}
