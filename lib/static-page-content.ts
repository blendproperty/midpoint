// Real, readable copy for each hardcoded (non-CMS) static page, used so the
// "Generate" buttons in Page settings (SEO description + JSON-LD schema)
// have actual page content to summarise instead of just a title. These
// pages don't have a content field in the database — their body is written
// directly in app/<path>/page.tsx (or sourced from scripts/scraped-data for
// Warehouses and Amenities) — so this is a light, hand-maintained mirror of
// that copy. Keep in sync with the page component when its copy changes.
import warehouses from "@/scripts/scraped-data/warehouses.json";
import amenities from "@/scripts/scraped-data/amenities.json";
import { pageContent, type ScrapedPage } from "@/lib/scraped";

function fromScraped(data: unknown): string {
  return pageContent(data as ScrapedPage)
    .map((block) => block.text)
    .join(" ");
}

const STATIC_COPY: Record<string, string> = {
  "/about-us":
    "About Us. Midpoint is a modern business estate in Midrand offering premium offices, serviced offices, and warehouse facilities. Developed by Blend Property Group. " +
    "Sections cover the estate's strategic growth story, a renewed vision for the park, and a grid of the office, serviced office and warehouse space types available. " +
    "Developed by property professionals: Midpoint is owned by Blend Property Group, a South African property company with extensive experience in the commercial and industrial sectors. " +
    "Since 2006, Blend Property Group has specialised in the development and investment of commercial and industrial properties across South Africa, guided by a commitment to innovation and design excellence, focused on enhancing productivity, operational efficiency, and long-term staff satisfaction.",
  "/location":
    "Location. Midpoint sits on the N1 between Johannesburg and Pretoria in Halfway House, Midrand — verified distances, access and route detail. " +
    "On the N1, between Johannesburg and Pretoria: Midpoint has 1,470 metres of frontage directly onto the N1 highway, roughly 25 km from Johannesburg and 31 km from Pretoria. " +
    "Halfway House, Midrand: the estate is based at 162 Tonetti Street, Halfway House, Midrand, 1685, one of Gauteng's most established commercial and industrial nodes, with direct N1 access. " +
    "Close to OR Tambo International Airport: approximately 21 km from OR Tambo International Airport, keeping the estate well connected for teams and clients travelling in and out of Johannesburg.",
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
  "/offices":
    "Offices to Rent in Midrand. Midpoint is a secure business estate on the N1 between Johannesburg and Pretoria, with backup power, security and on-site amenities included. Live availability, book a viewing or discuss requirements with the leasing team. " +
    "Flexible office environments: office suites across the estate vary in size and configuration, from newly refurbished spaces to larger floorplates suited to corporate teams, professional services firms, and operational headquarters, with private reception areas, dedicated kitchens, modern HVAC and secure access control. " +
    "Connected, professional surroundings: strong regional connectivity and visibility, with some spaces offering N1 highway exposure and others overlooking landscaped green areas. " +
    "A workplace that supports your team: amenities including a gym, padel courts with a rooftop terrace, the Fond restaurant and bar, on-site cafes, and 1.8 km of walking, running and cycling trails, all inside the estate. " +
    "Considerations before leasing: staff commute via 1,470m of N1 frontage (25km to Johannesburg, 31km to Pretoria, 21km to OR Tambo); generator-backed power and backup water with N+1 redundancy; amenities on the doorstep; conventional leases suit teams wanting dedicated branded space, with OnPoint serviced offices as the better fit for shorter-term or smaller-footprint needs; rate per square metre varies by building. " +
    "Current availability spans roughly 266 m² to 1,614.7 m² across buildings including 2 and 3 Weaver Avenue and 8 Sunbird Road. Leasing contact: Boitumelo, +27 11 380 9400, boitumelo@blendproperty.co.za.",
  "/warehouses": fromScraped(warehouses),
  "/amenities": fromScraped(amenities),
};

export function getStaticPageContent(path: string): string {
  return STATIC_COPY[path] || "";
}
