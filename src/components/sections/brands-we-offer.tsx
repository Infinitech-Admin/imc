import { Wind, Building2, Volume2, Flame } from "lucide-react";

interface Brand {
  code: string;
  accent: string; // hex
  name: string;
  parent?: string;
  spec: string;
  properties: string[];
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
}

const brands: Brand[] = [
  {
    code: "A1",
    accent: "#6B7A3A",
    name: "ArmaFlex® Class 1",
    parent: "Armaflex Brand",
    spec: "Elastomeric insulation engineered to prevent condensation on chilled and refrigerant lines.",
    properties: [
      "Closed-cell rubber, low water vapor permeability",
      "Resists mold growth under continuous moisture load",
      "Rated for HVAC-R pipe and duct applications",
    ],
    icon: Wind,
  },
  {
    code: "A0",
    accent: "#6B7A3A",
    name: "ArmaFlex® Class 0",
    parent: "Armaflex Brand",
    spec: "Fire-rated insulation system built for safety-critical, high-occupancy buildings.",
    properties: [
      "Class 0 fire performance to local building codes",
      "Low smoke and toxicity emission in fire conditions",
      "Suited to hospitals, malls, and high-rise HVAC systems",
    ],
    icon: Building2,
  },
  {
    code: "AP",
    accent: "#6B7A3A",
    name: "ArmaPhonic®",
    parent: "Armaflex Brand",
    spec: "Acoustic absorber that quiets mechanical noise in sensitive indoor environments.",
    properties: [
      "Reduces airborne noise from pipework and equipment",
      "Slim profile fits tight ceiling and wall cavities",
      "Common in hospital wards, hotels, and offices",
    ],
    icon: Volume2,
  },
  {
    code: "T1",
    accent: "#A3402A",
    name: "Thermobreak",
    spec: "Reflective foil thermal insulation for roofing, ducting, and pipework.",
    properties: [
      "Multi-layer foil acts as a radiant heat barrier",
      "Lightweight rolls, easy to cut and install on site",
      "Fits tight duct and roof clearances",
    ],
    icon: Flame,
  },
];

export function BrandsWeOffer() {
  return (
    <section className="bg-white pt-12 pb-20 sm:pt-16 sm:pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col justify-between gap-4 border-b border-emerald-950/15 pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-emerald-700">
              Materials catalog
            </p>
            <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight text-emerald-950 sm:text-4xl">
              Brands we carry
            </h2>
          </div>
          <p className="max-w-sm text-sm text-emerald-950/70">
            Sourced from manufacturers we've stocked and specified for over two
            decades — not private-label substitutes.
          </p>
        </div>

        <div className="mt-10 grid gap-px overflow-hidden border border-emerald-950/15 bg-emerald-950/15 sm:grid-cols-2">
          {brands.map((brand) => (
            <div
              key={brand.code}
              className="grid grid-cols-[64px_1fr] bg-white sm:grid-cols-[72px_1fr]"
            >
              <div
                className="flex items-start justify-center pt-6"
                style={{ backgroundColor: `${brand.accent}14` }}
              >
                <div className="flex flex-col items-center gap-3">
                  <span
                    className="font-display text-xs font-semibold tracking-[0.08em]"
                    style={{ color: brand.accent }}
                  >
                    {brand.code}
                  </span>
                  <brand.icon
                    className="size-4"
                    style={{ color: brand.accent }}
                  />
                </div>
              </div>

              <div className="border-l border-emerald-950/15 px-5 py-6">
                {brand.parent && (
                  <p className="text-[11px] font-medium text-emerald-950/50">
                    {brand.parent}
                  </p>
                )}
                <h3 className="font-display text-lg font-semibold text-emerald-950">
                  {brand.name}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-emerald-950/75">
                  {brand.spec}
                </p>
                <ul className="mt-4 flex flex-col gap-1.5">
                  {brand.properties.map((prop) => (
                    <li
                      key={prop}
                      className="flex items-baseline gap-2 text-[12.5px] text-emerald-950/60"
                    >
                      <span
                        className="h-1 w-1 shrink-0 translate-y-[-2px]"
                        style={{ backgroundColor: brand.accent }}
                      />
                      {prop}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
