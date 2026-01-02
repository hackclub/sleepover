"use client"

import { createProject } from "@/app/forms/actions/createProject"
import { orderProduct } from "@/app/forms/actions/orderProduct";
import { useParams } from 'next/navigation';

export default function OrderForm() {
  const name = String(useParams().prodid)

  return (
    <form
      action={async (formData) => { const res = await orderProduct(formData, name) }}
      className="space-y-3"
    >
      <h3>this is ordering product {name}</h3>

      <button type="submit" className="border px-3 py-2">
        Order!
      </button>
    </form>
  )
}