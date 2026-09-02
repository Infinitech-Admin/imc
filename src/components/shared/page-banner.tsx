import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * Palette used below (swap for your tailwind.config tokens if you have them):
 * forest-950 #0A1F14  forest-900 #12291B  forest-800 #1B3B26
 * forest-700 #245133  forest-600 #2F6743
 * amber-400  #DD8A3E  amber-300  #E8A868
 * sage-200   #C7D6BE (muted body text, used at reduced opacity)
 */

export function PageBanner({
  eyebrow,
  title,
  description,
  crumb,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  crumb: string;
}) {
  return (
    <section className="relative overflow-hidden bg-[#12291B] py-24">
      {/* base gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_35%,rgba(47,103,67,0.5),transparent_60%)]" />

      {/* warm glow behind the illustration */}
      <div className="pointer-events-none absolute right-[6%] top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[#DD8A3E]/20 blur-[100px]" />

      {/* technical grid, confined near the illustration so it never fights the text */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.09]"
        style={{
          maskImage: "linear-gradient(to left, black, transparent 55%)",
          WebkitMaskImage: "linear-gradient(to left, black, transparent 55%)",
        }}
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="ceiling-grid"
            width="56"
            height="56"
            patternUnits="userSpaceOnUse"
          >
            <path d="M56 0H0V56" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ceiling-grid)" />
      </svg>

      {/* blueprint corner bracket — small, technical-drawing reference, used once */}
      <svg
        className="pointer-events-none absolute right-10 top-10 hidden h-8 w-8 opacity-40 lg:block"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        <path d="M32 0V12" stroke="#DD8A3E" strokeWidth="1.5" />
        <path d="M32 0H20" stroke="#DD8A3E" strokeWidth="1.5" />
      </svg>

      {/* stacked-board illustration — isometric boxes for real depth, not flat rotated rects */}
      <svg
        className="pointer-events-none absolute -right-6 top-1/2 hidden h-[440px] w-[440px] -translate-y-1/2 lg:block"
        viewBox="0 0 440 440"
        aria-hidden="true"
      >
        <ellipse
          cx="230"
          cy="360"
          rx="170"
          ry="20"
          fill="black"
          opacity="0.25"
        />

        {/* board 1 — bottom */}
        <g>
          <rect x="60" y="240" width="260" height="66" fill="#1B3B26" />
          <polygon points="60,240 320,240 348,224 88,224" fill="#245133" />
          <polygon points="320,240 320,306 348,290 348,224" fill="#12291B" />
        </g>

        {/* board 2 — middle */}
        <g>
          <rect x="92" y="170" width="260" height="66" fill="#20452B" />
          <polygon points="92,170 352,170 380,154 120,154" fill="#2C5A3B" />
          <polygon points="352,170 352,236 380,220 380,154" fill="#183422" />
        </g>

        {/* board 3 — top, with amber trim */}
        <g>
          <rect x="122" y="100" width="260" height="66" fill="#245133" />
          <polygon points="122,100 382,100 410,84 150,84" fill="#2F6743" />
          <polygon points="382,100 382,166 410,150 410,84" fill="#1B3B26" />
          <rect x="122" y="100" width="260" height="3" fill="#DD8A3E" />
        </g>
      </svg>

      <div className="relative mx-auto max-w-7xl px-6">
        <nav className="flex items-center gap-1.5 text-xs text-[#C7D6BE]/60">
          <Link href="/" className="transition-colors hover:text-white">
            Home
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="text-[#C7D6BE]/90">{crumb}</span>
        </nav>

        <span className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#DD8A3E]/30 bg-[#DD8A3E]/10 px-3 py-1 text-xs font-semibold tracking-wide text-[#E8A868]">
          <span className="size-1.5 rounded-full bg-[#DD8A3E]" />
          {eyebrow}
        </span>

        <h1 className="mt-4 max-w-2xl text-balance font-display text-6xl font-bold leading-[1.05] tracking-tight text-white md:text-7xl">
          {title}
        </h1>

        {description && (
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[#C7D6BE]/80">
            {description}
          </p>
        )}
      </div>

      {/* signature accent line, the one recurring device tying banners together */}
      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-transparent via-[#DD8A3E]/70 to-transparent" />
    </section>
  );
}
