import type { Metadata } from "next";

import { PageBanner } from "@/components/shared/page-banner";
import { ProjectsGrid } from "@/components/sections/projects-grid";
import { CtaBanner } from "@/components/sections/cta-banner";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Recent works, on-going projects, finished projects, and supplied projects by IGROS Marketing Corporation.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageBanner
        eyebrow="Portfolio"
        title="Recent works across the Philippines and beyond"
        description="From on-going installations to a decades-long list of supplied materials, browse the projects IMC has been part of."
        crumb="Projects"
      />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <ProjectsGrid />
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
