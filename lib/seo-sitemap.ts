import type { MetadataRoute } from "next";
import { publicSeoUrl } from "@/lib/seo-metadata";

export type SitemapCandidate = { path: string; updatedAt?: Date; canonicalUrl?: string | null; noIndex?: boolean; passwordProtected?: boolean };

export function buildSitemap(domain: string, allowIndexing: boolean, candidates: SitemapCandidate[], redirects: string[] = []): MetadataRoute.Sitemap {
  if (!allowIndexing) return [];
  const redirected = new Set(redirects);
  const seen = new Set<string>();
  return candidates.flatMap(item => {
    const url = new URL(item.path, domain).href;
    const canonical = publicSeoUrl(item.canonicalUrl, domain);
    if (item.noIndex || item.passwordProtected || redirected.has(item.path) || (canonical && canonical.replace(/\/$/, "") !== url.replace(/\/$/, "")) || seen.has(url)) return [];
    seen.add(url);
    return [{ url, ...(item.updatedAt ? { lastModified: item.updatedAt } : {}) }];
  });
}
