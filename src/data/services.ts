import type { ServiceIconName } from "@/components/shared/service-icon";

export type Service = {
  slug: string;
  title: string;
  icon: ServiceIconName;
  summary: string;
  description: string;
  highlights: string[];
};

export const services: Service[] = [
  {
    slug: "commercial-construction",
    title: "Commercial Construction",
    icon: "commercial",
    summary:
      "Retail, office, and mixed-use builds delivered on schedule and on budget.",
    description:
      "From ground-up retail centers to office fit-outs, we manage every phase of commercial construction — pre-construction planning, permitting, self-performed trades, and closeout — so owners get a single point of accountability from groundbreak to grand opening.",
    highlights: [
      "Pre-construction budgeting & value engineering",
      "Self-performed concrete, carpentry & finishes",
      "Permit coordination & inspections management",
      "LEED & sustainable building practices",
    ],
  },
  {
    slug: "electrical",
    title: "Electrical",
    icon: "electrical",
    summary:
      "Licensed electrical design-build for commercial and industrial facilities.",
    description:
      "Our in-house electrical crews handle everything from service upgrades to full building power distribution, lighting design, and low-voltage systems — reducing subcontractor handoffs and keeping schedules tight.",
    highlights: [
      "Power distribution & panel design",
      "Interior & exterior lighting design",
      "Low-voltage & data infrastructure",
      "Emergency & backup power systems",
    ],
  },
  {
    slug: "fire-protection",
    title: "Fire Protection",
    icon: "fire",
    summary:
      "Sprinkler, suppression, and life-safety systems that pass inspection the first time.",
    description:
      "We design and install fire sprinkler, standpipe, and suppression systems engineered to code and coordinated with the rest of the build, minimizing rework and inspection delays.",
    highlights: [
      "Wet, dry & pre-action sprinkler systems",
      "Fire pump & standpipe installation",
      "Code compliance & AHJ coordination",
      "Inspection, testing & maintenance",
    ],
  },
  {
    slug: "government-construction",
    title: "Government Construction",
    icon: "government",
    summary:
      "Federal, state, and municipal projects built to public-sector standards.",
    description:
      "We navigate the compliance, security, and reporting requirements unique to public-sector work, delivering government facilities that meet every regulatory and procurement standard.",
    highlights: [
      "Davis-Bacon & prevailing wage compliance",
      "Security clearance & access coordination",
      "Public procurement & bonding experience",
      "ADA & accessibility compliance",
    ],
  },
  {
    slug: "industrial-construction",
    title: "Industrial Construction",
    icon: "industrial",
    summary:
      "Warehouses, distribution centers, and manufacturing facilities built for heavy use.",
    description:
      "Industrial clients need speed and durability. We deliver tilt-up warehouses, distribution centers, and manufacturing plants engineered for heavy equipment loads and long-term operational demands.",
    highlights: [
      "Tilt-up & pre-engineered metal buildings",
      "Heavy floor slab & foundation systems",
      "Dock & material-handling infrastructure",
      "Process piping & utility coordination",
    ],
  },
  {
    slug: "mechanical-construction",
    title: "Mechanical Construction",
    icon: "mechanical",
    summary:
      "HVAC, plumbing, and process piping self-performed for tighter schedules.",
    description:
      "Our mechanical division designs and installs HVAC, plumbing, and process piping systems in-house, giving us direct control over sequencing and quality on every job.",
    highlights: [
      "HVAC design-build & installation",
      "Commercial plumbing systems",
      "Process & industrial piping",
      "Building automation & controls",
    ],
  },
  {
    slug: "multifamily-construction",
    title: "Multifamily Construction",
    icon: "multifamily",
    summary:
      "Apartment communities and mixed-use residential built for long-term performance.",
    description:
      "We build apartment communities and mixed-use residential projects with a focus on unit efficiency, amenity spaces, and construction quality that holds up under daily resident use.",
    highlights: [
      "Podium & garden-style construction",
      "Amenity & common-area buildouts",
      "Unit finish-out & punch coordination",
      "Phased occupancy scheduling",
    ],
  },
  {
    slug: "renovations",
    title: "Renovations",
    icon: "renovations",
    summary:
      "Tenant improvements and building upgrades with minimal disruption.",
    description:
      "Whether it's a tenant improvement or full building modernization, we plan renovation work to minimize disruption to occupants while maintaining tight schedules and budgets.",
    highlights: [
      "Tenant improvement build-outs",
      "Occupied-building phasing plans",
      "Building envelope & systems upgrades",
      "ADA & code-compliance retrofits",
    ],
  },
];
