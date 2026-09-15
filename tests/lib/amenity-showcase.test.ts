import { describe, expect, it } from "vitest";
import { supportingAmenityFeatures } from "@/lib/amenity-showcase";

describe("amenities page composition", () => {
  it("removes superseded lifestyle cards while preserving other CMS content", () => {
    const trail = { heading: "1.8 km of landscaped trails", text: "Keep route details" };
    const power = { heading: "Generator-backed power and backup water", text: "Keep capacity caveats" };
    const future = { heading: "New tenant facility", text: "Keep future CMS additions" };
    expect(supportingAmenityFeatures([
      { heading: "Fond restaurant, bar and cafés", text: "Old card" },
      { heading: "Gym and padel facilities", text: "Old card" },
      trail, { heading: "The Suites at Midpoint", text: "Old card" }, power, future,
    ])).toEqual([trail, power, future]);
  });
});
