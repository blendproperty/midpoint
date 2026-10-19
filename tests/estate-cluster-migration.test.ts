import { readFileSync } from "node:fs";
import { afterAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";

describe.skipIf(process.env.VACANCY_SYNC_INTEGRATION !== "1")("estate article batch publication", () => {
  const planned = JSON.parse(readFileSync("prisma/content/estate-cluster-20261019.json", "utf8")) as { id: string; slug: string; title: string; pillarSlug: string }[];
  const ids = planned.map(p => p.id + "-test");
  const parents = ["estate-cluster-test-parent", "location-cluster-test-parent", "amenities-cluster-test-parent"];
  const slug = (value: string) => value + "-cluster-test";
  let sql = readFileSync("prisma/migrations/20261019110000_estate_content_cluster/migration.sql", "utf8");
  planned.forEach((p, i) => {
    sql = sql.replaceAll(`$f${i}_0$${p.id}$f${i}_0$`, `$f${i}_0$${ids[i]}$f${i}_0$`);
    sql = sql.replaceAll(`$f${i}_1$${p.slug}$f${i}_1$`, `$f${i}_1$${slug(p.slug)}$f${i}_1$`);
    sql = sql.replaceAll(`$f${i}_8$${p.pillarSlug}$f${i}_8$`, `$f${i}_8$${slug(p.pillarSlug)}$f${i}_8$`);
  });
  sql = sql.replaceAll("$estate$business-park-midrand$estate$", `$estate$${slug("business-park-midrand")}$estate$`)
    .replaceAll("$location$location$location$", `$location$${slug("location")}$location$`)
    .replaceAll("$amenities$amenities$amenities$", `$amenities$${slug("amenities")}$amenities$`);
  afterAll(async () => {
    await prisma.blogPost.deleteMany({ where: { id: { in: ids } } });
    await prisma.pillarPage.deleteMany({ where: { id: { in: parents } } });
    await prisma.$disconnect();
  });

  it("requires public parent pillars and refuses to partially overwrite a conflicting batch", async () => {
    if (!process.env.DATABASE_URL?.includes("localhost:55439/midpoint_booking_test")) throw Error("Disposable database required");
    for (const [index, name] of ["business-park-midrand", "location", "amenities"].entries()) await prisma.pillarPage.create({ data: { id: parents[index], slug: slug(name), title: name, contentHtml: "Test parent", status: "PUBLISHED", noIndex: index === 2 } });
    expect(await prisma.$executeRawUnsafe(sql)).toBe(0);
    await prisma.pillarPage.update({ where: { id: parents[2] }, data: { noIndex: false } });
    await prisma.blogPost.create({ data: { id: ids[0], slug: slug(planned[0].slug), title: "Existing owner content", contentHtml: "Preserve me", status: "DRAFT" } });
    expect(await prisma.$executeRawUnsafe(sql)).toBe(0);
    expect(await prisma.blogPost.count({ where: { id: { in: ids } } })).toBe(1);
    expect((await prisma.blogPost.findUniqueOrThrow({ where: { id: ids[0] } })).title).toBe("Existing owner content");
    await prisma.blogPost.delete({ where: { id: ids[0] } });
    expect(await prisma.$executeRawUnsafe(sql)).toBe(4);
    const published = await prisma.blogPost.findMany({ where: { id: { in: ids } }, include: { pillarPage: true } });
    expect(published).toHaveLength(4);
    for (const post of published) {
      const item = planned[ids.indexOf(post.id)];
      expect(post.status).toBe("PUBLISHED");
      expect(post.publishedAt).toBeInstanceOf(Date);
      expect(post.pillarPage?.slug).toBe(slug(item.pillarSlug));
    }
    expect(await prisma.$executeRawUnsafe(sql)).toBe(0);
    await prisma.blogPost.update({ where: { id: ids[0] }, data: { title: "Later owner revision" } });
    expect(await prisma.$executeRawUnsafe(sql)).toBe(0);
    expect((await prisma.blogPost.findUniqueOrThrow({ where: { id: ids[0] } })).title).toBe("Later owner revision");
  });
});
