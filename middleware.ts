import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { SessionData } from "@/lib/session";

const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "sleepover_session",
};

// // --- BASIC AUTH (username/password) ---
// function requireBasicAuth(request: NextRequest) {
//   const user = process.env.BASIC_AUTH_USER ?? "";
//   const pass = process.env.BASIC_AUTH_PASS ?? "";

//   // Skip basic auth if not configured (development mode)
//   if (!user || !pass) {
//     return null;
//   }

//   const auth = request.headers.get("authorization");

//   if (!auth?.startsWith("Basic ")) {
//     return new NextResponse("Authentication required.", {
//       status: 401,
//       headers: { "WWW-Authenticate": 'Basic realm="Protected"' },
//     });
//   }

//   let decoded = "";
//   try {
//     decoded = atob(auth.slice("Basic ".length));
//   } catch {
//     return new NextResponse("Invalid authentication header.", {
//       status: 401,
//       headers: { "WWW-Authenticate": 'Basic realm="Protected"' },
//     });
//   }

//   const [u, p] = decoded.split(":");
//   if (u !== user || p !== pass) {
//     return new NextResponse("Invalid credentials.", {
//       status: 401,
//       headers: { "WWW-Authenticate": 'Basic realm="Protected"' },
//     });
//   }

//   return null; // ✅ authenticated
// }

function isPublicAssetPath(pathname: string) {
  // Allowlist: public folders + standard public files
  return (
    pathname.startsWith("/background/") ||
    pathname.startsWith("/fonts/") ||
    pathname.startsWith("/icons/") ||
    pathname.startsWith("/prizes/") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 🔐 Session-based auth for /portal
  if (pathname.startsWith("/portal")) {
    const response = NextResponse.next();

    const session = await getIronSession<SessionData>(
      request,
      response,
      sessionOptions
    );

    if (!session.isLoggedIn) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.search = "";
      url.searchParams.set("error", "auth_required");
      return NextResponse.redirect(url);
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run middleware on everything EXCEPT Next internals
    "/((?!_next/static|_next/image).*)",
  ],
};
