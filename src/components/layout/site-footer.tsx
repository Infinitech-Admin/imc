import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

import { products } from "@/data/products";
import { primaryNav } from "@/data/nav";
import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-navy-950 text-sky-100/80">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <span className="flex h-11 w-11 items-center justify-center border-2 border-orange-500 font-display text-lg font-bold text-white">
              IMC
            </span>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-sky-100/60">
              IGROS Marketing Corporation (IMC) — supplying high-quality
              imported materials for insulation, ceilings, and drywall
              partitions since 1993.
            </p>
          </div>

          <div>
            <h3 className="font-display text-base font-semibold tracking-wide text-white">
              Sitemap
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sky-100/60 hover:text-orange-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-base font-semibold tracking-wide text-white">
              Products
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {products.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/products/${p.slug}`}
                    className="text-sky-100/60 hover:text-orange-400"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-base font-semibold tracking-wide text-white">
              Get in touch
            </h3>
            <ul className="mt-4 space-y-3.5 text-sm text-sky-100/60">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-blue-400" />
                <span>
                  No. 23 Manhattan Street, Cubao, Quezon City, Philippines
                  <span className="mt-1 block text-xs text-sky-100/40">
                    + Cebu Branch: No. 13 ABB Compound, Zuellig Avenue, Mandaue
                    City
                  </span>
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-blue-400" />
                <a href="tel:+63234103770" className="hover:text-orange-400">
                  (632) 3410-3770 / 3411-6907
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-blue-400" />
                <a
                  href="mailto:imcs23@yahoo.com"
                  className="hover:text-orange-400"
                >
                  imcs23@yahoo.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-10 bg-white/10" />

        <div className="flex flex-col items-start justify-between gap-3 text-xs text-sky-100/45 sm:flex-row sm:items-center">
          <p>© {year} IGROS Marketing Corporation. All rights reserved.</p>
          <p>
            Supplier of Insulation, Ceiling &amp; Drywall Partition Materials
          </p>
        </div>
      </div>
    </footer>
  );
}
