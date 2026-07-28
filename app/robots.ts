import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

// Explicit allow-rules for AI answer-engine crawlers, on top of the general
// wildcard allow — being explicit protects against these ever being caught
// by a future disallow rule, and signals clearly (to anyone auditing the
// file) that AI crawling is intentional, not incidental.
export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings();

  // Settings' "Allow search engines to index this site" toggle previously
  // only affected the per-page <meta name="robots"> tag — this file ignored
  // it entirely and always allowed every crawler. That's a real gap while
  // running on a temporary staging domain (e.g. before DNS cuts over to the
  // real one): a crawler that happens to find the staging URL would be told
  // to crawl freely regardless of the toggle. Now a full disallow is
  // emitted here too when indexing is switched off, and the sitemap is only
  // advertised once indexing is actually allowed again.
  if (!settings.allowIndexing) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Claude-User", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Perplexity-User", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
      { userAgent: "meta-externalagent", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
    ],
    sitemap: `${site.domain}/sitemap.xml`,
  };
}
