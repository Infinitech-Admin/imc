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

/**
 * Display-only column label fix.
 *
 * The admin spec-table editor always saves the same 3 column headers
 * ("Density (Kg/m³)", "Thickness (mm)", "W x L (m x m)") no matter what's
 * actually typed into the rows. For pipe-insulation products, admins have
 * been entering pipe sizes in inches under that first column, so the page
 * was showing "Density (Kg/m³)" next to inch values.
 *
 * Rather than touch the stored data or the admin form/backend, we just
 * swap the label at render time when the product name signals it's a
 * pipe product. The underlying spec_table JSON is untouched — this only
 * changes what's printed in the <th>.
 */
function getDisplayColumns(productName: string, columns: string[]): string[] {
  const isPipeProduct = /\bpipe\b/i.test(productName);
  if (!isPipeProduct) return columns;

  return columns.map((col) => (/density/i.test(col) ? "Size (Inch)" : col));
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
  const displayColumns = specTable
    ? getDisplayColumns(product.name, specTable.columns)
    : [];

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
                  {displayColumns.map((col, i) => (
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
