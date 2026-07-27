export type VacancyListing = {
  id: string;
  building: string;
  sector: "Warehouse" | "Office" | "Serviced office";
  sizeSqm: number;
  ratePerSqm: number;
  availability: string;
  description: string;
  features: string[];
  image: string;
};

const BASE = "https://cdn.prod.website-files.com/67d1edae36bfc44dfe4ad0c8";

// Real current listing data, sourced from Midpoint's live vacancy schedule
// (ultimately pulled from Blend's listings.blendproperty.co.za portfolio).
// Verified 2026-07-27 against the scraped vacancies snapshot.
export const warehouseListings: VacancyListing[] = [
  {
    id: "1-kingfisher-avenue",
    building: "1 Kingfisher Avenue",
    sector: "Warehouse",
    sizeSqm: 4200,
    ratePerSqm: 120,
    availability: "1 November 2026",
    description:
      "A two-storey building currently configured as office space, with ground-floor volumes suitable for conversion to warehouse, laboratory, or workshop use. The flexible layout allows the premises to adapt to different operational requirements. The building includes one on-grade roller shutter door with capacity for additional access points, is fully air-conditioned throughout, and offers elevator access between floors for added convenience and functionality.",
    features: ["Ground floor with 4m height to eaves", "Divisible space configuration", "67 basement parking bays, and 36 open parking bays"],
    image: `${BASE}/6a1d562d4c28554ab6104b6b_20260528_121054.jpg`
  },
  {
    id: "2-kingfisher-avenue",
    building: "2 Kingfisher Avenue",
    sector: "Warehouse",
    sizeSqm: 3300,
    ratePerSqm: 112,
    availability: "1 July 2027",
    description:
      "This site offers a blank slate for industrial transformation as it is ideal for conversion into a modern warehouse or logistics facility. A rare chance to unlock value in a high-demand industrial corridor.",
    features: ["Proposed total GLA: 3,300sqm", "Office GLA: 300sqm", "Proposed warehouse GLA: 3,000sqm"],
    image: `${BASE}/6a327235eeb7c08747696557_Page%201_cover%20small.png`
  },
  {
    id: "6-kingfisher-avenue",
    building: "Unit 2, 6 Kingfisher Avenue",
    sector: "Warehouse",
    sizeSqm: 2320,
    ratePerSqm: 118,
    availability: "1 January 2027",
    description:
      "A new 2,320sqm warehouse development designed to support efficient logistics operations with dedicated yard space, integrated offices, and strong vertical capacity. The facility offers 11m height to eaves to support vertical storage requirements, three on-grade roller shutter doors for efficient movement of goods, and 18 parking bays, including 15 covered and 3 open bays. Beneficial occupation expected October 2026, completion scheduled for January 2027.",
    features: ["Warehouse GLA: 1,952sqm", "Office GLA: 368sqm", "Yard Area: +/-1000sqm"],
    image: `${BASE}/6a2941e4ad5b6417fd544e68_Stand%208%202300sqm%20warehouse.png`
  },
  {
    id: "6-weaver-avenue",
    building: "6 Weaver Avenue",
    sector: "Warehouse",
    sizeSqm: 11443,
    ratePerSqm: 109,
    availability: "1 September 2026",
    description:
      "An expansive logistics facility designed for distribution, storage, and industrial operations. The building supports high-volume movement of goods, with 15m height to eaves, rear and side loading configurations, dock levellers, and on-grade loading access. Additional features include power availability up to 2.5 MVA, floor load bearing capacity of 3,000 kg per sqm, landscaped dam views from the offices, and N1 highway signage exposure.",
    features: ["10,000 sqm warehouse space", "1,443 sqm office component", "5,800 sqm yard area"],
    image: `${BASE}/69ce8dd0adb056051e84acc5_ChatGPT%20Image%20Apr%202%2C%202026%2C%2005_08_34%20PM.png`
  }
];

