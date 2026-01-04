import { NextResponse } from "next/server";
import { getCurrency } from "@/lib/airtable";
import { getUserInfo } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
 const cookieStore = await cookies();
     const sessionCookie = cookieStore.get("session");
   
     if (!sessionCookie) return NextResponse.json({ balance: 0 }, { status: 401 });
   
     const value = sessionCookie.value;
     const accessToken = JSON.parse(value).accessToken;
   
     const userinfo = await getUserInfo(accessToken);
     const balance = await getCurrency(userinfo.identity.id)


  return NextResponse.json({
    balance: balance,
  });
}
