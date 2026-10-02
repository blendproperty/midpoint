// Synthetic records in the disposable SEO test database only.
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
if (!process.env.DATABASE_URL?.includes("localhost:55439/midpoint_booking_test")) throw new Error("Disposable test database required");
async function main() {
  await prisma.siteSetting.upsert({ where: { id: "global" }, update: { allowIndexing: true, domain: "https://www.mid-point.co.za", defaultSocialImage: "/images/pages/amenities-banner.jpg" }, create: { id: "global", domain: "https://www.mid-point.co.za", defaultSocialImage: "/images/pages/amenities-banner.jpg" } });
  await prisma.user.upsert({ where: { email: "seo-test@example.test" }, update: {}, create: { id: "seo-test-editor", email: "seo-test@example.test", passwordHash: await bcrypt.hash(randomUUID(), 12), role: "EDITOR" } });
  await prisma.blogPost.upsert({ where: { slug: "seo-test-post" }, update: {}, create: { title: "Office viewing checklist", slug: "seo-test-post", contentHtml: '<h2>Before you view</h2><p>Confirm the available space with the leasing team.</p><a href="/vacancies">View vacancies</a>', excerpt: "Practical questions for an office viewing.", status: "PUBLISHED", publishedAt: new Date(), ogImage: "/images/pages/faq-banner.jpg" } });
  await prisma.blogPost.upsert({ where: { slug: "seo-test-draft" }, update: {}, create: { title: "Unpublished test", slug: "seo-test-draft", contentHtml: "Not public", status: "DRAFT" } });
  await prisma.page.upsert({ where: { slug: "seo-test-private" }, update: {}, create: { title: "Private test content", slug: "seo-test-private", contentHtml: "SECRET_TEST_BODY_NEVER_DISCOVER", status: "PUBLISHED", passwordProtected: true, accessPasswordHash: await bcrypt.hash(randomUUID(), 12) } });
  await prisma.page.upsert({ where: { slug: "seo-test-page" }, update: {}, create: { title: "Test page", slug: "seo-test-page", contentHtml: '<p>Public test page</p>', status: "PUBLISHED" } });
  await prisma.pillarPage.upsert({ where: { slug: "seo-test-pillar" }, update: {}, create: { title: "Local leasing guide", slug: "seo-test-pillar", contentHtml: '<h2>Questions for the leasing team</h2><p>Synthetic local guide for SEO delivery verification.</p>', status: "PUBLISHED", noIndex: false } });
  await prisma.vacancy.upsert({ where: { id: "seo-test-vacancy" }, update: {}, create: { id: "seo-test-vacancy", building: "SEO test building", sector: "OFFICE", sizeSqm: 100, ratePerSqm: 100, availability: "Enquire", description: "Synthetic office listing for local SEO verification only.", features: ["Test feature"], status: "PUBLISHED" } });
  await prisma.pageSeoOverride.upsert({ where: { path: "/spaces" }, update: {}, create: { path: "/spaces", canonicalUrl: "https://www.mid-point.co.za/about-us" } });
  await prisma.pageSeoOverride.upsert({ where: { path: "/faqs" }, update: {}, create: { path: "/faqs", noIndex: true } });
  await prisma.redirect.upsert({ where: { fromPath: "/seo-old" }, update: {}, create: { fromPath: "/seo-old", toPath: "/about-us", statusCode: 301 } });
  console.log("Synthetic SEO fixtures ready; no production data touched");
}
main().finally(() => prisma.$disconnect());
