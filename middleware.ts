import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { SessionData } from "@/lib/session";

const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "sleepover_session",
};

// --- BASIC AUTH (username/password) ---
function requireBasicAuth(request: NextRequest) {
  const user = process.env.BASIC_AUTH_USER ?? "";
  const pass = process.env.BASIC_AUTH_PASS ?? "";

  // Safer: fail closed if not configured
  if (!user || !pass) {
    return new NextResponse("Basic auth is not configured.", { status: 500 });
  }

  const auth = request.headers.get("authorization");

  if (!auth?.startsWith("Basic ")) {
    return new NextResponse("Authentication required.", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Protected"' },
    });
  }

  let decoded = "";
  try {
    decoded = atob(auth.slice("Basic ".length));
  } catch {
    return new NextResponse("Invalid authentication header.", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Protected"' },
    });
  }

  const [u, p] = decoded.split(":");
  const ok = u === user && p === pass;

  if (!ok) {
    return new NextResponse("Invalid credentials.", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Protected"' },
    });
  }

  // ok -> continue
  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Bypass basic auth for /api/dm and anything under /api/dm/*
  const isDmApi = pathname === "/api/dm" || pathname.startsWith("/api/dm/");
  if (!isDmApi) {
    const basic = requireBasicAuth(request);
    if (basic) return basic;
  }

  // 🔐 Keep existing /portal protection
  if (pathname.startsWith("/portal")) {
    const response = NextResponse.next();

    const session = await getIronSession<SessionData>(
      request,
      response,
      sessionOptions
    );

    if (!session.isLoggedIn) {
      const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
      const protocol = request.headers.get("x-forwarded-proto") || "https";
      const baseUrl = `${protocol}://${host}`;
      const url = new URL("/", baseUrl);
      url.searchParams.set("error", "auth_required");
      return NextResponse.redirect(url);
    }

    return response; // important: return the response tied to the session
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run middleware on everything EXCEPT Next internals/static files
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
