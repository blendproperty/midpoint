import { prisma } from "@/lib/prisma";
import { fallbackFaqs } from "@/lib/faqs-fallback";

export type Faq = { question: string; answer: string };

// Falls back to the static snapshot if the database is briefly unreachable,
// so a DB hiccup never takes the public FAQ page or sitewide FAQPage JSON-LD
// down. Edit FAQs via /admin/faqs going forward.
export async function getFaqs(): Promise<Faq[]> {
  try {
    const rows = await prisma.faq.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    if (rows.length === 0) return fallbackFaqs;
    return rows.map((r) => ({ question: r.question, answer: r.answer }));
  } catch {
    return fallbackFaqs;
  }
}
