import Link from "next/link";
import {
  ArrowRight,
  Thermometer,
  LayoutPanelTop,
  Layers,
  ShieldCheck,
} from "lucide-react";

const productCategories = [
  {
    slug: "mechanical",
    title: "Insulations",
    description:
      "Thermal, acoustic, and fire-rated insulation for mechanical systems and building envelopes.",
    icon: Thermometer,
  },
  {
    slug: "architectural",
    title: "Ceiling & Drywall Partitions",
    description:
      "Framing, boards, and finishing systems for interior ceilings and partition walls.",
    icon: LayoutPanelTop,
  },
  {
    slug: "test-result",
    title: "Thermobreak",
    description:
      "Reflective foam insulation that manages heat and moisture in roofing and wall assemblies.",
    icon: Layers,
  },
  {
    slug: "catalogue",
    title: "Armaflex Brand",
    description:
      "Flexible elastomeric insulation for HVAC and refrigeration piping, imported and distributed direct.",
    icon: ShieldCheck,
  },
];

export function ProductsOverview() {
  return (
    <section className="bg-white pt-20 pb-12 md:pt-28 md:pb-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-bold tracking-wide text-emerald-950 sm:text-4xl">
            Materials for every phase of the build
          </h2>
          <p className="mt-4 text-[15.5px] leading-relaxed text-emerald-950/60">
            IMC imports and distributes the insulation, ceiling, and drywall
            partition materials contractors rely on to pass inspection and hold
            up over time.
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden border border-emerald-950/10 bg-emerald-950/10 sm:grid-cols-2">
          {productCategories.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="group flex flex-col gap-3 bg-white p-7 transition-colors hover:bg-emerald-50/60"
            >
              <product.icon className="size-6 text-emerald-700 transition-colors group-hover:text-orange-500" />
              <span className="text-[15px] font-semibold text-emerald-950">
                {product.title}
              </span>
              <span className="text-sm leading-relaxed text-emerald-950/60">
                {product.description}
              </span>
            </Link>
          ))}
        </div>

        <Link
          href="/products"
          className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-orange-600"
        >
          View all products <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
