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
    "Defining the future of work in Midrand. A business estate combining premium offices, modern warehouses, serviced offices, and lifestyle amenities in one connected environment. " +
    "Strategic Growth. Midpoint is situated in Midrand between Johannesburg and Pretoria. The estate continues a long tradition as a place where businesses establish, grow, and operate efficiently. Originally developed in the 1980s, the estate has evolved over time to meet the changing needs of modern businesses. " +
    "A renewed vision. Today, Midpoint reflects a renewed vision for what a business environment can be; one that combines operational practicality with an atmosphere that supports productivity, collaboration, and wellbeing. " +
    "How we think: a precinct built to keep evolving. Midpoint is more than a collection of buildings. It is an established business community shaped by thoughtful ownership, practical property experience and a long-term view of how workplaces should perform. " +
    "Long-term stewardship: Midpoint is managed as a living business precinct, with continued investment in the estate, its infrastructure and the experience of the companies based here. " +
    "Designed around people: landscaped outdoor areas, everyday amenities and opportunities to connect support a more balanced working environment for teams across the estate. " +
    "Operationally practical: access, security, resilient infrastructure and adaptable property are considered together so businesses can operate efficiently as their requirements evolve. " +
    "Developed by property professionals. Midpoint is owned by Blend Property Group, a South African property company with extensive experience in the commercial and industrial sectors. " +
    "Since 2006, Blend Property Group has specialised in the development and investment of commercial and industrial properties across South Africa. Guided by a commitment to innovation and design excellence, the company has become recognised for creating work environments that are both functional and adaptable to the evolving needs of modern tenants. " +
    "Blend's developments focus on enhancing productivity, operational efficiency, and long-term staff satisfaction. These principles are clearly reflected in the continued evolution of Midpoint.",
  "/contact-us":
    "Let's find the right space for your business. Contact the Midpoint team to discuss available office space, serviced offices, and warehouse opportunities in Midrand. " +
    "Whether you are looking for office space, serviced offices, or warehouse facilities in Midrand, the Midpoint leasing team is ready to assist. Our team can provide detailed information on current vacancies, upcoming developments, space specifications, and leasing options across the estate. " +
    "We work with both prospective tenants and commercial property brokers to help businesses identify premises that align with their operational needs, growth plans, and preferred working environment. " +
    "Get in touch today to discuss availability, arrange a site visit, or explore the opportunities available at Midpoint. " +
    "Contact details: +27 11 380 9400, boitumelo@blendproperty.co.za. Address: 162 Tonetti Street, Halfway House, Midrand, 1685. Enquiries can specify interest in office space, warehouse space, or serviced offices via the contact form.",
  "/spaces":
    "A better place to do business. Offices, warehouses and flexible workspace — connected by one secure, amenity-rich business estate in the heart of Midrand. " +
    "Built for the way your business works. Compare the three ways to occupy Midpoint, then view specifications, current opportunities and the right contact for an inspection. 25 spaces available now, across 3 space types, within 1 connected estate. " +
    "Offices: flexible suites through to full corporate headquarters, with prime finishes and on-site security, flexible floorplates, backup infrastructure and on-site amenities. " +
    "Warehouses: high-performance industrial space with strong eaves, loading infrastructure and dedicated yard access, generous yards and office components. " +
    "Serviced offices: furnished OnPoint suites with meeting rooms, reception and an on-site barista, ready when your team is, with flexible terms and shared meeting rooms. " +
    "Amenities & Lifestyle. Facilities that support your team's day — an environment designed for well-being and success. Midpoint combines industrial and commercial space with everyday amenities created for the people who work here. " +
    "Coffee Shop: on-site cafés provide a convenient place for quick meetings, informal discussions, a moment to recharge, or simply starting the day with good coffee and a fresh bite. " +
    "Gym: stay active without leaving the office. The state-of-the-art gym is equipped with modern fitness facilities, helping maintain a healthy work-life balance. " +
    "Walking, Running & Cycling Trails: re-energise with a scenic 1.8 km walking, running and cycling trail. Explore lush gardens, pause areas, and serene green spaces that promote health and well-being. " +
    "Restaurant & Bar: unwind and connect with colleagues at the rooftop bar, offering stunning views, refreshing drinks, and a vibrant social atmosphere — perfect for after-work gatherings or casual business meet-ups. " +
    "Corporate Accommodation: stay close to where business happens with fully serviced corporate accommodation designed for visiting executives, project teams, and professionals working within the Midpoint estate. " +
    "Padel Court: take a break and challenge colleagues to a match on the rooftop padel courts — an exciting way to stay fit, have fun, and foster stronger team connections. " +
    "Ready to find your space? Explore available offices, warehouses and flexible workspace within one connected Midrand estate.",
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
