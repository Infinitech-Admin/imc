// FILE PATH: lib/product-categories.ts

/**
 * Static category list for the product form dropdown. Not backed by a
 * database table — just a fixed set of options rendered client-side.
 * Add/rename a category here only.
 */
export const PRODUCT_CATEGORIES = [
  "Insulations",
  "Ceiling & Drywall Partitions",
  "Thermobreak",
  "Armaflex Brand",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
