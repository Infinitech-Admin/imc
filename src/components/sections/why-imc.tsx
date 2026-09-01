import { ShieldCheck, Clock, Users2, ClipboardCheck } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Schedules that hold",
    text: "Self-performed mechanical, electrical, and fire protection scopes keep sequencing under our control, not a subcontractor's.",
  },
  {
    icon: ShieldCheck,
    title: "Safety as a baseline",
    text: "Every site runs on the same safety program regardless of size, with daily briefings and documented inspections.",
  },
  {
    icon: Users2,
    title: "One point of contact",
    text: "A dedicated project executive stays on your job from preconstruction through closeout — no hand-offs mid-project.",
  },
  {
    icon: ClipboardCheck,
    title: "Documentation you can audit",
    text: "Government and institutional clients get full compliance records, submittals, and closeout binders as standard practice.",
  },
];

export function WhyIMC() {
  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-sm font-semibold tracking-wide text-orange-600">Why owners choose IMC</p>
        <h2 className="mt-2 max-w-xl font-display text-4xl font-bold tracking-wide text-blue-900 text-balance">
          Fewer subcontractors, more accountability
        </h2>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="border-l-2 border-blue-200 pl-5">
              <f.icon className="size-6 text-blue-600" strokeWidth={1.75} />
              <h3 className="mt-4 font-display text-lg font-semibold tracking-wide text-blue-800">
                {f.title}
              </h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-steel">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
