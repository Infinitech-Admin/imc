import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Sprout } from "lucide-react";

import { landscapeService } from "@/data/services";
import { PageBanner } from "@/components/shared/page-banner";
import { CtaBanner } from "@/components/sections/cta-banner";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Landscape Construction",
  description: landscapeService.summary,
};

const scopeItems = [
  { title: "Grading & drainage", text: "Finish grading, stormwater management, and erosion control tied directly into the civil plan." },
  { title: "Hardscape", text: "Walkways, retaining walls, and site amenities built to match the surrounding structure." },
  { title: "Irrigation", text: "Zoned irrigation systems sized for the planting plan and local water requirements." },
  { title: "Planting", text: "Tree, shrub, and turf installation carried out after hardscape and irrigation are complete." },
];

export default function LandscapePage() {
  return (
    <>
      <PageBanner
        eyebrow="Site work"
        title={landscapeService.title}
        description={landscapeService.description}
        crumb="Landscape"
      />

      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Sprout className="size-9 text-blue-600" strokeWidth={1.75} />
            <h2 className="mt-5 font-display text-3xl font-bold tracking-wide text-blue-900 text-balance">
              The grounds finish the project
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-steel">
              A building can be finished on schedule and still feel unfinished if the site around it
              is an afterthought. Our landscape crews come in behind the civil and hardscape work
              already coordinated with the building schedule, so grading, planting, and irrigation
              land on time instead of becoming the last item on a punch list.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/contact">
                  Request a quote <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outlineDark">
                <Link href="/services">See all services</Link>
              </Button>
            </div>
          </div>

          <div className="corner-brackets bg-sky-50 p-8">
            <h2 className="font-display text-xl font-semibold tracking-wide text-blue-900">
              Scope of work
            </h2>
            <ul className="mt-5 space-y-3.5">
              {landscapeService.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-[14px] text-steel">
                  <Check className="mt-0.5 size-4 shrink-0 text-orange-500" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-blue-100/70 bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-semibold tracking-wide text-orange-600">How it breaks down</p>
          <h2 className="mt-2 font-display text-4xl font-bold tracking-wide text-blue-900">
            Four phases, in sequence
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {scopeItems.map((item, i) => (
              <div key={item.title} className="border-l-2 border-blue-200 pl-5">
                <p className="font-display text-3xl font-bold text-blue-300">{`0${i + 1}`}</p>
                <h3 className="mt-3 font-display text-lg font-semibold tracking-wide text-blue-800">
                  {item.title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-steel">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
