"use client";

// FILE PATH: app/admin/products/page.tsx

import * as React from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ProductsDataTable } from "@/components/admin/products-data-table";
import { ProductFormDialog } from "@/components/admin/product-form-dialog";
import type { Product } from "@/types/product";

export default function AdminProductsPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(
    null,
  );

  const loadProducts = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/products", { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to load products (${res.status})`);
      const json: { data: Product[] } = await res.json();
      setProducts(json.data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load products.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const openCreate = () => {
    setEditingProduct(null);
    setDialogOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleDelete = async (product: Product) => {
    const res = await fetch(`/api/products/${product.id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      toast.error("Failed to delete product.");
      throw new Error("Failed to delete product.");
    }
    toast.success("Product deleted.");
    await loadProducts();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-blue-900">
            Products
          </h1>
          <p className="mt-1 text-sm text-steel">
            Manage the product lines shown on the public products pages.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-1.5 size-4" /> Add product
        </Button>
      </div>

      <div className="mt-8">
        {loading ? (
          <p className="py-16 text-center text-sm text-steel-light">
            Loading products…
          </p>
        ) : error ? (
          <p className="py-16 text-center text-sm text-red-600">{error}</p>
        ) : (
          <ProductsDataTable
            products={products}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <ProductFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={editingProduct}
        onSaved={() => {
          toast.success(
            editingProduct ? "Product updated." : "Product created.",
          );
          loadProducts();
        }}
      />
    </div>
  );
}
