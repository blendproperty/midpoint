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
    "/availability-report"
  ];
  return routes.map((r) => ({
    url: `${site.domain}${r}`,
    changeFrequency: "weekly" as const,
    priority: r === "" ? 1 : 0.7
  }));
}
