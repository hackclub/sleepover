"use server"

import { addProduct } from "@/lib/airtable"
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/session";
import { HackClubAddress} from "../order/[prodid]/page";

export async function orderProduct(formData: FormData, product: string, address?: HackClubAddress) {
  const session = await requireAuth();
  const id = session.userId;
  
  if (!product) {
    throw new Error("Product ID is required")
  
  }

  await addProduct(id, product, formData, address)

  redirect("/portal/shop")
}
