"use client";

import { usePathname } from "next/navigation";

import { SiteHeader } from "@/components/layout/site-header";

export function ConditionalSiteHeader() {
  const pathname = usePathname();
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdmin) return null;

  return <SiteHeader />;
}
