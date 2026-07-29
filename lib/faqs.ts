import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { fallbackFaqs } from "@/lib/faqs-fallback";

export type Faq = { question: string; answer: string };

// Falls back to the static snapshot if the database is briefly unreachable,
// so a DB hiccup never takes the public FAQ page or sitewide FAQPage JSON-LD
// down. Edit FAQs via /admin/faqs going forward.
//
// Wrapped in React's cache() so the root layout (sitewide FAQPage JSON-LD)
// and app/faqs/page.tsx don't each independently re-query Postgres for the
// exact same rows within one request.
export const getFaqs = cache(async (): Promise<Faq[]> => {
  try {
    const rows = await prisma.faq.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    if (rows.length === 0) return fallbackFaqs;
    return rows.map((r) => ({ question: r.question, answer: r.answer }));
  } catch {
    return fallbackFaqs;
  }
});
