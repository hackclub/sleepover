"use client"

import { createProject } from "@/app/forms/actions/createProject"
import { shipProject } from "@/app/forms/actions/shipProject"
import { useParams } from 'next/navigation';

export default function ShipForm() {
  const id = String(useParams().projid)

  return (
    <form
      action={async (formData) => { const res = await shipProject(formData, id) }}
      className="space-y-3"
    >
      <h3>this is shipping project {id}</h3>
      <h3>checklist tbd</h3>

      <button type="submit" className="border px-3 py-2">
        Ship!
      </button>
    </form>
  )
}