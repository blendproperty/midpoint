import { readFileSync } from "node:fs";
import { afterAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";

const change = JSON.parse(readFileSync("prisma/content/storage-routing-20261023.json", "utf8"));
const id = "storage-routing-test-20261023";
const sql = readFileSync("prisma/migrations/20261023080000_storage_option_routing/migration.sql", "utf8")
  .replace(/\r\n/g, "\n")
  .replaceAll(`$routing$${change.id}$routing$`, `$routing$${id}$routing$`)
  .replaceAll(`$routing$${change.slug}$routing$`, `$routing$${id}$routing$`);

describe.skipIf(process.env.VACANCY_SYNC_INTEGRATION !== "1")("storage option routing migration", () => {
  afterAll(async () => {
    await prisma.blogPost.deleteMany({ where: { id } });
    await prisma.$disconnect();
  });
  it("updates reviewed CRLF content once, preserves publication fields and skips owner edits or drafts", async () => {
    if (!process.env.DATABASE_URL?.includes("localhost:55439/midpoint_booking_test")) throw new Error("Dedicated disposable database required");
    const kept = { title: "Preserved title", seoTitle: "Preserved SEO title", seoDescription: "Preserved description", coverImage: "/keep.webp", publishedAt: new Date("2026-09-03T10:35:42.899Z") };
    await prisma.blogPost.create({ data: { id, slug: id, status: "PUBLISHED", contentHtml: change.before.contentHtml.replace(/\r?\n/g, "\r\n"), ...kept } });
    expect(await prisma.$executeRawUnsafe(sql)).toBe(1);
    const updated = await prisma.blogPost.findUniqueOrThrow({ where: { id } });
    expect(updated).toMatchObject({ ...kept, contentHtml: change.after.contentHtml });
    expect(await prisma.$executeRawUnsafe(sql)).toBe(0);
    expect(await prisma.blogPost.findUniqueOrThrow({ where: { id } })).toEqual(updated);
    const edited = change.before.contentHtml + "<p>Later owner edit</p>";
    await prisma.blogPost.update({ where: { id }, data: { contentHtml: edited } });
    expect(await prisma.$executeRawUnsafe(sql)).toBe(0);
    expect((await prisma.blogPost.findUniqueOrThrow({ where: { id } })).contentHtml).toBe(edited);
    await prisma.blogPost.update({ where: { id }, data: { contentHtml: change.before.contentHtml, status: "DRAFT" } });
    expect(await prisma.$executeRawUnsafe(sql)).toBe(0);
  });
});
