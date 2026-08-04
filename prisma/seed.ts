// One-time / idempotent seed: creates the first SUPER_ADMIN user (if none
// exists) and migrates the previously-static vacancy + FAQ content, and the
// previously hand-coded Offices/Warehouses/Amenities/Location marketing
// pages, into the database so the site has real content from the moment
// the CMS goes live. Safe to re-run — everything here is an upsert or a
// "skip/create-only-if-missing", so it never clobbers a later admin edit.
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { fallbackVacancies } from "../lib/vacancies-fallback";
import { fallbackFaqs } from "../lib/faqs-fallback";

const prisma = new PrismaClient();

const SECTOR_MAP: Record<string, "WAREHOUSE" | "OFFICE" | "SERVICED_OFFICE"> = {
  Warehouse: "WAREHOUSE",
  Office: "OFFICE",
  "Serviced office": "SERVICED_OFFICE",
};

async function seedSuperAdmin() {
  const email = process.env.SEED_SUPERADMIN_EMAIL;
  const password = process.env.SEED_SUPERADMIN_PASSWORD;

  const existingCount = await prisma.user.count();
  if (existingCount > 0) {
    console.log("Users already exist, skipping superadmin seed.");
    return;
  }
  if (!email || !password) {
    console.warn(
      "SEED_SUPERADMIN_EMAIL / SEED_SUPERADMIN_PASSWORD not set — no admin user created."
    );
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      passwordHash,
      name: "Brett",
      role: "SUPER_ADMIN",
    },
  });
  console.log(`Created SUPER_ADMIN user: ${email}`);
}

async function seedVacancies() {
  const count = await prisma.vacancy.count();
  if (count > 0) {
    console.log("Vacancies already exist, skipping vacancy seed.");
    return;
  }
  let sortOrder = 0;
  for (const listing of fallbackVacancies) {
    await prisma.vacancy.create({
      data: {
        building: listing.building,
        sector: SECTOR_MAP[listing.sector],
        sizeSqm: listing.sizeSqm,
        ratePerSqm: listing.ratePerSqm,
        availability: listing.availability,
        description: listing.description,
        features: listing.features,
        image: listing.image,
        status: "PUBLISHED",
        sortOrder: sortOrder++,
      },
    });
  }
  console.log(`Seeded ${fallbackVacancies.length} vacancies.`);
}

async function seedFaqs() {
  const count = await prisma.faq.count();
  if (count > 0) {
    console.log("FAQs already exist, skipping FAQ seed.");
    return;
  }
  let sortOrder = 0;
  for (const faq of fallbackFaqs) {
    await prisma.faq.create({
      data: { question: faq.question, answer: faq.answer, sortOrder: sortOrder++ },
    });
  }
  console.log(`Seeded ${fallbackFaqs.length} FAQs.`);
}

async function seedSiteSettings() {
  await prisma.siteSetting.upsert({
    where: { id: "global" },
    update: {},
    create: {
      id: "global",
      siteName: "Midpoint Midrand",
      domain: "https://www.mid-point.co.za",
      phone: "+27 11 380 9400",
      email: "boitumelo@blendproperty.co.za",
      defaultSocialImage:
        "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/6a148a5463dac69c69cbc3a8_amenities_banner-p-1600.jpg",
      allowIndexing: true,
      vacancyRevalidateSeconds: 604800,
    },
  });
  console.log("Site settings row ensured.");
}

// One-time backfill: link any pre-existing Enquiry rows (submitted before
// the Contact/CRM model existed) to a Contact, deduplicated by email, so
// nothing submitted before this feature shipped is left orphaned in
// /admin/contacts. Safe to re-run — only touches rows where contactId is
// still null.
async function backfillContactsFromEnquiries() {
  const orphaned = await prisma.enquiry.findMany({
    where: { contactId: null },
    orderBy: { createdAt: "asc" },
  });

  if (orphaned.length === 0) {
    console.log("No orphaned enquiries to backfill into Contacts.");
    return;
  }

  let linked = 0;
  for (const enquiry of orphaned) {
    const email = enquiry.email?.trim().toLowerCase();
    if (!email) continue;

    const contact = await prisma.contact.upsert({
      where: { email },
      update: {
        firstName: enquiry.firstName || undefined,
        lastName: enquiry.lastName || undefined,
        phone: enquiry.phone || undefined,
      },
      create: {
        email,
        firstName: enquiry.firstName,
        lastName: enquiry.lastName,
        phone: enquiry.phone,
        source: "Midpoint",
      },
    });

    await prisma.enquiry.update({
      where: { id: enquiry.id },
      data: { contactId: contact.id },
    });
    linked++;
  }
  console.log(`Backfilled ${linked} pre-existing enquiries into Contacts.`);
}

