import { site } from "@/lib/site";
import { vacancyAreaNeedsConfirmation } from "@/lib/vacancy-content";
import { vacancyAvailability, vacancyDetailHref, vacancyLabel, type VacancyListing } from "@/lib/vacancy-shared";
import { publishedVacancyFacts } from "@/lib/leasing-comparison";

type SchemaListing = Pick<VacancyListing, "id" | "building" | "sector" | "sizeSqm" | "ratePerSqm" | "availability" | "description" | "image"> & Partial<Pick<VacancyListing, "unitName">>;

export function vacancyJsonLd(listing: SchemaListing, domain = site.domain) {
  const url = new URL(vacancyDetailHref(listing), domain).href;
  const name = vacancyLabel({ ...listing, unitName: listing.unitName || null });
  const image = listing.image ? new URL(listing.image, domain).href : undefined;
  const areaNeedsConfirmation = vacancyAreaNeedsConfirmation(listing);
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": `${url}#webpage`, url, name, description: listing.description, image,
    isPartOf: { "@id": `${domain.replace(/\/$/, "")}/#website` },
    about: {
      "@type": "Place", "@id": `${url}#property`, name, image,
      address: { "@type": "PostalAddress", streetAddress: `${site.address.street}, ${site.address.suburb}`, addressLocality: site.address.city, addressRegion: "Gauteng", postalCode: site.address.postalCode, addressCountry: "ZA" },
      containedInPlace: { "@id": `${domain.replace(/\/$/, "")}/#midpoint`, "@type": "Place", name: "Midpoint Business Park" },
      additionalProperty: [
        { "@type": "PropertyValue", name: "Property type", value: listing.sector },
        ...(!areaNeedsConfirmation && Number.isFinite(listing.sizeSqm) && listing.sizeSqm > 0 ? [{ "@type": "PropertyValue", name: "Published floor area", value: listing.sizeSqm, unitCode: "MTK" }] : []),
        { "@type": "PropertyValue", name: "Published availability", value: vacancyAvailability(listing.availability) },
        ...publishedVacancyFacts(listing).map(fact => ({ "@type": "PropertyValue", name: fact.label, value: fact.value })),
      ],
    },
    offers: {
      "@type": "OfferForLease", url,
      businessFunction: "http://purl.org/goodrelations/v1#LeaseOut",
      description: `Published availability: ${vacancyAvailability(listing.availability)}. Confirm occupation timing, VAT, parking and other charges with the leasing team.`,
      ...(!areaNeedsConfirmation && Number.isFinite(listing.ratePerSqm) && listing.ratePerSqm > 0 ? {
        priceSpecification: {
          "@type": "UnitPriceSpecification", price: listing.ratePerSqm, priceCurrency: "ZAR",
          unitText: "m² per month",
          referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MTK" },
        },
      } : {}),
    },
  };
}

export function vacancyListJsonLd(listings: SchemaListing[], path: string, name: string) {
  return {
    "@context": "https://schema.org", "@type": "ItemList", "@id": `${site.domain}${path}#availability`, name,
    numberOfItems: listings.length,
    itemListElement: listings.map((listing, index) => ({ "@type": "ListItem", position: index + 1, item: vacancyJsonLd(listing) })),
  };
}
