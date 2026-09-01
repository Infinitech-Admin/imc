import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { services } from "@/data/services";
import { ServiceIcon } from "@/components/shared/service-icon";

export function ServicesPreview() {
  return (
    <section className="relative border-y border-blue-100/70 bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold tracking-wide text-orange-600">What we build</p>
            <h2 className="mt-2 font-display text-4xl font-bold tracking-wide text-blue-900">
              Eight trades, one contractor
            </h2>
          </div>
          <Link
            href="/services"
            className="flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-orange-600"
          >
            View all services <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="corner-brackets group block px-1 py-1"
            >
              <ServiceIcon
                icon={service.icon}
                className="size-7 text-blue-600 transition-colors group-hover:text-orange-500"
              />
              <h3 className="mt-4 font-display text-xl font-semibold tracking-wide text-blue-800">
                {service.title}
              </h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-steel">{service.summary}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
