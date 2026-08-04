import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

// Explicit allow-rules for AI answer-engine crawlers, on top of the general
// wildcard allow — being explicit protects against these ever being caught
// by a future disallow rule, and signals clearly (to anyone auditing the
// file) that AI crawling is intentional, not incidental.
export default async function robots(): Promise<MetadataRoute.Robots> {
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
