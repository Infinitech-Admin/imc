import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, CalendarDays } from "lucide-react";

import { finishedProjects } from "@/data/projects";

export function ProjectsPreview() {
  const featured = finishedProjects.slice(0, 3);

  return (
    <section className="border-y border-blue-100/70 bg-sky-100/60 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold tracking-wide text-orange-600">
              Recent work
            </p>
            <h2 className="mt-2 font-display text-4xl font-bold tracking-wide text-blue-900">
              A portfolio built on repeat clients
            </h2>
          </div>
          <Link
            href="/projects"
            className="flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-orange-600"
          >
            View all projects <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {featured.map((p) => (
            <div key={p.slug} className="group overflow-hidden bg-white">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl font-semibold tracking-wide text-blue-900">
                  {p.name}
                </h3>
                {(p.location || p.year) && (
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-steel-light">
                    {p.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="size-3.5" /> {p.location}
                      </span>
                    )}
                    {p.year && (
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="size-3.5" /> {p.year}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
