"use server"

import { addProduct, hasUserOrderedProduct } from "@/lib/airtable"
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/session";

// Products that can only be ordered once per user
const SINGLE_PURCHASE_PRODUCTS = ["rec4wZN4c2OdkWMnc"]; // Sticker sheet

export async function orderProduct(formData: FormData, product: string) {
  const session = await requireAuth();
  const id = session.userId;

  if (!product) {
    throw new Error("Product ID is required")
  }

  // Check if this is a single-purchase product and user has already ordered it
  if (SINGLE_PURCHASE_PRODUCTS.includes(product)) {
    const alreadyOrdered = await hasUserOrderedProduct(id, product);
    if (alreadyOrdered) {
      throw new Error("You have already ordered this product")
    }
  }

  // Add product to profile on user_shop_info, and removes necessary currency
  await addProduct(id, product)

  redirect("/portal/shop")
}
