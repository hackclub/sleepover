import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
      value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://open.spotify.com https://www.youtube.com https://server.fillout.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://avatars.slack-edge.com https://*.airtableusercontent.com https://user-cdn.hackclub-assets.com https://cdn.hackclub.com",
      "font-src 'self' data:",
      "frame-src https://open.spotify.com https://www.youtube.com https://server.fillout.com",
      "connect-src 'self' https://api.hackclub.com",
      "object-src 'none'",
      "base-uri 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.slack-edge.com',
      },
      {
        protocol: 'https',
        hostname: '*.airtableusercontent.com',
      },
        {
          protocol: 'https',
          hostname: 'user-cdn.hackclub-assets.com',
        },
        {
          protocol: 'https',
          hostname: 'cdn.hackclub.com',
        },
    ],
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
