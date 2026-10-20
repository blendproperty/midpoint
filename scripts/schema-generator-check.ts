import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { richPageJsonLd, blogPostingJsonLd, breadcrumbJsonLd } from "../lib/seo";
import { vacancyJsonLd, vacancyListJsonLd } from "../lib/vacancy-schema";
import { safeJsonLd } from "../lib/json-ld";

const { validateHtml } = createRequire(import.meta.url)("../tools/schema-validator/check.cjs");
const website = { "@type": "WebSite", "@id": "https://www.mid-point.co.za/#website", name: "Midpoint" };
const listing = { id: "schema-test", building: "Schema fixture", sector: "Warehouse", sizeSqm: 100, ratePerSqm: 100, availability: "Available", description: "Test fixture only", image: "" };
const nodes = [
  ...["WebPage", "ContactPage", "AboutPage", "CollectionPage"].map(type => richPageJsonLd({ type, name: "Fixture", description: "Fixture description", path: "/fixture" })),
  blogPostingJsonLd({ title: "Fixture", description: "Fixture", path: "/blog/fixture", dateModified: "2026-10-20T00:00:00Z" }),
  breadcrumbJsonLd([{ name: "Home", path: "/" }]),
  vacancyJsonLd(listing), vacancyListJsonLd([listing], "/vacancies", "Fixtures"),
];
for (const node of nodes) {
  const graph = { "@context": "https://schema.org", "@graph": [website, node] };
  const result = validateHtml(`<script type="application/ld+json">${safeJsonLd(graph)}</script>`);
  assert.deepEqual(result.errors, [], JSON.stringify(result.errors));
  assert.deepEqual(result.warnings, [], JSON.stringify(result.warnings));
}
console.log(`Schema generator checks: ${nodes.length} cases passed`);
