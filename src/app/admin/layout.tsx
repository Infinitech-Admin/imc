// FILE PATH: app/admin/layout.tsx

import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { authHeader } from "@/lib/session";

const API_URL = process.env.API_URL ?? "";

async function getCurrentUser() {
  const headers = await authHeader();
  if (!headers.Authorization) return null;

  try {
    const res = await fetch(`${API_URL}/api/me`, {
      headers,
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 lg:flex-row">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {children}
      </main>
    </div>
  );
}
