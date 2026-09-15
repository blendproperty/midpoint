/** Lifestyle entries now have dedicated photo galleries. Keep other CMS features. */
const galleryHeadings = new Set([
  "fond restaurant, bar and cafés", "fond restaurant and bar", "fond",
  "gym and padel facilities", "gym", "padel", "padel courts",
  "the suites at midpoint", "corporate accommodation",
]);

export function supportingAmenityFeatures<T extends { heading: string }>(features: T[]): T[] {
  return features.filter((feature) => !galleryHeadings.has(feature.heading.trim().toLowerCase()));
}
