"use client"

import { createProject } from "@/app/forms/actions/createProject"
import { shipProject } from "@/app/forms/actions/shipProject"
import { useParams } from 'next/navigation';
import { useState, FormEvent } from 'react';

export default function ShipForm() {
  const id = String(useParams().projid)
  const [errors, setErrors] = useState<{ playable?: string; code?: string }>({});

  const isValidUrl = (urlString: string): boolean => {
    try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const playableUrl = formData.get('playable') as string;
    const codeUrl = formData.get('code') as string;

    const newErrors: { playable?: string; code?: string } = {};

    if (!isValidUrl(playableUrl)) {
      newErrors.playable = 'Please enter a valid URL (must start with http:// or https://)';
    }

    if (!isValidUrl(codeUrl)) {
      newErrors.code = 'Please enter a valid URL (must start with http:// or https://)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    await shipProject(formData, id);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3"
      encType="multipart/form-data"
    >

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
      {errors.playable && (
        <p className="text-red-500 text-sm mt-1" style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}>
          {errors.playable}
        </p>
      )}
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
      {errors.code && (
        <p className="text-red-500 text-sm mt-1" style={{ fontFamily: "'MADE Tommy Soft', sans-serif" }}>
          {errors.code}
        </p>
      )}
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

      <button type="submit" className="border px-3 py-2">
        Ship!
      </button>
    </form>
  )
}