import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";

const stats = [
  { value: "27+", label: "Years building" },
  { value: "270+", label: "Projects delivered" },
  { value: "2", label: "Branches nationwide" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_25%,rgba(44,132,184,0.35),transparent_55%)]" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 md:grid-cols-2 md:py-28">
        <div>
          <span className="inline-flex items-center gap-2 border border-orange-500/40 bg-orange-500/10 px-3 py-1 text-[12px] font-semibold tracking-wide text-orange-300">
            General contractor · Quezon City, Philippines
          </span>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-wide text-white text-balance sm:text-6xl">
            Construction built to hold up under real pressure
          </h1>
          <p className="mt-6 max-w-lg text-[15.5px] leading-relaxed text-sky-100/75">
            IMC delivers commercial, industrial, government, and multifamily
            projects from first grade stake to final punch list —
            self-performing the trades that matter most so schedules hold.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button asChild size="lg">
              <Link href="/contact">
                Request a quote <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/projects">See our projects</Link>
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-5 border-t border-white/10 pt-8">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-display text-3xl font-bold text-white">
                  {s.value}
                </p>
                <p className="text-xs tracking-wide text-sky-200/60">
                  {s.label}
                </p>
              </div>
            ))}
            <a
              href="tel:+6323410370"
              className="ml-auto hidden items-center gap-2 text-sm font-medium text-sky-100/70 hover:text-white sm:flex"
            >
              <Phone className="size-4 text-orange-400" /> (632) 3410-3770
            </a>
          </div>
        </div>

        <div className="relative mx-auto aspect-[16/9] w-full max-w-3xl overflow-hidden md:justify-self-end">
          <Image
            src="https://images.unsplash.com/photo-1751808830304-51c95ed33b10?fm=jpg&q=80&w=1600&auto=format&fit=crop"
            alt="Tower cranes against a clear blue sky on a construction site"
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
            priority
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-900/60 via-transparent to-navy-900/10" />
        </div>
      </div>
    </section>
  );
}
