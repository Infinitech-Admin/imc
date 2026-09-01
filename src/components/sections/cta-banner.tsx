import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-blue-800 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(232,117,44,0.12),transparent_45%)]" />
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-3xl font-bold tracking-wide text-white sm:text-4xl">
            Have a project on the boards?
          </h2>
          <p className="mt-2 max-w-lg text-sm text-sky-100/70">
            Tell us the scope and timeline — our estimating team will follow up within one
            business day.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/contact">
            Start a conversation <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
