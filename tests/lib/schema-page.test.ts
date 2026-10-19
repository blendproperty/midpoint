import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";
import { richPageJsonLd, webPageJsonLd } from "@/lib/seo";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

it("gives rich pages the shared page identity and emits a single page with its breadcrumb", () => {
  const node = richPageJsonLd({ type: "WebPage", name: "CMS page", description: "Visible description", path: "/p/test" });
  expect(node["@id"]).toBe(webPageJsonLd({ name: node.name, description: node.description, path: "/p/test" })["@id"]);
  expect(node.isPartOf).toEqual({ "@id": "https://www.mid-point.co.za/#website" });
  vi.stubGlobal("React", React);
  try {
    const html = renderToStaticMarkup(React.createElement(BreadcrumbJsonLd, { items: [{ name: "Home", path: "/" }, { name: "CMS page", path: "/p/test" }], node }));
    const graph = JSON.parse(html.match(/<script[^>]*>([\s\S]*?)<\/script>/)![1])["@graph"];
    expect(graph.map((n: Record<string, unknown>) => n["@type"])).toEqual(["BreadcrumbList", "WebPage"]);
    expect(graph[1]["@id"]).toBe(node["@id"]);
    expect(graph[1].about.address.streetAddress).toBe("162 Tonetti Street, Halfway House");
  } finally { vi.unstubAllGlobals(); }
});
