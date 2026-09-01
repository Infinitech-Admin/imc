import type { Metadata, Viewport } from "next";

import "./globals.css";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FloatingSocial } from "@/components/shared/floating-social";
import { ChatWidget } from "@/components/shared/chat-widget";

export const metadata: Metadata = {
  title: {
    default:
      "IGROS Marketing Corporation | Insulation, Ceiling & Drywall Materials",
    template: "%s | IGROS Marketing Corporation",
  },
  description:
    "IGROS Marketing Corporation (IMC) distributes high-quality imported materials for insulation, ceiling, and drywall partition installations across the Philippines since 1993.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "IMC",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a1f14",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <FloatingSocial />
        <ChatWidget />
      </body>
    </html>
  );
}
