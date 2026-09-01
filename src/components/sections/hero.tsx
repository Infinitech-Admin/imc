"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";

const stats = [
  { value: "270+", label: "Projects delivered" },
  { value: "2", label: "Branches nationwide" },
];

export function Hero() {
  const imageWrapRef = React.useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = imageWrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x, y });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  return (
    <section className="relative overflow-hidden bg-navy-900">
      <style jsx>{`
        .animate-float {
          animation: heroFloat 4.5s ease-in-out infinite;
        }
        .animate-drift {
          animation: heroDrift 10s ease-in-out infinite;
        }
        @keyframes heroFloat {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes heroDrift {
          0%,
          100% {
            background-position: 78% 25%;
          }
          50% {
            background-position: 68% 35%;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-float,
          .animate-drift {
            animation: none !important;
          }
        }
      `}</style>

      <div className="animate-drift pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_25%,rgba(44,132,184,0.35),transparent_55%)]" />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 md:grid-cols-2 md:py-28">
        <div>
          <span className="inline-flex animate-in fade-in slide-in-from-bottom-4 items-center gap-2 border border-orange-500/40 bg-orange-500/10 px-3 py-1 text-[12px] font-semibold tracking-wide text-orange-300 duration-700 fill-mode-both motion-reduce:animate-none">
            General contractor · Quezon City, Philippines
          </span>

          <h1 className="mt-6 animate-in fade-in slide-in-from-bottom-6 font-display text-5xl font-bold leading-[1.02] tracking-wide text-balance text-white delay-150 duration-700 fill-mode-both sm:text-6xl motion-reduce:animate-none">
            Construction built to hold up under real pressure
          </h1>

          <p className="mt-6 max-w-lg animate-in fade-in slide-in-from-bottom-6 text-[15.5px] leading-relaxed text-sky-100/75 delay-300 duration-700 fill-mode-both motion-reduce:animate-none">
            IMC delivers commercial, industrial, government, and multifamily
            projects from first grade stake to final punch list —
            self-performing the trades that matter most so schedules hold.
          </p>

          <div className="mt-9 flex animate-in fade-in slide-in-from-bottom-6 flex-wrap items-center gap-4 delay-500 duration-700 fill-mode-both motion-reduce:animate-none">
            <Button asChild size="lg">
              <Link href="/contact">
                Request a quote <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/projects">See our projects</Link>
            </Button>
          </div>

          <div className="mt-12 flex animate-in fade-in slide-in-from-bottom-4 flex-wrap items-center gap-x-10 gap-y-5 border-t border-white/10 pt-8 delay-700 duration-700 fill-mode-both motion-reduce:animate-none">
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
              className="ml-auto hidden items-center gap-2 text-sm font-medium text-sky-100/70 transition-colors hover:text-white sm:flex"
            >
              <Phone className="size-4 text-orange-400" /> (632) 3410-3770
            </a>
          </div>
        </div>

        <div
          ref={imageWrapRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={resetTilt}
          className="relative mx-auto w-full max-w-3xl md:justify-self-end"
        >
          {/* ambient glow, always drifting */}
          <div
            className="animate-float pointer-events-none absolute -inset-8 -z-10 rounded-full bg-orange-500/10 blur-3xl motion-reduce:animate-none"
            style={{
              transform: `translate3d(${tilt.x * -14}px, ${tilt.y * -14}px, 0)`,
            }}
          />

          <div
            className="relative aspect-[16/9] w-full animate-in fade-in zoom-in-95 overflow-hidden delay-200 duration-1000 fill-mode-both transition-transform ease-out motion-reduce:animate-none"
            style={{
              transform: `scale(1.02) translate3d(${tilt.x * 10}px, ${tilt.y * 10}px, 0)`,
            }}
          >
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

          {/* floating glass card — idle bob + parallax */}
          <div
            className="animate-float absolute -bottom-6 left-6 flex animate-in fade-in slide-in-from-bottom-4 items-center gap-4 border border-white/15 bg-navy-900/70 px-5 py-4 backdrop-blur-md delay-700 duration-700 fill-mode-both transition-transform ease-out motion-reduce:animate-none sm:left-10"
            style={{
              transform: `translate3d(${tilt.x * -18}px, ${tilt.y * -18}px, 0)`,
            }}
          >
            <p className="font-display text-4xl font-bold text-white">27+</p>
            <p className="max-w-[9rem] text-xs leading-snug tracking-wide text-sky-100/70">
              years delivering builds across the Philippines
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
