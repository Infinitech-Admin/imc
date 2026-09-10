"use client";

// FILE PATH: components/admin/product-form-dialog.tsx

import * as React from "react";
import Image from "next/image";
import {
  X,
  Upload,
  GripVertical,
  Plus,
  Trash2,
  Info,
  ImageIcon,
  Table2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Product, SpecTable } from "@/types/product";
import { PRODUCT_CATEGORIES } from "@/lib/product-categories";
import { imageUrl } from "@/lib/image-url";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null; // null = creating new
  onSaved: () => void;
}

const MAX_FILES = 12;
const MAX_FILE_MB = 8;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const SPEC_COLUMNS = ["Density (Kg/m³)", "Thickness (mm)", "W x L (m x m)"];

interface SpecRow {
  density: string;
  thickness: string;
  dimensions: string;
}

const EMPTY_SPEC_ROW: SpecRow = { density: "", thickness: "", dimensions: "" };

function specTableToRows(table: SpecTable | null | undefined): SpecRow[] {
  if (!table || table.columns.length === 0) return [];
  return table.rows.map((row) => ({
    density: row[0] ?? "",
    thickness: row[1] ?? "",
    dimensions: row[2] ?? "",
  }));
}

function rowsToSpecTable(rows: SpecRow[]): SpecTable {
  const nonEmpty = rows.filter(
    (r) => r.density.trim() || r.thickness.trim() || r.dimensions.trim(),
  );
  return {
    columns: SPEC_COLUMNS,
    rows: nonEmpty.map((r) => [r.density, r.thickness, r.dimensions]),
  };
}

