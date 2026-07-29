import { site } from "@/lib/site";
import { amenities } from "@/lib/amenities";

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
    name: "Blend Property Group",
    url: "https://www.blendproperty.co.za",
    description:
      "A South African property company with extensive experience in the commercial and industrial sectors specialising in the development and investment of commercial and industrial properties across South Africa.",
    email: site.email,
    telephone: site.phone,
    sameAs: ["https://www.blendproperty.co.za"]
  };
}

// The Midpoint estate itself as a schema.org Place, with a real address,
// contact details, and the live amenity list (lib/amenities.ts) as
// `amenityFeature` entries — reused as the `about` node on richPageJsonLd
// and on Pillar/CMS pages. Sourced from real site data, not manually typed
// into an admin form, so it can't go stale or ship blank.
export function midpointPlaceJsonLd() {
  return {
    "@type": "Place",
    "@id": `${site.domain}/#midpoint`,
    name: "Midpoint",
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
    email: site.email,
    amenityFeature: amenities.map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a.title,
      value: a.description
    })),
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
    headline: title,
    description,
    image: image || undefined,
    datePublished,
    dateModified,
    mainEntityOfPage: `${site.domain}${path}`,
    author: organizationJsonLd(),
    publisher: organizationJsonLd()
  };
}

type ListingForSchema = {
  id: string;
  building: string;
  sector: string;
  sizeSqm: number;
  ratePerSqm: number;
  availability: string;
  description: string;
  image: string;
};

// Product/Offer schema per vacancy listing so Google can pick up rich results
// (price, availability, image) for the vacancy schedule pages. Uses the
// GoodRelations LeaseOut business function since these are leases, not sales.
export function listingsJsonLd(listings: ListingForSchema[], path: string, name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: listings.map((listing, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        "@id": `${site.domain}${path}#${listing.id}`,
        name: listing.building,
        category: listing.sector,
        description: listing.description,
        image: listing.image,
        url: `${site.domain}${path}`,
        additionalProperty: [
          { "@type": "PropertyValue", name: "Size", value: `${listing.sizeSqm} m²` },
          { "@type": "PropertyValue", name: "Availability", value: listing.availability }
        ],
        offers: {
          "@type": "Offer",
          priceCurrency: "ZAR",
          price: listing.ratePerSqm,
          businessFunction: "http://purl.org/goodrelations/v1#LeaseOut",
          availability: "https://schema.org/InStock",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: listing.ratePerSqm,
            priceCurrency: "ZAR",
            unitText: "per square metre"
          }
        }
      }
    }))
  };
}

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
