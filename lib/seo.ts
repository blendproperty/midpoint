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
