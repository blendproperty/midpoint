// Known static (hardcoded, non-CMS) top-level pages, editable from
// /admin/page-seo. Keep this in sync with app/*/page.tsx.
//
// Offices, Warehouses, Amenities and Location used to be listed here too,
// but are now full Pillar Pages (editable content, not just SEO overrides)
// served by app/[slug]/page.tsx — see /admin/pillar-pages.
export const STATIC_PAGES = [
  { path: "/", label: "Homepage" },
  { path: "/about-us", label: "About Us" },
  { path: "/spaces", label: "Spaces" },
  { path: "/contact-us", label: "Contact Us" },
  { path: "/insights", label: "Insights" },
  { path: "/vacancies", label: "Vacancies" },
  { path: "/faqs", label: "FAQs" },
  { path: "/blog", label: "Blog" },
  { path: "/the-suites-at-midpoint", label: "The Suites at Midpoint" },
  { path: "/privacy-policy", label: "Privacy Policy" },
];
