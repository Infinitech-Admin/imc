import type { Metadata } from "next";
import { ShieldCheck, HardHat, Handshake, Target } from "lucide-react";

import { PageBanner } from "@/components/shared/page-banner";
import { CtaBanner } from "@/components/sections/cta-banner";

export const metadata: Metadata = {
  title: "About",
  description:
    "IGROS Marketing Corporation has supplied construction materials, building insulation, and installation services since 1993.",
};

const timeline = [
  {
    year: "1993",
    text: "IGROS Marketing Corporation registered with the SEC as a construction and building insulation supplier.",
  },
  {
    year: "Since",
    text: "Consistently delivering high-quality construction materials, insulation, and installation services to our clients.",
  },
  {
    year: "2026",
    text: "Over 30 years in business, continuing to grow our line of products and services.",
  },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Quality without compromise",
    text: "Every material and installation we deliver is held to the same standard, project after project.",
  },
  {
    icon: HardHat,
    title: "Built on expertise",
    text: "Decades of focus on construction materials and insulation means we know the details that matter behind the walls.",
  },
  {
    icon: Handshake,
    title: "Customer-first service",
    text: "We aim to earn the trust of every client by making them proud of the choice they made in working with us.",
  },
  {
    icon: Target,
    title: "Always ahead",
    text: "We push to make a breakthrough in the construction industry and stay a step ahead of the competition.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageBanner
        eyebrow="Since 1993"
        title="A trusted name in construction materials and insulation"
        description="IGROS Marketing Corporation (IMC) was registered with the SEC on August 25, 1993, and has supplied quality construction materials, insulation, and installation services ever since."
        crumb="About"
      />

      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold tracking-wide text-orange-600">
              Our story
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-wide text-blue-900 text-balance">
              Registered in 1993, still delivering on the same promise
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-steel">
              IGROS Marketing Corporation was registered with the Securities and
              Exchange Commission on August 25, 1993 as a construction and
              building insulation supplier. From the date of our establishment
              up to the present time, we have managed to deliver high-quality
              construction materials, insulation, and outstanding installation
              services.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-steel">
              Our mission is to exceed in our line of business and in the heart
              of our clients and customers by making them proud of themselves
              for choosing to do business with our company&apos;s excellence.
            </p>
          </div>

          <div className="border-l-2 border-blue-200 pl-8">
            {timeline.map((t, i) => (
              <div
                key={t.year}
                className={i !== timeline.length - 1 ? "pb-8" : ""}
              >
                <p className="font-display text-2xl font-bold text-blue-700">
                  {t.year}
                </p>
                <p className="mt-1 text-[14px] leading-relaxed text-steel">
                  {t.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-blue-100/70 bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-semibold tracking-wide text-orange-600">
            Mission &amp; Vision
          </p>
          <h2 className="mt-2 max-w-xl font-display text-4xl font-bold tracking-wide text-blue-900 text-balance">
            What drives us forward
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div className="corner-brackets px-5 py-6">
              <h3 className="font-display text-lg font-semibold tracking-wide text-blue-800">
                Mission
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-steel">
                To exceed in our line of business and in the heart of our
                clients and customers by making them proud of themselves for
                making the right choice in doing business with our
                company&apos;s excellence.
              </p>
            </div>
            <div className="corner-brackets px-5 py-6">
              <h3 className="font-display text-lg font-semibold tracking-wide text-blue-800">
                Vision
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-steel">
                To make a breakthrough in the world of construction and make a
                big difference ahead of other competitors.
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="corner-brackets px-5 py-6">
                <v.icon className="size-6 text-blue-600" strokeWidth={1.75} />
                <h3 className="mt-4 font-display text-lg font-semibold tracking-wide text-blue-800">
                  {v.title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-steel">
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
