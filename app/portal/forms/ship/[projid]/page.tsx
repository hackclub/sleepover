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
      encType="multipart/form-data"
    >
      <h3>this is shipping project {id}</h3>

      <label>Playable Url</label>
      <input
                name="playable"
                required
                className="w-full rounded-[12px] px-4 py-3 text-[#6C6EA0] text-lg outline-none"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  background: "white",
                  boxShadow:
                    "0px 4px 4px rgba(116,114,160,0.62), inset 2px 4px 8px rgba(116,114,160,0.29)",
                }}
              />
      <label>Code Url</label>
      <input
                name="code"
                required
                className="w-full rounded-[12px] px-4 py-3 text-[#6C6EA0] text-lg outline-none"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  background: "white",
                  boxShadow:
                    "0px 4px 4px rgba(116,114,160,0.62), inset 2px 4px 8px rgba(116,114,160,0.29)",
                }}
              />
      <label>Screenshot</label>
      <input
                type="file"
                name="screenshot"
                required
                className="w-full rounded-[12px] px-4 py-3 text-[#6C6EA0] text-lg outline-none"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  background: "white",
                  boxShadow:
                    "0px 4px 4px rgba(116,114,160,0.62), inset 2px 4px 8px rgba(116,114,160,0.29)",
                }}
              />
      <label>GitHub Username</label>
      <input
                name="github"
                required
                className="w-full rounded-[12px] px-4 py-3 text-[#6C6EA0] text-lg outline-none"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  background: "white",
                  boxShadow:
                    "0px 4px 4px rgba(116,114,160,0.62), inset 2px 4px 8px rgba(116,114,160,0.29)",
                }}
              />

      <h3>checklist tbd</h3>

      <button type="submit" className="border px-3 py-2">
        Ship!
      </button>
    </form>
  )
}