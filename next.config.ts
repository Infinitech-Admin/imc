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
    dangerouslyAllowLocalIP: true,

    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "irp.cdn-website.com",
      },
      {
        protocol: "https",
        hostname: "irp-cdn.multiscreensite.com",
      },
      {
        protocol: "https",
        hostname: "infinitech-api19.site",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "infinitech-api19.site",
        pathname: "/storage/**",
      },
    ],
  },

  turbopack: {},
};

export default withPWA(nextConfig);
