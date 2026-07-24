import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "scraped-data");
const BASE_URL = "https://www.mid-point.co.za";

const PAGES = [
  { p: "/", slug: "home" },
  { p: "/about-us", slug: "about-us" },
  { p: "/amenities", slug: "amenities" },
  { p: "/faqs", slug: "faqs" },
  { p: "/vacancies", slug: "vacancies" },
  { p: "/availability-report", slug: "availability-report" },
  { p: "/contact-us", slug: "contact-us" },
  { p: "/offices", slug: "offices" },
  { p: "/warehouses", slug: "warehouses" },
  { p: "/insights", slug: "insights" },
  { p: "/spaces", slug: "spaces" },
];

// Runs inside the browser context via page.evaluate.
function extractPageData() {
  function isVisible(el) {
    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function ownText(el) {
    let text = "";
    for (const node of el.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) text += node.textContent;
    }
    return text.replace(/\s+/g, " ").trim();
  }

  function absUrl(u) {
    if (!u) return u;
    try {
      return new URL(u, window.location.href).href;
    } catch {
      return u;
    }
  }

  function classNameOf(el) {
    return el.className && el.className.toString ? el.className.toString() : "";
  }

  const title = document.title;
  const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute("content") || null;
  const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href") || null;

  const ogTags = {};
  document.querySelectorAll('meta[property^="og:"]').forEach((m) => {
    ogTags[m.getAttribute("property")] = m.getAttribute("content");
  });

  const twitterTags = {};
  document.querySelectorAll('meta[name^="twitter:"]').forEach((m) => {
    twitterTags[m.getAttribute("name")] = m.getAttribute("content");
  });

  const jsonLd = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map((s) => {
    const raw = s.textContent;
    try {
      return { raw, parsed: JSON.parse(raw) };
    } catch {
      return { raw, parsed: null };
    }
  });

  let sectionEls = Array.from(document.querySelectorAll("section"));
  if (sectionEls.length === 0) {
    const main = document.querySelector("main") || document.body;
    sectionEls = Array.from(main.children).filter((el) => !["SCRIPT", "STYLE", "NOSCRIPT"].includes(el.tagName));
  }

  function describeChildren(el, depth) {
    if (depth <= 0) return [];
    return Array.from(el.children)
      .filter(isVisible)
      .map((child) => {
        const ccs = window.getComputedStyle(child);
        return {
          tag: child.tagName.toLowerCase(),
          className: classNameOf(child),
          display: ccs.display,
          flexDirection: ccs.flexDirection,
          gridTemplateColumns: ccs.gridTemplateColumns,
          alignItems: ccs.alignItems,
          justifyContent: ccs.justifyContent,
          childCount: child.children.length,
          children: describeChildren(child, depth - 1),
        };
      });
  }

  const sections = sectionEls.map((section, index) => {
    const cs = window.getComputedStyle(section);
    const rect = section.getBoundingClientRect();

    const textBlocks = [];
    const walker = document.createTreeWalker(section, NodeFilter.SHOW_ELEMENT);
    let node = walker.currentNode;
    while (node) {
      if (node !== section && isVisible(node)) {
        const txt = ownText(node);
        if (txt) textBlocks.push({ tag: node.tagName.toLowerCase(), text: txt });
      }
      node = walker.nextNode();
    }

    const images = Array.from(section.querySelectorAll("img"))
      .filter(isVisible)
      .map((img) => ({
        src: absUrl(img.currentSrc || img.src),
        alt: img.getAttribute("alt") || "",
        type: "img",
      }));

    Array.from(section.querySelectorAll("*")).forEach((el) => {
      const bg = window.getComputedStyle(el).backgroundImage;
      if (bg && bg !== "none" && bg.includes("url(")) {
        const match = bg.match(/url\(["']?(.*?)["']?\)/);
        if (match) images.push({ src: absUrl(match[1]), alt: "", type: "background-image" });
      }
    });

    const links = Array.from(section.querySelectorAll("a[href]"))
      .filter(isVisible)
      .map((a) => ({
        href: absUrl(a.getAttribute("href")),
        label: ownText(a) || a.getAttribute("aria-label") || "",
      }));

    const headings = Array.from(section.querySelectorAll("h1,h2,h3,h4,h5,h6"))
      .filter(isVisible)
      .map((h) => {
        const hcs = window.getComputedStyle(h);
        return {
          tag: h.tagName.toLowerCase(),
          text: (h.innerText || "").trim(),
          fontSize: hcs.fontSize,
          fontWeight: hcs.fontWeight,
          color: hcs.color,
          fontFamily: hcs.fontFamily,
          lineHeight: hcs.lineHeight,
        };
      });

    const paragraphs = Array.from(section.querySelectorAll("p"))
      .filter(isVisible)
      .map((p) => {
        const pcs = window.getComputedStyle(p);
        return {
          text: (p.innerText || "").trim(),
          fontSize: pcs.fontSize,
          fontWeight: pcs.fontWeight,
          color: pcs.color,
          lineHeight: pcs.lineHeight,
        };
      })
      .filter((p) => p.text);

    const buttonEls = Array.from(section.querySelectorAll("a, button")).filter((el) => {
      const cls = classNameOf(el).toLowerCase();
      return cls.includes("button") || cls.includes("btn") || el.tagName === "BUTTON";
    });
    const buttons = buttonEls.filter(isVisible).map((el) => {
      const bcs = window.getComputedStyle(el);
      return {
        tag: el.tagName.toLowerCase(),
        text: ownText(el) || (el.innerText || "").trim(),
        href: el.tagName === "A" ? absUrl(el.getAttribute("href")) : null,
        backgroundColor: bcs.backgroundColor,
        color: bcs.color,
        borderRadius: bcs.borderRadius,
        fontSize: bcs.fontSize,
        fontWeight: bcs.fontWeight,
        padding: bcs.padding,
      };
    });

    return {
      index,
      tag: section.tagName.toLowerCase(),
      className: classNameOf(section),
      id: section.id || null,
      computedStyle: {
        backgroundColor: cs.backgroundColor,
        display: cs.display,
        flexDirection: cs.flexDirection,
        gridTemplateColumns: cs.gridTemplateColumns,
        alignItems: cs.alignItems,
        justifyContent: cs.justifyContent,
        gap: cs.gap,
        padding: cs.padding,
        margin: cs.margin,
        borderRadius: cs.borderRadius,
      },
      rect: { width: Math.round(rect.width), height: Math.round(rect.height) },
      textBlocks,
      headings,
      paragraphs,
      images,
      links,
      buttons,
      domStructure: describeChildren(section, 2),
    };
  });

  const bodyCs = window.getComputedStyle(document.body);
  const htmlCs = window.getComputedStyle(document.documentElement);

  return {
    title,
    metaDescription,
    canonical,
    ogTags,
    twitterTags,
    jsonLd,
    page: {
      backgroundColorBody: bodyCs.backgroundColor,
      backgroundColorHtml: htmlCs.backgroundColor,
      fontFamilyBody: bodyCs.fontFamily,
    },
    sections,
  };
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let total = 0;
      const step = 400;
      const timer = setInterval(() => {
        window.scrollBy(0, step);
        total += step;
        if (total >= document.body.scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 100);
    });
  });
  await page.waitForTimeout(500);
}

function rgbToHex(rgb) {
  if (!rgb) return rgb;
  const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!m) return rgb;
  const [, r, g, b, a] = m;
  if (a !== undefined && parseFloat(a) === 0) return null; // fully transparent, skip
  const hex =
    "#" +
    [r, g, b]
      .map((x) => parseInt(x, 10).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();
  if (a !== undefined && parseFloat(a) < 1) return `${hex} / alpha ${a}`;
  return hex;
}

function collectSiteStats(allPages) {
  const colors = new Set();
  const fontSizes = new Set();
  const fontWeights = new Set();
  const borderRadii = new Set();

  const addColor = (c) => {
    const hex = rgbToHex(c);
    if (hex) colors.add(hex);
  };

  for (const pageData of allPages) {
    addColor(pageData.page.backgroundColorBody);
    addColor(pageData.page.backgroundColorHtml);
    for (const section of pageData.sections) {
      addColor(section.computedStyle.backgroundColor);
      if (section.computedStyle.borderRadius && section.computedStyle.borderRadius !== "0px") {
        borderRadii.add(section.computedStyle.borderRadius);
      }
      for (const h of section.headings) {
        addColor(h.color);
        fontSizes.add(h.fontSize);
        fontWeights.add(h.fontWeight);
      }
      for (const p of section.paragraphs) {
        addColor(p.color);
        fontSizes.add(p.fontSize);
        fontWeights.add(p.fontWeight);
      }
      for (const b of section.buttons) {
        addColor(b.backgroundColor);
        addColor(b.color);
        fontSizes.add(b.fontSize);
        fontWeights.add(b.fontWeight);
        if (b.borderRadius && b.borderRadius !== "0px") borderRadii.add(b.borderRadius);
      }
    }
  }

  return {
    colors: Array.from(colors).sort(),
    fontSizes: Array.from(fontSizes).sort((a, b) => parseFloat(a) - parseFloat(b)),
    fontWeights: Array.from(fontWeights).sort((a, b) => parseFloat(a) - parseFloat(b)),
    borderRadii: Array.from(borderRadii).sort(),
  };
}

const KNOWN_TOKENS = {
  "midpoint.dark": "#082121",
  "midpoint.cyan": "#39EAE6",
  "midpoint.grey-100": "#DADEDE",
  "midpoint.grey-400": "#526364",
};

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  const results = [];

  for (const { p, slug } of PAGES) {
    const url = BASE_URL + p;
    console.log(`Scraping ${url} ...`);
    const page = await context.newPage();
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
      await autoScroll(page);
      const data = await page.evaluate(extractPageData);
      const record = { url, slug, scrapedAt: new Date().toISOString(), ...data };
      results.push(record);
      fs.writeFileSync(path.join(OUT_DIR, `${slug}.json`), JSON.stringify(record, null, 2));
      console.log(`  -> saved ${slug}.json (${record.sections.length} sections)`);
    } catch (err) {
      console.error(`  !! failed to scrape ${url}: ${err.message}`);
      results.push({ url, slug, error: err.message });
    } finally {
      await page.close();
    }
  }

  await browser.close();

  const okResults = results.filter((r) => !r.error);
  const stats = collectSiteStats(okResults);

  let summary = `# Scrape Summary — mid-point.co.za\n\n`;
  summary += `Generated: ${new Date().toISOString()}\n\n`;
  summary += `Pages scraped: ${okResults.length}/${PAGES.length}\n`;
  const failed = results.filter((r) => r.error);
  if (failed.length) {
    summary += `\n## Failed pages\n\n`;
    for (const f of failed) summary += `- ${f.url}: ${f.error}\n`;
  }

  summary += `\n## Known tailwind.config.ts tokens\n\n`;
  for (const [name, hex] of Object.entries(KNOWN_TOKENS)) {
    const found = stats.colors.includes(hex.toUpperCase());
    summary += `- \`${name}\` = ${hex} — ${found ? "FOUND in scraped colors" : "NOT found verbatim in scraped colors (check summary list / alpha variants below)"}\n`;
  }

  summary += `\n## All unique colors found (hex, or hex + alpha)\n\n`;
  for (const c of stats.colors) summary += `- ${c}\n`;

  summary += `\n## All unique font-sizes found\n\n`;
  for (const f of stats.fontSizes) summary += `- ${f}\n`;

  summary += `\n## All unique font-weights found\n\n`;
  for (const w of stats.fontWeights) summary += `- ${w}\n`;

  summary += `\n## All unique border-radius values found\n\n`;
  for (const r of stats.borderRadii) summary += `- ${r}\n`;

  fs.writeFileSync(path.join(OUT_DIR, "summary.md"), summary);
  console.log("\nDone. Summary written to scripts/scraped-data/summary.md");
}

main();
