// Real, readable copy for each hardcoded (non-CMS) static page, used so the
// "Generate" buttons in Page settings (SEO description + JSON-LD schema)
// have actual page content to summarise instead of just a title. These
// pages don't have a content field in the database — their body is written
// directly in app/<path>/page.tsx — so this is a light, hand-maintained
// mirror of that copy. Keep in sync with the page component when its copy
// changes.
//
// Offices, Warehouses, Amenities and Location no longer need an entry here
// — they're Pillar Pages now, so their SEO tools read straight from the
// database like Blog/Page/Pillar always have.
const STATIC_COPY: Record<string, string> = {
  "/about-us":
    "About Us. Midpoint is a modern business estate in Midrand offering premium offices, serviced offices, and warehouse facilities. Developed by Blend Property Group. " +
    "Sections cover the estate's strategic growth story, a renewed vision for the park, and a grid of the office, serviced office and warehouse space types available. " +
    "Developed by property professionals: Midpoint is owned by Blend Property Group, a South African property company with extensive experience in the commercial and industrial sectors. " +
    "Since 2006, Blend Property Group has specialised in the development and investment of commercial and industrial properties across South Africa, guided by a commitment to innovation and design excellence, focused on enhancing productivity, operational efficiency, and long-term staff satisfaction.",
  "/contact-us":
    "Contact Us. Talk to the leasing team about availability, specifications, pricing, and lease structures, or to arrange a site visit. " +
    "Contact the Midpoint leasing team about warehouse, office and serviced office space in Midrand — phone and email enquiry details, plus a contact form.",
  "/spaces":
    "Spaces at Midpoint. Office space, warehouse space and on-site amenities, all within one connected business estate in Midrand. " +
    "Explore Midpoint's office space, warehouse space and on-site amenities in Midrand — a connected business estate between Johannesburg and Pretoria, with links through to each space type and a call to action to get moving.",
  "/insights":
    "Insights at Midpoint. The business park, its Midrand location, on-site amenities and answers to common questions — everything about the estate in one place. " +
    "From the estate itself to where it sits, what's on offer day to day, and the answers to common questions — this is where to get the full picture of Midpoint beyond the spaces you can lease. " +
    "Cards link out to: Business Park (the estate in full, tenants, layout, why businesses choose to be here), Location (on the N1 between Johannesburg and Pretoria), Amenities (gym, padel courts, restaurant, cafes and trails), and FAQs (straight answers on leasing, space, amenities and access).",
};

export function getStaticPageContent(path: string): string {
  return STATIC_COPY[path] || "";
}
