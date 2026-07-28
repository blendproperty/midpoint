// Known static (hardcoded, non-CMS) top-level pages, editable from
// /admin/page-seo. Keep this in sync with app/*/page.tsx.
//
// Offices, Warehouses, Amenities and Location used to be listed here too,
// but are now full Pillar Pages (editable content, not just SEO overrides)
// served by app/[slug]/page.tsx — see /admin/pillar-pages.
export const STATIC_PAGES = [
  { path: "/about-us", label: "About Us" },
  { path: "/spaces", label: "Spaces" },
  { path: "/contact-us", label: "Contact Us" },
  { path: "/insights", label: "Insights" },
];
