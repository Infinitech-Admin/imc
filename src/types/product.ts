// FILE PATH: types/product.ts

import type { Category } from "@/types/category";

export interface ProductImage {
  id: number;
  product_id: number;
  path: string;
  sort_order: number;
}

export interface SpecTable {
  // "table" = a generic multi-column table with admin-named columns
  //           (e.g. Name / Size / PCS per CTN / Ratio per m²).
  // "list"  = simple label/value rows (e.g. "Size: 3x6, 4x8 Feet").
  // Older records saved before this field existed won't have it —
  // treat a missing type as "table" everywhere it's read.
  type?: "table" | "list";
  columns: string[];
  rows: string[][];
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  category_id: number | null;
  category: Category | null; // full related object, not just a name/id
  summary: string | null;
  description: string | null;
  highlights: string[];
  spec_table: SpecTable | null;
  images: ProductImage[];
  cover_image: string | null;
  created_at: string;
  updated_at: string;
}
