// lib/image-url.ts
const API_IMAGE_URL = process.env.NEXT_PUBLIC_API_IMAGE_URL ?? "";

export function imageUrl(path?: string | null): string {
  if (!path) return "/placeholder-project.jpg";
  if (path.startsWith("http")) return path;
  return `${API_IMAGE_URL.replace(/\/$/, "")}/storage/${path.replace(/^\//, "")}`;
}