// Static snapshot kept as the seed source + emergency fallback — see
// lib/faqs.ts. No longer the live source of truth; edit FAQs via /admin/faqs.
export type FaqSeed = { question: string; answer: string };

export const fallbackFaqs: FaqSeed[] = [
  {
    question: "What is Midpoint?",
    answer:
      "Midpoint is a commercial and industrial business estate located in Midrand, Gauteng. Positioned between Johannesburg and Pretoria, Midpoint offers easy access to major transport routes. The estate brings together office space, serviced offices, and warehouse facilities within a single connected environment. Originally developed in the 1980s, the estate is now a modern business destination that combines practical workspace with lifestyle amenities and landscaped outdoor areas. The goal is to provide businesses with premium premises that support both operational efficiency and a more balanced working environment for their teams."
  },
  {
    question: "What types of spaces are available at Midpoint?",
    answer:
      "Midpoint offers a range of commercial and industrial space in Midrand, including premium office suites, serviced offices, and warehouse facilities suitable for logistics, distribution, and light industrial operations. Office spaces range from smaller suites for professional teams to larger corporate headquarters, while warehouse facilities provide high eave heights, loading access, and operational flexibility. Serviced offices within the estate provide a convenient option for smaller teams, project groups, or businesses establishing a presence in Midrand. Tenants also benefit from being part of a business environment where excellent amenities – such as restaurants, fitness facilities, and outdoor spaces - contribute to a more enjoyable working day. This combination allows companies to find workspaces that match their operational needs while remaining within one well-connected business estate."
  },
  {
    question: "How do I enquire about leasing?",
    answer:
      "Businesses interested in office space, serviced offices, or warehouse space in Midrand can enquire directly through the Midpoint leasing team. The team can provide detailed information on current availability, specifications, pricing, and lease structures. Prospective tenants and commercial brokers are encouraged to make contact to discuss their requirements, arrange site visits, or review available spaces across the estate. The leasing team can also assist companies looking to secure space in upcoming developments within Midpoint."
  },
  {
    question: "What amenities are available at Midpoint?",
    answer:
      "Midpoint offers a range of on-site amenities that contribute to a more enjoyable and balanced working environment. These include the Fond restaurant and bar, cafés, fitness facilities, padel courts, and walking, running, and cycling trails integrated throughout the estate. These amenities allow tenants to step away from their desks or warehouse floors without leaving the estate. Whether meeting colleagues for coffee, hosting a working lunch, exercising after work, or taking a walk outdoors, the amenities form part of the everyday experience for businesses based at Midpoint."
  },
  {
    question: "Can I secure a space before construction is complete?",
    answer:
      "Yes. In certain cases, businesses may secure office space or warehouse space at Midpoint before construction or redevelopment is completed. This allows companies to plan ahead and secure premises that meet their operational requirements. Pre-leasing opportunities are particularly relevant for businesses seeking larger office environments or warehouse facilities within the estate. Interested tenants are encouraged to contact the leasing team to discuss upcoming developments, expected completion timelines, and available leasing options."
  },
  {
    question: "Where is Midpoint located?",
    answer:
      "Midpoint is located in Halfway House, Midrand, one of Gauteng's most established commercial and industrial nodes. The estate sits between Johannesburg and Pretoria with convenient access to the N1 highway, making it well positioned for businesses operating across Gauteng and national supply chains. This central location makes Midpoint particularly attractive for companies requiring office space, serviced offices, or warehouse facilities with strong regional connectivity."
  },
  {
    question: "Who owns Midpoint?",
    answer:
      "Midpoint is owned by Blend Property Group, a South African property company specialising in commercial and industrial developments. Since 2006, Blend Property Group has focused on developing and investing in work environments that combine practical design, strong operational functionality, and long-term tenant value. The redevelopment of Midpoint reflects Blend's commitment to creating spaces that support productivity, efficiency, and staff satisfaction."
  }
];
