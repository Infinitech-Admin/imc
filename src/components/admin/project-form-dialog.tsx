"use client";

// FILE PATH: components/admin/project-form-dialog.tsx

import * as React from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useChunkedUploads } from "@/hooks/use-chunked-upload";
import type {
  Project,
  ProjectCategory,
  ProjectFormValues,
} from "@/types/project";

const API_IMAGE_URL = process.env.NEXT_PUBLIC_API_IMAGE_URL ?? "";

function imageUrl(path?: string | null): string {
  if (!path) return "/placeholder-project.jpg";
  if (path.startsWith("http")) return path;
  return `${API_IMAGE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

interface ExistingImage {
  path: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null; // null = create mode
  onSubmit: (values: ProjectFormValues) => Promise<void>;
}

const emptyForm = {
  name: "",
  category: "ongoing" as ProjectCategory,
  location: "",
  year: "",
  description: "",
};

export function ProjectFormDialog({
  open,
  onOpenChange,
  project,
  onSubmit,
}: Props) {
  const [form, setForm] = React.useState(emptyForm);
  const [existingImages, setExistingImages] = React.useState<ExistingImage[]>(
    [],
  );
  const [submitting, setSubmitting] = React.useState(false);
  const { items, addFiles, removeItem, reset, isUploading, completedPaths } =
    useChunkedUploads();

  React.useEffect(() => {
    if (!open) return;
    if (project) {
      setForm({
        name: project.name,
        category: project.category,
        location: project.location ?? "",
        year: project.year ?? "",
        description: project.description ?? "",
      });
      setExistingImages(project.images.map((img) => ({ path: img.path })));
    } else {
      setForm(emptyForm);
      setExistingImages([]);
    }
    reset();
  }, [open, project, reset]);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    addFiles(files);
  };

  const removeExisting = (path: string) => {
    setExistingImages((prev) => prev.filter((img) => img.path !== path));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setSubmitting(true);
    try {
      const images = [...existingImages.map((i) => i.path), ...completedPaths];
      await onSubmit({
        name: form.name.trim(),
        category: form.category,
        location: form.location.trim(),
        year: form.year.trim(),
        description: form.description.trim(),
        images,
      });
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  const photoCount = existingImages.length + items.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <DialogHeader className="border-b border-emerald-950/10 px-6 py-5">
            <DialogTitle className="font-display text-lg font-semibold text-emerald-950">
              {project ? "Edit project" : "Add project"}
            </DialogTitle>
            <DialogDescription className="text-sm text-emerald-900/60">
              {project
                ? "Update the project details and photos."
                : "Fill in the details and upload photos for this project."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-7 px-6 py-6">
            {/* Details */}
            <div className="flex flex-col gap-5">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-emerald-950">
                  Project name
                </Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="e.g. Alveo Rise Tower, Fit-out"
                  required
                  className="border-emerald-950/15 focus-visible:border-emerald-700 focus-visible:ring-emerald-700/20"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="grid gap-2">
                  <Label className="text-emerald-950">Category</Label>
                  <Select
                    value={form.category}
                    onValueChange={(value) => {
                      if (value) setForm((f) => ({ ...f, category: value }));
                    }}
                  >
                    <SelectTrigger className="border-emerald-950/15 focus-visible:border-emerald-700 focus-visible:ring-emerald-700/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ongoing">On-going</SelectItem>
                      <SelectItem value="finished">Finished</SelectItem>
                      <SelectItem value="supplied">Supplied</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="year" className="text-emerald-950">
                    Year
                  </Label>
                  <Input
                    id="year"
                    value={form.year}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, year: e.target.value }))
                    }
                    placeholder="2026"
                    className="border-emerald-950/15 focus-visible:border-emerald-700 focus-visible:ring-emerald-700/20"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="location" className="text-emerald-950">
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={form.location}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, location: e.target.value }))
                    }
                    placeholder="Batangas, PH"
                    className="border-emerald-950/15 focus-visible:border-emerald-700 focus-visible:ring-emerald-700/20"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description" className="text-emerald-950">
                  Description
                </Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Scope of work, materials supplied, or notes about the project."
                  className="resize-none border-emerald-950/15 focus-visible:border-emerald-700 focus-visible:ring-emerald-700/20"
                />
              </div>
            </div>

            {/* Photos */}
            <div className="flex flex-col gap-3 border-t border-emerald-950/10 pt-6">
              <div className="flex items-center justify-between">
                <Label className="text-emerald-950">Photos</Label>
                {photoCount > 0 && (
                  <span className="text-xs text-emerald-900/50">
                    {photoCount} {photoCount === 1 ? "photo" : "photos"}
                  </span>
                )}
              </div>

              <label
                htmlFor="photo-upload"
                className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-emerald-700/30 bg-emerald-50/40 px-4 py-7 text-center transition-colors hover:border-emerald-700/50 hover:bg-emerald-50"
              >
                <Upload className="size-5 text-emerald-700" />
                <span className="text-sm font-medium text-emerald-950">
                  Click to add photos
                </span>
                <span className="text-xs text-emerald-900/50">
                  Multiple files allowed — large files upload in chunks
                  automatically
                </span>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </label>

              {photoCount > 0 && (
                <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-5">
                  {existingImages.map((img) => (
                    <div
                      key={img.path}
                      className="group relative aspect-square overflow-hidden rounded-lg border border-emerald-950/10 bg-emerald-50"
                    >
                      <Image
                        src={imageUrl(img.path)}
                        alt=""
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeExisting(img.path)}
                        className="absolute right-1 top-1 rounded-full bg-emerald-950/70 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        aria-label="Remove image"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  ))}

                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="group relative aspect-square overflow-hidden rounded-lg border border-emerald-950/10 bg-emerald-50"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.previewUrl}
                        alt=""
                        className="size-full object-cover"
                      />
                      {item.status !== "done" && (
                        <div
                          className={cn(
                            "absolute inset-0 flex flex-col items-center justify-center gap-1 text-white",
                            item.status === "error"
                              ? "bg-red-950/60"
                              : "bg-emerald-950/60",
                          )}
                        >
                          {item.status === "error" ? (
                            <span className="px-2 text-center text-[11px] font-medium">
                              Failed
                            </span>
                          ) : (
                            <>
                              <Loader2 className="size-4 animate-spin" />
                              <span className="text-[11px] font-semibold">
                                {item.progress}%
                              </span>
                            </>
                          )}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="absolute right-1 top-1 rounded-full bg-emerald-950/70 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        aria-label="Remove image"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="border-t border-emerald-950/10 bg-slate-50/60 px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || isUploading}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Saving…
                </>
              ) : isUploading ? (
                "Uploading photos…"
              ) : project ? (
                "Save changes"
              ) : (
                "Create project"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
