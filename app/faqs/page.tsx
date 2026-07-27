import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PageFaqAccordion from "@/components/PageFaqAccordion";
import TalkToLeasing from "@/components/TalkToLeasing";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Find answers to common questions about office space, warehouse facilities, amenities, and leasing opportunities at Midpoint in Midrand."
};

const faqs = [
  {
    question: "What is Midpoint?",
    answer:
      "Midpoint is a commercial and industrial business estate located in Midrand, Gauteng. Positioned between Johannesburg and Pretoria, Midpoint offers easy access to major transport routes. The estate brings together office space, serviced offices, and warehouse facilities within a single connected environment. Originally developed in the 1980s, the estate is now a modern business destination that combines practical workspace with lifestyle amenities and landscaped outdoor areas."
  },
  {
    question: "What types of spaces are available at Midpoint?",
    answer:
      "Midpoint offers a range of commercial and industrial space in Midrand, including premium office suites, serviced offices, and warehouse facilities suitable for logistics, distribution, and light industrial operations. Office spaces range from smaller suites for professional teams to larger corporate headquarters, while warehouse facilities provide high eave heights, loading access, and operational flexibility. Serviced offices provide a convenient option for smaller teams, project groups, or businesses establishing a presence in Midrand."
  },
  {
    question: "How do I enquire about leasing?",
    answer:
      "Businesses interested in office space, serviced offices, or warehouse space in Midrand can enquire directly through the Midpoint leasing team, who can provide detailed information on current availability, specifications, pricing, and lease structures. Prospective tenants and commercial brokers are encouraged to make contact to discuss requirements, arrange site visits, or review available spaces across the estate."
  },
  {
    question: "What amenities are available at Midpoint?",
    answer:
      "Midpoint offers a range of on-site amenities that contribute to a more enjoyable and balanced working environment, including the Fond restaurant and bar, cafés, fitness facilities, padel courts, and walking, running, and cycling trails integrated throughout the estate."
  },
  {
    question: "Can I secure a space before construction is complete?",
    answer:
      "Yes. In certain cases, businesses may secure office space or warehouse space at Midpoint before construction or redevelopment is completed, allowing companies to plan ahead and secure premises that meet their operational requirements. Interested tenants are encouraged to contact the leasing team to discuss upcoming developments, expected completion timelines, and available leasing options."
  },
  {
    question: "Where is Midpoint located?",
    answer:
      "Midpoint is located in Halfway House, Midrand, one of Gauteng's most established commercial and industrial nodes. The estate sits between Johannesburg and Pretoria with convenient access to the N1 highway, making it well positioned for businesses operating across Gauteng and national supply chains."
  },
  {
    question: "Who owns Midpoint?",
    answer:
      "Midpoint is owned by Blend Property Group, a South African property company specialising in commercial and industrial developments. Since 2006, Blend Property Group has focused on developing and investing in work environments that combine practical design, strong operational functionality, and long-term tenant value."
  }
];

export default function FaqsPage() {
  return (
    <>
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
