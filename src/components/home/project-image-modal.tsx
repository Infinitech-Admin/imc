// FILE PATH: components/home/project-image-modal.tsx

"use client";

import * as React from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface Props {
  src: string;
  alt: string;
}

export function ProjectImageModal({ src, alt }: Props) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative block aspect-[4/3] w-full cursor-zoom-in"
        aria-label={`View larger image of ${alt}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
          <div
            className="relative aspect-[4/3] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
