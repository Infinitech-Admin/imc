import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { products } from "@/data/products";
import { PageBanner } from "@/components/shared/page-banner";
import { CtaBanner } from "@/components/sections/cta-banner";

export const metadata: Metadata = {
  title: "Products",
  description:
    "IMC distributes high-quality imported materials — SUPAFLEX, THERMASHIELD, Thermobreak, and ArmaFlex — for insulation, ceiling, and drywall partition installations.",
};

export default function ProductsPage() {
  return (
    <>
      <PageBanner
        eyebrow="What we supply"
        title="Imported materials for insulation, ceilings, and partitions"
        description="We distribute and provide high-quality imported materials for building insulation, ceiling systems, and drywall partitions — including SUPAFLEX, THERMASHIELD, Thermobreak, and ArmaFlex."
        crumb="Products"
      />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-px overflow-hidden border border-blue-100 bg-blue-100 sm:grid-cols-2">
            {products.map((product) => (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                className="group flex flex-col bg-white transition-colors hover:bg-sky-50"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-8">
                  <div>
                    <product.icon
                      className="size-8 text-blue-600 transition-colors group-hover:text-orange-500"
                      strokeWidth={1.75}
                    />
                    <h2 className="mt-5 font-display text-2xl font-semibold tracking-wide text-blue-900">
                      {product.title}
                    </h2>
                    <p className="mt-3 text-[13.5px] leading-relaxed text-steel">
                      {product.summary}
                    </p>
                  </div>
                  <span className="mt-6 flex items-center gap-1.5 text-[13px] font-semibold text-blue-700 group-hover:text-orange-600">
                    Learn more <ArrowRight className="size-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <p className="mt-8 text-center text-[13.5px] text-steel">
            You may contact us if you need a copy of our product brochures.
          </p>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
