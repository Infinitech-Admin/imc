"use client";

// FILE PATH: components/admin/products-data-table.tsx

import * as React from "react";
import Image from "next/image";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

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

export function ProductsDataTable({ products, onEdit, onDelete }: Props) {
  const [pendingDelete, setPendingDelete] = React.useState<Product | null>(
    null,
  );
  const [deleting, setDeleting] = React.useState(false);

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
    <div>
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
            {products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-12 text-center text-sm text-steel-light"
                >
                  No products yet.
                </TableCell>
              </TableRow>
            ) : (
              products.map((p) => (
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
