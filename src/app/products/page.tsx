// FILE PATH: app/products/page.tsx

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Category } from "@/types/category";
import { PageBanner } from "@/components/shared/page-banner";
import { CtaBanner } from "@/components/sections/cta-banner";

const API_URL = process.env.API_URL ?? "";

export const metadata: Metadata = {
  title: "Products",
  description:
    "IMC distributes high-quality imported materials — SUPAFLEX, THERMASHIELD, Thermobreak, and ArmaFlex — for insulation, ceiling, and drywall partition installations.",
};

async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/api/categories`, { cache: "no-store" });
  if (!res.ok) return [];
  const { data }: { data: Category[] } = await res.json();
  return data;
}

export default async function ProductsPage() {
  const categories = await getCategories();

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
          {categories.length === 0 ? (
            <p className="text-center text-steel">No categories available.</p>
          ) : (
            <div className="grid gap-px overflow-hidden border border-blue-100 bg-blue-100 sm:grid-cols-2">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/products/${category.slug}`}
                  className="group flex flex-col justify-between bg-white p-8 transition-colors hover:bg-sky-50"
                >
                  <h2 className="font-display text-2xl font-semibold tracking-wide text-blue-900">
                    {category.name}
                  </h2>
                  <span className="mt-6 flex items-center gap-1.5 text-[13px] font-semibold text-blue-700 group-hover:text-orange-600">
                    View products <ArrowRight className="size-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          )}

          <p className="mt-8 text-center text-[13.5px] text-steel">
            You may contact us if you need a copy of our product brochures.
          </p>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
