"use client";

// FILE PATH: components/sections/projects-grid.tsx

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Search, X, ChevronDown } from "lucide-react";

import type { Project, ProjectCategory } from "@/types/project";
import { cn } from "@/lib/utils";
import { getProjectSlug } from "@/lib/slug";

const API_IMAGE_URL = process.env.NEXT_PUBLIC_API_IMAGE_URL ?? "";

function imageUrl(path?: string | null): string {
  if (!path) return "/placeholder-project.jpg";
  if (path.startsWith("http")) return path;
  return `${API_IMAGE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

const tabs = ["On-going", "Finished", "Supplied"] as const;
type Tab = (typeof tabs)[number];

const tabCategory: Record<Tab, ProjectCategory> = {
  "On-going": "ongoing",
  Finished: "finished",
  Supplied: "supplied",
};

export function ProjectsGrid() {
  const [active, setActive] = React.useState<Tab>("On-going");
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch("/api/projects", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load projects (${res.status})`);
        return res.json();
      })
      .then((json: { data: Project[] }) => {
        if (!cancelled) setProjects(json.data);
      })
      .catch((err) => {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Failed to load projects.",
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const tabCounts = React.useMemo(() => {
    return tabs.reduce(
      (acc, tab) => {
        acc[tab] = projects.filter(
          (p) => p.category === tabCategory[tab],
        ).length;
        return acc;
      },
      {} as Record<Tab, number>,
    );
  }, [projects]);

  const activeProjects = projects.filter(
    (p) => p.category === tabCategory[active],
  );

  return (
    <div>
      <div className="inline-flex flex-wrap gap-1 rounded-lg border border-blue-100 bg-white p-1 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={cn(
              "flex items-center gap-2 rounded-md px-4 py-2 text-[13px] font-semibold tracking-wide transition-colors",
              active === tab
                ? "bg-blue-900 text-white shadow-sm"
                : "text-blue-700 hover:bg-sky-50",
            )}
          >
            {tab}
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[10.5px] font-bold tabular-nums",
                active === tab
                  ? "bg-white/15 text-white"
                  : "bg-blue-50 text-blue-600",
              )}
            >
              {tabCounts[tab]}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-10">
        {loading ? (
          <p className="py-16 text-center text-sm text-steel-light">
            Loading projects…
          </p>
        ) : error ? (
          <p className="py-16 text-center text-sm text-red-600">{error}</p>
        ) : active === "Supplied" ? (
          <SuppliedDirectory projects={activeProjects} />
        ) : (
          <FeaturedGrid projects={activeProjects} />
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* On-going / Finished — photo cards, linking to the detail page          */
/* ---------------------------------------------------------------------- */

function FeaturedGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-steel-light">
        No projects in this category yet.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => (
        <Link
          key={p.id}
          href={`/projects/${getProjectSlug(p)}`}
          className="group overflow-hidden rounded-md border border-blue-100 bg-white transition-shadow hover:shadow-lg"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-sky-50">
            <Image
              src={imageUrl(p.cover_image)}
              alt={p.name}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            />
            {p.year && (
              <span className="absolute right-3 top-3 rounded bg-navy-900/85 px-2 py-1 text-[11px] font-semibold tracking-wide text-white backdrop-blur-sm">
                {p.year}
              </span>
            )}
          </div>
          <div className="p-5">
            <h3 className="font-display text-lg font-semibold leading-snug tracking-wide text-blue-900">
              {p.name}
            </h3>
            {p.location && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-steel-light">
                <MapPin className="size-3.5 shrink-0 text-orange-500" />{" "}
                {p.location}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Supplied — searchable directory grouped by year                        */
/* ---------------------------------------------------------------------- */

const COLLAPSED_LIMIT = 24;

function SuppliedDirectory({ projects }: { projects: Project[] }) {
  const [query, setQuery] = React.useState("");
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});

  const normalizedQuery = query.trim().toLowerCase();

  const groups = React.useMemo(() => {
    const byYear = new Map<string, Project[]>();
    for (const p of projects) {
      const year = p.year ?? "Undated";
      if (!byYear.has(year)) byYear.set(year, []);
      byYear.get(year)!.push(p);
    }
    return Array.from(byYear.entries())
      .map(([year, list]) => ({
        year,
        projects: [...list].sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .sort((a, b) => b.year.localeCompare(a.year));
  }, [projects]);

  if (normalizedQuery) {
    const matches = groups.flatMap((g) =>
      g.projects
        .filter((p) => p.name.toLowerCase().includes(normalizedQuery))
        .map((p) => ({ project: p, year: g.year })),
    );

    return (
      <div>
        <SearchBar query={query} setQuery={setQuery} />
        {matches.length === 0 ? (
          <p className="py-16 text-center text-sm text-steel-light">
            No supplied projects match &ldquo;{query}&rdquo;.
          </p>
        ) : (
          <>
            <p className="mt-6 text-xs font-semibold tracking-wide text-steel-light">
              {matches.length} match{matches.length === 1 ? "" : "es"}
            </p>
            <ul className="mt-3 columns-1 gap-x-8 sm:columns-2 lg:columns-3">
              {matches.map(({ project, year }) => (
                <li
                  key={project.id}
                  className="mb-2 flex items-baseline justify-between gap-3 break-inside-avoid border-b border-blue-50 pb-2 text-[13.5px] text-steel"
                >
                  <Link
                    href={`/projects/${getProjectSlug(project)}`}
                    className="hover:text-blue-900"
                  >
                    {project.name}
                  </Link>
                  <span className="shrink-0 text-[11px] text-steel-light">
                    {year}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    );
  }

  return (
    <div>
      <SearchBar query={query} setQuery={setQuery} />

      <div className="mt-10 space-y-12">
        {groups.map((group) => {
          const isExpanded = expanded[group.year] ?? false;
          const visible = isExpanded
            ? group.projects
            : group.projects.slice(0, COLLAPSED_LIMIT);
          const hasMore = group.projects.length > COLLAPSED_LIMIT;

          return (
            <div key={group.year}>
              <div className="flex items-baseline gap-3 border-b border-blue-100 pb-3">
                <h3 className="font-display text-xl font-semibold tracking-wide text-blue-900">
                  {group.year}
                </h3>
                <span className="text-xs font-semibold text-steel-light">
                  {group.projects.length} projects
                </span>
              </div>

              <ul className="mt-5 columns-1 gap-x-8 sm:columns-2 lg:columns-3">
                {visible.map((p) => (
                  <li
                    key={p.id}
                    className="mb-2.5 break-inside-avoid border-l-2 border-orange-400/50 pl-3 text-[13.5px] leading-snug text-steel transition-colors hover:border-orange-500 hover:text-blue-900"
                  >
                    <Link href={`/projects/${getProjectSlug(p)}`}>
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>

              {hasMore && (
                <button
                  onClick={() =>
                    setExpanded((prev) => ({
                      ...prev,
                      [group.year]: !isExpanded,
                    }))
                  }
                  className="mt-4 flex items-center gap-1.5 text-[13px] font-semibold text-blue-700 hover:text-orange-600"
                >
                  {isExpanded
                    ? "Show fewer"
                    : `Show all ${group.projects.length}`}
                  <ChevronDown
                    className={cn(
                      "size-4 transition-transform",
                      isExpanded && "rotate-180",
                    )}
                  />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SearchBar({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (v: string) => void;
}) {
  return (
    <div className="relative max-w-sm">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-steel-light" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search supplied projects…"
        className="w-full rounded-md border border-blue-100 bg-white py-2.5 pl-9 pr-9 text-[13.5px] text-ink placeholder:text-steel-light focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
      />
      {query && (
        <button
          onClick={() => setQuery("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-steel-light hover:text-blue-700"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
