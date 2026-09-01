import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";

import { products } from "@/data/products";
import { PageBanner } from "@/components/shared/page-banner";
import { CtaBanner } from "@/components/sections/cta-banner";
import { Button } from "@/components/ui/button";

type Params = Promise<{ slug: string }>;

const process = [
  {
    step: "01",
    title: "Inquiry & specs",
    body: "Send us your project specs or drawings and we'll recommend the right material and grade.",
  },
  {
    step: "02",
    title: "Quotation",
    body: "We provide pricing and lead times based on stock availability and order volume.",
  },
  {
    step: "03",
    title: "Delivery",
    body: "Materials are delivered to your site or warehouse, coordinated around your schedule.",
  },
  {
    step: "04",
    title: "Installation support",
    body: "Our team can advise on installation best practices to get the most from the material.",
  },
];

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return {};
  return { title: product.title, description: product.summary };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <>
      <PageBanner
        eyebrow="Product"
        title={product.title}
        crumb={product.title}
      />

      {/* Overview + image */}
      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <product.icon className="size-9 text-blue-600" strokeWidth={1.75} />
            <p className="mt-5 text-[15px] leading-relaxed text-steel">
              {product.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/contact">
                  Request a quote <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outlineDark">
                <Link href="/products">Back to all products</Link>
              </Button>
            </div>

            <div className="relative mt-10 aspect-[16/10] w-full overflow-hidden rounded-md">
              <Image
                src={product.image}
                alt={product.title}
                fill
                sizes="(min-width: 1024px) 560px, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="corner-brackets bg-sky-50 p-8">
            <h2 className="font-display text-xl font-semibold tracking-wide text-blue-900">
              What&apos;s included
            </h2>
            <ul className="mt-5 space-y-3.5">
              {product.highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-start gap-2.5 text-[14px] text-steel"
                >
                  <Check className="mt-0.5 size-4 shrink-0 text-orange-500" />
                  {h}
                </li>
              ))}
            </ul>

            <div className="mt-8 grid grid-cols-2 gap-6 border-t border-blue-100 pt-6">
              <div>
                <p className="font-display text-2xl font-bold text-blue-900">
                  1993
                </p>
                <p className="text-xs tracking-wide text-steel">Established</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-blue-900">
                  4
                </p>
                <p className="text-xs tracking-wide text-steel">
                  Product lines
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="border-t border-blue-100/70 bg-navy-900 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-semibold tracking-wide text-orange-400">
            How it works
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-wide text-white">
            Getting {product.title.toLowerCase()} to your project
          </h2>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p) => (
              <div
                key={p.step}
                className="border-l-2 border-orange-500/60 pl-5"
              >
                <span className="font-display text-3xl font-bold text-sky-300/40">
                  {p.step}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold tracking-wide text-white">
                  {p.title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-sky-100/70">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related products */}
      <section className="border-t border-blue-100/70 bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-semibold tracking-wide text-orange-600">
            Related products
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-wide text-blue-900">
            Often ordered together
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                className="group flex flex-col justify-between border border-blue-100 bg-white p-7 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
              >
                <div>
                  <p.icon
                    className="size-7 text-blue-600 transition-colors group-hover:text-orange-500"
                    strokeWidth={1.75}
                  />
                  <h3 className="mt-4 font-display text-lg font-semibold tracking-wide text-blue-800">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-steel">
                    {p.summary}
                  </p>
                </div>
                <span className="mt-5 flex items-center gap-1.5 text-[12.5px] font-semibold text-blue-700 group-hover:text-orange-600">
                  Learn more <ArrowRight className="size-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
