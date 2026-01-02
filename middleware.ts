import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { SessionData } from "@/lib/session";

const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "sleepover_session",
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /portal routes
  if (pathname.startsWith("/portal")) {
    const response = NextResponse.next();

    const session = await getIronSession<SessionData>(
      request,
      response,
      sessionOptions
    );

    if (!session.isLoggedIn) {
      const url = new URL("/", request.url);
      url.searchParams.set("error", "auth_required");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*"],
};
