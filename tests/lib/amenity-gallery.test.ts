import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";
import AmenityGallery from "@/components/AmenityGallery";

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return { ...actual, useState: (initial: unknown) => actual.useState(initial === 0 ? 1 : initial) };
});

it("keeps the priority photo eager after advancing to the second slide", () => {
  vi.stubGlobal("React", React);
  try {
    const html = renderToStaticMarkup(React.createElement(AmenityGallery, {
      name: "Test gallery", priority: true,
      photos: [{ src: "/first.jpg", alt: "First photo" }, { src: "/second.jpg", alt: "Second photo" }],
    }));
    expect(html).toContain("02 / 02");
    expect(html).toContain('fetchPriority="high"');
    expect(html).not.toMatch(/alt="First photo"[^>]*loading="lazy"/);
  } finally { vi.unstubAllGlobals(); }
});
