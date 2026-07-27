import type { Metadata } from "next";
import ScrapedContent from "@/components/ScrapedContent";
import data from "@/scripts/scraped-data/warehouses.json";
import type { ScrapedPage } from "@/lib/scraped";

const page = data as unknown as ScrapedPage;

export const metadata: Metadata = {
  title: page.title,
  description: page.metaDescription
};

export default function Page() {
  return <ScrapedContent page={page} />;
}
