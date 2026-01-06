"use server"

import { addProduct } from "@/lib/airtable"
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/session";

export async function orderProduct(formData: FormData, product: string) {
  const name = String(formData.get("name") ?? "").trim()
  const desc = String(formData.get("desc") ?? "").trim()

  const session = await requireAuth();
  const id = session.userId;

  // Add product to profile on user_shop_info, and removes necessary currency
  addProduct(id, product)

  redirect("/portal/shop")
}
