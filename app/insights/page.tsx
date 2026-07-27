import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PillarCard from "@/components/PillarCard";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

const description =
  "Discover Midpoint's business park, its Midrand location, on-site amenities and answers to common questions — everything about the estate in one place.";

export const metadata: Metadata = {
  title: "Insights | Business Park, Location, Amenities, FAQs & more",
  description
};

const cards = [
  {
    title: "Business Park",
    description:
      "The Midpoint estate in full — tenants, estate layout, and why businesses choose to be here.",
    href: "/offices",
    ctaLabel: "View the business park →",
    variant: "dark" as const,
  },
  {
    title: "Location",
    description:
      "On the N1 between Johannesburg and Pretoria — verified distances, access and route detail.",
    href: "/location",
    ctaLabel: "View location →",
    variant: "cyan" as const,
  },
  {
    title: "Amenities",
    description:
      "Gym, padel courts, restaurant, cafes and trails — what's operating on the estate now.",
    href: "/amenities",
    ctaLabel: "View amenities →",
    variant: "dark" as const,
  },
  {
    title: "FAQs",
    description:
      "Straight answers on leasing, space, amenities and access at Midpoint.",
    href: "/faqs",
    ctaLabel: "View all FAQs →",
    variant: "cyan" as const,
  },
];

export default function InsightsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[{ name: "Home", path: "/" }, { name: "Insights", path: "/insights" }]}
        description={description}
      />
      <PageHero
        title="Insights at Midpoint"
        subtitle="The business park, its Midrand location, on-site amenities and answers to common questions — everything about the estate in one place."
        image="https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/6a148a5463dac69c69cbc3a8_amenities_banner-p-1600.jpg"
        imageAlt="Midpoint business estate"
      />

      <div className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-2xl font-bold md:text-3xl">
          Explore Midpoint&apos;s insights
        </h2>
        <p className="mt-4 max-w-3xl text-midpoint-grey-400">
          From the estate itself to where it sits, what&apos;s on offer day
          to day, and the answers to common questions — this is where to get
          the full picture of Midpoint beyond the spaces you can lease.
        </p>

        <div className="mt-10 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <PillarCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </>
  );
}
