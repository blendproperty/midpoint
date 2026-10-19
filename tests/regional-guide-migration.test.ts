import { readFileSync } from "node:fs";
import { afterAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";

describe.skipIf(process.env.VACANCY_SYNC_INTEGRATION !== "1")("regional CMS refresh across line endings", () => {
  const id = "regional-guide-migration-test-20261019";
  const slug = id;
  afterAll(async () => {
    await prisma.blogPost.deleteMany({ where: { id } });
    await prisma.$disconnect();
  });
  it("updates CRLF content from LF deployment SQL once and preserves later owner changes", async () => {
    if (!process.env.DATABASE_URL?.includes("localhost:55439/midpoint_booking_test")) throw new Error("Dedicated disposable database required");
    const original = readFileSync("prisma/migrations/20261019090000_verified_regional_guide/migration.sql", "utf8").replace(/\r\n/g, "\n");
    const followup = original;
    const value = (tag: string) => {
      const delimiter = "$" + tag + "$";
      const start = original.indexOf(delimiter);
      if (start < 0) throw new Error("Missing migration fixture " + tag);
      return original.slice(start + delimiter.length, original.indexOf(delimiter, start + delimiter.length));
    };
    const scoped = (sql: string) => sql.replaceAll("$id$" + value("id") + "$id$", "$id$" + id + "$id$").replaceAll("$slug$" + value("slug") + "$slug$", "$slug$" + slug + "$slug$");
    const data = { id, slug, title: value("old0"), contentHtml: value("old1").replace(/\n/g, "\r\n"), excerpt: value("old2"), seoTitle: value("old3"), seoDescription: value("old4"), status: "PUBLISHED" as const, publishedAt: new Date("2026-09-03T10:35:42.899Z"), coverImage: "/unchanged.webp" };
    await prisma.blogPost.create({ data });
    expect(await prisma.$executeRawUnsafe(scoped(followup))).toBe(1);
    const changed = await prisma.blogPost.findUniqueOrThrow({ where: { id } });
    expect(changed.title).toBe(value("next0"));
    expect(changed.contentHtml).toBe(value("next1"));
    expect(changed.publishedAt).toEqual(data.publishedAt);
    expect(changed.coverImage).toBe(data.coverImage);
    expect(changed.slug).toBe(slug);
    expect(await prisma.$executeRawUnsafe(scoped(followup))).toBe(0);
    expect(await prisma.blogPost.findUniqueOrThrow({ where: { id } })).toEqual(changed);
    await prisma.blogPost.update({ where: { id }, data: { ...data, contentHtml: data.contentHtml + "<p>Later owner edit</p>" } });
    expect(await prisma.$executeRawUnsafe(scoped(followup))).toBe(0);
    expect((await prisma.blogPost.findUniqueOrThrow({ where: { id } })).title).toBe(data.title);
  });
});
