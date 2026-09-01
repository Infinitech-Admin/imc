"use client";

import * as React from "react";
import Image from "next/image";
import { MapPin, CalendarDays, Search, X, ChevronDown } from "lucide-react";

import {
  ongoingProjects,
  finishedProjects,
  suppliedProjects,
  type FeaturedProject,
} from "@/data/projects";
import { cn } from "@/lib/utils";

const tabs = ["On-going", "Finished", "Supplied"] as const;
type Tab = (typeof tabs)[number];

const tabCounts: Record<Tab, number> = {
  "On-going": ongoingProjects.length,
  Finished: finishedProjects.length,
  Supplied: suppliedProjects.reduce((n, g) => n + g.projects.length, 0),
};

export function ProjectsGrid() {
  const [active, setActive] = React.useState<Tab>("On-going");

  return (
    <div>
      {/* Segmented tab switcher */}
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
        {active === "On-going" && <FeaturedGrid projects={ongoingProjects} />}
        {active === "Finished" && <FeaturedGrid projects={finishedProjects} />}
        {active === "Supplied" && <SuppliedDirectory />}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* On-going / Finished — photo cards                                      */
/* ---------------------------------------------------------------------- */

function FeaturedGrid({ projects }: { projects: FeaturedProject[] }) {
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
        <div
          key={p.slug}
          className="group overflow-hidden rounded-md border border-blue-100 bg-white transition-shadow hover:shadow-lg"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-sky-50">
            <Image
              src={p.image}
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
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Supplied — searchable, alphabetized directory                          */
/* ---------------------------------------------------------------------- */

const COLLAPSED_LIMIT = 24;

function SuppliedDirectory() {
  const [query, setQuery] = React.useState("");
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});

  const normalizedQuery = query.trim().toLowerCase();

  const sortedGroups = React.useMemo(
    () =>
      suppliedProjects.map((g) => ({
        year: g.year,
        projects: [...g.projects].sort((a, b) => a.localeCompare(b)),
      })),
    [],
  );

  if (normalizedQuery) {
    const matches = sortedGroups.flatMap((g) =>
      g.projects
        .filter((name) => name.toLowerCase().includes(normalizedQuery))
        .map((name) => ({ name, year: g.year })),
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
              {matches.map((m) => (
                <li
                  key={`${m.year}-${m.name}`}
                  className="mb-2 flex items-baseline justify-between gap-3 break-inside-avoid border-b border-blue-50 pb-2 text-[13.5px] text-steel"
                >
                  <span>{m.name}</span>
                  <span className="shrink-0 text-[11px] text-steel-light">
                    {m.year}
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
        {sortedGroups.map((group) => {
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
                {visible.map((name) => (
                  <li
                    key={name}
                    className="mb-2.5 break-inside-avoid border-l-2 border-orange-400/50 pl-3 text-[13.5px] leading-snug text-steel transition-colors hover:border-orange-500 hover:text-blue-900"
                  >
                    {name}
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
