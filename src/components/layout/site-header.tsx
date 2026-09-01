"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ArrowRight, Download } from "lucide-react";

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
                            "text-emerald-950",
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
                          "text-emerald-950",
                          active && "text-emerald-700",
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
              <SheetContent side="right" className="w-[85%] px-6 py-8">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="mt-8 flex flex-col gap-1">
                  {primaryNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="border-b border-emerald-950/10 py-3.5 font-display text-xl tracking-wide text-emerald-950/90"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-8 flex flex-col gap-3">
                  {products.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/products/${p.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 text-sm text-emerald-800/80"
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
                    className="mt-6 flex w-full items-center justify-center gap-1.5 border border-emerald-950/20 py-2.5 text-sm font-semibold text-emerald-950/90"
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
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
