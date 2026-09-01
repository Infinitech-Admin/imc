import { Hero } from "@/components/sections/hero";
import { ProductsOverview } from "@/components/sections/products-overview";
import { WhyIMC } from "@/components/sections/why-imc";
import { ProjectsPreview } from "@/components/sections/projects-preview";
import { CtaBanner } from "@/components/sections/cta-banner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProductsOverview />
      <WhyIMC />
      <ProjectsPreview />
      <CtaBanner />
    </>
  );
}
