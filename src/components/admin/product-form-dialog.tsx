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
  Sparkles,
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

const DEFAULT_TABLE_COLUMNS = ["Column 1", "Column 2", "Column 3"];
const MAX_COLUMNS = 8;

const DEFAULT_MATRIX_LABEL_COLUMNS = ["Label 1", "Label 2"];
const DEFAULT_MATRIX_FEATURE_COLUMNS = ["Option 1", "Option 2", "Option 3"];
const MAX_MATRIX_LABEL_COLUMNS = 3;
const MAX_MATRIX_FEATURE_COLUMNS = 10;

type SpecMode = "table" | "list" | "matrix";

interface ListItem {
  label: string;
  value: string;
  /** True only for labels that came from a template — keeps them from
   * being retyped by accident. Items added afterward via "+ Add an item"
   * are never locked, even while a template is active. */
  locked?: boolean;
}

/**
 * For "availability grid" specs — a fixed set of identifying columns (e.g.
 * Inch / mm) plus a fixed set of yes/no feature columns (e.g. wall
 * thicknesses), where any row can be missing some of the features. Editing
 * with checkboxes instead of typed "*" marks means adding a new size never
 * risks an inconsistent symbol, and leaving a feature unchecked is exactly
 * how a size that doesn't come in that option gets represented.
 */
interface MatrixRow {
  labels: string[];
  checks: boolean[];
}

/**
 * Pre-built column/label sets so admins pick a layout instead of inventing
 * column names by hand — the #1 source of inconsistent units across
 * products (e.g. "Kg/m³" on one product, "Inch" on the next, for what's
 * meant to be the same column). Applying a template only sets the
 * headers/labels; the admin still types every value themselves.
 */
interface SpecTemplate {
  id: string;
  label: string;
  hint: string;
  mode: SpecMode;
  columns?: string[]; // used when mode === "table"
  itemLabels?: string[]; // used when mode === "list"
  matrixLabelColumns?: string[]; // used when mode === "matrix"
  matrixFeatureColumns?: string[]; // used when mode === "matrix"
}

const SPEC_TEMPLATES: SpecTemplate[] = [
  {
    id: "pipe-size-matrix",
    label: "Pipe size availability (checklist)",
    hint: "Inch / mm rows × wall-thickness columns, checkbox per size — e.g. Fiberglass Pipe",
    mode: "matrix",
    matrixLabelColumns: ["Inch", "mm"],
    matrixFeatureColumns: ["25", "38", "50", "64", "75"],
  },
  {
    id: "named-sizing-pcs",
    label: "Name / Size / PCS per CTN / Ratio",
    hint: "NAME, SIZE, PCS/CTN, RATIO/m² — e.g. T-Runners",
    mode: "table",
    columns: ["NAME", "SIZE", "PCS/CTN", "RATIO/m²"],
  },
  {
    id: "named-sizing-no-pcs",
    label: "Name / Size / Ratio (no PCS)",
    hint: "NAME, SIZE, RATIO/m² — for products sold without a per-carton count",
    mode: "table",
    columns: ["NAME", "SIZE", "RATIO/m²"],
  },
  {
    id: "size-thickness",
    label: "Size & thickness",
    hint: "Size, Thickness — e.g. boards and sheets",
    mode: "list",
    itemLabels: ["Size", "Thickness"],
  },
  {
    id: "general-specs",
    label: "General specs",
    hint: "Size, Color, Material, Standard/Certification",
    mode: "list",
    itemLabels: ["Size", "Color", "Material", "Standard/Certification"],
  },
];

