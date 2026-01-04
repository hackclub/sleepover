import { NextResponse } from "next/server";
import { getCurrency, getProgressHours } from "@/lib/airtable";
import { getUserInfo } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
 const cookieStore = await cookies();
     const sessionCookie = cookieStore.get("session");
   
     if (!sessionCookie) return;
   
     const value = sessionCookie.value;
     const accessToken = JSON.parse(value).accessToken;
   
     const userinfo = await getUserInfo(accessToken);
     const hours = await getProgressHours(userinfo.identity.id)
     console.log(hours)


  return NextResponse.json({
    hours: hours,
  });
}
