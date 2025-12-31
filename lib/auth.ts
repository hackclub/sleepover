export const HACKCLUB_AUTH_CONFIG = {
  clientId: process.env.HACKCLUB_CLIENT_ID!,
  clientSecret: process.env.HACKCLUB_CLIENT_SECRET!,
  redirectUri: process.env.HACKCLUB_REDIRECT_URI || "http://localhost:3000/api/auth/callback",
  authorizationUrl: "https://auth.hackclub.com/oauth/authorize",
  tokenUrl: "https://auth.hackclub.com/oauth/token",
  userInfoUrl: "https://auth.hackclub.com/api/v1/me",
  scopes: "openid email name slack_id verification_status",
};

export function getAuthorizationUrl() {
  const params = new URLSearchParams({
    client_id: HACKCLUB_AUTH_CONFIG.clientId,
    redirect_uri: HACKCLUB_AUTH_CONFIG.redirectUri,
    response_type: "code",
    scope: HACKCLUB_AUTH_CONFIG.scopes,
  });

  return `${HACKCLUB_AUTH_CONFIG.authorizationUrl}?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: HACKCLUB_AUTH_CONFIG.clientId,
    client_secret: HACKCLUB_AUTH_CONFIG.clientSecret,
    redirect_uri: HACKCLUB_AUTH_CONFIG.redirectUri,
    code,
  });
  
  console.log("Token exchange request:", { 
    grant_type: "authorization_code",
    client_id: HACKCLUB_AUTH_CONFIG.clientId,
    redirect_uri: HACKCLUB_AUTH_CONFIG.redirectUri,
  });
  
  const response = await fetch(HACKCLUB_AUTH_CONFIG.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Token exchange failed:", response.status, errorText);
    throw new Error(`Failed to exchange code for token: ${errorText}`);
  }

  return response.json();
}

export async function getUserInfo(accessToken: string) {
  const response = await fetch(HACKCLUB_AUTH_CONFIG.userInfoUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get user info");
  }

  return response.json();
}

export async function getCurrentUser() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) {
    return null;
  }

  try {
    const session = JSON.parse(sessionCookie.value);
    return session;
  } catch {
    return null;
  }
}