export const officeListings: VacancyListing[] = [
  {
    id: "1-weaver-avenue-515",
    building: "1 Weaver Avenue",
    sector: "Office",
    sizeSqm: 515.6,
    ratePerSqm: 120,
    availability: "1 January 2025",
    description:
      "This well-configured office suite offers a bright workspace with scenic views and a calm atmosphere. Conveniently located near key amenities, it provides both practicality and appeal for businesses seeking a professional setting with easy access to surrounding services.",
    features: ["Prime Offices", "Security", "Generator"],
    image: `${BASE}/69e62fed89e1a4eb02346d06_ChatGPT%20Image%20Apr%2017%2C%202026%2C%2009_16_25%20PM.png`
  },
  {
    id: "1-weaver-avenue-500",
    building: "1 Weaver Avenue",
    sector: "Office",
    sizeSqm: 500.66,
    ratePerSqm: 120,
    availability: "27 February 2026",
    description:
      "Bright, spacious office with abundant natural light, set amid manicured landscaping — ideal for a professional, welcoming workspace.",
    features: ["Prime Offices", "Security", "Generator"],
    image: `${BASE}/69e62fed89e1a4eb02346d06_ChatGPT%20Image%20Apr%2017%2C%202026%2C%2009_16_25%20PM.png`
  },
  {
    id: "3-weaver-avenue",
    building: "3 Weaver Avenue",
    sector: "Office",
    sizeSqm: 1125.8,
    ratePerSqm: 90,
    availability: "1 April 2026",
    description:
      "An expansive office space featuring impressive high ceilings that enhance natural light and create a sense of volume and sophistication. Ideal for businesses seeking a modern, professional environment with room to grow.",
    features: ["Prime Offices", "Security", "Generator"],
    image: `${BASE}/6a3273527947476faf6366aa_ChatGPT%20Image%20Apr%2023%2C%202026%2C%2012_37_36%20PM-p-1600.jpg`
  },
  {
    id: "unit-1-1-weaver",
    building: "Unit 1, 1 Weaver Avenue",
    sector: "Office",
    sizeSqm: 266,
    ratePerSqm: 105,
    availability: "1 June 2026",
    description:
      "This well-configured office suite offers a bright workspace. Conveniently located near the entrance, it provides both practicality and appeal for businesses seeking a professional setting with easy access to surrounding services.",
    features: ["Prime Offices", "Security", "Generator"],
    image: `${BASE}/6a326c3ba9828abcd964c090_ChatGPT%20Image%20Jun%201%2C%202026%2C%2010_33_02%20AM.png`
  },
  {
    id: "8-sunbird-road",
    building: "8 Sunbird Road",
    sector: "Office",
    sizeSqm: 1028.19,
    ratePerSqm: 120,
    availability: "1 December 2025",
    description:
      "Spacious, refurbished office with serene views overlooking a koi pond. A tranquil setting that blends productivity with a calming work environment.",
    features: ["Prime Offices", "Security", "Generator"],
    image: `${BASE}/69ce8d3330a9c3f2979e36b7_Metropolitan%20Unit%206%20Sunbird.png`
  },
  {
    id: "2-weaver-avenue",
    building: "2 Weaver Avenue",
    sector: "Office",
    sizeSqm: 1614.7,
    ratePerSqm: 120,
    availability: "2 February 2026",
    description:
      "A bright and spacious open-plan office with abundant natural light, complemented by a private patio and braai facility — ideal for modern teams seeking a professional yet inviting environment.",
    features: ["Prime Offices", "Security", "Generator"],
    image: `${BASE}/6a0ad83ab1a17b8f2b551788_Stand%2011-1600%20Premium%20Offices.png`
  },
  {
    id: "1-weaver-avenue-338",
    building: "Unit 2, 1 Weaver Avenue",
    sector: "Office",
    sizeSqm: 338.14,
    ratePerSqm: 120,
    availability: "7 March 2025",
    description:
      "This recently upgraded first-floor office suite offers a modern and versatile workspace: a spacious open-plan area for collaborative working, three private offices for flexibility and privacy, and a fully fitted kitchen. Contemporary finishes throughout ensure a professional, ready-to-occupy space.",
    features: ["Prime Offices", "Security", "Generator"],
    image: `${BASE}/69e62fed89e1a4eb02346d06_ChatGPT%20Image%20Apr%2017%2C%202026%2C%2009_16_25%20PM.png`
  }
];

export const servicedOfficeListings: VacancyListing[] = [
  {
    id: "onpoint",
    building: "OnPoint",
    sector: "Serviced office",
    sizeSqm: 172.66,
    ratePerSqm: 117.5,
    availability: "Available immediately",
    description:
      "Modern serviced office unit with access to a full suite of shared amenities, designed to elevate the workday. Enjoy seamless use of three professional meeting rooms, private call booths, sleek kitchens and a welcoming reception area complete with an on-site barista. Tenants also benefit from monthly credits, adding flexibility and value to the workspace experience. Gross rental of R117.50 per m², monthly rental of R31,746.15. Furnished or unfurnished options, four covered parking bays.",
    features: ["Furnished or unfurnished", "Access to three meeting rooms", "Reception with on-site barista"],
    image: `${BASE}/69ce9c23efbedee7cabf70b3_6J2P0234_35_36_37_38_39_40.jpeg`
  }
];

export const allVacancyListings: VacancyListing[] = [
  ...warehouseListings,
  ...officeListings,
  ...servicedOfficeListings
];
