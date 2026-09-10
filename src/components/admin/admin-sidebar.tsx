"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Building2,
  Settings,
  ArrowLeft,
  Menu,
  LogOut,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package, exact: false },
  { href: "/admin/projects", label: "Projects", icon: Building2, exact: false },
  // { href: "/admin/orders", label: "Orders", icon: ShoppingCart, exact: false },
  // { href: "/admin/customers", label: "Customers", icon: Users, exact: false },
  // { href: "/admin/settings", label: "Settings", icon: Settings, exact: false },
] as const;

type AdminUser = {
  name: string;
  email: string;
};

function useCurrentUser() {
  const [user, setUser] = React.useState<AdminUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const json = await res.json();
        if (!cancelled) setUser(json.data ?? null);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { user, loading };
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function AdminBrand() {
  return (
    <div className="flex items-center gap-3 px-5 py-4">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white">
        <Image
          src="/imc-logo.png"
          alt="IGROS Marketing Corporation logo"
          width={30}
          height={30}
          className="h-[30px] w-[30px] object-contain"
        />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="font-display text-sm font-semibold tracking-wide text-white">
          IMC Admin
        </span>
        <span className="text-[11px] text-emerald-300/70">Back office</span>
      </div>
    </div>
  );
}

function AdminNavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const rawPathname = usePathname();
  // normalize trailing slash so "/admin/" and "/admin" match the same way
  const pathname =
    rawPathname && rawPathname.length > 1
      ? rawPathname.replace(/\/+$/, "")
      : rawPathname;

  return (
    <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
      {adminNav.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname?.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative flex items-center gap-3 rounded-lg py-2.5 pl-4 pr-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60",
              active
                ? "bg-white/10 text-white before:absolute before:inset-y-1.5 before:left-0 before:w-1 before:rounded-full before:bg-orange-500"
                : "text-emerald-100/70 hover:bg-white/5 hover:text-white",
            )}
          >
            <item.icon
              className={cn(
                "size-4.5 shrink-0",
                active ? "text-orange-400" : "text-emerald-200/50",
              )}
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function UserFooter({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const { user, loading } = useCurrentUser();
  const [signingOut, setSigningOut] = React.useState(false);

  const handleLogout = async () => {
    setSigningOut(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error();
      toast.success("Signed out.");
      onNavigate?.();
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Failed to sign out. Please try again.");
      setSigningOut(false);
    }
  };

  return (
    <div className="border-t border-white/10 px-3 py-4">
      <div className="flex items-center gap-3 rounded-lg px-3 py-2">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">
          {loading ? "" : user ? initials(user.name) : "?"}
        </div>
        <div className="min-w-0 flex-1 leading-tight">
          {loading ? (
            <div className="h-3.5 w-24 animate-pulse rounded bg-white/10" />
          ) : user ? (
            <>
              <p className="truncate text-sm font-medium text-white">
                {user.name}
              </p>
              <p className="truncate text-[11px] text-emerald-300/70">
                {user.email}
              </p>
            </>
          ) : (
            <p className="text-sm text-emerald-200/60">Not signed in</p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        disabled={signingOut}
        className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-emerald-200/60 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-50"
      >
        <LogOut className="size-4.5 shrink-0" />
        {signingOut ? "Signing out…" : "Log out"}
      </button>

      <Link
        href="/"
        onClick={onNavigate}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-emerald-200/60 transition-colors hover:bg-white/5 hover:text-white"
      >
        <ArrowLeft className="size-4.5 shrink-0" />
        Back to site
      </Link>
    </div>
  );
}

export function AdminSidebar() {
  const [open, setOpen] = React.useState(false);
  const close = React.useCallback(() => setOpen(false), []);

  return (
    <>
      {/* Desktop: fixed sticky sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-emerald-950 shadow-[8px_0_24px_-16px_rgba(0,0,0,0.4)] lg:flex">
        <div className="border-b border-white/10">
          <AdminBrand />
        </div>
        <AdminNavLinks />
        <UserFooter />
      </aside>

      {/* Mobile: sticky top bar with hamburger */}
      <div className="sticky top-0 z-40 flex items-center justify-between bg-emerald-950 px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white">
            <Image
              src="/imc-logo.png"
              alt="IGROS Marketing Corporation logo"
              width={22}
              height={22}
              className="h-[22px] w-[22px] object-contain"
            />
          </div>
          <span className="font-display text-sm font-semibold tracking-wide text-white">
            IMC Admin
          </span>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            aria-label="Open admin menu"
            render={
              <button className="flex size-9 items-center justify-center rounded-lg border border-white/15 text-white" />
            }
          >
            <Menu className="size-4.5" />
          </SheetTrigger>
          <SheetContent
            side="left"
            className="flex w-[80%] max-w-xs flex-col border-none bg-emerald-950 p-0 text-white"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Admin menu</SheetTitle>
            </SheetHeader>
            <div className="border-b border-white/10">
              <AdminBrand />
            </div>
            <AdminNavLinks onNavigate={close} />
            <UserFooter onNavigate={close} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
