"use client";

// FILE PATH: components/admin/products-data-table.tsx

import * as React from "react";
import Image from "next/image";
import { MoreHorizontal, Pencil, Trash2, LayoutGrid } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import type { Product } from "@/types/product";
import { imageUrl } from "@/lib/image-url";
import { cn } from "@/lib/utils";

interface Props {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => Promise<void>;
}

const UNCATEGORIZED_KEY = "__uncategorized__";

export function ProductsDataTable({ products, onEdit, onDelete }: Props) {
  const [pendingDelete, setPendingDelete] = React.useState<Product | null>(
    null,
  );
  const [deleting, setDeleting] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null,
  ); // null = "All"

  // Build the sidebar list: one entry per distinct category name found in
  // products, plus an "Uncategorized" bucket for products with no
  // category, each with a live count. Sorted alphabetically so the list
  // order doesn't jump around as products change.
  const categoryGroups = React.useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of products) {
      const key = p.category?.name ?? UNCATEGORIZED_KEY;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => {
        if (a[0] === UNCATEGORIZED_KEY) return 1;
        if (b[0] === UNCATEGORIZED_KEY) return -1;
        return a[0].localeCompare(b[0]);
      })
      .map(([name, count]) => ({ name, count }));
  }, [products]);

  const filteredProducts = React.useMemo(() => {
    if (selectedCategory === null) return products;
    if (selectedCategory === UNCATEGORIZED_KEY) {
      return products.filter((p) => !p.category?.name);
    }
    return products.filter((p) => p.category?.name === selectedCategory);
  }, [products, selectedCategory]);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await onDelete(pendingDelete);
      setPendingDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex gap-4">
      {/* Left nav: category filter buttons */}
      <nav className="w-52 shrink-0 space-y-1 rounded-md border border-blue-100 bg-sky-50/40 p-3">
        <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-steel-light">
          Categories
        </p>

        <button
          type="button"
          onClick={() => setSelectedCategory(null)}
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors",
            selectedCategory === null
              ? "bg-white text-blue-900 shadow-sm ring-1 ring-blue-100"
              : "text-steel hover:bg-white/60 hover:text-blue-800",
          )}
        >
          <LayoutGrid className="size-4 shrink-0" />
          All
          <span className="ml-auto text-xs text-steel-light">
            {products.length}
          </span>
        </button>

        {categoryGroups.map(({ name, count }) => (
          <button
            key={name}
            type="button"
            onClick={() => setSelectedCategory(name)}
            className={cn(
              "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors",
              selectedCategory === name
                ? "bg-white text-blue-900 shadow-sm ring-1 ring-blue-100"
                : "text-steel hover:bg-white/60 hover:text-blue-800",
            )}
          >
            <span className="truncate">
              {name === UNCATEGORIZED_KEY ? "Uncategorized" : name}
            </span>
            <span className="ml-auto shrink-0 text-xs text-steel-light">
              {count}
            </span>
          </button>
        ))}
      </nav>

      {/* Table */}
      <div className="min-w-0 flex-1">
        <div className="overflow-x-auto rounded-md border border-blue-100">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20 pr-4">Photo</TableHead>
                <TableHead className="pl-2">Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Summary</TableHead>
                <TableHead className="w-20 text-center">Images</TableHead>
                <TableHead className="w-12 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-12 text-center text-sm text-steel-light"
                  >
                    {products.length === 0
                      ? "No products yet."
                      : "No products in this category."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((p) => (
                  <TableRow
                    key={p.id}
                    onClick={() => onEdit(p)}
                    className="cursor-pointer hover:bg-sky-50/60"
                  >
                    <TableCell className="pr-4">
                      <div className="relative size-10 overflow-hidden rounded bg-sky-50">
                        <Image
                          src={imageUrl(p.cover_image)}
                          alt={p.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="pl-2 font-medium text-blue-900">
                      {p.name}
                    </TableCell>
                    <TableCell className="text-steel">
                      {p.category?.name ?? "—"}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-steel">
                      {p.summary || "—"}
                    </TableCell>
                    <TableCell className="text-center text-steel">
                      {p.images.length}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          onClick={(e) => e.stopPropagation()}
                          className={cn(
                            buttonVariants({ variant: "ghost", size: "icon" }),
                          )}
                          aria-label="Row actions"
                        >
                          <MoreHorizontal className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <DropdownMenuItem onClick={() => onEdit(p)}>
                            <Pencil className="mr-2 size-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setPendingDelete(p)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 size-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{pendingDelete?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the product and all of its uploaded
              images. This can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
