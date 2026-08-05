// Static snapshot kept as (a) the seed source for the first `prisma db seed`
// run, and (b) an emergency fallback if the database is briefly unreachable
// — see lib/vacancies.ts. This is no longer the live source of truth; edit
// vacancies via /admin/vacancies instead.
export type VacancySector = "Warehouse" | "Office" | "Serviced office";

export type VacancyListingSeed = {
  building: string;
  unitName?: string | null;
  sector: VacancySector;
  sizeSqm: number;
  ratePerSqm: number;
  availability: string;
  description: string;
  features: string[];
  image: string;
};

export const fallbackVacancies: VacancyListingSeed[] = [
  {
    building: "1 Kingfisher Avenue",
    sector: "Warehouse",
    sizeSqm: 4200,
    ratePerSqm: 120,
    availability: "1 November 2026",
    description:
      "A two-storey building currently configured as office space, with ground-floor volumes suitable for conversion to warehouse, laboratory, or workshop use. The flexible layout allows the premises to adapt to different operational requirements. The building includes one on-grade roller shutter door with capacity for additional access points, is fully air-conditioned throughout, and offers elevator access between floors for added convenience and functionality.",
    features: ["Ground floor with 4m height to eaves", "Divisible space configuration", "67 basement parking bays, and 36 open parking bays"],
    image: "/images/listings/1-kingfisher-avenue.jpg"
  },
  {
    building: "2 Kingfisher Avenue",
    sector: "Warehouse",
    sizeSqm: 3300,
    ratePerSqm: 112,
    availability: "1 July 2027",
    description:
      "This site offers a blank slate for industrial transformation as it is ideal for conversion into a modern warehouse or logistics facility. A rare chance to unlock value in a high-demand industrial corridor.",
    features: ["Proposed total GLA: 3,300sqm", "Office GLA: 300sqm", "Proposed warehouse GLA: 3,000sqm"],
    image: "/images/listings/2-kingfisher-avenue.png"
  },
  {
    building: "Unit 2, 6 Kingfisher Avenue",
    sector: "Warehouse",
    sizeSqm: 2320,
    ratePerSqm: 118,
    availability: "1 January 2027",
    description:
      "A new 2,320sqm warehouse development designed to support efficient logistics operations with dedicated yard space, integrated offices, and strong vertical capacity. The facility offers 11m height to eaves to support vertical storage requirements, three on-grade roller shutter doors for efficient movement of goods, and 18 parking bays, including 15 covered and 3 open bays. Beneficial occupation expected October 2026, completion scheduled for January 2027.",
    features: ["Warehouse GLA: 1,952sqm", "Office GLA: 368sqm", "Yard Area: +/-1000sqm"],
    image: "/images/listings/6-kingfisher-avenue.png"
  },
  {
    building: "6 Weaver Avenue",
    sector: "Warehouse",
    sizeSqm: 11443,
    ratePerSqm: 109,
    availability: "1 September 2026",
    description:
      "An expansive logistics facility designed for distribution, storage, and industrial operations. The building supports high-volume movement of goods, with 15m height to eaves, rear and side loading configurations, dock levellers, and on-grade loading access. Additional features include power availability up to 2.5 MVA, floor load bearing capacity of 3,000 kg per sqm, landscaped dam views from the offices, and N1 highway signage exposure.",
    features: ["10,000 sqm warehouse space", "1,443 sqm office component", "5,800 sqm yard area"],
    image: "/images/listings/6-weaver-avenue.png"
  },
  {
    building: "1 Weaver Avenue",
    unitName: "Unit 7, Sunbird Road (FF)",
    sector: "Office",
    sizeSqm: 515.6,
    ratePerSqm: 120,
    availability: "1 January 2025",
    description:
      "This well-configured office suite offers a bright workspace with scenic views and a calm atmosphere. Conveniently located near key amenities, it provides both practicality and appeal for businesses seeking a professional setting with easy access to surrounding services.",
    features: ["Prime Offices", "Security", "Generator"],
    image: "/images/listings/1-weaver-avenue.png"
  },
  {
    building: "1 Weaver Avenue",
    unitName: "Unit 7, Sunbird Road (GF)",
    sector: "Office",
    sizeSqm: 500.66,
    ratePerSqm: 120,
    availability: "27 February 2026",
    description:
      "Bright, spacious office with abundant natural light, set amid manicured landscaping — ideal for a professional, welcoming workspace.",
    features: ["Prime Offices", "Security", "Generator"],
    image: "/images/listings/1-weaver-avenue.png"
  },
  {
    building: "3 Weaver Avenue",
    sector: "Office",
    sizeSqm: 1125.8,
    ratePerSqm: 90,
    availability: "1 April 2026",
    description:
      "An expansive office space featuring impressive high ceilings that enhance natural light and create a sense of volume and sophistication. Ideal for businesses seeking a modern, professional environment with room to grow.",
    features: ["Prime Offices", "Security", "Generator"],
    image: "/images/listings/3-weaver-avenue.jpg"
  },
  {
    building: "Unit 1, 1 Weaver Avenue",
    sector: "Office",
    sizeSqm: 266,
    ratePerSqm: 105,
    availability: "1 June 2026",
    description:
      "This well-configured office suite offers a bright workspace. Conveniently located near the entrance, it provides both practicality and appeal for businesses seeking a professional setting with easy access to surrounding services.",
    features: ["Prime Offices", "Security", "Generator"],
    image: "/images/listings/unit1-1-weaver.png"
  },
  {
    building: "8 Sunbird Road",
    sector: "Office",
    sizeSqm: 1028.19,
    ratePerSqm: 120,
    availability: "1 December 2025",
    description:
      "Spacious, refurbished office with serene views overlooking a koi pond. A tranquil setting that blends productivity with a calming work environment.",
    features: ["Prime Offices", "Security", "Generator"],
    image: "/images/listings/8-sunbird-road.png"
  },
  {
    building: "2 Weaver Avenue",
    sector: "Office",
    sizeSqm: 1614.7,
    ratePerSqm: 120,
    availability: "2 February 2026",
    description:
      "A bright and spacious open-plan office with abundant natural light, complemented by a private patio and braai facility — ideal for modern teams seeking a professional yet inviting environment.",
    features: ["Prime Offices", "Security", "Generator"],
    image: "/images/listings/2-weaver-avenue.png"
  },
  {
    building: "Unit 2, 1 Weaver Avenue",
    sector: "Office",
    sizeSqm: 338.14,
    ratePerSqm: 120,
    availability: "7 March 2025",
    description:
      "This recently upgraded first-floor office suite offers a modern and versatile workspace: a spacious open-plan area for collaborative working, three private offices for flexibility and privacy, and a fully fitted kitchen. Contemporary finishes throughout ensure a professional, ready-to-occupy space.",
    features: ["Prime Offices", "Security", "Generator"],
    image: "/images/listings/1-weaver-avenue.png"
  },
  {
    building: "OnPoint",
    unitName: "Office G.02",
    sector: "Serviced office",
    sizeSqm: 172.66,
    ratePerSqm: 117.5,
    availability: "Available immediately",
    description:
      "Modern serviced office unit with access to a full suite of shared amenities, designed to elevate the workday. Enjoy seamless use of three professional meeting rooms, private call booths, sleek kitchens and a welcoming reception area complete with an on-site barista. Tenants also benefit from monthly credits, adding flexibility and value to the workspace experience. Gross rental of R117.50 per m², monthly rental of R31,746.15. Furnished or unfurnished options, four covered parking bays.",
    features: ["Furnished or unfurnished", "Access to three meeting rooms", "Reception with on-site barista"],
    image: "/images/listings/onpoint.jpeg"
  }
];
