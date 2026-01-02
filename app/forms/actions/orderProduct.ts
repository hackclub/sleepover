"use server"

import { addProduct } from "@/lib/airtable" // or Airtable init here
import { getUserInfo } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function orderProduct(formData: FormData, product: string) {
  const name = String(formData.get("name") ?? "").trim()
  const desc = String(formData.get("desc") ?? "").trim()

  const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");
    var id = "ident!30fJ8d"
  
    if (sessionCookie) {
      const value = sessionCookie?.value
      const userinfo = await getUserInfo(JSON.parse(value).accessToken)
      id = userinfo.identity.id
    }
  //add product to profile on user_shop_info, and removes necessary currency
  addProduct(id, product)

  redirect("/portal/shop")
}