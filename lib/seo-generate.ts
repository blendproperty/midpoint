// Rule-based SEO title/description generation used by the "Generate" buttons
// in the admin forms. Deliberately dependency-free (no external AI call) so
// it works instantly, client-side, with no API key or network round trip.
export function generateSeoTitle(primaryText: string, siteName: string, maxLen = 60): string {
  const base = primaryText.trim();
  if (!base) return "";
  const withBrand = `${base} | ${siteName}`;
  if (withBrand.length <= maxLen) return withBrand;
  if (base.length <= maxLen) return base;
  return base.slice(0, maxLen - 1).replace(/\s+\S*$/, "") + "…";
}

export function generateSeoDescription(sourceText: string, maxLen = 155): string {
  const clean = sourceText.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (!clean) return "";
  if (clean.length <= maxLen) return clean;
  return clean.slice(0, maxLen - 1).replace(/\s+\S*$/, "") + "…";
}
