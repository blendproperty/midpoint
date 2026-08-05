// Static snapshot kept as the seed source + emergency fallback — see
// lib/faqs.ts. No longer the live source of truth; edit FAQs via /admin/faqs.
export type FaqSeed = { question: string; answer: string };

export const fallbackFaqs: FaqSeed[] = [
  {
    question: "What is Midpoint?",
    answer:
      "Midpoint is a commercial and industrial estate at 162 Tonetti Street, Halfway House, Midrand. It contains conventional offices, OnPoint serviced offices and warehouse space and is owned by Blend Property Group."
  },
  {
    question: "What types of spaces are available at Midpoint?",
    answer:
      "The estate has conventional offices, OnPoint serviced offices and warehouse or industrial space. Available units, sizes, rates and unit-specific specifications are shown on the live vacancy schedule."
  },
  {
    question: "How do I enquire about leasing?",
    answer:
      "Use the enquiry form, call +27 11 380 9400 or email boitumelo@blendproperty.co.za. The leasing team can confirm availability and arrange a site visit."
  },
  {
    question: "What amenities are available at Midpoint?",
    answer:
      "The estate's current and planned amenities include Fond restaurant and bar, cafés, fitness and padel facilities, trails and corporate accommodation. Some facilities remain under development; confirm current operating status before visiting."
  },
  {
    question: "Can I secure a space before construction is complete?",
    answer:
      "Some published opportunities have future availability dates or are under development. Contact the leasing team for the programme, specification and commercial terms of the particular unit."
  },
  {
    question: "Where is Midpoint located?",
    answer:
      "Midpoint is at 162 Tonetti Street, Halfway House, Midrand, on the N1 corridor between Johannesburg and Pretoria."
  },
  {
    question: "Who owns Midpoint?",
    answer:
      "Midpoint is owned by Blend Property Group, a South African commercial property company established in 2006."
  }
];
