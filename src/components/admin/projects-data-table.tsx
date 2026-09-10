"use client";

// FILE PATH: components/admin/projects-data-table.tsx

import * as React from "react";
import Image from "next/image";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import type { Project, ProjectCategory } from "@/types/project";
import { cn } from "@/lib/utils";

const API_IMAGE_URL = process.env.NEXT_PUBLIC_API_IMAGE_URL ?? "";

function imageUrl(path?: string | null): string {
  if (!path) return "/placeholder-project.jpg";
  if (path.startsWith("http")) return path;
  return `${API_IMAGE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

const PAGE_SIZE = 10;

const categoryLabel: Record<ProjectCategory, string> = {
  ongoing: "On-going",
  finished: "Finished",
  supplied: "Supplied",
};

const categoryTone: Record<ProjectCategory, string> = {
  ongoing: "bg-amber-50 text-amber-700 border-amber-200",
  finished: "bg-emerald-50 text-emerald-700 border-emerald-200",
  supplied: "bg-sky-50 text-blue-700 border-blue-200",
};

interface Props {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => Promise<void>;
}

interface PreviewState {
  project: Project;
  index: number;
}

export function ProjectsDataTable({ projects, onEdit, onDelete }: Props) {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<ProjectCategory | "all">(
    "all",
  );
  const [page, setPage] = React.useState(1);
  const [pendingDelete, setPendingDelete] = React.useState<Project | null>(
    null,
  );
  const [deleting, setDeleting] = React.useState(false);
  const [preview, setPreview] = React.useState<PreviewState | null>(null);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      const matchesCategory = category === "all" || p.category === category;
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.location ?? "").toLowerCase().includes(q) ||
        (p.year ?? "").toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [projects, query, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  React.useEffect(() => {
    setPage(1);
  }, [query, category]);

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

  const showPrev = () => {
    setPreview((p) =>
      p
        ? {
            ...p,
            index:
              (p.index - 1 + p.project.images.length) % p.project.images.length,
          }
        : p,
    );
  };

  const showNext = () => {
    setPreview((p) =>
      p ? { ...p, index: (p.index + 1) % p.project.images.length } : p,
    );
  };

  const activeImage = preview?.project.images[preview.index];

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-steel-light" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects…"
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(["all", "ongoing", "finished", "supplied"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                category === c
                  ? "bg-blue-900 text-white"
                  : "bg-sky-50 text-blue-700 hover:bg-sky-100",
              )}
            >
              {c === "all" ? "All" : categoryLabel[c]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-md border border-blue-100">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24 pr-4">Photos</TableHead>
              <TableHead className="pl-2">Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Year</TableHead>
              <TableHead className="w-12 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-12 text-center text-sm text-steel-light"
                >
                  No projects found.
                </TableCell>
              </TableRow>
            ) : (
              paged.map((p) => {
                const cover = p.images[0]?.path;
                const extraCount = Math.max(0, p.images.length - 1);
                const hasImages = p.images.length > 0;

                return (
                  <TableRow key={p.id}>
                    <TableCell className="pr-4">
                      <button
                        type="button"
                        onClick={() =>
                          hasImages && setPreview({ project: p, index: 0 })
                        }
                        disabled={!hasImages}
                        className={cn(
                          "relative size-10 overflow-hidden rounded bg-sky-50",
                          hasImages &&
                            "cursor-pointer transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900 focus-visible:ring-offset-1",
                        )}
                        aria-label={
                          hasImages
                            ? `View photos for ${p.name}`
                            : "No photos available"
                        }
                      >
                        <Image
                          src={imageUrl(cover)}
                          alt={p.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                        {extraCount > 0 && (
                          <span className="absolute bottom-0 right-0 rounded-tl bg-black/70 px-1 text-[9px] font-semibold leading-tight text-white">
                            +{extraCount}
                          </span>
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="pl-2 font-medium text-blue-900">
                      {p.name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={categoryTone[p.category]}
                      >
                        {categoryLabel[p.category]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-steel">
                      {p.location || "—"}
                    </TableCell>
                    <TableCell className="text-steel">
                      {p.year || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          className={cn(
                            buttonVariants({ variant: "ghost", size: "icon" }),
                          )}
                          aria-label="Row actions"
                        >
                          <MoreHorizontal className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
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
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-steel">
          <span>
            Page {currentPage} of {totalPages} · {filtered.length} project
            {filtered.length === 1 ? "" : "s"}
          </span>
          <div className="flex gap-1.5">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{pendingDelete?.name}”?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the project and all of its uploaded
              images. This can&apos;t be undone.
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

      <Dialog
        open={!!preview}
        onOpenChange={(open) => !open && setPreview(null)}
      >
        <DialogContent className="max-w-3xl border-none bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">
            {preview?.project.name ?? "Project photo"} preview
          </DialogTitle>
          {preview && activeImage && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="absolute -top-10 right-0 rounded-full bg-white/10 p-1.5 text-white transition-colors hover:bg-white/20"
                aria-label="Close preview"
              >
                <X className="size-5" />
              </button>

              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
                <Image
                  src={imageUrl(activeImage.path)}
                  alt={preview.project.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-contain"
                />
              </div>

              {preview.project.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={showPrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={showNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="size-5" />
                  </button>
                  <div className="mt-2 text-center text-sm text-white/80">
                    {preview.index + 1} / {preview.project.images.length}
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
