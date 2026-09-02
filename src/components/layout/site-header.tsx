"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  ArrowRight,
  Download,
  MapPin,
  Mail,
  Phone,
  Printer,
  Smartphone,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { primaryNav } from "@/data/nav";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] =
    React.useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = React.useState(false);

  React.useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    const handleInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const promptInstall = React.useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  return { canInstall: !!deferredPrompt && !installed, promptInstall };
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const { canInstall, promptInstall } = usePwaInstall();

  return (
    <header className="sticky top-0 z-50">
      {/* main bar */}
      <div className="bg-white shadow-[0_8px_30px_-12px_rgba(10,30,48,0.15)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/imc-logo.png"
              alt="IGROS Marketing Corporation logo"
              width={56}
              height={56}
              priority
              className="h-14 w-14 object-contain"
            />
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="font-display text-lg font-semibold tracking-wide text-emerald-950">
                IGROS Marketing Corporation
              </span>
              <span className="text-[11px] tracking-[0.06em] text-emerald-700/70">
                Insulation, ceiling &amp; drywall partition materials
              </span>
            </span>
          </Link>

          <div className="hidden lg:flex lg:items-center lg:gap-2">
            <NavigationMenu>
              <NavigationMenuList>
                {primaryNav.map((item) => {
                  const active = pathname === item.href;
                  if ("hasDropdown" in item && item.hasDropdown) {
                    return (
                      <NavigationMenuItem key={item.href}>
                        <NavigationMenuTrigger
                          className={cn(
                            "bg-transparent text-emerald-950 hover:bg-transparent hover:text-blue-700 focus:bg-transparent focus:text-blue-700",
                            "data-[state=open]:bg-transparent data-[state=open]:text-blue-700",
                            active && "text-emerald-700",
                          )}
                        >
                          {item.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="w-[560px] grid grid-cols-2 gap-x-2 gap-y-1 p-3">
                            {products.map((product) => (
                              <NavigationMenuLink key={product.slug} asChild>
                                <Link
                                  href={`/products/${product.slug}`}
                                  className="group flex items-center gap-3.5 px-4 py-3 transition-colors hover:bg-sky-50"
                                >
                                  <product.icon className="size-4.5 shrink-0 text-blue-600 group-hover:text-orange-500" />
                                  <span className="whitespace-nowrap text-[13.5px] font-medium text-ink">
                                    {product.title}
                                  </span>
                                </Link>
                              </NavigationMenuLink>
                            ))}
                          </div>
                          <div className="border-t border-blue-100 px-5 py-3.5">
                            <Link
                              href="/products"
                              className="flex items-center gap-1.5 text-[13px] font-semibold text-blue-700 hover:text-orange-600"
                            >
                              View all products{" "}
                              <ArrowRight className="size-3.5" />
                            </Link>
                          </div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    );
                  }
                  return (
                    <NavigationMenuItem key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          navTriggerStyle,
                          "relative bg-transparent text-emerald-950 transition-colors hover:bg-transparent hover:text-blue-700 focus:bg-transparent focus:text-blue-700",
                          active &&
                            "text-emerald-700 after:absolute after:inset-x-3 after:-bottom-[1px] after:h-[2px] after:bg-emerald-700",
                        )}
                      >
                        {item.label}
                      </Link>
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>

            {canInstall && (
              <button
                onClick={promptInstall}
                className="ml-2 flex items-center gap-1.5 border border-emerald-950/20 px-3.5 py-2 text-[13px] font-semibold text-emerald-950/90 transition-colors hover:border-emerald-950/40 hover:text-emerald-950"
              >
                <Download className="size-4" />
                Install app
              </button>
            )}

            <Button asChild size="default" className="ml-2">
              <Link href="/contact">
                Request a quote <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          {/* mobile trigger */}
          <div className="lg:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button
                  aria-label="Open menu"
                  className="flex size-10 items-center justify-center border border-emerald-950/20 text-emerald-950"
                >
                  <Menu className="size-5" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[85%] overflow-y-auto bg-white px-6 py-8 text-emerald-950"
              >
                <SheetHeader>
                  <SheetTitle className="text-emerald-950">Menu</SheetTitle>
                </SheetHeader>
                <nav className="mt-8 flex flex-col gap-1">
                  {primaryNav.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "border-b border-emerald-950/10 py-3.5 font-display text-xl tracking-wide text-emerald-950 transition-colors hover:text-blue-700",
                          active && "text-emerald-700",
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
                <div className="mt-8 flex flex-col gap-3">
                  {products.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/products/${p.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 text-sm text-emerald-900 transition-colors hover:text-blue-700"
                    >
                      <p.icon className="size-4 text-emerald-700" />
                      {p.title}
                    </Link>
                  ))}
                </div>

                {canInstall && (
                  <button
                    onClick={() => {
                      promptInstall();
                      setOpen(false);
                    }}
                    className="mt-6 flex w-full items-center justify-center gap-1.5 border border-emerald-950/20 py-2.5 text-sm font-semibold text-emerald-950"
                  >
                    <Download className="size-4" />
                    Install app
                  </button>
                )}

                <Button asChild className="mt-4 w-full">
                  <Link href="/contact" onClick={() => setOpen(false)}>
                    Request a quote
                  </Link>
                </Button>

                {/* contact / branch info — mobile menu only */}
                <div className="mt-8 flex flex-col gap-6 border-t border-emerald-950/10 pt-6 text-[13px] leading-relaxed text-emerald-900">
                  <div>
                    <p className="mb-2 font-display text-sm font-semibold tracking-wide text-emerald-950">
                      Main Office
                    </p>
                    <div className="flex gap-2.5">
                      <MapPin className="mt-0.5 size-4 shrink-0 text-emerald-700" />
                      <p>
                        No. 23 Manhattan Street, Cubao
                        <br />
                        Quezon City, Philippines
                      </p>
                    </div>
                    <div className="mt-2 flex items-center gap-2.5">
                      <Mail className="size-4 shrink-0 text-emerald-700" />
                      <a
                        href="mailto:imcs23@yahoo.com"
                        className="hover:text-blue-700"
                      >
                        imcs23@yahoo.com
                      </a>
                    </div>
                    <div className="mt-2 flex items-center gap-2.5">
                      <Phone className="size-4 shrink-0 text-emerald-700" />
                      <a
                        href="tel:+63234103770"
                        className="hover:text-blue-700"
                      >
                        (632) 3410-3770 / 3411-6907
                      </a>
                    </div>
                    <div className="mt-2 flex items-center gap-2.5">
                      <Printer className="size-4 shrink-0 text-emerald-700" />
                      <span>(632) 3411-5870 / 8722-0359</span>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 font-display text-sm font-semibold tracking-wide text-emerald-950">
                      Cebu Branch
                    </p>
                    <div className="flex gap-2.5">
                      <MapPin className="mt-0.5 size-4 shrink-0 text-emerald-700" />
                      <p>
                        No. 13 ABB Compound, Zuellig Avenue,
                        <br />
                        North Reclamation Area, Mandaue City
                      </p>
                    </div>
                    <div className="mt-2 flex items-center gap-2.5">
                      <Smartphone className="size-4 shrink-0 text-emerald-700" />
                      <a
                        href="tel:+639228347047"
                        className="hover:text-blue-700"
                      >
                        +63 922 834 7047
                      </a>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
