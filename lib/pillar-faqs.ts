export type PillarFaq = { question: string; answer: string };

// Admin form stores FAQs as plain text (one block per FAQ, blank-line
// separated, "Question :: Answer") rather than a repeatable field UI, to
// keep the form simple for a first version.
export function parsePillarFaqs(raw: string): PillarFaq[] {
  return raw
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const [q, ...rest] = block.split("::");
      return { question: (q || "").trim(), answer: rest.join("::").trim() };
    })
    .filter((f) => f.question && f.answer);
}

export function formatPillarFaqs(faqs: PillarFaq[] | null | undefined): string {
  if (!faqs || faqs.length === 0) return "";
  return faqs.map((f) => `${f.question} :: ${f.answer}`).join("\n\n");
}
