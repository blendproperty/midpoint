import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";
import ContentAuthor from "@/components/ContentAuthor";
import { blogPostingJsonLd, organizationJsonLd } from "@/lib/seo";
import { pillarPageJsonLd } from "@/lib/pillar-schema";

it("publishes the same organisation name, profile and bio visibly and in article/guide schema", () => {
  vi.stubGlobal("React", React);
  try {
    const author = organizationJsonLd();
    const html = renderToStaticMarkup(React.createElement(ContentAuthor));
    expect(html).toContain(`href="${author.url}" rel="author"`);
    expect(html).toContain(author.name);
    expect(html).toContain(author.description);
    const article = blogPostingJsonLd({ title: "Guide", description: "Guide", path: "/blog/guide", dateModified: "2026-10-22T00:00:00Z" });
    expect(article.author).toEqual(author);
    const guide = pillarPageJsonLd({ slug: "offices", title: "Offices", seoDescription: null, heroImage: null, updatedAt: new Date("2026-10-22"), lastReviewedAt: null, expertName: null, expertRole: null, expertBio: null, expertImage: null }, [], "https://www.mid-point.co.za", true);
    expect(guide["@graph"][0]).toHaveProperty("author", author);
    expect(author["@type"]).toBe("Organization");
  } finally {
    vi.unstubAllGlobals();
  }
});
