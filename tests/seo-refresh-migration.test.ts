import { readFileSync } from "node:fs";
import { afterAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";

const manifest = JSON.parse(readFileSync("prisma/content/seo-refresh-20261022.json", "utf8"));
const sourceSql = readFileSync("prisma/migrations/20261022120000_seo_refresh/migration.sql", "utf8").replace(/\r\n/g, "\n");

describe.skipIf(process.env.VACANCY_SYNC_INTEGRATION !== "1")("guarded SEO refresh", () => {
  const ids = ["seo-refresh-test-warehouse", "seo-refresh-test-office"];
  const path = "/seo-refresh-test-insights";
  const scopedSql = manifest.changes.reduce((sql: string, change: { key: Record<string, string> }, index: number) => {
    for (const value of Object.values(change.key)) sql = sql.replaceAll(`$refresh$${value}$refresh$`, `$refresh$${index < 2 ? ids[index] : path}$refresh$`);
    return sql;
  }, sourceSql);
  afterAll(async () => {
    await prisma.pillarPage.deleteMany({ where: { id: { in: ids } } });
    await prisma.pageSeoOverride.deleteMany({ where: { path } });
    await prisma.$disconnect();
  });
  it("refreshes reviewed CRLF content once, preserves other fields and skips later owner edits", async () => {
    if (!process.env.DATABASE_URL?.includes("localhost:55439/midpoint_booking_test")) throw new Error("Dedicated disposable database required");
    for (let index = 0; index < 2; index++) {
      const change = manifest.changes[index];
      await prisma.pillarPage.create({ data: { id: ids[index], slug: ids[index], title: "Original title", status: "PUBLISHED", ...change.before, contentHtml: change.before.contentHtml.replace(/\r?\n/g, "\r\n"), heroImage: "/keep.webp", expertName: "Existing reviewer", lastReviewedAt: new Date("2026-07-30") } });
    }
    await prisma.pageSeoOverride.create({ data: { path, ...manifest.changes[2].before } });
    await prisma.$executeRawUnsafe(scopedSql);
    for (let index = 0; index < 2; index++) {
      const row = await prisma.pillarPage.findUniqueOrThrow({ where: { id: ids[index] } });
      expect(row).toMatchObject({ ...manifest.changes[index].after, title: "Original title", heroImage: "/keep.webp", expertName: "Existing reviewer", lastReviewedAt: new Date("2026-07-30") });
    }
    expect(await prisma.pageSeoOverride.findUniqueOrThrow({ where: { path } })).toMatchObject(manifest.changes[2].after);
    const refreshed = await prisma.pillarPage.findUniqueOrThrow({ where: { id: ids[0] } });
    await prisma.$executeRawUnsafe(scopedSql);
    expect(await prisma.pillarPage.findUniqueOrThrow({ where: { id: ids[0] } })).toEqual(refreshed);
    await prisma.pillarPage.update({ where: { id: ids[0] }, data: { ...manifest.changes[0].before, contentHtml: manifest.changes[0].before.contentHtml + "<p>Owner edit</p>" } });
    await prisma.pageSeoOverride.update({ where: { path }, data: { ...manifest.changes[2].before, seoTitle: "Owner title" } });
    await prisma.$executeRawUnsafe(scopedSql);
    expect((await prisma.pillarPage.findUniqueOrThrow({ where: { id: ids[0] } })).contentHtml).toContain("<p>Owner edit</p>");
    expect((await prisma.pageSeoOverride.findUniqueOrThrow({ where: { path } })).seoTitle).toBe("Owner title");
  });
  it("repairs the exact enquiry values without overwriting surrounding owner copy", async () => {
    const original = readFileSync("prisma/migrations/20261022121000_seo_enquiry_prefill/migration.sql", "utf8");
    let sql = original;
    for (let index = 0; index < 2; index++) {
      for (const value of Object.values(manifest.changes[index].key) as string[]) sql = sql.replaceAll(`'${value}'`, `'${ids[index]}'`);
      const contentHtml = "<p>Later owner introduction</p>" + manifest.changes[index].after.contentHtml;
      await prisma.pillarPage.update({ where: { id: ids[index] }, data: { contentHtml } });
    }
    await prisma.$executeRawUnsafe(sql);
    for (let index = 0; index < 2; index++) {
      const row = await prisma.pillarPage.findUniqueOrThrow({ where: { id: ids[index] } });
      const interest = index === 0 ? "Warehouse" : "Office";
      expect(row.contentHtml).toBe("<p>Later owner introduction</p>" + manifest.changes[index].after.contentHtml.replace(`interest=${interest}#Contact`, `interest=${interest}%20space#Contact`));
      const updatedAt = row.updatedAt;
      await prisma.$executeRawUnsafe(sql);
      expect((await prisma.pillarPage.findUniqueOrThrow({ where: { id: ids[index] } })).updatedAt).toEqual(updatedAt);
    }
  });
});
