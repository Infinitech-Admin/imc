// FILE PATH: app/products/[slug]/page.tsx

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import type { Category } from "@/types/category";
import { imageUrl } from "@/lib/image-url";

const API_URL = process.env.API_URL ?? "";

async function getCategory(slug: string): Promise<Category | null> {
  const res = await fetch(`${API_URL}/api/categories/${slug}`, {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load category.");
  const { data }: { data: Category } = await res.json();
  return data;
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) notFound();

  const products = category.products ?? [];

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-blue-700 hover:text-orange-600"
        >
          <ArrowLeft className="size-3.5" /> All categories
        </Link>

        <h1 className="mt-4 font-display text-3xl font-semibold tracking-wide text-blue-900">
          {category.name}
        </h1>

        {products.length === 0 ? (
          <p className="mt-8 text-steel">No products in this category yet.</p>
        ) : (
          <div className="mt-8 grid gap-px overflow-hidden border border-blue-100 bg-blue-100 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Link
                key={product.slug}
                href={`/products/${category.slug}/${product.slug}`}
                className="group flex flex-col bg-white transition-colors hover:bg-sky-50"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-sky-50">
                  <Image
                    src={imageUrl(product.cover_image)}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <h2 className="font-display text-lg font-semibold tracking-wide text-blue-900">
                      {product.name}
                    </h2>
                    {product.summary && (
                      <p className="mt-2 text-[13.5px] leading-relaxed text-steel">
                        {product.summary}
                      </p>
                    )}
                  </div>
                  <span className="mt-4 flex items-center gap-1.5 text-[13px] font-semibold text-blue-700 group-hover:text-orange-600">
                    Learn more <ArrowRight className="size-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
