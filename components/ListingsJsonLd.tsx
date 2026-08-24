import { listingsJsonLd } from "@/lib/seo";
import type { VacancyListing } from "@/lib/vacancies";
import { safeJsonLd } from "@/lib/json-ld";

type Props = {
  listings: VacancyListing[];
  path: string;
  name: string;
};

export default function ListingsJsonLd({ listings, path, name }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(listingsJsonLd(listings, path, name)) }}
    />
  );
}
