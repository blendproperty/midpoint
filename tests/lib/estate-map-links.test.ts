import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";
import SiteMap from "@/components/SiteMap";

it("opens the map image without intercepting building detail links", () => {
  vi.stubGlobal("React", React);
  const html = renderToStaticMarkup(React.createElement(SiteMap, {
    availability: { 7: { count: 1, totalSqm: 100, nextAvailable: "Now", spaces: [{ id: "test", label: "Test warehouse", href: "/vacancies/test", sizeSqm: 100 }] } },
  }));
  expect(html).toMatch(/<a[^>]+href="\/images\/sitemap\/estate-map.jpg"[^>]+target="_blank"/);
  expect(html).toContain('aria-label="Open full-size estate map (opens in a new tab)"');
  expect(html).toContain('href="#map-point-7"');
  expect(html).toContain('id="map-point-7"');
  expect(html).toContain('href="/vacancies/test"');
  expect(html).toContain('id="map-filter-warehouses"');
  vi.unstubAllGlobals();
});
