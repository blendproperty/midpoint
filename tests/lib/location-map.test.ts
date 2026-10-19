import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";
import LocationMap from "@/components/LocationMap";

it("keeps the Google embed out of the initial document and retains an accessible location link", () => {
  vi.stubGlobal("React", React);
  try {
    const html = renderToStaticMarkup(React.createElement(LocationMap));
    expect(html).not.toContain("<iframe");
    expect(html).not.toContain("google.com/maps/embed");
    expect(html).toContain("View Midpoint on Google Maps");
    expect(html).toContain("maps/search/?api=1");
    expect(html).toContain("h-72");
  } finally {
    vi.unstubAllGlobals();
  }
});
