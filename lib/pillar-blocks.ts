// Admin forms store these as plain text (blocks or lines) rather than a
// repeatable-field UI, matching the same simple convention already used for
// Pillar Page FAQs (lib/pillar-faqs.ts).
export type PillarFeature = { heading: string; text: string; image: string };
export type PillarConsideration = { heading: string; text: string };
export type PillarLink = { label: string; href: string };

// Blocks separated by a blank line, format "Heading :: Text :: Image URL"
export function parseFeatures(raw: string): PillarFeature[] {
  return raw
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean)
    .map((block) => {
      const [heading, text, image] = block.split("::").map((s) => s.trim());
      return { heading: heading || "", text: text || "", image: image || "" };
    })
    .filter((f) => f.heading && f.text && f.image);
}

export function formatFeatures(items: PillarFeature[] | null | undefined): string {
  if (!items || items.length === 0) return "";
  return items.map((f) => `${f.heading} :: ${f.text} :: ${f.image}`).join("\n\n");
}

// Blocks separated by a blank line, format "Heading :: Text"
export function parseConsiderations(raw: string): PillarConsideration[] {
  return raw
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean)
    .map((block) => {
      const [heading, ...rest] = block.split("::");
      return { heading: (heading || "").trim(), text: rest.join("::").trim() };
    })
    .filter((c) => c.heading && c.text);
}

export function formatConsiderations(items: PillarConsideration[] | null | undefined): string {
  if (!items || items.length === 0) return "";
  return items.map((c) => `${c.heading} :: ${c.text}`).join("\n\n");
}

// One per line, format "Label :: /href"
export function parseLinks(raw: string): PillarLink[] {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, href] = line.split("::").map((s) => s.trim());
      return { label: label || "", href: href || "" };
    })
    .filter((l) => l.label && l.href);
}

export function formatLinks(items: PillarLink[] | null | undefined): string {
  if (!items || items.length === 0) return "";
  return items.map((l) => `${l.label} :: ${l.href}`).join("\n");
}
