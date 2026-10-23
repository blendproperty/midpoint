import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";

const base = process.argv[2] || "http://127.0.0.1:3106";
const output = process.argv[3] || "tmp/nav-verification";
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });
const results = [];
const errors = [];
const destinations = new Set();
try {
  for (const width of [1440, 1280, 1009, 768, 390, 320]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
    // Verification must not create analytics events or submit enquiries.
    await context.route("**/*", route => {
      const request = route.request();
      const url = new URL(request.url());
      return url.origin !== new URL(base).origin || request.method() !== "GET" || /\/api\/track\//.test(url.pathname)
        ? route.abort() : route.continue();
    });
    const page = await context.newPage();
    page.on("pageerror", error => errors.push(error.message));
    for (const path of ["/blog", "/insights"]) {
      const response = await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
      assert.equal(response.status(), 200);
      const nav = page.getByRole("navigation", { name: "Main navigation", exact: true });
      const menu = page.getByRole("button", { name: "Open menu", exact: true });
      const current = nav.locator(`a[aria-current="page"]:visible`);
      assert.equal(await nav.evaluate(el => getComputedStyle(el).backgroundImage), "none");
      assert.equal(await page.locator("h1").count(), 1);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      const breadcrumb = await page.getByRole("navigation", { name: "Breadcrumb", exact: true }).locator("ol").boundingBox();
      const header = await nav.boundingBox();
      assert.ok(breadcrumb.y >= header.y + header.height, "header must not cover breadcrumb");
      if (width >= 1280) {
        assert.equal(await menu.isVisible(), false);
        assert.equal(await current.count(), 1);
        assert.equal(await current.getAttribute("href"), path);
        assert.equal(await nav.locator('a[href^="mailto:"]:visible').count(), 0);
        const links = await nav.locator("a:visible").evaluateAll(els => els.map(el => {
          const box = el.getBoundingClientRect();
          return { left: box.left, right: box.right, top: box.top, bottom: box.bottom };
        }));
        for (let i = 1; i < links.length; i++) assert.ok(links[i].left >= links[i - 1].right, "header links must not overlap");
      } else {
        assert.equal(await menu.isVisible(), true);
        assert.equal(await page.locator("#mobile-nav-panel").getAttribute("inert"), "");
        await menu.focus();
        await page.keyboard.press("Tab");
        assert.ok(await page.evaluate(() => !document.activeElement.closest("#mobile-nav-panel")), "collapsed links must not receive keyboard focus");
        await menu.click();
        assert.equal(await page.locator("body").evaluate(el => el.style.overflow), "hidden");
        assert.equal(await current.getAttribute("href"), path);
        await page.keyboard.press("Escape");
        assert.equal(await menu.evaluate(el => el === document.activeElement), true);
        assert.equal(await page.locator("body").evaluate(el => el.style.overflow), "");
        await menu.click();
        const target = path === "/blog" ? "/insights" : "/blog";
        await nav.locator(`#mobile-nav-panel a[href="${target}"]`).click();
        await page.waitForURL(`${base}${target}`);
        assert.equal(await menu.getAttribute("aria-expanded"), "false");
        assert.equal(await page.locator("body").evaluate(el => el.style.overflow), "");
        await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
      }
      if (width === 1440 || width === 390) await page.screenshot({ path: `${output}/${path.slice(1)}-${width}-header.png` });
      const topics = page.locator(".topic-navigation");
      assert.equal(await topics.locator("a").count(), path === "/blog" ? 6 : 4);
      await topics.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      for (const tile of await topics.locator("a").all()) {
        const box = await tile.boundingBox();
        assert.ok(box.height >= 44 && box.x >= 0 && box.x + box.width <= width, "topic touch target must fit viewport");
        destinations.add(await tile.getAttribute("href"));
      }
      await topics.locator("a").first().focus();
      assert.equal(await topics.locator("a").first().evaluate(el => getComputedStyle(el).outlineStyle), "solid");
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      if (width === 1440 || width === 390) await page.screenshot({ path: `${output}/${path.slice(1)}-${width}-topics.png` });
      if (width === 390) {
        const first = topics.locator("a").first();
        const href = await first.getAttribute("href");
        await first.click();
        await page.waitForURL(`${base}${href}`);
        assert.equal(new URL(page.url()).pathname, new URL(href, base).pathname);
      }
      results.push({ path, width, status: response.status(), header: "solid, unobstructed", topics: "fit viewport", menu: width < 1280 ? "open, Escape, focus return, navigation and scroll unlock passed" : "active page and no overlap passed" });
      console.log(`${path} ${width}px passed`);
    }
    await context.close();
  }
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on("pageerror", error => errors.push(error.message));
  await page.setViewportSize({ width: 390, height: 500 });
  await page.route("**/*", route => route.request().method() === "GET" && new URL(route.request().url()).origin === new URL(base).origin && !route.request().url().includes("/api/track/") ? route.continue() : route.abort());
  await page.goto(`${base}/blog`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.locator('#mobile-nav-panel a[href^="tel:"]').scrollIntoViewIfNeeded();
  const phone = await page.locator('#mobile-nav-panel a[href^="tel:"]').boundingBox();
  assert.ok(phone.y >= 0 && phone.y + phone.height <= 500, "short-screen menu contact must remain reachable");
  await page.screenshot({ path: `${output}/mobile-short-menu.png` });
  await page.keyboard.press("Escape");
  const article = page.locator('main a[href^="/blog/"]').first();
  if (await article.count()) {
    await article.click();
    await page.waitForURL(/\/blog\/.+/);
    const nav = page.getByRole("navigation", { name: "Main navigation", exact: true });
    assert.equal(await nav.evaluate(el => getComputedStyle(el).backgroundImage), "none");
    await page.getByRole("button", { name: "Open menu" }).click();
    assert.equal(await nav.locator('a[aria-current="page"]:visible').getAttribute("href"), "/blog");
  }
  await page.goto(base, { waitUntil: "networkidle" });
  assert.notEqual(await page.getByRole("navigation", { name: "Main navigation", exact: true }).evaluate(el => getComputedStyle(el).backgroundImage), "none", "home hero retains its overlay header");
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  for (const href of destinations) {
    const response = await context.request.get(`${base}${href}`);
    assert.equal(response.status(), 200, href);
    if (href.includes("#")) assert.ok((await response.text()).includes(`id="${href.split("#")[1]}"`));
  }
  await context.close();
  assert.deepEqual(errors, []);
  writeFileSync(`${output}/results.json`, JSON.stringify({ base, checkedAt: new Date().toISOString(), results, destinations: [...destinations], errors }, null, 2));
  console.log(`${results.length} responsive page checks; ${destinations.size} destinations; no browser errors. Evidence: ${output}`);
} finally {
  await browser.close();
}
