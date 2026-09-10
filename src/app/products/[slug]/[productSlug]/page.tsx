// FILE PATH: app/products/[slug]/[productSlug]/page.tsx

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import type { Product, SpecTable } from "@/types/product";
import { imageUrl } from "@/lib/image-url";

const API_URL = process.env.API_URL ?? "";

async function getProduct(productSlug: string): Promise<Product | null> {
  const res = await fetch(`${API_URL}/api/products/${productSlug}`, {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load product.");
  const { data }: { data: Product } = await res.json();
  return data;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string; productSlug: string }>;
}) {
  const { slug: categorySlug, productSlug } = await params;
  const product = await getProduct(productSlug);

  if (!product) notFound();

  const specTable: SpecTable | null = product.spec_table;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <Link
        href={`/products/${categorySlug}`}
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-blue-700 hover:text-orange-600"
      >
        <ArrowLeft className="size-3.5" /> Back to category
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-sky-50">
          <Image
            src={imageUrl(product.cover_image)}
            alt={product.name}
            fill
            className="object-contain"
          />
        </div>

        <div>
          <h1 className="font-display text-2xl font-semibold text-blue-900">
            {product.name}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-steel">
            {product.description}
          </p>

          {product.highlights && product.highlights.length > 0 && (
            <ul className="mt-5 space-y-1.5 text-[13.5px] text-steel">
              {product.highlights.map((h, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-blue-600">•</span>
                  {h}
                </li>
              ))}
            </ul>
          )}

          {specTable && specTable.columns.length > 0 && (
            <table className="mt-6 w-full text-center text-sm text-blue-900">
              <thead>
                <tr>
                  {specTable.columns.map((col, i) => (
                    <th
                      key={i}
                      className="border-b border-blue-100 pb-2 font-semibold"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {specTable.rows.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci} className="py-2">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
