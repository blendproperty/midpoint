export type Listing = {
  pin: number;
  // Exact position as % relative to the aerial IMAGE itself (not its
  // wrapper div, which is letterboxed) — extracted via Playwright by
  // measuring each .mp-N marker's getBoundingClientRect() against the
  // <img> element's own rendered rect on the live site.
  x: number;
  y: number;
  name: string;
  category: string;
  description: string;
  features: string[];
  image: string;
  href: string;
  // Non-rentable destinations (amenities, communal facilities) that should
  // always appear on the site map regardless of vacancy availability. Most
  // pins are gated behind "has at least one available space" in
  // SiteMap.tsx; evergreen pins opt out of that gate since they were never
  // going to have a vacancy count in the first place.
  evergreen?: boolean;
};

export const listings: Listing[] = [
  {
    pin: 12,
    x: 22.59,
    y: 48.45,
    name: "3 Weaver Avenue",
    category: "Office / Warehouse",
    description:
      "Office and warehouse opportunities associated with 3 Weaver Avenue. Open the published units for current sizes, rates and confirmed specifications.",
    features: ["Potential industrial component", "Two-storey layout", "Suitable for administration offices"],
    image: "/images/listings/3-weaver-avenue.jpg",
    href: "/offices",
  },
  {
    pin: 10,
    x: 27.59,
    y: 46.48,
    name: "Unit 1, 1 Weaver",
    category: "Office",
    description:
      "Office opportunity at Unit 1, 1 Weaver Avenue. Open the published unit for current size, rate, availability and confirmed features.",
    features: ["Move-in ready workspace", "Excellent balance of collaborative and private areas", "Exclusive-use amenities"],
    image: "/images/listings/unit1-1-weaver.png",
    href: "/offices",
  },
  {
    pin: 11,
    x: 26.59,
    y: 40.57,
    name: "1 Kingfisher Avenue",
    category: "Warehouse",
    description:
      "Opportunity at 1 Kingfisher Avenue. Use the live unit page for its current configuration, proposed use and confirmed technical details.",
    features: ["Ground floor with 4 m height to eaves", "Divisible space configuration", "On-grade roller shutter door"],
    image: "/images/listings/1-kingfisher-avenue.jpg",
    href: "/warehouses",
  },
  {
    pin: 2,
    x: 40.59,
    y: 38.60,
    name: "Corporate Accommodation",
    category: "Accommodation",
    description:
      "Corporate accommodation is planned within Midpoint. Confirm completion, specification and booking availability before making arrangements.",
    features: ["Comfortable executive apartments", "Ideal for project teams and clients", "Quality finishes for stress-free stays"],
    image: "/images/listings/corporate-accommodation.png",
    href: "/spaces",
  },
  {
    pin: 4,
    x: 35.59,
    y: 44.51,
    name: "2 Kingfisher Avenue",
    category: "New Development Opportunity",
    description:
      "Development opportunity at 2 Kingfisher Avenue. Open the published listing for the current proposal, area and availability date.",
    features: ["Proposed total GLA: 3,300sqm", "Office GLA: 300sqm", "Proposed warehouse GLA: 3,000sqm"],
    image: "/images/listings/2-kingfisher-avenue.png",
    href: "/warehouses",
  },
  {
    pin: 5,
    x: 50.59,
    y: 56.33,
    name: "6 Kingfisher Avenue",
    category: "Warehouse",
    description: "Warehouse opportunity at 6 Kingfisher Avenue. Open the published unit for current area, rate, availability and confirmed specifications.",
    features: ["Proposed total GLA: 2,320sqm", "Office GLA: 368sqm", "Proposed warehouse GLA: 1,952sqm"],
    image: "/images/listings/6-kingfisher-avenue.png",
    href: "/warehouses",
  },
  {
    pin: 6,
    x: 29.59,
    y: 56.33,
    name: "2 Weaver Avenue",
    category: "Office",
    description:
      "Office opportunities at 2 Weaver Avenue. Open the published units for current sizes, rates, availability and confirmed features.",
    features: ["New high-efficiency HVAC system", "Indoor and outdoor entertainment spaces", "Versatile layout"],
    image: "/images/listings/2-weaver-avenue.png",
    href: "/offices",
  },
  {
    pin: 7,
    x: 15.59,
    y: 54.36,
    name: "6 Weaver Avenue",
    category: "Warehouse",
    description:
      "Warehouse opportunity at 6 Weaver Avenue. Open the published unit for current area, rate, availability and confirmed technical details.",
    features: ["Warehouse GLA: 10 150sqm", "Office GLA: 1 293sqm", "Yard Area: 5 795sqm"],
    image: "/images/listings/6-weaver-avenue.png",
    href: "/warehouses",
  },
  {
    pin: 3,
    x: 46.59,
    y: 48.45,
    name: "OnPoint",
    category: "Serviced Offices",
    description:
      "OnPoint provides workspace within Midpoint for smaller teams, project offices and businesses establishing a presence in Midrand. See the live listings for available suites and rates.",
    features: ["Collaborative open-plan layout", "Well-equipped kitchen facilities", "Multiple access points for flexible use"],
    image: "/images/listings/onpoint.jpeg",
    href: "/services-offices",
  },
  {
    pin: 1,
    x: 39.89,
    y: 46.48,
    name: "Amenity Hub",
    category: "Entertainment",
    description:
      "The amenity area includes current and planned food, fitness and social facilities. Confirm operating status and access before visiting.",
    features: ["Premium fitness gym", "Padel courts with a rooftop terrace", "Vibrant restaurant and social bar"],
    image: "/images/listings/amenity-hub-pin.png",
    href: "/amenities",
    evergreen: true,
  },
  {
    pin: 8,
    x: 24.59,
    y: 44.51,
    name: "1 Weaver Avenue",
    category: "Office",
    description:
      "Office opportunities at 1 Weaver Avenue. Open the published units for current sizes, rates, availability and confirmed features.",
    features: ["Serene environment", "Open-concept design", "Spacious kitchenette"],
    image: "/images/listings/1-weaver-avenue.png",
    href: "/offices",
  },
  {
    pin: 9,
    x: 38.59,
    y: 40.57,
    name: "8 Sunbird Road",
    category: "Office",
    description:
      "Office opportunities at 8 Sunbird Road. Open the published units for current sizes, rates, availability and confirmed features.",
    features: ["Elegant design", "Modern workspace offering", "Open-plan configuration"],
    image: "/images/listings/8-sunbird-road.png",
    href: "/offices",
  },
];
