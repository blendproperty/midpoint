// One-time / idempotent seed: creates the first SUPER_ADMIN user (if none
// exists) and migrates the previously-static vacancy + FAQ content, and the
// previously hand-coded Offices/Warehouses/Amenities/Location marketing
// pages, into the database so the site has real content from the moment
// the CMS goes live. Safe to re-run — everything here is an upsert or a
// "skip/create-only-if-missing", so it never clobbers a later admin edit.
import { PrismaClient } from "@prisma/client";
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

// Migrates the four hand-coded marketing pages (Offices, Warehouses,
// Amenities, Location) into full Pillar Pages, preserving their real copy,
// images and FAQs so the comprehensive pillar template renders exactly the
// same richness those pages had as hardcoded routes — just admin-editable
// now. Upsert-with-empty-update: creates once, never overwrites a later
// admin edit on re-run.
async function seedConvertedPillarPages() {
  const pages = [
    {
      slug: "offices",
      title: "Offices to Rent in Midrand",
      primaryEntity: "Office space",
      relatedSector: "OFFICE" as const,
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
      relatedSector: "WAREHOUSE" as const,
      heroImage: "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/6a156e00cfaf0adb9c0eb204_warehouse-p-800.jpg",
      heroAnswer: "High eave heights, efficient loading access, and generous yard capacity. High-performance warehouse infrastructure in Midrand.",
      trustStrip: "High eave heights\nDock levellers & roller shutters\nN1 highway exposure",
      showReadyToMove: true,
      features: [] as unknown[],
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
      faqs: [] as unknown[],
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
      title: "A Workplace With Room to Breathe",
      primaryEntity: "Amenities",
      relatedSector: null,
      heroImage: "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/6a148a5463dac69c69cbc3a8_amenities_banner-p-1600.jpg",
      heroAnswer: "On-site restaurants, fitness facilities, and outdoor spaces across the estate bring energy, balance, and connection to the working day.",
      trustStrip: "Gym\nPadel courts\nRestaurant & bar\nWalking, running & cycling trails",
      showReadyToMove: true,
      features: [
        { heading: "Corporate Accommodation", text: "Midpoint’s corporate accommodation offers a convenient and comfortable stay for professionals working within the estate. Designed for visiting executives, travelling consultants, project teams, and short-term client stays, these fully serviced apartments provide a practical alternative to traditional hotels, with easy access to offices, warehouses, meeting spaces, restaurants, fitness facilities, and outdoor amenities.", image: "https://cdn.prod.website-files.com/67d1edae36bfc44dfe4ad0c8/6a281449e4b8af04cb78624d_Type-A-View.jpg" },
        { heading: "Gym", text: "The on-site gym allows tenants to integrate fitness into their daily routine without leaving the estate. Whether before work, during a lunch break, or after the workday ends, the facility provides a convenient way to maintain an active lifestyle.", image: "https://cdn.prod.website-files.com/67d1edae36bfc44dfe4ad0c8/69fa257244e96ba96660da56_gym.jpg" },
        { heading: "Padel Court", text: "Padel courts bring a social and energetic dimension to the Midpoint estate, offering a fast-paced way for colleagues to connect outside the office — friendly competition, team bonding, or informal networking between tenants.", image: "https://cdn.prod.website-files.com/67d1edae36bfc44dfe4ad0c8/69fa26eb7543756ba1f72268_pedal-courts.jpg" },
        { heading: "Restaurant & Bar", text: "The Fond Restaurant and Bar provides a welcoming place for tenants and visitors to meet, host clients, or unwind at the end of the day, working equally well for working lunches, team celebrations, or informal client meetings.", image: "https://cdn.prod.website-files.com/67d1edae36bfc44dfe4ad0c8/6a05baf20d50722841f3bd98_restaurant.jpg" },
        { heading: "Walking, Running & Cycling Trails", text: "Winding through landscaped green areas, the trails provide space for walking, running, or cycling — a refreshing alternative to remaining indoors between meetings, and part of many tenants' daily routine.", image: "https://cdn.prod.website-files.com/67d1edae36bfc44dfe4ad0c8/6a147d9896d773202294260f_running-man.jpg" },
        { heading: "Coffee", text: "Coffee spaces at Midpoint provide natural points of connection throughout the working day — a simple but valuable convenience that lets tenants step out briefly, recharge, and return to work refreshed.", image: "https://cdn.prod.website-files.com/67d1edae36bfc44dfe4ad0c8/6a148381b93e4613bbbd7c61_Coffee.jpg" },
      ],
      considerations: [] as unknown[],
      listingsHeading: null,
      listingsIntro: null,
      contentHtml:
        "<p>Businesses based at Midpoint benefit from an environment where work and everyday lifestyle intersect naturally. The estate combines office space, serviced offices, and warehouse facilities in Midrand with shared amenities that support the people working within them.</p><p>These spaces contribute to a workplace culture that extends beyond desks, meeting rooms, and warehouse floors. Teams can meet informally, step away for a break, or recharge between meetings without leaving the estate.</p>",
      faqs: [] as unknown[],
      ctaHeading: "Talk to the leasing team",
      ctaText: "Contact the Midpoint leasing team to discuss availability, pricing, or to arrange a viewing.",
      exploreLinks: [
        { label: "Offices to rent", href: "/offices" },
        { label: "Warehouses to rent", href: "/warehouses" },
        { label: "About Midpoint & Blend Property Group", href: "/about-us" },
      ],
      seoTitle: "Amenities at Midpoint | Gym, Padel, Restaurant & Trails in Midrand",
      seoDescription: "Discover Midpoint District amenities: fitness facilities, padel courts, restaurants, walking trails, and corporate accommodation for a balanced workday.",
      focusKeyword: "Midpoint amenities",
    },
    {
      slug: "location",
      title: "Location",
      primaryEntity: "Location",
      relatedSector: null,
      heroImage: "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/6a148a5463dac69c69cbc3a8_amenities_banner-p-1600.jpg",
      heroAnswer: "On the N1 between Johannesburg and Pretoria — verified distances, access and route detail.",
      trustStrip: "25 km to Johannesburg\n31 km to Pretoria\n21 km to OR Tambo",
      showReadyToMove: false,
      features: [] as unknown[],
      considerations: [
        { heading: "On the N1, between Johannesburg and Pretoria", text: "Midpoint has 1,470 metres of frontage directly onto the N1 highway, roughly 25 km from Johannesburg and 31 km from Pretoria — positioned squarely between Gauteng's two largest business centres." },
        { heading: "Halfway House, Midrand", text: "The estate is based at 162 Tonetti Street, Halfway House, Midrand, 1685 — one of Gauteng's most established commercial and industrial nodes, with direct N1 access for staff commuting from either side of the corridor." },
        { heading: "Close to OR Tambo International Airport", text: "Midpoint is approximately 21 km from OR Tambo International Airport, keeping the estate well connected for teams and clients travelling in and out of Johannesburg." },
      ],
      listingsHeading: null,
      listingsIntro: null,
      contentHtml: "",
      faqs: [] as unknown[],
      ctaHeading: "Get in touch about Midpoint's location",
      ctaText: "Contact the Midpoint leasing team to discuss access, commute times, or to arrange a site visit.",
      exploreLinks: [
        { label: "Offices to rent", href: "/offices" },
        { label: "Warehouses to rent", href: "/warehouses" },
        { label: "Amenities & lifestyle", href: "/amenities" },
        { label: "View Midpoint on Google Maps", href: "https://www.google.com/maps?q=162+Tonetti+St,+Halfway+House,+Midrand,+1685" },
      ],
      seoTitle: "Midpoint Location | N1 Business Park Between Johannesburg & Pretoria",
      seoDescription: "Midpoint sits on the N1 between Johannesburg and Pretoria in Halfway House, Midrand — verified distances, access and route detail.",
      focusKeyword: "Midpoint Midrand location",
    },
  ];

  for (const page of pages) {
    const existing = await prisma.pillarPage.findUnique({ where: { slug: page.slug } });
    if (existing) {
      console.log(`Pillar page /${page.slug} already exists, leaving admin edits in place.`);
      continue;
    }
    const { slug, ...data } = page;
    await prisma.pillarPage.create({
      data: {
        slug,
        ...data,
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });
    console.log(`Created pillar page /${slug}.`);
  }
}

async function main() {
  await seedSuperAdmin();
  await seedVacancies();
  await seedFaqs();
  await seedSiteSettings();
  await seedConvertedPillarPages();
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
