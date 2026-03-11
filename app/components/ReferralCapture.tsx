"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ReferralCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      // Store in cookie for durability
      document.cookie = `referral_code=${encodeURIComponent(ref)}; path=/; max-age=${60 * 60 * 24 * 365}`; // 1 year expiry
    }
  }, [searchParams]);

  return null; // This component doesn't render anything
}
