// Rule-based SEO title/description generation used by the "Generate" buttons
// in the admin forms. Deliberately dependency-free (no external AI call) so
// it works instantly, client-side, with no API key or network round trip.
//
// Does NOT append the site name — app/layout.tsx's root metadata already
// sets title.template = "%s | Midpoint Midrand" (or whatever's configured in
// Site Settings), which Next.js automatically appends to every page's title.
// Appending it here too used to double it up (e.g. "About Us | Midpoint
// Midrand | Midpoint Midrand" in the browser tab).
export function generateSeoTitle(primaryText: string, maxLen = 60): string {
  const base = primaryText.trim();
  if (!base) return "";
  if (base.length <= maxLen) return base;
  return base.slice(0, maxLen - 1).replace(/\s+\S*$/, "") + "…";
}

export function generateSeoDescription(sourceText: string, maxLen = 155): string {
  const clean = sourceText.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (!clean) return "";
  if (clean.length <= maxLen) return clean;
  return clean.slice(0, maxLen - 1).replace(/\s+\S*$/, "") + "…";
}
