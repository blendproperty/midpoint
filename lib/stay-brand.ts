/** Preserve old bookmarked room links without retaining the office brand in new URLs. */
export function canonicalStaySlug(slug: string) {
  if (slug === "onpoint-studio") return "studio";
  if (slug === "onpoint-executive-suite") return "executive-suite";
  return slug;
}
