"use client"

import { createProject } from "@/app/forms/actions/createProject"

export default function ProjectForm() {
  return (
    <form
      action={async (formData) => { const res = await createProject(formData) }}
      className="space-y-3"
    >
      <div>
        <label className="block">Name</label>
        <input name="name" required className="border p-2 w-full" />
      </div>

      <div>
        <label className="block">Description</label>
        <textarea name="desc" className="border p-2 w-full" />
      </div>

      <button type="submit" className="border px-3 py-2">
        Add project
      </button>
    </form>
  )
}