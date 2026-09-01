import { Hero } from "@/components/sections/hero";

import { WhyIMC } from "@/components/sections/why-imc";
import { ProjectsPreview } from "@/components/sections/projects-preview";
import { CtaBanner } from "@/components/sections/cta-banner";

export default function HomePage() {
  return (
    <>
      <Hero />

      <WhyIMC />
      <ProjectsPreview />
      <CtaBanner />
    </>
  );
}
