import { Thermometer, PanelsTopLeft, Layers, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Product = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  icon: LucideIcon;
  image: string;
  highlights: string[];
};

export const products: Product[] = [
  {
    slug: "insulations",
    title: "Insulations",
    summary:
      "Imported thermal and acoustic insulation materials for mechanical and building applications.",
    description:
      "We supply a full range of insulation materials for HVAC, plumbing, and building envelope applications — including fiberglass, mineral wool, rubber, and foam products from trusted imported brands like SUPAFLEX and THERMASHIELD.",
    icon: Thermometer,
    image:
      "https://irp.cdn-website.com//001c71f9/dms3rep/multi/opt/2037_I_insulation_insitu-300x211-480w.jpg",
    highlights: [
      "Fiberglass blanket and board",
      "Mineral wool (rockwool) blanket and board",
      "SUPAFLEX rubber sheet and closed-cell tubing",
      "Rigid pipe insulation",
      "SUPAFLEX flexible duct",
      "THERMASHIELD polyolefin foam insulation",
      "Bubble insulation",
      "Copper tube",
    ],
  },
  {
    slug: "ceiling-drywall-partitions",
    title: "Ceiling & Drywall Partitions",
    summary:
      "Gypsum, ceiling, and partition systems for commercial and residential interiors.",
    description:
      "From framing to finishing, we supply the boards, metal frames, and accessories needed for ceiling and drywall partition systems — gypsum, CASI, Senepa, phenolic, and MDF board among them.",
    icon: PanelsTopLeft,
    image:
      "https://irp.cdn-website.com//001c71f9/dms3rep/multi/opt/drywall-partition-singapore-469x311-480w.jpg",
    highlights: [
      "Gypsum, CASI, Senepa, phenolic, and MDF board",
      "PVC laminated gypsum board",
      "Acoustic ceiling board",
      "Light metal frames and ceiling grid T-runners",
      "Access panels",
      "Gypsum putty, powder, and screws",
      "Corner flex tape and fiber tape",
    ],
  },
  {
    slug: "thermobreak",
    title: "Thermobreak",
    summary:
      "Thermal insulation engineered for building envelopes and roofing systems.",
    description:
      "Thermobreak is a thermal insulation product line built to reduce heat transfer through building envelopes, helping structures stay cooler and more energy efficient.",
    icon: Layers,
    image:
      "https://irp.cdn-website.com//001c71f9/dms3rep/multi/opt/Untitled_ogirKGjTiaulkXDxDh1z-637x715-510w.png",
    highlights: [
      "Reflective thermal insulation",
      "Suited for roofing and building envelope applications",
      "Helps reduce heat gain and improve energy efficiency",
      "Contact us for test results and technical data",
    ],
  },
  {
    slug: "armaflex-brand",
    title: "Armaflex Brand",
    summary:
      "Armacell ArmaFlex Class 1 insulation engineered to prevent condensation.",
    description:
      "We distribute ArmaFlex Class 1 from Armacell — a flexible elastomeric insulation engineered to prevent condensation and reduce the risk of corrosion under insulation on mechanical and HVAC piping systems.",
    icon: ShieldCheck,
    image:
      "https://irp.cdn-website.com//001c71f9/dms3rep/multi/opt/ArmaFlex_Class_1_page-0001-480w.jpg",
    highlights: [
      "Engineered to prevent condensation",
      "Multi-risk vapor barrier reduces corrosion under insulation",
      "Suited for HVAC and mechanical piping systems",
      "Trusted global brand: Armacell",
    ],
  },
];
