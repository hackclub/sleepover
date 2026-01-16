import crypto from "crypto";

export const HACKCLUB_AUTH_CONFIG = {
  clientId: process.env.HACKCLUB_CLIENT_ID!,
  clientSecret: process.env.HACKCLUB_CLIENT_SECRET!,
  redirectUri: process.env.HACKCLUB_REDIRECT_URI || "https://sleepover.hackclub.com/api/auth/callback",
  authorizationUrl: "https://auth.hackclub.com/oauth/authorize",
  tokenUrl: "https://auth.hackclub.com/oauth/token",
  userInfoUrl: "https://auth.hackclub.com/api/v1/me",
  scopes: "openid email name slack_id verification_status address",
};

export function generateOAuthState(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function getAuthorizationUrl(state: string, email?: string) {
  const params = new URLSearchParams({
    client_id: HACKCLUB_AUTH_CONFIG.clientId,
    redirect_uri: HACKCLUB_AUTH_CONFIG.redirectUri,
    response_type: "code",
    scope: HACKCLUB_AUTH_CONFIG.scopes,
    state,
  });

  if (email) {
    params.set("login_hint", email);
  }

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

  const response = await fetch(HACKCLUB_AUTH_CONFIG.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    console.error("Token exchange failed:", response.status);
    throw new Error("token_exchange_failed");
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
    throw new Error("user_info_failed");
  }

  return response.json();
}

export async function getUserAddresses(accessToken: string) {
  const response = await fetch(HACKCLUB_AUTH_CONFIG.userInfoUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    console.error("Failed to fetch user info for addresses:", response.status);
    return [];
  }

  const data = await response.json();
  const identity = data.identity || data;
  
  // Addresses are returned in the identity object when address scope is granted
  return identity.addresses || [];
}
