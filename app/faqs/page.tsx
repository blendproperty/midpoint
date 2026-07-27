import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PageFaqAccordion from "@/components/PageFaqAccordion";
import TalkToLeasing from "@/components/TalkToLeasing";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { getFaqs } from "@/lib/faqs";

export const dynamic = "force-dynamic";

const description =
  "Find answers to common questions about office space, warehouse facilities, amenities, and leasing opportunities at Midpoint in Midrand.";

export const metadata: Metadata = {
  title: "FAQs",
  description
};

export default async function FaqsPage() {
  const faqs = await getFaqs();

  return (
    <>
      <BreadcrumbJsonLd
        items={[{ name: "Home", path: "/" }, { name: "FAQs", path: "/faqs" }]}
        description={description}
      />
      <PageHero
        title="Everything you need to know about Midpoint."
        subtitle="Find answers to common questions about office space, warehouse facilities, amenities, and leasing opportunities at Midpoint in Midrand."
        image="https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/69f8b6cd0380c1ad65416b38_faq-banner-p-1600.jpg"
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
