import { NextResponse } from "next/server";

export function rejectCrossOrigin(request: Request): NextResponse | null {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}
