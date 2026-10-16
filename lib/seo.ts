import { site } from "@/lib/site";

export type BreadcrumbItem = { name: string; path: string };

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${site.domain}${item.path}`
    }))
  };
}

export function webPageJsonLd({
  name,
  description,
  path
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${site.domain}${path}#webpage`,
    url: `${site.domain}${path}`,
    name,
    description,
    isPartOf: { "@id": `${site.domain}/#website` }
  };
}

// Blend Property Group, the developer/owner behind Midpoint — reused as the
// `mentions`/`author`/`publisher` node across every rich schema builder
// below, matching what the old Webflow site emitted per-page instead of
// leaving pages with no organizational context.
export function organizationJsonLd() {
  return {
    "@type": "Organization",
    "@id": "https://www.blendproperty.co.za/#organization",
    name: "Blend Property Group",
    url: "https://www.blendproperty.co.za",
    // Brand image declared by Blend's official homepage og:image metadata.
    image: "https://cdn.prod.website-files.com/685d124b7f9adfba6971a327/686e83878524e3136d50c2aa_open-graph.png",
    // Official Blend footer identifies this as its Johannesburg office.
    address: {
      "@type": "PostalAddress",
      streetAddress: "162 Tonetti Street, Halfway House",
      addressLocality: "Midrand",
      addressRegion: "Gauteng",
      postalCode: "1685",
      addressCountry: "ZA",
    },
    description:
      "A South African property company with extensive experience in the commercial and industrial sectors specialising in the development and investment of commercial and industrial properties across South Africa.",
    email: site.email,
    telephone: site.phone,
    sameAs: ["https://www.blendproperty.co.za"]
  };
}

// Shared estate identity. Planned and operating facilities are distinguished
// in visible content, so do not assert the entire marketing amenity list as live.
export function midpointPlaceJsonLd() {
  return {
    "@type": "Place",
    "@id": `${site.domain}/#midpoint`,
    name: "Midpoint",
    image: `${site.domain}/images/brand/midpoint-brochure-logo.png`,
    description:
      "A business estate combining premium offices, modern warehouses, serviced offices, and lifestyle amenities in one connected environment.",
    address: {
      "@type": "PostalAddress",
      streetAddress: `${site.address.street}, ${site.address.suburb}`,
      addressLocality: site.address.city,
      addressRegion: "Gauteng",
      postalCode: site.address.postalCode,
      addressCountry: site.address.country
    },
    telephone: site.phone,
    containedInPlace: {
      "@type": "Place",
      name: "Midrand",
      description: "Positioned in Midrand between Johannesburg and Pretoria"
    }
  };
}

// Richer per-page schema for the hand-coded static pages (About Us, Contact
// Us, Spaces, Insights) — nests the Midpoint Place (with amenities/address)
// and Blend Property Group Organization under `about`/`mentions`, matching
// the depth the old Webflow site had, instead of a flat WebPage with just a
// name and description. Always auto-generated — there is no manual override
// path for this content anymore.
export function richPageJsonLd({
  type,
  name,
  description,
  path
}: {
  type: string;
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    name,
    url: `${site.domain}${path}`,
    inLanguage: "en",
    description,
    about: midpointPlaceJsonLd(),
    mentions: organizationJsonLd()
  };
}

// BlogPosting schema for /blog/[slug] posts, with Blend Property Group as
// both author and publisher — always auto-generated from the post's real
// fields (title, excerpt/description, cover image, publish/update dates).
export function blogPostingJsonLd({
  title,
  description,
  image,
  path,
  datePublished,
  dateModified
}: {
  title: string;
  description: string;
  image?: string;
  path: string;
  datePublished?: string;
  dateModified: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${site.domain}${path}#article`,
    headline: title,
    description,
    image: image ? new URL(image, site.domain).href : undefined,
    datePublished,
    dateModified,
    mainEntityOfPage: `${site.domain}${path}`,
    author: organizationJsonLd(),
    publisher: organizationJsonLd()
  };
}

// Leasing pages describe real-estate listings, with rates explicitly per m²/month.
export { vacancyListJsonLd as listingsJsonLd } from "@/lib/vacancy-schema";

// Defensively strips an already-baked-in " | <siteName>" (or " - <siteName>")
// suffix from a title before it's returned from generateMetadata. Needed
// because some PageSeoOverride/PillarPage rows in the database already have
// the site name appended (from before generateSeoTitle stopped doing that),
// and the root layout's title.template will append it again on top —
// without this, those specific pages would still show the old doubled-up
// title even after the generator fix, since existing DB rows don't change
// retroactively.
export function stripSiteNameSuffix(title: string, siteName: string): string {
  const trimmed = title.trim();
  const suffixes = [` | ${siteName}`, ` - ${siteName}`, ` — ${siteName}`];
  for (const suffix of suffixes) {
    if (trimmed.toLowerCase().endsWith(suffix.toLowerCase())) {
      return trimmed.slice(0, trimmed.length - suffix.length).trim();
    }
  }
  return trimmed;
}
