// FILE PATH: types/category.ts

import type { Product } from "@/types/product";

export interface Category {
  id: number;
  name: string;
  slug: string;
  sort_order: number;
  products?: Product[]; // present only from GET /api/categories/{slug} (show)
}
