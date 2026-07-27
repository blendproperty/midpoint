import type { Metadata } from "next";
import ScrapedContent from "@/components/ScrapedContent";
import data from "@/scripts/scraped-data/warehouses.json";
import type { ScrapedPage } from "@/lib/scraped";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

const page = data as unknown as ScrapedPage;

export const metadata: Metadata = {
  title: page.title,
  description: page.metaDescription
};

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[{ name: "Home", path: "/" }, { name: "Warehouses", path: "/warehouses" }]}
        description={page.metaDescription ?? undefined}
      />
      <ScrapedContent page={page} />
    </>
  );
}
