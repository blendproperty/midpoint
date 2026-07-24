export type Listing = {
  pin: number;
  // Approximate position as % of the map image — placeholder first pass,
  // adjust based on visual review against the live site.
  x: number;
  y: number;
  name: string;
  category: string;
  description: string;
  features: string[];
  image: string;
  href: string;
};

export const listings: Listing[] = [
  {
    pin: 12,
    x: 34,
    y: 79,
    name: "3 Weaver Avenue",
    category: "Office / Warehouse",
    description:
      "1125sqm of versatile office space across two levels, featuring boardrooms, training facilities, kitchen and private ablutions, with an option to convert 500sqm into warehouse space.",
    features: ["Potential industrial component", "Two-storey layout", "Suitable for administration offices"],
    image: "https://cdn.prod.website-files.com/67d1edae36bfc44dfe4ad0c8/6a3273527947476faf6366aa_ChatGPT%20Image%20Apr%2023%2C%202026%2C%2012_37_36%20PM-p-1600.jpg",
    href: "/vacancies",
  },
  {
    pin: 10,
    x: 41,
    y: 77,
    name: "Unit 1, 1 Weaver",
    category: "Office",
    description:
      "266sqm office space featuring a private reception area, spacious open-plan workspace, two private offices, a dedicated kitchenette, and exclusive bathroom facilities for staff and visitors.",
    features: ["Move-in ready workspace", "Excellent balance of collaborative and private areas", "Exclusive-use amenities"],
    image: "https://cdn.prod.website-files.com/67d1edae36bfc44dfe4ad0c8/6a326c3ba9828abcd964c090_ChatGPT%20Image%20Jun%201%2C%202026%2C%2010_33_02%20AM.png",
    href: "/vacancies",
  },
  {
    pin: 11,
    x: 40,
    y: 71,
    name: "1 Kingfisher Avenue",
    category: "Warehouse",
    description:
      "A two-storey building currently configured as office space, with ground-floor volumes suitable for conversion to warehouse, laboratory, or workshop use. The flexible layout allows the building to be adapted to the tenant's operational requirements.",
    features: ["Ground floor with 4 m height to eaves", "Divisible space configuration", "On-grade roller shutter door"],
    image: "https://cdn.prod.website-files.com/67d1edae36bfc44dfe4ad0c8/6a1d562d4c28554ab6104b6b_20260528_121054.jpg",
    href: "/vacancies",
  },
  {
    pin: 2,
    x: 60,
    y: 69,
    name: "Corporate Accommodation",
    category: "Accommodation",
    description:
      "Experience a new level of comfort and convenience with the corporate accommodation at Midpoint. Designed for modern professionals, these luxury, fully serviced spaces offer a refined and practical accommodation option within the business park.",
    features: ["Comfortable executive apartments", "Ideal for project teams and clients", "Quality finishes for stress-free stays"],
    image: "https://cdn.prod.website-files.com/67d1edae36bfc44dfe4ad0c8/69e201677ac157f541efc250_Type%20A%20View%202.png",
    href: "/vacancies",
  },
  {
    pin: 4,
    x: 53,
    y: 75,
    name: "2 Kingfisher Avenue",
    category: "New Development Opportunity",
    description:
      "This site offers a blank slate for industrial transformation as it is ideal for conversion into a modern warehouse or logistics facility. A rare chance to unlock value in a high-demand industrial corridor.",
    features: ["Proposed total GLA: 3,300sqm", "Office GLA: 300sqm", "Proposed warehouse GLA: 3,000sqm"],
    image: "https://cdn.prod.website-files.com/67d1edae36bfc44dfe4ad0c8/6a327235eeb7c08747696557_Page%201_cover%20small.png",
    href: "/vacancies",
  },
  {
    pin: 5,
    x: 74,
    y: 87,
    name: "6 Kingfisher Avenue",
    category: "Warehouse",
    description: "This well-located 2,320sqm warehouse offers excellent highway frontage.",
    features: ["Proposed total GLA: 2,320sqm", "Office GLA: 368sqm", "Proposed warehouse GLA: 1,952sqm"],
    image: "https://cdn.prod.website-files.com/67d1edae36bfc44dfe4ad0c8/6a2941e4ad5b6417fd544e68_Stand%208%202300sqm%20warehouse.png",
    href: "/vacancies",
  },
  {
    pin: 6,
    x: 44,
    y: 87,
    name: "2 Weaver Avenue",
    category: "Office",
    description:
      "For companies seeking a distinctive head office environment in Midrand, Unit 2, 2 Weaver at Midpoint offers a rare opportunity with 1,614sqm of office space.",
    features: ["New high-efficiency HVAC system", "Indoor and outdoor entertainment spaces", "Versatile layout"],
    image: "https://cdn.prod.website-files.com/67d1edae36bfc44dfe4ad0c8/6a0ad83ab1a17b8f2b551788_Stand%2011-1600%20Premium%20Offices.png",
    href: "/vacancies",
  },
  {
    pin: 7,
    x: 24,
    y: 85,
    name: "6 Weaver Avenue",
    category: "Warehouse",
    description:
      "Custom-built 11 443sqm warehouse offering prime highway frontage, designed for maximum visibility and logistical efficiency.",
    features: ["Warehouse GLA: 10 150sqm", "Office GLA: 1 293sqm", "Yard Area: 5 795sqm"],
    image: "https://cdn.prod.website-files.com/67d1edae36bfc44dfe4ad0c8/69ce8dd0adb056051e84acc5_ChatGPT%20Image%20Apr%202%2C%202026%2C%2005_08_34%20PM.png",
    href: "/vacancies",
  },
  {
    pin: 3,
    x: 68,
    y: 79,
    name: "OnPoint",
    category: "Serviced Offices",
    description:
      "OnPoint provides premium serviced offices within the Midpoint estate, offering a flexible solution for smaller teams, satellite offices, or businesses establishing a presence in Midrand.",
    features: ["Collaborative open-plan layout", "Well-equipped kitchen facilities", "Multiple access points for flexible use"],
    image: "https://cdn.prod.website-files.com/67d1edae36bfc44dfe4ad0c8/69ce9c23efbedee7cabf70b3_6J2P0234_35_36_37_38_39_40.jpeg",
    href: "/vacancies",
  },
  {
    pin: 1,
    x: 59,
    y: 77,
    name: "Amenity Hub",
    category: "Entertainment",
    description:
      "The working day isn't confined to desks, meeting rooms, or warehouse floors. It's the ease of grabbing coffee before your first meeting, stepping out for a quick reset between tasks, or having a place to meet clients without leaving the business park.",
    features: ["Premium fitness gym", "Padel courts with a rooftop terrace", "Vibrant restaurant and social bar"],
    image: "https://cdn.prod.website-files.com/67d1edae36bfc44dfe4ad0c8/69ce9ca57fb6ecf38ed01934_AMENITY%20HUB%20%20(9).png",
    href: "/vacancies",
  },
  {
    pin: 8,
    x: 37,
    y: 75,
    name: "1 Weaver Avenue",
    category: "Office",
    description:
      "Unit 2, 1 Weaver at Midpoint offers 338sqm of newly refurbished office space designed for businesses that need a professional, secure, and functional environment.",
    features: ["Serene environment", "Open-concept design", "Spacious kitchenette"],
    image: "https://cdn.prod.website-files.com/67d1edae36bfc44dfe4ad0c8/69e62fed89e1a4eb02346d06_ChatGPT%20Image%20Apr%2017%2C%202026%2C%2009_16_25%20PM.png",
    href: "/vacancies",
  },
  {
    pin: 9,
    x: 57,
    y: 71,
    name: "8 Sunbird Road",
    category: "Office",
    description:
      "Number 8 Sunbird Road offers newly redeveloped office space in Midrand, with flexible configurations and immediate availability.",
    features: ["Elegant design", "Modern workspace offering", "Open-plan configuration"],
    image: "https://cdn.prod.website-files.com/67d1edae36bfc44dfe4ad0c8/69ce8d3330a9c3f2979e36b7_Metropolitan%20Unit%206%20Sunbird.png",
    href: "/vacancies",
  },
];