type SeedPillarFeature = { heading: string; text: string; image: string; alt?: string };
type SeedPillarConsideration = { heading: string; text: string };
type SeedPillarFaq = { question: string; answer: string };
type SeedPillarLink = { label: string; href: string };

type SeedPillarPage = {
  slug: string;
  title: string;
  primaryEntity: string;
  primaryAudience?: string;
  decisionStage?: string;
  primarySearchIntent?: string;
  primaryConversion?: string;
  relatedSector: "OFFICE" | "WAREHOUSE" | "SERVICED_OFFICE" | null;
  heroImage: string;
  heroAnswer: string;
  trustStrip: string;
  showReadyToMove: boolean;
  features: SeedPillarFeature[];
  considerations: SeedPillarConsideration[];
  listingsHeading: string | null;
  listingsIntro: string | null;
  contentHtml: string;
  faqs: SeedPillarFaq[];
  faqsHeading?: string;
  ctaHeading: string;
  ctaText: string;
  exploreLinks: SeedPillarLink[];
  expertName?: string;
  expertRole?: string;
  expertBio?: string;
  reviewOwner?: string;
  lastReviewedAt?: Date;
  seoTitle: string;
  seoDescription: string;
  focusKeyword: string;
};

// Migrates the four hand-coded marketing pages (Offices, Warehouses,
// Amenities, Location) into full Pillar Pages, preserving their real copy,
// images and FAQs so the comprehensive pillar template renders exactly the
// same richness those pages had as hardcoded routes — just admin-editable
// now. Upsert-with-empty-update: creates once, never overwrites a later
// admin edit on re-run.
async function seedConvertedPillarPages() {
  const pages: SeedPillarPage[] = [
    {
      slug: "offices",
      title: "Offices to Rent in Midrand",
      primaryEntity: "Office space",
      relatedSector: "OFFICE",
      heroImage: "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/6a169af02d64c62ff25b56af_office-banner-p-1600.jpg",
      heroAnswer:
        "Midpoint is a secure business estate on the N1 between Johannesburg and Pretoria, with backup power, security and on-site amenities included. Live availability below — book a viewing or discuss your requirements with the leasing team.",
      trustStrip: "N1 highway frontage\nBackup power & water\nOn-site amenities",
      showReadyToMove: true,
      features: [
        {
          heading: "Flexible office environments.",
          text: "Office suites across the estate vary in size and configuration, allowing businesses to scale as their needs evolve. Some offices are newly refurbished or redeveloped, while others provide larger floorplates suited to corporate teams, professional services firms, and operational headquarters. Layouts incorporate features such as private reception areas, dedicated kitchens, modern HVAC systems, and secure access control, creating professional working environments that balance practicality with comfort.",
          image: "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/6a16a7cc8af199f89084d8f0_Office-image-p-500.jpg",
        },
        {
          heading: "Connected, professional surroundings.",
          text: "Midpoint’s office buildings benefit from strong regional connectivity and visibility. Several spaces offer exposure to the N1 highway, while others sit within quieter areas of the estate overlooking landscaped green areas. These settings allow businesses to maintain a professional presence while providing teams with a more balanced working environment.",
          image: "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/6a16c26beae69b5c5eacdd65_professionals-p-500.jpg",
        },
        {
          heading: "A workplace that supports your team.",
          text: "At Midpoint, the working day does not begin and end at the desk. The wider environment and unmatched amenities offer opportunities to meet colleagues, enjoy a meal, take a break, exercise, or simply step outside. It’s a workplace experience that feels noticeably different from conventional office parks.",
          image: "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/6a16c3bea9126473ae8b83ae_Workplace-p-500.jpg",
        },
      ],
      considerations: [
        {
          heading: "Staff access and commute",
          text: "Midpoint sits directly on the N1, roughly 25 km from Johannesburg and 31 km from Pretoria, with 1,470 metres of highway frontage and 21 km to OR Tambo International Airport. For teams currently based in Sandton or Waterfall, that's a materially shorter, more predictable commute for staff living on either side of the N1 corridor, without the rates that come with those nodes.",
        },
        {
          heading: "Resilience",
          text: "The estate runs on generator-backed power and backup water with N+1 redundancy, so day-to-day operations are protected against grid outages and water disruptions. Full connectivity and fibre specification for a given building should be confirmed for your specific unit when you enquire, since this can vary by building and fit-out stage.",
        },
        {
          heading: "Amenities on your doorstep",
          text: "A gym, padel courts with a rooftop terrace, the Fond restaurant and bar, on-site cafes, and 1.8 km of walking, running and cycling trails are all inside the estate — meaning meetings, team breaks and after-work socialising don't require leaving the park. See the full amenities breakdown for what's operating now versus planned.",
        },
        {
          heading: "Less flexibility",
          text: "Conventional office leases at Midpoint suit teams that want a dedicated, branded space and are ready to commit to a standard commercial term. If your need is shorter-term, smaller-footprint, or you want furnished space with shared meeting rooms and reception included, OnPoint's serviced offices are the better fit — ask the leasing team which structure suits your timeline before you commit.",
        },
        {
          heading: "Total occupancy cost",
          text: "Rate per square metre varies by building and is quoted per listing on the vacancy schedule. As with any commercial lease, confirm directly with the leasing team what's included in the quoted rate versus billed separately (utilities, operating costs, parking) before comparing offers.",
        },
      ],
      listingsHeading: "Current office availability at Midpoint",
      listingsIntro: "A snapshot of office space currently available. Full specifications, floor plans, rates and photos are on the live vacancy schedule.",
      contentHtml: "",
      faqs: [
        { question: "What office space is available in Midrand at Midpoint?", answer: "Midpoint offers office suites from smaller professional-team spaces up to full corporate headquarters, alongside OnPoint serviced offices for smaller teams or satellite presences. Current availability, size and rate are listed on this page and verified against live inventory." },
        { question: "Which Midpoint space suits a head office versus a satellite team?", answer: "Larger single-tenant offices suit corporate head offices needing a distinctive, branded environment. Smaller or shorter-term needs are better served by OnPoint serviced offices, which offer flexible terms for satellite teams, project groups, or a first Midrand presence." },
        { question: "Is there backup power and connectivity at Midpoint?", answer: "Yes. The estate runs on generator-backed power and backup water with N+1 redundancy, so operations continue through grid outages or water disruptions." },
        { question: "How close is Midpoint to the N1?", answer: "Midpoint has 1,470 metres of N1 highway frontage. It's roughly 25 km to Johannesburg, 31 km to Pretoria, and 21 km to OR Tambo International Airport — positioned directly between the two cities." },
        { question: "Can a broker get a current availability schedule?", answer: "Yes — Midpoint's vacancy schedule and availability report is published on the site, and brokers are welcome to contact the leasing team directly for tenant-specific requirements." },
        { question: "How do I book a viewing or get in touch about leasing?", answer: "Contact the Midpoint leasing team on +27 11 380 9400 or boitumelo@blendproperty.co.za, or use the enquiry form on the Contact Us page." },
      ],
      faqsHeading: "Frequently asked questions about offices at Midpoint",
      ctaHeading: "Talk to the leasing team",
      ctaText: "Boitumelo handles office enquiries at Midpoint — reach out directly on +27 11 380 9400 or boitumelo@blendproperty.co.za to book a viewing or discuss your requirements. Midpoint is developed and managed by Blend Property Group.",
      exploreLinks: [
        { label: "Warehouses to rent", href: "/warehouses" },
        { label: "Amenities & lifestyle", href: "/amenities" },
        { label: "About Midpoint & Blend Property Group", href: "/about-us" },
        { label: "Full vacancy schedule", href: "/availability-report" },
      ],
      expertName: "Boitumelo",
      expertRole: "Leasing Manager, Midpoint",
      reviewOwner: "Boitumelo",
      lastReviewedAt: new Date(),
      seoTitle: "Offices to Rent in Midrand | Midpoint Business Park",
      seoDescription: "Modern offices to rent in Midrand at Midpoint, between Joburg and Pretoria. Live availability, backup power, security and on-site amenities. Book a viewing.",
      focusKeyword: "office space Midrand",
    },
    {
      slug: "warehouses",
      title: "Warehouse Space Built for Modern Logistics and Distribution",
      primaryEntity: "Warehouse space",
      relatedSector: "WAREHOUSE",
      heroImage: "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/6a156e00cfaf0adb9c0eb204_warehouse-p-800.jpg",
      heroAnswer: "High eave heights, efficient loading access, and generous yard capacity. High-performance warehouse infrastructure in Midrand.",
      trustStrip: "High eave heights\nDock levellers & roller shutters\nN1 highway exposure",
      showReadyToMove: true,
      features: [],
      considerations: [
        { heading: "Clear Height", text: "High eave heights support vertical racking systems and maximise storage capacity." },
        { heading: "Loading Efficiency", text: "A combination of dock levellers, on-grade roller shutters, and rear or side loading enables efficient movement of goods." },
        { heading: "Power Availability", text: "Strong power capacity supports warehousing, distribution, light manufacturing, and operational facilities." },
        { heading: "Yard Capacity", text: "Large yard areas allow for truck manoeuvring, loading activity, and operational flexibility." },
        { heading: "Integrated Offices", text: "Several facilities incorporate office components that keep administration and operational teams connected to day-to-day warehouse activity." },
        { heading: "Highway Exposure", text: "Select buildings offer visibility from the N1 highway, providing signage opportunities and strong brand presence." },
      ],
      listingsHeading: "Current warehouse availability at Midpoint",
      listingsIntro: "A snapshot of warehouse space currently available. Full specifications and rates are on the live vacancy schedule.",
      contentHtml:
        "<p>Midpoint offers a range of warehouse space in Midrand. Located between Johannesburg and Pretoria, the estate provides convenient access to major transport routes, making it well suited to businesses serving Gauteng and national supply chains.</p><p>Warehouse sizes vary to accommodate different operational requirements, from flexible mixed-use buildings to large-scale distribution facilities with integrated offices and yard space.</p><h2>The Midpoint lifestyle advantage.</h2><p>Running a warehouse is demanding, and Midpoint recognises the people behind the operation. The surrounding amenities create a work environment where teams can take a break, meet informally, or recharge, adding a lifestyle element rarely found in industrial spaces.</p>",
      faqs: [],
      ctaHeading: "Contact us to discuss availability, pricing, or to arrange a viewing",
      ctaText: "Contact us to discuss availability, pricing, or to arrange a viewing of any warehouse at Midpoint.",
      exploreLinks: [
        { label: "Offices to rent", href: "/offices" },
        { label: "Amenities & lifestyle", href: "/amenities" },
        { label: "About Midpoint & Blend Property Group", href: "/about-us" },
        { label: "Full vacancy schedule", href: "/availability-report" },
      ],
      seoTitle: "Warehouses to Rent in Midrand | Midpoint Business Park",
      seoDescription: "High-performance Midrand warehouses with high eaves, efficient loading access, and generous yards. Built for logistics, distribution, and light manufacturing.",
      focusKeyword: "warehouse space Midrand",
    },
    {
      slug: "amenities",
      title: "Amenities, Security & Backup Power at Midpoint",
      primaryEntity: "Midpoint's on-site amenities, security and resilience infrastructure",
      primaryAudience: "Facilities managers, HR and procurement teams weighing workday experience and operational risk",
      decisionStage: "Consideration to decision — amenities and resilience are evaluated after location and space fit",
      primarySearchIntent: "Midpoint amenities, backup power Midrand office, and business park security Midrand",
      primaryConversion: "Check availability and discuss operational requirements",
      relatedSector: null,
      heroImage: "/images/pages/amenities-banner.jpg",
      heroAnswer: "Midpoint's planned and available amenities include a gym, padel courts, the Fond restaurant and bar, cafés, 1.8 km of walking, running and cycling trails, and corporate accommodation. The estate also uses generator-backed power and backup water with N+1 redundancy. Some amenities and buildings remain under construction; confirm current status before relying on availability.",
      trustStrip: "Gym and padel facilities\nFond restaurant, bar and cafés\n1.8 km of landscaped trails\nCorporate accommodation\nGenerator-backed power and backup water",
      showReadyToMove: false,
      features: [
        { heading: "Fond restaurant, bar and cafés", text: "These spaces are intended to give tenants and clients somewhere to meet, eat or take a break without leaving the estate. Confirm which venues are operating, their hours and public-access arrangements before a visit.", image: "/images/gallery/gallery-10-restaurant.jpg", alt: "Illustrative restaurant and café setting representing Midpoint's workday amenities" },
        { heading: "Gym and padel facilities", text: "Fitness facilities support exercise and informal team connection around the working day. Confirm current operating status, membership or booking terms and tenant access with the leasing team.", image: "/images/gallery/gallery-9-gym.jpg", alt: "Illustrative gym image for Midpoint's fitness amenities" },
        { heading: "1.8 km of landscaped trails", text: "Walking, running and cycling routes extend for approximately 1.8 km through the landscaped estate grounds, offering an outdoor alternative to remaining at a desk throughout the day.", image: "/images/gallery/gallery-8-running.jpg", alt: "Illustrative view of landscaped walking, running and cycling trails at a business park" },
        { heading: "Corporate accommodation", text: "Corporate accommodation is intended for visiting executives, project teams and short-term stays. Confirm current availability, finished specification, eligibility and the booking process before making travel arrangements.", image: "/images/listings/corporate-accommodation.png", alt: "Architectural visualisation of proposed corporate accommodation at Midpoint" },
        { heading: "Generator-backed power and backup water", text: "Midpoint uses generator-backed power and backup water with N+1 redundancy. Coverage, capacity and changeover arrangements must be confirmed for the specific building and tenant load.", image: "/images/pillars/warehouses/backup-power-generator.webp", alt: "Generator representing backup power infrastructure at Midpoint" },
      ],
      considerations: [
        { heading: "Current versus planned status", text: "Some buildings and amenities remain under construction. Confirm what is operational on the date of your visit; renderings and generic lifestyle images are illustrative, not proof of current availability." },
        { heading: "Security and access", text: "Ask the leasing team to confirm the current perimeter, visitor, vehicle and building-level access arrangements applicable to your staff, clients and operating hours." },
        { heading: "Power and water resilience", text: "Confirm generator coverage and capacity, changeover arrangements, backup-water configuration and any limitations for the exact building and load under consideration." },
        { heading: "Connectivity", text: "Fibre providers, capacity and redundancy can vary by building and fit-out stage. Treat connectivity as a unit-level technical check rather than an estate-wide assumption." },
        { heading: "Amenity access and booking", text: "Confirm operating hours, tenant or public eligibility, booking rules, fees and the corporate-accommodation process before relying on an amenity for staff or visitors." },
      ],
      listingsHeading: null,
      listingsIntro: null,
      contentHtml: `<h2>A Workplace With Room to Breathe</h2><p>Midpoint is designed around more than leased square metres. Its workday proposition combines places to eat and meet, fitness and outdoor activity, accommodation for visiting teams, and resilience infrastructure within the wider business estate.</p><p>That proposition must be assessed against what is available today. Some amenities and buildings remain under construction, and some site imagery is illustrative. Prospective tenants should confirm current operating status, access terms and completion timing with the leasing team before making a decision.</p><h2>Current and Planned Amenities</h2><table><thead><tr><th>Amenity</th><th>Purpose</th><th>Status</th></tr></thead><tbody><tr><td>Gym</td><td>On-site fitness facility</td><td>Confirm before visiting</td></tr><tr><td>Padel facilities</td><td>Exercise and team activity</td><td>Confirm before booking</td></tr><tr><td>Fond restaurant and bar</td><td>Meals, meetings and informal gatherings</td><td>Confirm opening status and hours</td></tr><tr><td>Cafés</td><td>Coffee and quick-bite options</td><td>Confirm current venues and hours</td></tr><tr><td>Walking, running and cycling trails</td><td>Approximately 1.8 km through landscaped grounds</td><td>Confirm current route access</td></tr><tr><td>Corporate accommodation</td><td>Short stays for visiting teams</td><td>Confirm availability and booking process</td></tr></tbody></table><h2>Security and Access Control</h2><p>Security is a building-selection and operational question, not a label. Ask for the current estate and building-level arrangements, including visitor processing, vehicle access, after-hours procedures and the controls applicable to the specific premises.</p><p>The page does not publish an assumed access-control method or security specification. These details should be confirmed directly because they may change and because a tenant's operating hours and visitor profile affect what is suitable.</p><h2>Power and Water Resilience</h2><p>Midpoint uses generator-backed power and backup water with N+1 redundancy. Before signing for a specific unit, confirm which loads are covered, generator capacity, changeover behaviour, water configuration and any building-specific limitations.</p><p>Businesses with critical equipment or extended operating hours should include expected load and continuity requirements in their technical brief rather than relying on a general estate claim.</p><h2>Connectivity</h2><p>Fibre and connectivity specifications can vary by building and fit-out stage. Confirm available providers, installation lead times, service level and redundancy options for the exact unit being assessed.</p><h2>Corporate Accommodation</h2><p>Corporate accommodation is intended to support visiting executives, project teams and short-term stays close to the workplace. Current availability, completed specification, booking eligibility and rates should be confirmed before travel is arranged.</p><h2>Choosing Amenities That Matter to Your Team</h2><p>Different teams value different parts of the workday environment. HR may focus on wellness and retention; facilities teams may prioritise access and resilience; operations teams may care most about power, water and connectivity. Bring those priorities to a site visit and test the facilities that materially affect the decision.</p>`,
      faqs: [
        { question: "What amenities are available or planned at Midpoint?", answer: "The amenity mix includes a gym, padel facilities, the Fond restaurant and bar, cafés, approximately 1.8 km of landscaped trails and corporate accommodation. Some amenities and buildings remain under construction, so confirm current operating status before visiting." },
        { question: "Is there backup power at Midpoint?", answer: "Yes. Midpoint uses generator-backed power. Confirm coverage, capacity and changeover arrangements for the specific building and tenant load." },
        { question: "Is there backup water at Midpoint?", answer: "Yes. The estate describes its backup-water arrangement as N+1 redundant. Confirm the practical configuration and coverage for the specific building during technical review." },
        { question: "What security is in place at Midpoint?", answer: "Security and access arrangements should be confirmed with the leasing team for the estate and the specific building, including visitor, vehicle and after-hours requirements." },
        { question: "Is fibre or connectivity included?", answer: "Connectivity varies by building and fit-out stage. Confirm providers, capacity, installation timing, service levels and whether costs are included for the unit being considered." },
        { question: "How long are the walking and cycling trails?", answer: "The landscaped walking, running and cycling routes extend for approximately 1.8 km through the estate grounds." },
        { question: "Is corporate accommodation available?", answer: "Corporate accommodation forms part of the Midpoint amenity plan. Confirm current availability, completed specification, eligibility, rates and the booking process before arranging a stay." },
        { question: "Are all amenities shown on the site currently built?", answer: "No. Some buildings and amenities remain under construction. Renderings and generic lifestyle imagery are illustrative; confirm current-versus-planned status with the leasing team." },
      ],
      faqsHeading: "Frequently Asked Questions About Amenities at Midpoint",
      ctaHeading: "Ready to experience Midpoint?",
      ctaText: "Check current availability, or discuss your team's specific amenity, security, connectivity and resilience requirements with Boitumelo.",
      exploreLinks: [
        { label: "Offices to rent", href: "/offices" },
        { label: "Warehouses to rent", href: "/warehouses" },
        { label: "About Midpoint & Blend Property Group", href: "/business-park-midrand" },
      ],
      expertName: "Boitumelo",
      expertRole: "Leasing Manager, Midpoint",
      expertBio: "Boitumelo helps prospective tenants compare Midpoint's office and warehouse options, arrange site visits and confirm practical amenity, access and resilience requirements.",
      reviewOwner: "Boitumelo",
      seoTitle: "Midpoint Amenities Midrand | Security & Backup Power",
      seoDescription: "Explore Midpoint amenities in Midrand, including fitness, trails, hospitality, corporate accommodation, backup power and the questions to confirm before leasing.",
      focusKeyword: "Midpoint amenities Midrand",
    },
    {
      slug: "location",
      title: "Why Midrand: Location, Access and Logistics at Midpoint",
      primaryEntity: "Midpoint Business Park's N1 location in Midrand",
      primaryAudience: "Facilities, HR and logistics decision-makers comparing Midrand with Sandton, Waterfall and Centurion",
      decisionStage: "Consideration — location and access are early filters before a specific space is shortlisted",
      primarySearchIntent: "Midpoint location, business park Midrand N1, and office or warehouse access in Midrand",
      primaryConversion: "Discuss access, commute requirements or arrange a site visit",
      relatedSector: null,
      heroImage: "/images/sitemap/aerial.jpg",
      heroAnswer: "Midpoint is at 162 Tonetti Street, Halfway House, Midrand, 1685 — on the N1 with 1,470 metres of direct highway frontage, positioned between Johannesburg and Pretoria. It is approximately 25 km from Johannesburg, 31 km from Pretoria and 21 km from OR Tambo International Airport. Distances last verified 28 July 2026.",
      trustStrip: "1,470 metres of direct N1 highway frontage\n25 km to Johannesburg\n31 km to Pretoria\n21 km to OR Tambo International Airport",
      showReadyToMove: false,
      features: [
        { heading: "Direct N1 frontage", text: "1,470 metres of direct highway frontage puts Midpoint on one of Gauteng's principal arterial routes, with straightforward estate access rather than a multi-turn approach through a dense city centre.", image: "/images/sitemap/aerial.jpg", alt: "Aerial view of Midpoint Business Park's direct N1 highway frontage in Midrand" },
        { heading: "Between two business centres, not inside either", text: "At approximately 25 km from Johannesburg and 31 km from Pretoria, Midpoint sits between Gauteng's two largest business centres. Teams can assess access in both directions without locating inside either CBD.", image: "/images/pillars/warehouses/johannesburg-pretoria-corridor.webp", alt: "Map showing Midpoint on the N1 corridor between Johannesburg and Pretoria" },
        { heading: "Approximately 21 km from OR Tambo", text: "For teams with regular travel, client visits or air-freight requirements, OR Tambo International Airport is approximately 21 km from Midpoint. Test the route at the operating times relevant to your team before making a location decision.", image: "/images/location/map-background.avif", alt: "Map of Midpoint's central Gauteng location and access routes" },
      ],
      considerations: [
        { heading: "Drive time, not just distance", text: "Traffic changes throughout the day. Test representative staff, client and delivery routes in both peak and off-peak conditions rather than relying on a single optimistic travel-time estimate." },
        { heading: "Freight and logistics access", text: "N1 frontage is useful for regional movement, but confirm the access point, vehicle route, turning space and loading requirements for the specific warehouse or building being considered." },
        { heading: "Comparing commercial nodes", text: "When comparing Midrand with Sandton, Waterfall or Centurion, use real staff-origin data, current rentals, parking costs and operating requirements. The best node depends on where a team and its customers actually travel from." },
        { heading: "Public and alternative transport", text: "If public transport, Gautrain access, staff shuttles or cycling routes affect the decision, discuss the current options with the leasing team and test the final connection to the estate." },
      ],
      listingsHeading: null,
      listingsIntro: null,
      contentHtml: `<h2>Why Midrand for Business?</h2><p>Location is usually one of the first filters applied when comparing business parks, often before a team reviews a specific floor plan or rental. Midpoint's answer is straightforward: 162 Tonetti Street, Halfway House, Midrand, 1685, directly alongside the N1 and positioned between Johannesburg and Pretoria.</p><p>That “between, not inside” position is the core of the location case. Johannesburg is approximately 25 km away, Pretoria approximately 31 km, and OR Tambo International Airport approximately 21 km away. These figures describe distance, not a guaranteed journey time; traffic, the exact destination and time of travel still matter.</p><table><thead><tr><th>Metric</th><th>Verified value</th></tr></thead><tbody><tr><td>Johannesburg</td><td>Approximately 25 km</td></tr><tr><td>Pretoria</td><td>Approximately 31 km</td></tr><tr><td>OR Tambo International Airport</td><td>Approximately 21 km</td></tr><tr><td>Direct N1 highway frontage</td><td>1,470 metres</td></tr></tbody></table><h2>Distance and Drive Time</h2><p>A kilometre figure is useful for orientation, but it does not tell a facilities or HR team what a Monday-morning commute will feel like. A credible location assessment should test realistic peak and off-peak journeys from the residential areas where staff live, as well as the destinations customers, suppliers and delivery vehicles use most often.</p><p>Midpoint's structural advantage is direct access to the N1 corridor in both directions. The practical benefit will differ by journey, so the leasing team can help arrange a site visit at a representative operating time rather than presenting a single universal drive-time claim.</p><h2>Comparing Midrand, Sandton, Waterfall and Centurion</h2><p>The right commercial node depends on a business's real travel pattern. Midpoint is most compelling when a business needs access across the Johannesburg–Pretoria corridor, values N1 visibility, or combines office activity with logistics and distribution requirements.</p><p>Compare total occupancy cost rather than rent alone. Current rental, parking, staff travel, delivery routes, resilience infrastructure and the suitability of the available space all affect the final decision.</p><h2>Freight and Logistics Access</h2><p>For distribution and operational businesses, direct N1 frontage reduces reliance on lower-capacity urban roads for the regional leg of a journey. Confirm the entrance used by large vehicles, internal circulation, turning space, loading configuration and any operating restrictions for the unit under consideration.</p><h2>Access to OR Tambo International Airport</h2><p>OR Tambo International Airport is approximately 21 km from Midpoint. As with city journeys, allow for traffic and test the route at the times that matter to the operation before treating distance as a schedule.</p><h2>Getting to Midpoint</h2><p>Midpoint is at 162 Tonetti Street, Halfway House, Midrand, 1685. Use the Google Maps link below for turn-by-turn directions, or contact the leasing team to arrange a visit.</p>`,
      faqs: [
        { question: "Is Midpoint between Johannesburg and Pretoria?", answer: "Yes. Midpoint sits on the N1 corridor, approximately 25 km from Johannesburg and 31 km from Pretoria." },
        { question: "How close is Midpoint to the N1?", answer: "Midpoint has 1,470 metres of direct N1 highway frontage." },
        { question: "How far is Midpoint from OR Tambo International Airport?", answer: "Approximately 21 km. Actual travel time varies with traffic and the time of day." },
        { question: "What is Midpoint's address?", answer: "162 Tonetti Street, Halfway House, Midrand, 1685." },
        { question: "Is Midpoint suitable for a business with logistics or freight needs?", answer: "Its N1 frontage supports regional route access, but vehicle access, internal circulation, yards and loading suitability must be confirmed for the specific building." },
        { question: "Can I visit the estate before deciding?", answer: "Yes. Contact the leasing team to arrange a site visit and assess the access routes at a time relevant to your operation." },
        { question: "Who do I contact about access or commute questions?", answer: "Contact Boitumelo, Leasing Manager, on +27 11 380 9400 or boitumelo@blendproperty.co.za." },
      ],
      faqsHeading: "Frequently Asked Questions About Midpoint's Location",
      ctaHeading: "Want to see the access for yourself?",
      ctaText: "Arrange a site visit, or discuss your team's commute, client and logistics access needs with Boitumelo before booking a viewing.",
      exploreLinks: [
        { label: "Offices to rent", href: "/offices" },
        { label: "Warehouses to rent", href: "/warehouses" },
        { label: "About Midpoint & Blend Property Group", href: "/business-park-midrand" },
        { label: "View Midpoint on Google Maps", href: "https://www.google.com/maps?q=162+Tonetti+St,+Halfway+House,+Midrand,+1685" },
      ],
      expertName: "Boitumelo",
      expertRole: "Leasing Manager, Midpoint",
      expertBio: "Boitumelo helps prospective tenants compare Midpoint's office and warehouse options, arrange site visits and work through practical access requirements with the leasing team.",
      reviewOwner: "Boitumelo",
      lastReviewedAt: new Date("2026-07-28T00:00:00.000Z"),
      seoTitle: "Midpoint Location Midrand | N1 Access & Distances",
      seoDescription: "Explore Midpoint's N1 location in Midrand, verified distances to Johannesburg, Pretoria and OR Tambo, access considerations and site-visit details.",
      focusKeyword: "Midpoint location Midrand",
    },
  ];

  for (const page of pages) {
    const existing = await prisma.pillarPage.findUnique({ where: { slug: page.slug } });
    if (existing) {
      console.log(`Pillar page /${page.slug} already exists, leaving admin edits in place.`);
      continue;
    }
    const { slug, features, considerations, faqs, exploreLinks, ...rest } = page;
    const data: Prisma.PillarPageCreateInput = {
      slug,
      ...rest,
      features: features as unknown as Prisma.InputJsonValue,
      considerations: considerations as unknown as Prisma.InputJsonValue,
      faqs: faqs as unknown as Prisma.InputJsonValue,
      exploreLinks: exploreLinks as unknown as Prisma.InputJsonValue,
      status: "PUBLISHED",
      publishedAt: new Date(),
    };
    await prisma.pillarPage.create({ data });
    console.log(`Created pillar page /${slug}.`);
  }
}

async function main() {
  await seedSuperAdmin();
  await seedVacancies();
  await seedFaqs();
  await seedSiteSettings();
  await seedConvertedPillarPages();
  await backfillContactsFromEnquiries();
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
