import { cookies } from "next/headers";

export const HACKCLUB_AUTH_URL = "https://auth.hackclub.com";
export const OAUTH_SCOPES = "openid profile email name slack_id verification_status";

export interface HackClubUser {
  id: string;
  email?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  slack_id?: string;
  verification_status?: "needs_submission" | "pending" | "verified" | "ineligible";
}

export function getAuthorizationUrl(): string {
  const clientId = process.env.HACKCLUB_CLIENT_ID;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const redirectUri = `${baseUrl}/api/auth/callback`;

  const params = new URLSearchParams({
    client_id: clientId!,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: OAUTH_SCOPES,
  });

  return `${HACKCLUB_AUTH_URL}/oauth/authorize?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
}> {
  const clientId = process.env.HACKCLUB_CLIENT_ID;
  const clientSecret = process.env.HACKCLUB_CLIENT_SECRET;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const redirectUri = `${baseUrl}/api/auth/callback`;

  const response = await fetch(`${HACKCLUB_AUTH_URL}/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to exchange code for token");
  }

  return response.json();
}

export async function getUser(accessToken: string): Promise<HackClubUser> {
  const response = await fetch(`${HACKCLUB_AUTH_URL}/api/v1/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get user");
  }

  return response.json();
}

export async function setAuthCookie(accessToken: string, expiresIn: number) {
  const cookieStore = await cookies();
  cookieStore.set("hackclub_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: expiresIn,
    path: "/",
  });
}

export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("hackclub_token")?.value;
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("hackclub_token");
}

export async function getCurrentUser(): Promise<HackClubUser | null> {
  const token = await getAuthCookie();
  if (!token) return null;

  try {
    return await getUser(token);
  } catch {
    return null;
  }
}
