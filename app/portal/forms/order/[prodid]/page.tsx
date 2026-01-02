"use client"

import { createProject } from "@/app/forms/actions/createProject"
import { orderProduct } from "@/app/forms/actions/orderProduct";
import { useParams } from 'next/navigation';

export default function OrderForm() {
  const id = useParams().prodid

  return (
    <form
      action={async (formData) => { const res = await orderProduct(formData) }}
      className="space-y-3"
    >
      <h3>this is ordering product {id}</h3>
      <div>
        <label className="block">Something</label>
        <input name="name" required className="border p-2 w-full" />
      </div>

      <button type="submit" className="border px-3 py-2">
        Ship!
      </button>
    </form>
  )
}