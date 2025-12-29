import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken, setAuthCookie } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  if (error) {
    return NextResponse.redirect(`${baseUrl}?error=${error}`);
  }

  if (!code) {
    return NextResponse.redirect(`${baseUrl}?error=no_code`);
  }

  try {
    const tokens = await exchangeCodeForToken(code);
    await setAuthCookie(tokens.access_token, tokens.expires_in);
    return NextResponse.redirect(`${baseUrl}?success=true`);
  } catch {
    return NextResponse.redirect(`${baseUrl}?error=token_exchange_failed`);
  }
}
