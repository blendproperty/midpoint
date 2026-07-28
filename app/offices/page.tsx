import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import FeatureIntro from "@/components/FeatureIntro";
import ReadyToMoveSection from "@/components/ReadyToMoveSection";
import ConsiderationsList from "@/components/ConsiderationsList";
import ListingsPreview from "@/components/ListingsPreview";
import PageFaqAccordion from "@/components/PageFaqAccordion";
import TalkToLeasing from "@/components/TalkToLeasing";
import ExploreMore from "@/components/ExploreMore";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { getPageSeoOverride } from "@/lib/page-seo";

export const dynamic = "force-dynamic";

const FALLBACK_TITLE = "Offices to Rent in Midrand | Midpoint Business Park";
const description =
  "Modern offices to rent in Midrand at Midpoint, between Joburg and Pretoria. Live availability, backup power, security and on-site amenities. Book a viewing.";

export async function generateMetadata(): Promise<Metadata> {
  const override = await getPageSeoOverride("/offices");
  return {
    title: override?.seoTitle || FALLBACK_TITLE,
    description: override?.seoDescription || description,
  };
}

const features = [
  {
    heading: "Flexible office environments.",
    text: "Office suites across the estate vary in size and configuration, allowing businesses to scale as their needs evolve. Some offices are newly refurbished or redeveloped, while others provide larger floorplates suited to corporate teams, professional services firms, and operational headquarters. Layouts incorporate features such as private reception areas, dedicated kitchens, modern HVAC systems, and secure access control, creating professional working environments that balance practicality with comfort.",
    image: "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/6a16a7cc8af199f89084d8f0_Office-image-p-500.jpg"
  },
  {
    heading: "Connected, professional surroundings.",
    text: "Midpoint’s office buildings benefit from strong regional connectivity and visibility. Several spaces offer exposure to the N1 highway, while others sit within quieter areas of the estate overlooking landscaped green areas. These settings allow businesses to maintain a professional presence while providing teams with a more balanced working environment.",
    image: "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/6a16c26beae69b5c5eacdd65_professionals-p-500.jpg"
  },
  {
    heading: "A workplace that supports your team.",
    text: "At Midpoint, the working day does not begin and end at the desk. The wider environment and unmatched amenities offer opportunities to meet colleagues, enjoy a meal, take a break, exercise, or simply step outside. It’s a workplace experience that feels noticeably different from conventional office parks.",
    image: "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/6a16c3bea9126473ae8b83ae_Workplace-p-500.jpg"
  }
];

const considerations = [
  {
    heading: "Staff access and commute",
    text: "Midpoint sits directly on the N1, roughly 25 km from Johannesburg and 31 km from Pretoria, with 1,470 metres of highway frontage and 21 km to OR Tambo International Airport. For teams currently based in Sandton or Waterfall, that's a materially shorter, more predictable commute for staff living on either side of the N1 corridor, without the rates that come with those nodes."
  },
  {
    heading: "Resilience",
    text: "The estate runs on generator-backed power and backup water with N+1 redundancy, so day-to-day operations are protected against grid outages and water disruptions. Full connectivity and fibre specification for a given building should be confirmed for your specific unit when you enquire, since this can vary by building and fit-out stage."
  },
  {
    heading: "Amenities on your doorstep",
    text: "A gym, padel courts with a rooftop terrace, the Fond restaurant and bar, on-site cafes, and 1.8 km of walking, running and cycling trails are all inside the estate — meaning meetings, team breaks and after-work socialising don't require leaving the park. See the full amenities breakdown for what's operating now versus planned."
  },
  {
    heading: "Less flexibility",
    text: "Conventional office leases at Midpoint suit teams that want a dedicated, branded space and are ready to commit to a standard commercial term. If your need is shorter-term, smaller-footprint, or you want furnished space with shared meeting rooms and reception included, OnPoint's serviced offices are the better fit — ask the leasing team which structure suits your timeline before you commit."
  },
  {
    heading: "Total occupancy cost",
    text: "Rate per square metre varies by building and is quoted per listing on the vacancy schedule. As with any commercial lease, confirm directly with the leasing team what's included in the quoted rate versus billed separately (utilities, operating costs, parking) before comparing offers."
  }
];