/** Splits saved spec_table data into the two editor states below. */
function loadSpecState(table: SpecTable | null | undefined): {
  mode: SpecMode;
  columns: string[];
  rows: string[][];
  listItems: ListItem[];
} {
  if (!table || (table.columns.length === 0 && table.rows.length === 0)) {
    return {
      mode: "table",
      columns: DEFAULT_TABLE_COLUMNS,
      rows: [],
      listItems: [],
    };
  }

  if (table.type === "list") {
    return {
      mode: "list",
      columns: DEFAULT_TABLE_COLUMNS,
      rows: [],
      listItems: table.rows.map((r) => ({
        label: r[0] ?? "",
        value: r[1] ?? "",
      })),
    };
  }

  const columns =
    table.columns.length > 0 ? table.columns : DEFAULT_TABLE_COLUMNS;
  const rows = table.rows.map((r) => columns.map((_, i) => r[i] ?? ""));
  return { mode: "table", columns, rows, listItems: [] };
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

  // --- Specs editor state ---
  const [specMode, setSpecMode] = React.useState<SpecMode>("table");
  const [specColumns, setSpecColumns] = React.useState<string[]>(
    DEFAULT_TABLE_COLUMNS,
  );
  const [specRows, setSpecRows] = React.useState<string[][]>([]);
  const [listItems, setListItems] = React.useState<ListItem[]>([]);
  const [matrixLabelColumns, setMatrixLabelColumns] = React.useState<string[]>(
    DEFAULT_MATRIX_LABEL_COLUMNS,
  );
  const [matrixFeatureColumns, setMatrixFeatureColumns] = React.useState<
    string[]
  >(DEFAULT_MATRIX_FEATURE_COLUMNS);
  const [matrixRows, setMatrixRows] = React.useState<MatrixRow[]>([]);
  const [appliedTemplateId, setAppliedTemplateId] = React.useState<
    string | null
  >(null);

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

      const spec = loadSpecState(product?.spec_table);
      setSpecMode(spec.mode);
      setSpecColumns(spec.columns);
      setSpecRows(spec.rows);
      setListItems(spec.listItems);
      // The checklist/matrix editor is a guided way to build a spec table —
      // it isn't a separate saved format, so re-opening an existing product
      // always lands in the plain Table view above (still fully editable).
      setMatrixLabelColumns(DEFAULT_MATRIX_LABEL_COLUMNS);
      setMatrixFeatureColumns(DEFAULT_MATRIX_FEATURE_COLUMNS);
      setMatrixRows([]);
      setAppliedTemplateId(null);

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

  // --- Template handling ---
  const specHasData =
    specMode === "table"
      ? specRows.some((row) => row.some((cell) => cell.trim().length > 0))
      : specMode === "list"
        ? listItems.some(
            (it) => it.label.trim().length > 0 || it.value.trim().length > 0,
          )
        : matrixRows.some(
            (r) =>
              r.labels.some((l) => l.trim().length > 0) ||
              r.checks.some(Boolean),
          );

  const applyTemplate = (templateId: string) => {
    const template = SPEC_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;

    if (specHasData) {
      const confirmed = window.confirm(
        "Applying a template replaces the current columns/labels and clears any values you've already entered. Continue?",
      );
      if (!confirmed) return;
    }

    if (template.mode === "table") {
      setSpecMode("table");
      setSpecColumns(template.columns ?? DEFAULT_TABLE_COLUMNS);
      setSpecRows([]);
    } else if (template.mode === "list") {
      setSpecMode("list");
      setListItems(
        (template.itemLabels ?? []).map((label) => ({
          label,
          value: "",
          locked: true,
        })),
      );
    } else {
      setSpecMode("matrix");
      setMatrixLabelColumns(
        template.matrixLabelColumns ?? DEFAULT_MATRIX_LABEL_COLUMNS,
      );
      setMatrixFeatureColumns(
        template.matrixFeatureColumns ?? DEFAULT_MATRIX_FEATURE_COLUMNS,
      );
      setMatrixRows([]);
    }
    setAppliedTemplateId(template.id);
  };

  const switchToCustom = (mode: SpecMode) => {
    setSpecMode(mode);
    if (mode === "matrix") {
      setMatrixLabelColumns(DEFAULT_MATRIX_LABEL_COLUMNS);
      setMatrixFeatureColumns(DEFAULT_MATRIX_FEATURE_COLUMNS);
      setMatrixRows([]);
    }
    setAppliedTemplateId(null);
  };

  // --- Table mode handlers ---
  const addColumn = () => {
    if (specColumns.length >= MAX_COLUMNS) return;
    setSpecColumns((prev) => [...prev, `Column ${prev.length + 1}`]);
    setSpecRows((prev) => prev.map((row) => [...row, ""]));
    setAppliedTemplateId(null);
  };
  const updateColumnName = (colIdx: number, value: string) => {
    setSpecColumns((prev) => prev.map((c, i) => (i === colIdx ? value : c)));
    setAppliedTemplateId(null);
  };
  const removeColumn = (colIdx: number) => {
    if (specColumns.length <= 1) return;
    setSpecColumns((prev) => prev.filter((_, i) => i !== colIdx));
    setSpecRows((prev) =>
      prev.map((row) => row.filter((_, i) => i !== colIdx)),
    );
    setAppliedTemplateId(null);
  };
  const addTableRow = () =>
    setSpecRows((prev) => [...prev, specColumns.map(() => "")]);
  const updateTableCell = (rowIdx: number, colIdx: number, value: string) =>
    setSpecRows((prev) =>
      prev.map((row, ri) =>
        ri === rowIdx ? row.map((c, ci) => (ci === colIdx ? value : c)) : row,
      ),
    );
  const removeTableRow = (rowIdx: number) =>
    setSpecRows((prev) => prev.filter((_, idx) => idx !== rowIdx));

  // --- List mode handlers ---
  const addListItem = () =>
    setListItems((prev) => [...prev, { label: "", value: "", locked: false }]);
  const updateListItem = (
    idx: number,
    field: keyof ListItem,
    value: string,
  ) => {
    setListItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, [field]: value } : it)),
    );
  };
  const removeListItem = (idx: number) =>
    setListItems((prev) => prev.filter((_, i) => i !== idx));

  // --- Matrix (checklist) mode handlers ---
  const addMatrixLabelColumn = () => {
    if (matrixLabelColumns.length >= MAX_MATRIX_LABEL_COLUMNS) return;
    setMatrixLabelColumns((prev) => [...prev, `Label ${prev.length + 1}`]);
    setMatrixRows((prev) =>
      prev.map((r) => ({ ...r, labels: [...r.labels, ""] })),
    );
  };
  const updateMatrixLabelColumn = (idx: number, value: string) =>
    setMatrixLabelColumns((prev) =>
      prev.map((c, i) => (i === idx ? value : c)),
    );
  const removeMatrixLabelColumn = (idx: number) => {
    if (matrixLabelColumns.length <= 1) return;
    setMatrixLabelColumns((prev) => prev.filter((_, i) => i !== idx));
    setMatrixRows((prev) =>
      prev.map((r) => ({
        ...r,
        labels: r.labels.filter((_, i) => i !== idx),
      })),
    );
  };

  const addMatrixFeatureColumn = () => {
    if (matrixFeatureColumns.length >= MAX_MATRIX_FEATURE_COLUMNS) return;
    setMatrixFeatureColumns((prev) => [...prev, `Option ${prev.length + 1}`]);
    setMatrixRows((prev) =>
      prev.map((r) => ({ ...r, checks: [...r.checks, false] })),
    );
  };
  const updateMatrixFeatureColumn = (idx: number, value: string) =>
    setMatrixFeatureColumns((prev) =>
      prev.map((c, i) => (i === idx ? value : c)),
    );
  const removeMatrixFeatureColumn = (idx: number) => {
    if (matrixFeatureColumns.length <= 1) return;
    setMatrixFeatureColumns((prev) => prev.filter((_, i) => i !== idx));
    setMatrixRows((prev) =>
      prev.map((r) => ({
        ...r,
        checks: r.checks.filter((_, i) => i !== idx),
      })),
    );
  };

  const addMatrixRow = () =>
    setMatrixRows((prev) => [
      ...prev,
      {
        labels: matrixLabelColumns.map(() => ""),
        checks: matrixFeatureColumns.map(() => false),
      },
    ]);
  const updateMatrixRowLabel = (
    rowIdx: number,
    labelIdx: number,
    value: string,
  ) =>
    setMatrixRows((prev) =>
      prev.map((r, ri) =>
        ri === rowIdx
          ? {
              ...r,
              labels: r.labels.map((l, li) => (li === labelIdx ? value : l)),
            }
          : r,
      ),
    );
  const toggleMatrixCheck = (rowIdx: number, featureIdx: number) =>
    setMatrixRows((prev) =>
      prev.map((r, ri) =>
        ri === rowIdx
          ? {
              ...r,
              checks: r.checks.map((c, ci) => (ci === featureIdx ? !c : c)),
            }
          : r,
      ),
    );
  const removeMatrixRow = (rowIdx: number) =>
    setMatrixRows((prev) => prev.filter((_, idx) => idx !== rowIdx));

  const buildSpecTable = (): SpecTable | null => {
    if (specMode === "list") {
      const nonEmpty = listItems.filter(
        (it) => it.label.trim() || it.value.trim(),
      );
      if (nonEmpty.length === 0) return null;
      return {
        type: "list",
        columns: ["Label", "Value"],
        rows: nonEmpty.map((it) => [it.label.trim(), it.value.trim()]),
      };
    }

    if (specMode === "matrix") {
      // Saved as a plain table — a checked box just becomes a "✓" cell —
      // so the product page needs no changes and re-opening this product
      // later shows an ordinary, still fully editable, table.
      const nonEmptyRows = matrixRows.filter(
        (r) =>
          r.labels.some((l) => l.trim().length > 0) || r.checks.some(Boolean),
      );
      if (nonEmptyRows.length === 0) return null;
      const trimmedLabelCols = matrixLabelColumns.map(
        (c) => c.trim() || "Column",
      );
      const trimmedFeatureCols = matrixFeatureColumns.map(
        (c) => c.trim() || "Option",
      );
      return {
        type: "table",
        columns: [...trimmedLabelCols, ...trimmedFeatureCols],
        rows: nonEmptyRows.map((r) => [
          ...r.labels.map((l) => l.trim()),
          ...r.checks.map((c) => (c ? "✓" : "")),
        ]),
      };
    }

    const trimmedColumns = specColumns.map((c) => c.trim() || "Column");
    const nonEmptyRows = specRows.filter((row) =>
      row.some((cell) => cell.trim().length > 0),
    );
    if (nonEmptyRows.length === 0) return null;
    return {
      type: "table",
      columns: trimmedColumns,
      rows: nonEmptyRows,
    };
  };

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

      const specTable = buildSpecTable();
      if (specTable) {
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
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <p className="max-w-[240px] text-xs text-steel-light">
                    Optional — shown on the product page. Start from a template
                    so column names and units stay consistent across products.
                  </p>

                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="size-3.5 text-blue-500" />
                      <select
                        value=""
                        onChange={(e) => {
                          if (e.target.value) applyTemplate(e.target.value);
                        }}
                        className="rounded-md border border-blue-200 bg-white px-2 py-1.5 text-xs font-medium text-blue-900 focus:border-blue-400 focus:outline-none"
                      >
                        <option value="" disabled>
                          Use a template…
                        </option>
                        <optgroup label="Checklist layouts">
                          {SPEC_TEMPLATES.filter(
                            (t) => t.mode === "matrix",
                          ).map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.label}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="Table layouts">
                          {SPEC_TEMPLATES.filter((t) => t.mode === "table").map(
                            (t) => (
                              <option key={t.id} value={t.id}>
                                {t.label}
                              </option>
                            ),
                          )}
                        </optgroup>
                        <optgroup label="List layouts">
                          {SPEC_TEMPLATES.filter((t) => t.mode === "list").map(
                            (t) => (
                              <option key={t.id} value={t.id}>
                                {t.label}
                              </option>
                            ),
                          )}
                        </optgroup>
                      </select>

                      <div className="flex items-center gap-1 rounded-md border border-blue-100 bg-sky-50/60 p-0.5">
                        <button
                          type="button"
                          onClick={() => switchToCustom("table")}
                          className={cn(
                            "rounded px-2.5 py-1 text-xs font-semibold transition-colors",
                            specMode === "table"
                              ? "bg-white text-blue-900 shadow-sm"
                              : "text-steel-light hover:text-blue-700",
                          )}
                        >
                          Table
                        </button>
                        <button
                          type="button"
                          onClick={() => switchToCustom("list")}
                          className={cn(
                            "rounded px-2.5 py-1 text-xs font-semibold transition-colors",
                            specMode === "list"
                              ? "bg-white text-blue-900 shadow-sm"
                              : "text-steel-light hover:text-blue-700",
                          )}
                        >
                          List
                        </button>
                        <button
                          type="button"
                          onClick={() => switchToCustom("matrix")}
                          className={cn(
                            "rounded px-2.5 py-1 text-xs font-semibold transition-colors",
                            specMode === "matrix"
                              ? "bg-white text-blue-900 shadow-sm"
                              : "text-steel-light hover:text-blue-700",
                          )}
                        >
                          Checklist
                        </button>
                      </div>
                    </div>

                    {appliedTemplateId && (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-700">
                        <Sparkles className="size-3" />
                        {
                          SPEC_TEMPLATES.find((t) => t.id === appliedTemplateId)
                            ?.label
                        }{" "}
                        template applied
                      </span>
                    )}
                  </div>
                </div>

                {specMode === "matrix" && (
                  <>
                    <p className="mt-2 text-[11px] text-steel-light">
                      {appliedTemplateId
                        ? "Identifying columns and options come from the template — add a row per size and tick whichever options it comes in."
                        : "Custom checklist — name the identifying columns (e.g. Inch, mm) and the yes/no options (e.g. wall thickness in mm), then tick a box for every combination this size supports."}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-4">
                      <div>
                        <p className="text-[11px] font-semibold text-blue-900">
                          Identifying columns
                        </p>
                        <div className="mt-1.5 space-y-1.5">
                          {matrixLabelColumns.map((col, ci) => (
                            <div key={ci} className="flex items-center gap-1">
                              <Input
                                value={col}
                                onChange={(e) =>
                                  updateMatrixLabelColumn(ci, e.target.value)
                                }
                                placeholder={`Label ${ci + 1}`}
                                className="h-7 w-32 bg-white text-xs font-semibold"
                              />
                              {matrixLabelColumns.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeMatrixLabelColumn(ci)}
                                  className="shrink-0 text-steel-light hover:text-red-600"
                                  aria-label="Remove identifying column"
                                >
                                  <X className="size-3.5" />
                                </button>
                              )}
                            </div>
                          ))}
                          {matrixLabelColumns.length <
                            MAX_MATRIX_LABEL_COLUMNS && (
                            <button
                              type="button"
                              onClick={addMatrixLabelColumn}
                              className="flex items-center gap-1 text-[11px] font-medium text-blue-700 hover:text-orange-600"
                            >
                              <Plus className="size-3" /> Add column
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex-1">
                        <p className="text-[11px] font-semibold text-blue-900">
                          Options (checkbox per row)
                        </p>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {matrixFeatureColumns.map((col, ci) => (
                            <div
                              key={ci}
                              className="flex items-center gap-1 rounded-md border border-blue-100 bg-white px-1.5 py-1"
                            >
                              <Input
                                value={col}
                                onChange={(e) =>
                                  updateMatrixFeatureColumn(ci, e.target.value)
                                }
                                placeholder={`Option ${ci + 1}`}
                                className="h-6 w-16 border-0 p-0 text-center text-xs font-semibold focus-visible:ring-0"
                              />
                              {matrixFeatureColumns.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeMatrixFeatureColumn(ci)}
                                  className="shrink-0 text-steel-light hover:text-red-600"
                                  aria-label="Remove option"
                                >
                                  <X className="size-3" />
                                </button>
                              )}
                            </div>
                          ))}
                          {matrixFeatureColumns.length <
                            MAX_MATRIX_FEATURE_COLUMNS && (
                            <button
                              type="button"
                              onClick={addMatrixFeatureColumn}
                              className="flex items-center gap-1 rounded-md border border-dashed border-blue-200 px-2 py-1 text-[11px] font-medium text-blue-700 hover:border-blue-400 hover:bg-blue-50"
                            >
                              <Plus className="size-3" /> Add option
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 overflow-x-auto rounded-md border border-blue-100">
                      <table className="w-full border-collapse text-sm">
                        <thead className="bg-sky-50">
                          <tr>
                            {matrixLabelColumns.map((col, ci) => (
                              <th
                                key={`l-${ci}`}
                                className="border-b border-blue-100 p-2 text-left text-xs font-semibold text-blue-900"
                              >
                                {col || `Label ${ci + 1}`}
                              </th>
                            ))}
                            {matrixFeatureColumns.map((col, ci) => (
                              <th
                                key={`f-${ci}`}
                                className="border-b border-blue-100 p-2 text-center text-xs font-semibold text-blue-900"
                              >
                                {col || `Option ${ci + 1}`}
                              </th>
                            ))}
                            <th className="w-10 border-b border-blue-100" />
                          </tr>
                        </thead>
                        <tbody>
                          {matrixRows.length === 0 && (
                            <tr>
                              <td
                                colSpan={
                                  matrixLabelColumns.length +
                                  matrixFeatureColumns.length +
                                  1
                                }
                                className="p-4 text-center text-xs text-steel-light"
                              >
                                No sizes added yet.
                              </td>
                            </tr>
                          )}
                          {matrixRows.map((row, ri) => (
                            <tr
                              key={ri}
                              className="odd:bg-white even:bg-sky-50/40"
                            >
                              {row.labels.map((val, li) => (
                                <td key={`l-${li}`} className="p-2">
                                  <Input
                                    value={val}
                                    onChange={(e) =>
                                      updateMatrixRowLabel(
                                        ri,
                                        li,
                                        e.target.value,
                                      )
                                    }
                                    placeholder={
                                      matrixLabelColumns[li] || "Value"
                                    }
                                    className="h-8 w-20 bg-white text-xs"
                                  />
                                </td>
                              ))}
                              {row.checks.map((checked, fi) => (
                                <td key={`f-${fi}`} className="p-2 text-center">
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => toggleMatrixCheck(ri, fi)}
                                    className="size-4 rounded border-blue-300 text-blue-600 focus:ring-blue-400"
                                    aria-label={`${matrixFeatureColumns[fi] || "Option"} available`}
                                  />
                                </td>
                              ))}
                              <td className="text-center">
                                <button
                                  type="button"
                                  onClick={() => removeMatrixRow(ri)}
                                  className="text-steel-light hover:text-red-600"
                                  aria-label="Remove this size"
                                  title="Remove this size"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td
                              colSpan={
                                matrixLabelColumns.length +
                                matrixFeatureColumns.length +
                                1
                              }
                              className="p-2"
                            >
                              <button
                                type="button"
                                onClick={addMatrixRow}
                                className="flex w-full items-center justify-center gap-1 rounded-md border border-dashed border-blue-200 py-1.5 text-xs font-medium text-blue-700 hover:border-blue-400 hover:bg-blue-50"
                              >
                                <Plus className="size-3.5" /> Add a size
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                {specMode === "table" && (
                  <>
                    <p className="mt-2 text-[11px] text-steel-light">
                      {appliedTemplateId
                        ? "Column names and units come from the template — fill in the values below, or click the × on a column (e.g. PCS/CTN) if this product doesn't have it."
                        : "Custom layout — name each column yourself, e.g. NAME / SIZE / PCS/CTN / RATIO/m²."}
                    </p>

                    <div className="mt-3 overflow-x-auto rounded-md border border-blue-100">
                      <table className="w-full border-collapse text-sm">
                        <thead className="bg-sky-50">
                          <tr>
                            {specColumns.map((col, ci) => (
                              <th
                                key={ci}
                                className="border-b border-blue-100 p-2 text-left font-semibold text-blue-900"
                              >
                                <div className="flex items-center gap-1">
                                  <Input
                                    value={col}
                                    onChange={(e) =>
                                      updateColumnName(ci, e.target.value)
                                    }
                                    placeholder={`Column ${ci + 1}`}
                                    className="h-7 bg-white text-xs font-semibold"
                                  />
                                  {specColumns.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeColumn(ci)}
                                      className="shrink-0 text-steel-light hover:text-red-600"
                                      aria-label="Remove column"
                                      title="Remove column"
                                    >
                                      <X className="size-3.5" />
                                    </button>
                                  )}
                                </div>
                              </th>
                            ))}
                            <th className="w-10 border-b border-blue-100" />
                          </tr>
                        </thead>
                        <tbody>
                          {specRows.length === 0 && (
                            <tr>
                              <td
                                colSpan={specColumns.length + 1}
                                className="p-4 text-center text-xs text-steel-light"
                              >
                                No rows added yet.
                              </td>
                            </tr>
                          )}
                          {specRows.map((row, ri) => (
                            <tr
                              key={ri}
                              className="odd:bg-white even:bg-sky-50/40"
                            >
                              {row.map((cell, ci) => (
                                <td key={ci} className="p-2">
                                  <Input
                                    value={cell}
                                    onChange={(e) =>
                                      updateTableCell(ri, ci, e.target.value)
                                    }
                                    placeholder="Value"
                                    className="h-8 bg-white text-xs"
                                  />
                                </td>
                              ))}
                              <td className="text-center">
                                <button
                                  type="button"
                                  onClick={() => removeTableRow(ri)}
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
                            <td
                              colSpan={specColumns.length + 1}
                              className="p-2"
                            >
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={addTableRow}
                                  className="flex flex-1 items-center justify-center gap-1 rounded-md border border-dashed border-blue-200 py-1.5 text-xs font-medium text-blue-700 hover:border-blue-400 hover:bg-blue-50"
                                >
                                  <Plus className="size-3.5" /> Add a row
                                </button>
                                {specColumns.length < MAX_COLUMNS && (
                                  <button
                                    type="button"
                                    onClick={addColumn}
                                    className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md border border-dashed border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-700 hover:border-blue-400 hover:bg-blue-50"
                                  >
                                    <Plus className="size-3.5" /> Add column
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                {specMode === "list" && (
                  <>
                    <p className="mt-2 text-[11px] text-steel-light">
                      {appliedTemplateId
                        ? "Labels come from the template — fill in the values below, remove a row (×) if this product doesn't have it, or add extra rows of your own."
                        : 'Custom layout — e.g. "Size: 3x6, 4x8 Feet" or "Thickness: 3.5, 4.5, 6, 9, 12, 18mm".'}
                    </p>

                    <div className="mt-3 space-y-2">
                      {listItems.map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Input
                            value={item.label}
                            onChange={(e) =>
                              updateListItem(i, "label", e.target.value)
                            }
                            placeholder="Label, e.g. Size"
                            className="w-40 shrink-0"
                            readOnly={item.locked}
                          />
                          <Input
                            value={item.value}
                            onChange={(e) =>
                              updateListItem(i, "value", e.target.value)
                            }
                            placeholder="Value, e.g. 3x6, 4x8 Feet"
                          />
                          <button
                            type="button"
                            onClick={() => removeListItem(i)}
                            className="shrink-0 text-steel-light hover:text-red-600"
                            aria-label="Remove this item"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      ))}
                      {listItems.length === 0 && (
                        <p className="text-xs text-steel-light">
                          No items added yet.
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={addListItem}
                        className="flex w-full items-center justify-center gap-1 rounded-md border border-dashed border-blue-200 py-1.5 text-xs font-medium text-blue-700 hover:border-blue-400 hover:bg-blue-50"
                      >
                        <Plus className="size-3.5" /> Add an item
                      </button>
                    </div>
                  </>
                )}
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
