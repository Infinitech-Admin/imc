// FILE PATH: app/projects/[slug]/page.tsx

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, ArrowRight } from "lucide-react";

import { PageBanner } from "@/components/shared/page-banner";
import { ProjectGallery } from "@/components/sections/project-gallery";
import { getIdFromSlug, getProjectSlug } from "@/lib/slug";
import type { Project, ProjectCategory } from "@/types/project";
import { cn } from "@/lib/utils";

const API_URL = process.env.API_URL ?? "";
const API_IMAGE_URL = process.env.NEXT_PUBLIC_API_IMAGE_URL ?? "";

function projectImageUrl(path: string | null): string {
  if (!path) return "/placeholder-project.jpg";
  if (path.startsWith("http")) return path;
  return `${API_IMAGE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

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

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProjectById(id: number): Promise<Project | null> {
  const res = await fetch(`${API_URL}/api/projects/${id}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) return null;

  const json: { data: Project } = await res.json();
  return json.data ?? null;
}

async function resolveProject(slug: string): Promise<Project | null> {
  const id = getIdFromSlug(slug);
  if (id === null) return null;
  return getProjectById(id);
}

async function getOtherProjects(currentId: number): Promise<Project[]> {
  try {
    const res = await fetch(`${API_URL}/api/projects`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];

    const json: { data: Project[] } = await res.json();
    return (json.data ?? []).filter((p) => p.id !== currentId).slice(0, 6);
  } catch (err) {
    console.error("[ProjectDetailPage] failed to fetch other projects:", err);
    return [];
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await resolveProject(slug);

  if (!project) {
    return { title: "Project not found" };
  }

  return {
    title: project.name,
    description:
      project.description ??
      (project.location && project.year
        ? `${project.name} — ${project.location}, ${project.year}`
        : project.name),
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await resolveProject(slug);

  if (!project) {
    notFound();
  }

  const sortedImages = [...project.images].sort(
    (a, b) => a.sort_order - b.sort_order,
  );

  const otherProjects = await getOtherProjects(project.id);

  return (
    <>
      <PageBanner
        eyebrow={categoryLabel[project.category]}
        title={project.name}
        description={
          project.location && project.year
            ? `${project.location} · ${project.year}`
            : project.location || project.year || ""
        }
        crumb={project.name}
      />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
            {/* Gallery — takes up 2/3 on desktop */}
            <div className="lg:col-span-2">
              <ProjectGallery
                images={sortedImages}
                coverImage={project.cover_image}
                projectName={project.name}
              />
            </div>

            {/* Sticky details panel */}
            <aside className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <Badge tone={categoryTone[project.category]}>
                  {categoryLabel[project.category]}
                </Badge>

                <h2 className="mt-4 font-display text-2xl font-semibold leading-snug text-blue-900">
                  {project.name}
                </h2>

                <div className="mt-5 space-y-3 border-y border-blue-100 py-5">
                  {project.location && (
                    <div className="flex items-center gap-3 text-sm text-steel">
                      <MapPin className="size-4 shrink-0 text-orange-500" />
                      {project.location}
                    </div>
                  )}
                  {project.year && (
                    <div className="flex items-center gap-3 text-sm text-steel">
                      <Calendar className="size-4 shrink-0 text-orange-500" />
                      {project.year}
                    </div>
                  )}
                </div>

                {project.description && (
                  <div className="mt-6">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-steel-light">
                      About this project
                    </h3>
                    <p className="mt-3 whitespace-pre-line text-[14.5px] leading-relaxed text-steel">
                      {project.description}
                    </p>
                  </div>
                )}

                <Link
                  href="/contact"
                  className="mt-8 inline-flex items-center gap-2 rounded-md bg-blue-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
                >
                  Discuss a similar project
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </aside>
          </div>

          {otherProjects.length > 0 && (
            <div className="mt-20 border-t border-blue-100 pt-12">
              <h3 className="font-display text-xl font-semibold text-blue-900">
                Other projects
              </h3>

              <div
                className="mt-8 -mx-6 flex gap-0 overflow-x-auto px-6 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                style={{ scrollSnapType: "x mandatory" }}
              >
                {otherProjects.map((p, i) => (
                  <Link
                    key={p.id}
                    href={`/projects/${getProjectSlug(p)}`}
                    className={cn(
                      "group flex w-[260px] shrink-0 flex-col pr-6 mr-6",
                      i !== otherProjects.length - 1 &&
                        "border-r border-blue-100",
                    )}
                    style={{ scrollSnapAlign: "start" }}
                  >
                    <div
                      className="relative aspect-[4/3] w-full overflow-hidden bg-sky-50"
                      style={{
                        clipPath:
                          "polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 0 100%)",
                      }}
                    >
                      <Image
                        src={projectImageUrl(p.cover_image)}
                        alt={p.name}
                        fill
                        sizes="260px"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                      />
                      {p.year && (
                        <span className="absolute right-0 top-0 w-20 origin-top-right translate-x-[9px] translate-y-[9px] rotate-45 bg-blue-900 py-0.5 text-center text-[10px] font-semibold text-white">
                          {p.year}
                        </span>
                      )}
                    </div>

                    <h4 className="mt-4 font-display text-base font-semibold leading-snug text-blue-900">
                      {p.name}
                    </h4>
                    {p.location && (
                      <p className="mt-1 text-xs text-steel-light">
                        {p.location}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function Badge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide",
        tone,
      )}
    >
      {children}
    </span>
  );
}
