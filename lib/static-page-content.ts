// Real, readable copy for each hardcoded (non-CMS) static page, used so the
// "Generate" buttons in Page settings (SEO description + JSON-LD schema)
// have actual page content to summarise instead of just a title, and so the
// SEO audit's word-count check reflects what's really on the page. These
// pages don't have a content field in the database — their body is written
// directly in app/<path>/page.tsx — so this is a hand-maintained mirror of
// that copy, transcribed from the live page body text (not a condensed
// synopsis). Keep in sync with the page component when its copy changes.
//
// Offices, Warehouses, Amenities and Location no longer need an entry here
// — they're Pillar Pages now, so their SEO tools read straight from the
// database like Blog/Page/Pillar always have.
const STATIC_COPY: Record<string, string> = {
  "/about-us":
    "Midpoint is a commercial and industrial estate at 162 Tonetti Street, Halfway House, Midrand. It contains conventional offices, OnPoint serviced offices and warehouse or industrial buildings. Midpoint is owned by Blend Property Group, a South African commercial property company established in 2006. Blend invests in, develops and redevelops office, industrial and retail property in South Africa, and its Johannesburg office is located at Midpoint.",
  "/contact-us":
    "Let's find the right space for your business. Contact the Midpoint team to discuss available office space, serviced offices, and warehouse opportunities in Midrand. " +
    "Whether you are looking for office space, serviced offices, or warehouse facilities in Midrand, the Midpoint leasing team is ready to assist. Our team can provide detailed information on current vacancies, upcoming developments, space specifications, and leasing options across the estate. " +
    "We work with both prospective tenants and commercial property brokers to help businesses identify premises that align with their operational needs, growth plans, and preferred working environment. " +
    "Get in touch today to discuss availability, arrange a site visit, or explore the opportunities available at Midpoint. " +
    "Contact details: +27 11 380 9400, boitumelo@blendproperty.co.za. Address: 162 Tonetti Street, Halfway House, Midrand, 1685. Enquiries can specify interest in office space, warehouse space, or serviced offices via the contact form.",
  "/spaces":
    "Compare current conventional offices, OnPoint serviced offices and warehouse opportunities at Midpoint in Halfway House, Midrand. Live availability, sizes, rates, dates and unit-specific descriptions are supplied through Blend Listings. Some estate facilities and developments remain under construction; confirm current status and the specification of a particular space during a viewing.",
  "/insights":
    "Ideas and guidance for better property decisions. Precinct updates, practical leasing guidance and useful context for businesses considering Midpoint and commercial property in Midrand. " +
    "Start with the bigger picture: why businesses choose Midpoint. Understand the estate, its central Gauteng location, property mix, resilience infrastructure, amenities and the team responsible for the precinct. " +
    "Understand the place before choosing the space. Insights explains the location, working environment and leasing process. For offices, warehouses, serviced offices and live availability, go directly to Spaces. " +
    "Getting Here — Location and access: understand Midpoint's position on the N1 between Johannesburg and Pretoria, including the routes that matter to staff, clients and operations. " +
    "Working at Midpoint — Amenities and working life: explore the restaurants, fitness facilities, padel courts and outdoor spaces that shape the working day at Midpoint. " +
    "Leasing Guidance — Leasing questions answered: find straightforward answers about access, amenities, availability and the process of arranging an inspection. " +
    "For commercial and industrial brokers: Midpoint welcomes enquiries from commercial and industrial property brokers representing tenants seeking warehouse space, offices, or serviced offices in Midrand. Current vacancies range from office suites to large-scale warehouse facilities, with further developments underway. For leasing information, availability schedules, or tenant requirements, please contact the Midpoint leasing team.",
};

export function getStaticPageContent(path: string): string {
  return STATIC_COPY[path] || "";
}
