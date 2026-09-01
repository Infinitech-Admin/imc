import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  fallbacks: {
    document: "/offline",
  },
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "irp.cdn-website.com" },
      { protocol: "https", hostname: "irp-cdn.multiscreensite.com" },
    ],
  },
  turbopack: {}, // silences the webpack/turbopack conflict warning on Next.js 16 dev
};

export default withPWA(nextConfig);
