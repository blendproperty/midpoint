import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";

describe.skipIf(process.env.VACANCY_SYNC_INTEGRATION !== "1")("canonical vacancy links in saved editorial content", () => {
  it("updates only local detail hrefs, preserving owner copy, suffixes and brochure/external links", async () => {
    if (!process.env.DATABASE_URL?.includes("localhost:55439/midpoint_booking_test")) throw new Error("Dedicated disposable database required");
    const rollback = new Error("rollback editorial fixture");
    await expect(prisma.$transaction(async tx => {
      await tx.$executeRawUnsafe("CREATE SCHEMA vacancy_editorial_links_test");
      await tx.$executeRawUnsafe("SET LOCAL search_path TO vacancy_editorial_links_test");
      await tx.$executeRawUnsafe('CREATE TABLE "Vacancy" (id TEXT, slug TEXT)');
      await tx.$executeRawUnsafe(`INSERT INTO "Vacancy" VALUES ('old-id', 'onpoint-office-g-02-midrand')`);
      const content = `<p>Owner copy, unchanged.</p><a href="/vacancies/old-id">Space</a><a href='/vacancies/old-id?utm_source=guide#details'>Tracked</a><a href="https://www.mid-point.co.za/vacancies/old-id#details">Absolute</a><a href="/vacancies/old-id/brochure">Brochure</a><a href="https://example.com/vacancies/old-id">External</a><a href="/vacancies/old-id-other">Other</a>`;
      for (const table of ["PillarPage", "Page", "BlogPost"]) {
        await tx.$executeRawUnsafe(`CREATE TABLE "${table}" ("contentHtml" TEXT, "updatedAt" TEXT)`);
        await tx.$executeRawUnsafe(`INSERT INTO "${table}" VALUES ($1, 'keep-date')`, content);
      }
      const sql = readFileSync("prisma/migrations/20261102090000_vacancy_editorial_links/migration.sql", "utf8");
      await tx.$executeRawUnsafe(sql);
      await tx.$executeRawUnsafe(sql);
      for (const table of ["PillarPage", "Page", "BlogPost"]) {
        const rows = await tx.$queryRawUnsafe<{ contentHtml: string; updatedAt: string }[]>(`SELECT * FROM "${table}"`);
        expect(rows).toEqual([{ contentHtml: content.replace('href="/vacancies/old-id"', 'href="/vacancies/onpoint-office-g-02-midrand"').replace("href='/vacancies/old-id?", "href='/vacancies/onpoint-office-g-02-midrand?").replace('href="https://www.mid-point.co.za/vacancies/old-id#', 'href="https://www.mid-point.co.za/vacancies/onpoint-office-g-02-midrand#'), updatedAt: "keep-date" }]);
      }
      throw rollback;
    })).rejects.toBe(rollback);
  });
});
