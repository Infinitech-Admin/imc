"use client";

// FILE PATH: components/sections/project-gallery.tsx

import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import type { ProjectImage } from "@/types/project";

const API_IMAGE_URL = process.env.NEXT_PUBLIC_API_IMAGE_URL ?? "";

function imageUrl(path?: string | null): string {
  if (!path) return "/placeholder-project.jpg";
  if (path.startsWith("http")) return path;
  return `${API_IMAGE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

interface Props {
  images: ProjectImage[];
  coverImage: string | null;
  projectName: string;
}

export function ProjectGallery({ images, coverImage, projectName }: Props) {
  const gallery: { path: string }[] =
    images.length > 0 ? images : coverImage ? [{ path: coverImage }] : [];

  const [activeIndex, setActiveIndex] = React.useState(0);

  if (gallery.length === 0) {
    return (
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-sky-50">
        <Image
          src={imageUrl(null)}
          alt={projectName}
          fill
          sizes="(max-width: 1024px) 100vw, 700px"
          className="object-cover"
        />
      </div>
    );
  }

  const active = gallery[activeIndex];

  return (
    <div>
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-sky-50 shadow-sm">
        <Image
          key={active.path}
          src={imageUrl(active.path)}
          alt={`${projectName} photo ${activeIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 700px"
          className="object-cover transition-opacity duration-200"
        />
      </div>

      {gallery.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {gallery.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative aspect-[4/3] w-20 shrink-0 overflow-hidden rounded-md border-2 bg-sky-50 transition-all sm:w-24",
                i === activeIndex
                  ? "border-blue-900 ring-2 ring-blue-900/30"
                  : "border-transparent opacity-70 hover:opacity-100",
              )}
              aria-label={`View photo ${i + 1}`}
              aria-current={i === activeIndex}
            >
              <Image
                src={imageUrl(img.path)}
                alt={`${projectName} thumbnail ${i + 1}`}
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