const listings = [
  { title: "2 Weaver Avenue — 1,614.7 m²", text: "Office | Available from 2 Feb 2026. Distinctive head-office space with a private patio and braai facility." },
  { title: "3 Weaver Avenue — 1,125.8 m²", text: "Office | Available from 1 Apr 2026. High ceilings and natural light, room to grow." },
  { title: "8 Sunbird Road — 1,028.19 m²", text: "Office | Available from 1 Dec 2025. Refurbished space overlooking a koi pond." },
  { title: "Unit 1, 1 Weaver Avenue — 266 m²", text: "Office | Available from 1 Jun 2026. Move-in ready, near the entrance." }
];

const faqs = [
  {
    question: "What office space is available in Midrand at Midpoint?",
    answer: "Midpoint offers office suites from smaller professional-team spaces up to full corporate headquarters, alongside OnPoint serviced offices for smaller teams or satellite presences. Current availability, size and rate are listed on this page and verified against live inventory."
  },
  {
    question: "Which Midpoint space suits a head office versus a satellite team?",
    answer: "Larger single-tenant offices suit corporate head offices needing a distinctive, branded environment. Smaller or shorter-term needs are better served by OnPoint serviced offices, which offer flexible terms for satellite teams, project groups, or a first Midrand presence."
  },
  {
    question: "Is there backup power and connectivity at Midpoint?",
    answer: "Yes. The estate runs on generator-backed power and backup water with N+1 redundancy, so operations continue through grid outages or water disruptions."
  },
  {
    question: "How close is Midpoint to the N1?",
    answer: "Midpoint has 1,470 metres of N1 highway frontage. It's roughly 25 km to Johannesburg, 31 km to Pretoria, and 21 km to OR Tambo International Airport — positioned directly between the two cities."
  },
  {
    question: "Can a broker get a current availability schedule?",
    answer: "Yes — Midpoint's vacancy schedule and availability report is published on the site, and brokers are welcome to contact the leasing team directly for tenant-specific requirements."
  },
  {
    question: "How do I book a viewing or get in touch about leasing?",
    answer: "Contact the Midpoint leasing team on +27 11 380 9400 or boitumelo@blendproperty.co.za, or use the enquiry form on the Contact Us page."
  }
];

const exploreLinks = [
  { label: "Warehouses to rent", href: "/warehouses" },
  { label: "Amenities & lifestyle", href: "/amenities" },
  { label: "About Midpoint & Blend Property Group", href: "/about-us" },
  { label: "All FAQs", href: "/#FAQ" },
  { label: "Full vacancy schedule", href: "/availability-report" }
];

export default function OfficesPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[{ name: "Home", path: "/" }, { name: "Offices", path: "/offices" }]}
        description={description}
      />
      <PageHero
        title="Offices to Rent in Midrand"
        subtitle="Midpoint is a secure business estate on the N1 between Johannesburg and Pretoria, with backup power, security and on-site amenities included. Live availability below — book a viewing or discuss your requirements with the leasing team."
        image="https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/6a169af02d64c62ff25b56af_office-banner-p-1600.jpg"
        imageAlt="Midpoint office space"
      />
      <FeatureIntro eyebrow="Flexible Workspace. Connected Environment." features={features} />
      <ReadyToMoveSection />
      <ConsiderationsList eyebrow="What to weigh up before leasing office space at Midpoint" items={considerations} />
      <ListingsPreview
        eyebrow="Current office availability at Midpoint"
        intro="A snapshot of office space currently available. Full specifications, floor plans, rates and photos are on the live vacancy schedule."
        listings={listings}
        ctaHref="/availability-report"
        ctaLabel="View full office availability and floor plans"
      />
      <PageFaqAccordion heading="Frequently asked questions about offices at Midpoint" faqs={faqs} />
      <TalkToLeasing
        heading="Talk to the leasing team"
        text="Boitumelo handles office enquiries at Midpoint — reach out directly on +27 11 380 9400 or boitumelo@blendproperty.co.za to book a viewing or discuss your requirements. Midpoint is developed and managed by Blend Property Group."
      />
      <ExploreMore links={exploreLinks} />
    </>
  );
}
