import type { Metadata } from "next";
import ScrapedContent from "@/components/ScrapedContent";
import data from "@/scripts/scraped-data/amenities.json";
import type { ScrapedPage } from "@/lib/scraped";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { getPageSeoOverride } from "@/lib/page-seo";

export const dynamic = "force-dynamic";

const page = data as unknown as ScrapedPage;

export async function generateMetadata(): Promise<Metadata> {
  const override = await getPageSeoOverride("/amenities");
  return {
    title: override?.seoTitle || page.title,
    description: override?.seoDescription || page.metaDescription,
  };
}

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[{ name: "Home", path: "/" }, { name: "Amenities", path: "/amenities" }]}
        description={page.metaDescription ?? undefined}
      />
      <ScrapedContent page={page} />
    </>
  );
}
