import { Hero } from "@/components/sections/hero";
import { ServicesPreview } from "@/components/sections/services-preview";
import { WhyIMC } from "@/components/sections/why-imc";
import { ProjectsPreview } from "@/components/sections/projects-preview";
import { CtaBanner } from "@/components/sections/cta-banner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesPreview />
      <WhyIMC />
      <ProjectsPreview />
      <CtaBanner />
    </>
  );
}
