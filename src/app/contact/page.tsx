"use client";

import * as React from "react";
import { MapPin, Phone, Printer, Mail, Smartphone } from "lucide-react";

import { PageBanner } from "@/components/shared/page-banner";
import { ContactForm } from "@/components/sections/contact-form";
import { cn } from "@/lib/utils";

const offices = [
  {
    name: "Main Office",
    address: "No. 23 Manhattan Street, Cubao, Quezon City, Philippines",
    lines: [
      {
        icon: MapPin,
        label: "Address",
        value: "No. 23 Manhattan Street, Cubao, Quezon City, Philippines",
      },
      { icon: Mail, label: "Email", value: "imcs23@yahoo.com" },
      { icon: Phone, label: "Phone", value: "(632) 3410-3770 / 3411-6907" },
      { icon: Printer, label: "Fax", value: "(632) 3411-5870 / 8722-0359" },
    ],
  },
  {
    name: "Cebu Branch",
    address:
      "No. 13 ABB Compound, Zuellig Avenue, North Reclamation Area, Mandaue City, Philippines",
    lines: [
      {
        icon: MapPin,
        label: "Address",
        value:
          "No. 13 ABB Compound, Zuellig Avenue, North Reclamation Area, Mandaue City",
      },
      { icon: Smartphone, label: "Mobile", value: "+63 922 834 7047" },
    ],
  },
];

export default function ContactPage() {
  const [activeOffice, setActiveOffice] = React.useState(0);

  return (
    <>
      <PageBanner
        eyebrow="Let's talk"
        title="Start a conversation about your project"
        description="Have a question about our products or an ongoing order? Send us a message and we'll get back to you as soon as possible."
        crumb="Contact"
      />

      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold tracking-wide text-orange-600">
              Reach us directly
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-wide text-blue-900 text-balance">
              Two locations, one team
            </h2>

            <div className="mt-8 space-y-10">
              {offices.map((office) => (
                <div key={office.name}>
                  <h3 className="font-display text-lg font-semibold tracking-wide text-blue-800">
                    {office.name}
                  </h3>
                  <ul className="mt-4 space-y-5">
                    {office.lines.map((d) => (
                      <li key={d.label} className="flex items-start gap-3.5">
                        <span className="flex size-10 shrink-0 items-center justify-center border border-blue-200 text-blue-600">
                          <d.icon className="size-4.5" />
                        </span>
                        <div>
                          <p className="text-xs font-semibold tracking-wide text-steel-light">
                            {d.label}
                          </p>
                          <p className="mt-0.5 text-[14.5px] text-ink">
                            {d.value}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Map */}
            <div className="mt-10 overflow-hidden border border-blue-100">
              <div className="flex border-b border-blue-100 bg-sky-50">
                {offices.map((office, i) => (
                  <button
                    key={office.name}
                    onClick={() => setActiveOffice(i)}
                    className={cn(
                      "flex-1 px-4 py-3 text-[13px] font-semibold tracking-wide transition-colors",
                      activeOffice === i
                        ? "bg-blue-900 text-white"
                        : "text-blue-700 hover:bg-sky-100",
                    )}
                  >
                    {office.name}
                  </button>
                ))}
              </div>

              <div className="relative h-72 w-full">
                <iframe
                  key={activeOffice}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    offices[activeOffice].address,
                  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  title={`Map of ${offices[activeOffice].name}`}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          <div className="corner-brackets bg-white p-8 lg:sticky lg:top-24">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
