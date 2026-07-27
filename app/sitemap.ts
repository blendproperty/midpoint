import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about-us",
    "/spaces",
    "/offices",
    "/warehouses",
    "/insights",
    "/vacancies",
    "/amenities",
    "/contact-us",
    "/availability-report",
    "/faqs",
    "/location"
  ];
  const lastModified = new Date();
  return routes.map((r) => ({
    url: `${site.domain}${r}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: r === "" ? 1 : 0.7
  }));
}
