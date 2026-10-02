import { chromium, type Browser } from "playwright";
import { SignJWT } from "jose";
import { prisma } from "../lib/prisma";
import { mkdirSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";

if (!process.env.DATABASE_URL?.includes("localhost:55439/midpoint_booking_test")) throw new Error("Disposable test database required");
const base = "http://127.0.0.1:3102";
const evidence = process.env.SEO_EVIDENCE_DIR || "../seo-verification";
mkdirSync(evidence, { recursive: true });
const results: { check: string; passed: boolean }[] = [];
let testBrowser: Browser | undefined;
const check = (name: string, condition: unknown) => { assert.ok(condition, name); results.push({ check: name, passed: true }); };
async function main() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  testBrowser = browser;
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await context.route("**/*", route => ["127.0.0.1", "localhost"].includes(new URL(route.request().url()).hostname) ? route.continue() : route.abort());
  const anonymous = await context.request.get(`${base}/admin/content-ideas`, { maxRedirects: 0 });
  check("Anonymous planning access redirects to login", anonymous.status() === 307 && !!anonymous.headers().location?.includes("/admin/login"));
  const token = await new SignJWT({ email: "seo-test@example.test", role: "EDITOR" }).setProtectedHeader({ alg: "HS256" }).setSubject("seo-test-editor").setIssuedAt().setExpirationTime("1h").sign(new TextEncoder().encode(process.env.AUTH_SECRET));
  await context.addCookies([{ name: "midpoint_admin_session", value: token, url: base }]);
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));

  const beforeCounts = await Promise.all([prisma.blogPost.count(), prisma.page.count(), prisma.pillarPage.count()]);
  await page.goto(`${base}/admin/content-ideas`);
  await page.getByLabel("Content idea", { exact: true }).fill("Local test: Office viewing checklist");
  await page.getByLabel("Target search phrase").fill("office space Midrand");
  await page.getByLabel("Who is it for?").fill("Business tenants");
  await page.getByLabel("Idea and writing brief").fill("Confirm real leasing facts before publishing.");
  await page.getByLabel("Research and inspiration").fill("Review Search Console queries in the authorised account.");
  await page.getByLabel("Progress").selectOption("ready");
  await page.getByLabel("Format", { exact: true }).selectOption("article");
  await page.getByLabel("Priority", { exact: true }).selectOption("high");
  await page.getByLabel("Target publish date").fill("2026-10-20");
  await Promise.all([page.waitForResponse(response => response.request().method() === "POST" && response.url().includes("/admin/content-ideas")), page.getByRole("button", { name: "Save idea", exact: true }).click()]);
  await page.waitForURL(/\/admin\/content-ideas$/);
  const idea = await prisma.contentIdea.findFirstOrThrow({ where: { title: "Local test: Office viewing checklist" }, orderBy: { updatedAt: "desc" } });
  check("Idea create persisted all planning fields", idea.status === "ready" && idea.keyword === "office space Midrand" && idea.priority === "high" && idea.format === "article");
  await page.goto(`${base}/admin/content-ideas?edit=${idea.id}`);
  await page.getByLabel("Progress").selectOption("published");
  await page.getByLabel("Finished content link").fill("https://www.mid-point.co.za/blog/seo-test-post");
  await Promise.all([page.waitForResponse(response => response.request().method() === "POST" && response.url().includes("/admin/content-ideas")), page.getByRole("button", { name: "Save idea", exact: true }).click()]);
  await page.waitForURL(/\/admin\/content-ideas$/);
  await page.goto(`${base}/admin/content-ideas?edit=${idea.id}`);
  check("Idea progress save and reload", await page.getByLabel("Progress").inputValue() === "published");
  check("Idea progress never publishes website records", JSON.stringify(beforeCounts) === JSON.stringify(await Promise.all([prisma.blogPost.count(), prisma.page.count(), prisma.pillarPage.count()])));

  await page.goto(`${base}/admin/page-seo/edit?path=%2Ffaqs`);
  await page.getByLabel("Allow search engines to index this page").uncheck();
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await page.waitForURL(/\/admin\/page-seo$/);
  check("Per-page index choice persists through editor action", (await prisma.pageSeoOverride.findUniqueOrThrow({ where: { path: "/faqs" } })).noIndex);

  // The saved OG image must survive saving with its section closed.
  await page.goto(`${base}/admin/page-seo/edit?path=%2Fabout-us`);
  await page.getByLabel("Title tag").fill("Local SEO estate title");
  await page.getByLabel("Meta description", { exact: true }).fill("Local SEO description used only to verify the Midpoint metadata delivery path in this isolated test database.");
  await page.getByLabel("Canonical URL (optional)").fill("https://www.mid-point.co.za/about-us");
  check("Search preview reacts immediately", await page.getByText("Local SEO estate title", { exact: true }).count() > 0);
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await page.waitForURL(/\/admin\/page-seo$/);
  await prisma.pageSeoOverride.update({ where: { path: "/about-us" }, data: { ogTitle: "Local share title", ogDescription: "Local share description", ogImage: "/images/pages/faq-banner.jpg" } });
  await page.goto(`${base}/admin/page-seo/edit?path=%2Fabout-us`);
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await page.waitForURL(/\/admin\/page-seo$/);
  check("Closed social section retains saved image", (await prisma.pageSeoOverride.findUniqueOrThrow({ where: { path: "/about-us" } })).ogImage === "/images/pages/faq-banner.jpg");
  await page.goto(`${base}/about-us`);
  check("Saved search title delivered", (await page.title()).includes("Local SEO estate title"));
  check("Saved canonical delivered", await page.locator('link[rel="canonical"]').getAttribute("href") === "https://www.mid-point.co.za/about-us");
  check("Saved OG/X previews delivered", await page.locator('meta[property="og:title"]').getAttribute("content") === "Local share title" && await page.locator('meta[name="twitter:title"]').getAttribute("content") === "Local share title");
  check("Saved social image delivered", (await page.locator('meta[property="og:image"]').getAttribute("content"))?.endsWith("/images/pages/faq-banner.jpg"));
  check("About retains estate schema without unrelated FAQs", !(await page.locator('script[type="application/ld+json"]').allTextContents()).join("").includes('"@type":"FAQPage"'));

  for (const route of ["/", "/contact-us", "/insights", "/vacancies", "/blog", "/blog/seo-test-post", "/p/seo-test-page", "/seo-test-pillar", "/vacancies/seo-test-vacancy", "/the-suites-at-midpoint", "/privacy-policy"]) {
    const response = await page.goto(base + route);
    check(`${route} HTTP and self canonical`, response?.status() === 200 && (await page.locator('link[rel="canonical"]').getAttribute("href"))?.replace(/\/$/, "") === new URL(route, "https://www.mid-point.co.za").href.replace(/\/$/, ""));
    check(`${route} has specific X preview`, !!await page.locator('meta[name="twitter:title"]').getAttribute("content"));
  }
  await page.goto(`${base}/spaces`);
  check("Static alternate canonical delivered", await page.locator('link[rel="canonical"]').getAttribute("href") === "https://www.mid-point.co.za/about-us");
  await page.goto(`${base}/faqs`);
  check("Per-page noindex delivered", (await page.locator('meta[name="robots"]').getAttribute("content"))?.includes("noindex"));
  check("FAQ schema matches visible FAQ route", (await page.locator('script[type="application/ld+json"]').allTextContents()).join("").includes('"@type":"FAQPage"'));
  await page.goto(`${base}/p/seo-test-private`);
  check("Protected page remains excluded and body is gated", (await page.locator('meta[name="robots"]').getAttribute("content"))?.includes("noindex") && !(await page.content()).includes("SECRET_TEST_BODY_NEVER_DISCOVER"));
  const sitemap = await (await context.request.get(`${base}/sitemap.xml`)).text();
  check("Sitemap discovers vacancy and published content", sitemap.includes("/vacancies/seo-test-vacancy") && sitemap.includes("/blog/seo-test-post") && sitemap.includes("/seo-test-pillar"));
  check("Sitemap excludes noindex/private/draft/alternate canonical", !sitemap.includes("/faqs<") && !sitemap.includes("seo-test-private") && !sitemap.includes("seo-test-draft") && !sitemap.includes("/spaces<"));
  const llms = await (await context.request.get(`${base}/llms.txt`)).text();
  check("LLM discovery excludes private and noindex content", !llms.includes("seo-test-private") && !llms.includes("SECRET_TEST_BODY_NEVER_DISCOVER") && !llms.includes("/faqs)"));
  const robots = await (await context.request.get(`${base}/robots.txt`)).text();
  check("Robots uses canonical sitemap and excludes administration", robots.includes("https://www.mid-point.co.za/sitemap.xml") && robots.includes("Disallow: /admin"));
  const redirect = await context.request.get(`${base}/seo-old?utm_source=test`, { maxRedirects: 0 });
  check("Managed permanent redirect preserves query", redirect.status() === 301 && redirect.headers().location?.includes("/about-us?utm_source=test"));
  const staging = await context.request.get(`${base}/robots.txt`, { headers: { "x-forwarded-host": "midpoint.onpointoffices.co.za" } });
  check("Staging blanket crawler protection preserved", (await staging.text()).includes("Disallow: /") && staging.headers()["x-robots-tag"]?.includes("noindex"));

  const post = await prisma.blogPost.findUniqueOrThrow({ where: { slug: "seo-test-post" } });
  await page.goto(`${base}/admin/blog/${post.id}/edit`);
  await page.getByRole("button", { name: /Page settings/ }).click();
  await page.getByLabel("Title tag").fill("Reactive article search title");
  check("Article search preview reacts before saving", await page.getByText("Reactive article search title", { exact: true }).count() > 0);
  await page.waitForFunction(() => !!(window as unknown as { tinymce?: { activeEditor?: { initialized?: boolean } } }).tinymce?.activeEditor?.initialized);
  await page.evaluate(() => {
    const editor = (window as unknown as { tinymce: { activeEditor: { setContent: (value: string) => void } } }).tinymce.activeEditor;
    editor.setContent(`<p>${"detail ".repeat(320)}</p>`);
  });
  await page.getByText(/320 words/).waitFor();
  check("Rich-text writing checks react before saving", true);
  await page.screenshot({ path: `${evidence}/article-writing-checks-1440.png`, fullPage: true });
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.screenshot({ path: `${evidence}/article-writing-checks-390.png`, fullPage: true });
  check("Article writing panel responsive 390", await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
  // No published article save: this test must not announce synthetic URLs to IndexNow.

  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of ["/admin/content-ideas", "/admin/page-seo", "/admin/page-seo/edit?path=%2Fabout-us", "/admin/seo-audit", "/admin?workspace=website"]) {
      await page.goto(base + route);
      await page.screenshot({ path: `${evidence}/${route.split("?")[0].split("/").at(-1)}-${width}.png`, fullPage: route !== "/admin/seo-audit" });
      check(`${route} responsive ${width}`, await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
    }
  }
  await page.goto(`${base}/admin/content-ideas?edit=${idea.id}`);
  await page.getByRole("button", { name: "Delete idea", exact: true }).click();
  await page.waitForURL(/\/admin\/content-ideas$/);
  check("Authenticated idea deletion persists", !(await prisma.contentIdea.findUnique({ where: { id: idea.id } })));
  await page.goto(`${base}/admin/login`);
  check("Admin login excluded from indexing", (await page.locator('meta[name="robots"]').getAttribute("content"))?.includes("noindex"));
  check("No browser application exceptions", errors.length === 0);
  writeFileSync(`${evidence}/browser-results.json`, JSON.stringify({ results, errors }, null, 2));
  await browser.close();
  console.log(`${results.length} local compiled-browser checks passed`);
}
main().catch(error => { writeFileSync(`${evidence}/browser-results.json`, JSON.stringify({ results, failure: String(error) }, null, 2)); console.error(error); process.exitCode = 1; }).finally(async () => { await testBrowser?.close(); await prisma.$disconnect(); });
