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
      "1125sqm of versatile office space across two levels, featuring boardrooms, training facilities, kitchen and private ablutions, with an option to convert 500sqm into warehouse space.",
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
      "266sqm office space featuring a private reception area, spacious open-plan workspace, two private offices, a dedicated kitchenette, and exclusive bathroom facilities for staff and visitors.",
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
      "A two-storey building currently configured as office space, with ground-floor volumes suitable for conversion to warehouse, laboratory, or workshop use. The flexible layout allows the building to be adapted to the tenant's operational requirements.",
    features: ["Ground floor with 4 m height to eaves", "Divisible space configuration", "On-grade roller shutter door"],
    image: "/images/listings/1-kingfisher-avenue.jpg",
    href: "/warehouses",
  },
  {
    pin: 3,
    x: 40.59,
    y: 38.60,
    name: "Corporate Accommodation",
    category: "Accommodation",
    description:
      "Experience a new level of comfort and convenience with the corporate accommodation at Midpoint. Designed for modern professionals, these luxury, fully serviced spaces offer a refined and practical accommodation option within the business park.",
    features: ["Comfortable executive apartments", "Ideal for project teams and clients", "Quality finishes for stress-free stays"],
    image: "/images/listings/corporate-accommodation.png",
    href: "/amenities",
    evergreen: true,
  },
  {
    pin: 4,
    x: 35.59,
    y: 44.51,
    name: "2 Kingfisher Avenue",
    category: "New Development Opportunity",
    description:
      "This site offers a blank slate for industrial transformation as it is ideal for conversion into a modern warehouse or logistics facility. A rare chance to unlock value in a high-demand industrial corridor.",
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
    description: "This well-located 2,320sqm warehouse offers excellent highway frontage.",
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
      "For companies seeking a distinctive head office environment in Midrand, Unit 2, 2 Weaver at Midpoint offers a rare opportunity with 1,614sqm of office space.",
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
      "Custom-built 11 443sqm warehouse offering prime highway frontage, designed for maximum visibility and logistical efficiency.",
    features: ["Warehouse GLA: 10 150sqm", "Office GLA: 1 293sqm", "Yard Area: 5 795sqm"],
    image: "/images/listings/6-weaver-avenue.png",
    href: "/warehouses",
  },
  {
    pin: 2,
    x: 46.59,
    y: 48.45,
    name: "OnPoint",
    category: "Serviced Offices",
    description:
      "OnPoint provides premium serviced offices within the Midpoint estate, offering a flexible solution for smaller teams, satellite offices, or businesses establishing a presence in Midrand.",
    features: ["Collaborative open-plan layout", "Well-equipped kitchen facilities", "Multiple access points for flexible use"],
    image: "/images/listings/onpoint.jpeg",
    href: "/services-offices",
    evergreen: true,
  },
  {
    pin: 1,
    x: 39.89,
    y: 46.48,
    name: "Amenity Hub",
    category: "Entertainment",
    description:
      "The working day isn't confined to desks, meeting rooms, or warehouse floors. It's the ease of grabbing coffee before your first meeting, stepping out for a quick reset between tasks, or having a place to meet clients without leaving the business park.",
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
      "Unit 2, 1 Weaver at Midpoint offers 338sqm of newly refurbished office space designed for businesses that need a professional, secure, and functional environment.",
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
      "Number 8 Sunbird Road offers newly redeveloped office space in Midrand, with flexible configurations and immediate availability.",
    features: ["Elegant design", "Modern workspace offering", "Open-plan configuration"],
    image: "/images/listings/8-sunbird-road.png",
    href: "/offices",
  },
];
