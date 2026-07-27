// Thin accessor over the Playwright scrape output in scripts/scraped-data.
// Gives every page its live titles/meta and readable content sections
// until each page gets a bespoke layout.
export interface ScrapedTextBlock { tag: string; text: string; }
export interface ScrapedHeading { tag: string; text: string; }
export interface ScrapedSection {
  index: number;
  headings?: ScrapedHeading[];
  textBlocks?: ScrapedTextBlock[];
}
export interface ScrapedPage {
  title: string;
  metaDescription?: string;
  sections: ScrapedSection[];
}

export function pageContent(page: ScrapedPage) {
  // Collapse to renderable blocks, de-duplicated (Webflow repeats heading
  // text inside textBlocks) and stripped of empties.
  const out: { type: "h1" | "h2" | "h3" | "p"; text: string }[] = [];
  const seen = new Set<string>();
  for (const s of page.sections) {
    for (const h of s.headings ?? []) {
      const t = h.text?.trim();
      if (!t || seen.has(t)) continue;
      seen.add(t);
      out.push({ type: (h.tag as "h1" | "h2" | "h3") ?? "h2", text: t });
    }
    for (const b of s.textBlocks ?? []) {
      const t = b.text?.trim();
      if (!t || seen.has(t) || t.length < 40) continue;
      seen.add(t);
      out.push({ type: "p", text: t });
    }
  }
  return out;
}
