import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/site-settings";
export const dynamic = "force-dynamic";
export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings();
  return {
    rules: settings.allowIndexing
      ? { userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/stay", "/manage-booking"] }
      : { userAgent: "*", disallow: "/" },
    ...(settings.allowIndexing ? { sitemap: new URL("/sitemap.xml", settings.domain).href } : {}),
  };
}
