// One-time / idempotent seed: creates the first SUPER_ADMIN user (if none
// exists) and migrates the previously-static vacancy + FAQ content into the
// database so the site has real content from the moment the CMS goes live.
// Safe to re-run — everything here is an upsert or a "skip if already exists".
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

async function main() {
  await seedSuperAdmin();
  await seedVacancies();
  await seedFaqs();
  await seedSiteSettings();
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
