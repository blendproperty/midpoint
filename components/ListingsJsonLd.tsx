import { listingsJsonLd } from "@/lib/seo";
import type { VacancyListing } from "@/lib/vacancies";

type Props = {
  listings: VacancyListing[];
  path: string;
  name: string;
};

export default function ListingsJsonLd({ listings, path, name }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(listingsJsonLd(listings, path, name)) }}
    />
  );
}
