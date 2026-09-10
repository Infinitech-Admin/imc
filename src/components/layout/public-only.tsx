"use client";

import { usePathname } from "next/navigation";

export function PublicOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdmin) return null;

  return <>{children}</>;
}
