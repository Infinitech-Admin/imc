"use client";

// FILE PATH: hooks/use-chunked-upload.ts

import * as React from "react";

const CHUNK_SIZE = 1024 * 1024; // 1MB per chunk

interface ChunkResponse {
  done: boolean;
  path?: string;
  url?: string;
  received?: number;
  totalChunks?: number;
}

/** Uploads a single file in sequential chunks, reporting 0-100 progress. */
async function uploadFileInChunks(
  file: File,
  onProgress: (pct: number) => void,
): Promise<string> {
  const identifier = `${Date.now()}-${crypto.randomUUID()}`;
  const totalChunks = Math.max(1, Math.ceil(file.size / CHUNK_SIZE));

  let finalPath = "";

  for (let index = 0; index < totalChunks; index++) {
    const start = index * CHUNK_SIZE;
    const chunk = file.slice(start, start + CHUNK_SIZE);

    const form = new FormData();
    form.append("file", chunk, file.name);
    form.append("identifier", identifier);
    form.append("chunkIndex", String(index));
    form.append("totalChunks", String(totalChunks));
    form.append("filename", file.name);

    const res = await fetch(`/api/uploads/chunk`, {
      method: "POST",
      body: form,
    });

    if (!res.ok) {
      throw new Error(`Upload failed on chunk ${index + 1}/${totalChunks}`);
    }

    const data: ChunkResponse = await res.json();
    onProgress(Math.round(((index + 1) / totalChunks) * 100));

    if (data.done && data.path) {
      finalPath = data.path;
    }
  }

  if (!finalPath) {
    throw new Error("Upload finished but no final path was returned.");
  }

  return finalPath;
}

export interface UploadItem {
  id: string;
  file: File;
  previewUrl: string;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
  path?: string;
  error?: string;
}

/** Manages a queue of files being chunk-uploaded, one at a time, with progress per file. */
export function useChunkedUploads() {
  const [items, setItems] = React.useState<UploadItem[]>([]);

  const addFiles = React.useCallback((files: FileList | File[]) => {
    const list = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
      progress: 0,
      status: "pending" as const,
    }));

    setItems((prev) => [...prev, ...list]);

    list.forEach((item) => {
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: "uploading" } : i)),
      );

      uploadFileInChunks(item.file, (pct) => {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, progress: pct } : i)),
        );
      })
        .then((path) => {
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id
                ? { ...i, status: "done", path, progress: 100 }
                : i,
            ),
          );
        })
        .catch((err: Error) => {
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id
                ? { ...i, status: "error", error: err.message }
                : i,
            ),
          );
        });
    });
  }, []);

  const removeItem = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const reset = React.useCallback(() => setItems([]), []);

  const isUploading = items.some(
    (i) => i.status === "uploading" || i.status === "pending",
  );
  const completedPaths = items
    .filter((i) => i.status === "done" && i.path)
    .map((i) => i.path!) as string[];

  return { items, addFiles, removeItem, reset, isUploading, completedPaths };
}
