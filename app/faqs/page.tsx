import { safeJsonLd } from "@/lib/json-ld";
import { staticPageMetadata } from "@/lib/page-seo";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PageFaqAccordion from "@/components/PageFaqAccordion";
import TalkToLeasing from "@/components/TalkToLeasing";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { getFaqs } from "@/lib/faqs";

export const dynamic = "force-dynamic";

const description =
  "Find answers to common questions about office space, warehouse facilities, amenities, and leasing opportunities at Midpoint in Midrand.";

export async function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata("/faqs", "FAQs", description);
}

export default async function FaqsPage() {
  const faqs = await getFaqs();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: faqs.map(f => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
      }) }} />
      <BreadcrumbJsonLd
        items={[{ name: "Home", path: "/" }, { name: "FAQs", path: "/faqs" }]}
        description={description}
      />
      <PageHero
        title="Everything you need to know about Midpoint."
        subtitle="Find answers to common questions about office space, warehouse facilities, amenities, and leasing opportunities at Midpoint in Midrand."
        image="/images/pages/faq-banner.jpg"
        imageAlt="Midpoint business estate"
      />
      <PageFaqAccordion heading="Frequently asked questions" faqs={faqs} />
      <TalkToLeasing
        heading="Still have a question?"
        text="The Midpoint leasing team is on hand for anything not covered here — reach out on +27 11 380 9400 or boitumelo@blendproperty.co.za."
      />
    </>
  );
}
