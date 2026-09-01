import Link from "next/link";
import { ChevronRight } from "lucide-react";

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
    <section className="relative overflow-hidden bg-navy-900 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(44,132,184,0.3),transparent_55%)]" />
      <div className="mx-auto max-w-7xl px-6">
        <nav className="flex items-center gap-1.5 text-xs text-sky-200/60">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="text-sky-200/90">{crumb}</span>
        </nav>
        <p className="mt-5 text-sm font-semibold tracking-wide text-orange-300">{eyebrow}</p>
        <h1 className="mt-2 max-w-2xl font-display text-5xl font-bold tracking-wide text-white text-balance">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-sky-100/70">{description}</p>
        )}
      </div>
    </section>
  );
}