const TABS = [
  { key: "Info", label: "Info", icon: Info },
  { key: "Images", label: "Images", icon: ImageIcon },
  { key: "Specs", label: "Specs", icon: Table2 },
] as const;
type Tab = (typeof TABS)[number]["key"];

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  onSaved,
}: Props) {
  const [tab, setTab] = React.useState<Tab>("Info");

  const [name, setName] = React.useState("");
  const [category, setCategory] = React.useState<string>(""); // category NAME, e.g. "Insulation"
  const [summary, setSummary] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [highlights, setHighlights] = React.useState<string[]>([]);
  const [specRows, setSpecRows] = React.useState<SpecRow[]>([]);
  const [newFiles, setNewFiles] = React.useState<File[]>([]);
  const [removeIds, setRemoveIds] = React.useState<number[]>([]);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setTab("Info");
      setName(product?.name ?? "");
      // product.category comes back from the API as the related Category
      // object ({ id, name, slug, ... }) — the dropdown just needs its name.
      setCategory(product?.category?.name ?? "");
      setSummary(product?.summary ?? "");
      setDescription(product?.description ?? "");
      setHighlights(product?.highlights ?? []);
      setSpecRows(specTableToRows(product?.spec_table));
      setNewFiles([]);
      setRemoveIds([]);
      setError(null);
    }
  }, [open, product]);

  const existingImages = (product?.images ?? []).filter(
    (img) => !removeIds.includes(img.id),
  );
  const totalImageCount = existingImages.length + newFiles.length;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    e.target.value = "";

    const valid: File[] = [];
    for (const file of selected) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError(`"${file.name}" isn't a supported image type (jpg/png/webp).`);
        continue;
      }
      if (file.size > MAX_FILE_MB * 1024 * 1024) {
        setError(`"${file.name}" is over ${MAX_FILE_MB}MB.`);
        continue;
      }
      valid.push(file);
    }

    setNewFiles((prev) => {
      const combined = [...prev, ...valid];
      if (existingImages.length + combined.length > MAX_FILES) {
        setError(`You can have at most ${MAX_FILES} images per product.`);
        return combined.slice(0, MAX_FILES - existingImages.length);
      }
      return combined;
    });
  };

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (id: number) => {
    setRemoveIds((prev) => [...prev, id]);
  };

  const addHighlight = () => setHighlights((prev) => [...prev, ""]);
  const updateHighlight = (i: number, value: string) =>
    setHighlights((prev) => prev.map((h, idx) => (idx === i ? value : h)));
  const removeHighlight = (i: number) =>
    setHighlights((prev) => prev.filter((_, idx) => idx !== i));

  const addSpecRow = () =>
    setSpecRows((prev) => [...prev, { ...EMPTY_SPEC_ROW }]);

  const updateSpecRow = (rowIdx: number, field: keyof SpecRow, value: string) =>
    setSpecRows((prev) =>
      prev.map((row, idx) =>
        idx === rowIdx ? { ...row, [field]: value } : row,
      ),
    );

  const removeSpecRow = (rowIdx: number) =>
    setSpecRows((prev) => prev.filter((_, idx) => idx !== rowIdx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Product name is required.");
      setTab("Info");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.set("name", name.trim());
      formData.set("summary", summary.trim());
      formData.set("description", description.trim());

      if (category) {
        // Sent as a plain name — the backend finds or creates the
        // matching Category row and stores category_id itself.
        formData.set("category", category);
      }

      highlights
        .filter((h) => h.trim().length > 0)
        .forEach((h) => formData.append("highlights[]", h.trim()));

      const specTable = rowsToSpecTable(specRows);
      if (specTable.rows.length > 0) {
        formData.set("spec_table", JSON.stringify(specTable));
      }

      newFiles.forEach((file) => formData.append("images[]", file));

      if (product && removeIds.length > 0) {
        removeIds.forEach((id) =>
          formData.append("remove_image_ids[]", String(id)),
        );
      }

      const url = product ? `/api/products/${product.id}` : "/api/products";
      const method = product ? "PUT" : "POST";

      const res = await fetch(url, { method, body: formData });

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.message ?? "Failed to save product.");
      }

      onSaved();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[560px] max-w-4xl flex-col overflow-hidden p-0 sm:max-w-4xl">
        <DialogHeader className="border-b border-blue-100 px-6 py-4">
          <DialogTitle>{product ? "Edit product" : "Add product"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          <nav className="w-44 shrink-0 border-r border-blue-100 bg-sky-50/40 p-3">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors",
                  tab === key
                    ? "bg-white text-blue-900 shadow-sm ring-1 ring-blue-100"
                    : "text-steel hover:bg-white/60 hover:text-blue-800",
                )}
              >
                <Icon className="size-4 shrink-0" />
                {label}
                {key === "Images" && totalImageCount > 0 && (
                  <span className="ml-auto text-xs text-steel-light">
                    {totalImageCount}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <form
            id="product-form"
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto px-6 py-5"
          >
            {tab === "Info" && (
              <div className="mx-auto max-w-xl space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-blue-900">
                      Name
                    </label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. IMC Fiberglass Blanket"
                      className="mt-1.5"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-blue-900">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-1.5 w-full rounded-md border border-blue-100 bg-white px-3 py-2 text-sm text-blue-900 focus:border-blue-400 focus:outline-none"
                    >
                      <option value="">No category</option>
                      {PRODUCT_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-blue-900">
                    Summary
                  </label>
                  <Input
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="One-line summary shown on the products grid"
                    className="mt-1.5"
                    maxLength={300}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-blue-900">
                    Description
                  </label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Full description shown on the product detail page"
                    className="mt-1.5"
                    rows={3}
                    maxLength={5000}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-blue-900">
                      Highlights
                    </label>
                    <button
                      type="button"
                      onClick={addHighlight}
                      className="flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-orange-600"
                    >
                      <Plus className="size-3.5" /> Add
                    </button>
                  </div>
                  <div className="mt-2 space-y-2">
                    {highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <GripVertical className="size-4 shrink-0 text-steel-light" />
                        <Input
                          value={h}
                          onChange={(e) => updateHighlight(i, e.target.value)}
                          placeholder="e.g. Fiberglass blanket and board"
                        />
                        <button
                          type="button"
                          onClick={() => removeHighlight(i)}
                          className="shrink-0 text-steel-light hover:text-red-600"
                          aria-label="Remove highlight"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ))}
                    {highlights.length === 0 && (
                      <p className="text-xs text-steel-light">
                        No highlights added yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {tab === "Images" && (
              <div>
                <p className="text-xs text-steel-light">
                  JPG, PNG, or WEBP · up to {MAX_FILE_MB}MB each · up to{" "}
                  {MAX_FILES} total ({totalImageCount}/{MAX_FILES} used)
                </p>

                <div className="mt-3 grid grid-cols-4 gap-3 lg:grid-cols-5">
                  {existingImages.map((img) => (
                    <div
                      key={img.id}
                      className="group relative aspect-square overflow-hidden rounded-md border border-blue-100 bg-sky-50"
                    >
                      <Image
                        src={imageUrl(img.path)}
                        alt=""
                        fill
                        sizes="120px"
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(img.id)}
                        className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        aria-label="Remove image"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  ))}

                  {newFiles.map((file, i) => (
                    <div
                      key={i}
                      className="group relative aspect-square overflow-hidden rounded-md border border-emerald-200 bg-emerald-50"
                    >
                      <Image
                        src={URL.createObjectURL(file)}
                        alt=""
                        fill
                        sizes="120px"
                        className="object-cover"
                      />
                      <span className="absolute left-1 top-1 rounded bg-emerald-600 px-1 text-[9px] font-semibold text-white">
                        NEW
                      </span>
                      <button
                        type="button"
                        onClick={() => removeNewFile(i)}
                        className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        aria-label="Remove image"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  ))}

                  {totalImageCount < MAX_FILES && (
                    <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md border-2 border-dashed border-blue-200 text-steel-light transition-colors hover:border-blue-400 hover:text-blue-600">
                      <Upload className="size-5" />
                      <span className="text-[11px] font-medium">Add</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            )}

            {tab === "Specs" && (
              <div>
                <p className="text-xs text-steel-light">
                  Optional — sizes shown on the product page. Leave empty if
                  this product doesn't need a sizes table.
                </p>

                <div className="mt-3 overflow-x-auto rounded-md border border-blue-100">
                  <table className="w-full border-collapse text-sm">
                    <thead className="bg-sky-50">
                      <tr>
                        <th className="border-b border-blue-100 p-2 text-left font-semibold text-blue-900">
                          Density
                          <span className="block text-[11px] font-normal text-steel-light">
                            Kg/m³
                          </span>
                        </th>
                        <th className="border-b border-blue-100 p-2 text-left font-semibold text-blue-900">
                          Thickness
                          <span className="block text-[11px] font-normal text-steel-light">
                            mm
                          </span>
                        </th>
                        <th className="border-b border-blue-100 p-2 text-left font-semibold text-blue-900">
                          W x L
                          <span className="block text-[11px] font-normal text-steel-light">
                            m x m
                          </span>
                        </th>
                        <th className="w-10 border-b border-blue-100" />
                      </tr>
                    </thead>
                    <tbody>
                      {specRows.length === 0 && (
                        <tr>
                          <td
                            colSpan={4}
                            className="p-4 text-center text-xs text-steel-light"
                          >
                            No sizes added yet.
                          </td>
                        </tr>
                      )}
                      {specRows.map((row, ri) => (
                        <tr key={ri} className="odd:bg-white even:bg-sky-50/40">
                          <td className="p-2">
                            <Input
                              value={row.density}
                              onChange={(e) =>
                                updateSpecRow(ri, "density", e.target.value)
                              }
                              placeholder="e.g. 12 or 25,50,100"
                              className="h-8 bg-white text-xs"
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              value={row.thickness}
                              onChange={(e) =>
                                updateSpecRow(ri, "thickness", e.target.value)
                              }
                              placeholder="e.g. 50 or 25,50,100"
                              className="h-8 bg-white text-xs"
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              value={row.dimensions}
                              onChange={(e) =>
                                updateSpecRow(ri, "dimensions", e.target.value)
                              }
                              placeholder="e.g. 1.2x30.0"
                              className="h-8 bg-white text-xs"
                            />
                          </td>
                          <td className="text-center">
                            <button
                              type="button"
                              onClick={() => removeSpecRow(ri)}
                              className="text-steel-light hover:text-red-600"
                              aria-label="Remove this row"
                              title="Remove this row"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={4} className="p-2">
                          <button
                            type="button"
                            onClick={addSpecRow}
                            className="flex w-full items-center justify-center gap-1 rounded-md border border-dashed border-blue-200 py-1.5 text-xs font-medium text-blue-700 hover:border-blue-400 hover:bg-blue-50"
                          >
                            <Plus className="size-3.5" /> Add a size
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {error && (
              <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}
          </form>
        </div>

        <DialogFooter className="border-t border-blue-100 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" form="product-form" disabled={saving}>
            {saving ? "Saving…" : product ? "Save changes" : "Create product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
