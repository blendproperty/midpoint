import { afterAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { getAllVacancies, getVacancyBySlugOrId } from "@/lib/vacancies";
import { readFileSync } from "node:fs";

const prefix = "vacancy-slug-test-20261102-";
const data = { building: "OnPoint SEO fixture", unitName: "Office G.02", sector: "SERVICED_OFFICE" as const, sizeSqm: 172.66, ratePerSqm: 117.5, availability: "Immediately", description: "Fixture only", features: [] };

describe.skipIf(process.env.VACANCY_SYNC_INTEGRATION !== "1")("persistent vacancy URLs in disposable PostgreSQL", () => {
  afterAll(async () => {
    await prisma.vacancy.deleteMany({ where: { id: { startsWith: prefix } } });
    await prisma.$disconnect();
  });

  it("generates distinct readable URLs and preserves them across updates", async () => {
    if (!process.env.DATABASE_URL?.includes("localhost:55439/midpoint_booking_test")) throw new Error("Dedicated disposable database required");
    await prisma.vacancy.deleteMany({ where: { id: { startsWith: prefix } } });
    const first = await prisma.vacancy.create({ data: { ...data, id: prefix + "first" } });
    const second = await prisma.vacancy.create({ data: { ...data, id: prefix + "second" } });
    expect(first.slug).toBe("onpoint-seo-fixture-office-g-02-midrand");
    expect(second.slug).toBe(`onpoint-seo-fixture-office-g-02-midrand-${second.id}`);
    const updated = await prisma.vacancy.update({ where: { id: first.id }, data: { building: "Renamed", unitName: "New name", ratePerSqm: 120 } });
    expect(updated.slug).toBe(first.slug);
    expect((await getVacancyBySlugOrId(first.id))?.id).toBe(first.id);
    expect((await getVacancyBySlugOrId(first.slug))?.id).toBe(first.id);
    expect((await getAllVacancies()).find(v => v.id === first.id)?.slug).toBe(first.slug);
    await prisma.vacancy.update({ where: { id: first.id }, data: { status: "DRAFT" } });
    expect(await getVacancyBySlugOrId(first.id)).toBeNull();
    expect(await getVacancyBySlugOrId(first.slug)).toBeNull();
    expect(await getVacancyBySlugOrId("missing-vacancy")).toBeNull();
  });

  it("serializes concurrent duplicate names and normalizes accents", async () => {
    const rows = await Promise.all(["a", "b"].map(suffix => prisma.vacancy.create({ data: { ...data, id: prefix + suffix, building: "Café & Offices", unitName: "Suite 1" } })));
    expect(new Set(rows.map(row => row.slug)).size).toBe(2);
    expect(rows.some(row => row.slug === "cafe-offices-suite-1-midrand")).toBe(true);
    const address = await prisma.vacancy.create({ data: { ...data, id: prefix + "address", building: "Midpoint Warehousing", unitName: "66 Weaver Fixture Avenue" } });
    expect(address.slug).toBe("66-weaver-fixture-avenue-midrand");
    const repeated = await prisma.vacancy.create({ data: { ...data, id: prefix + "repeated", building: "22 Weaver Fixture Avenue", unitName: "Unit 2, 22 Weaver Fixture Avenue" } });
    expect(repeated.slug).toBe("unit-2-22-weaver-fixture-avenue-midrand");
  });

  it("backfills old rows and migrates self-canonicals without losing owner metadata", async () => {
    if (!process.env.DATABASE_URL?.includes("localhost:55439/midpoint_booking_test")) throw new Error("Dedicated disposable database required");
    const rollback = new Error("rollback migration fixture");
    await expect(prisma.$transaction(async tx => {
      await tx.$executeRawUnsafe("CREATE SCHEMA vacancy_slug_migration_test");
      await tx.$executeRawUnsafe("SET LOCAL search_path TO vacancy_slug_migration_test");
      await tx.$executeRawUnsafe('CREATE TABLE "Vacancy" (id TEXT PRIMARY KEY, building TEXT, "unitName" TEXT, "createdAt" TIMESTAMP)');
      await tx.$executeRawUnsafe('CREATE TABLE "PageSeoOverride" (path TEXT UNIQUE, "canonicalUrl" TEXT, "seoTitle" TEXT, "noIndex" BOOLEAN)');
      await tx.$executeRawUnsafe(`INSERT INTO "Vacancy" VALUES ('original','OnPoint','Office G.02','2026-01-01'), ('duplicate','OnPoint','Office G.02','2026-02-01'), ('external','Warehouse',NULL,'2026-03-01')`);
      await tx.$executeRawUnsafe(`INSERT INTO "PageSeoOverride" VALUES ('/vacancies/original','https://www.mid-point.co.za/vacancies/original','Owner title',true), ('/vacancies/external','https://example.com/approved','External canonical',false)`);
      const sql = readFileSync("prisma/migrations/20261102080000_vacancy_public_slugs/migration.sql", "utf8");
      await tx.$executeRawUnsafe(`DO $fixture$ BEGIN EXECUTE $migration$${sql}$migration$; END $fixture$`);
      const rows = await tx.$queryRawUnsafe<{ id: string; slug: string }[]>('SELECT id, slug FROM "Vacancy" ORDER BY "createdAt"');
      expect(rows.map(row => row.slug)).toEqual(["onpoint-office-g-02-midrand", "onpoint-office-g-02-midrand-duplicate", "warehouse-midrand"]);
      const overrides = await tx.$queryRawUnsafe<Record<string, unknown>[]>('SELECT * FROM "PageSeoOverride" ORDER BY "seoTitle"');
      expect(overrides).toEqual([
        { path: "/vacancies/warehouse-midrand", canonicalUrl: "https://example.com/approved", seoTitle: "External canonical", noIndex: false },
        { path: "/vacancies/onpoint-office-g-02-midrand", canonicalUrl: "https://www.mid-point.co.za/vacancies/onpoint-office-g-02-midrand", seoTitle: "Owner title", noIndex: true },
      ]);
      throw rollback;
    })).rejects.toBe(rollback);
  });
});
