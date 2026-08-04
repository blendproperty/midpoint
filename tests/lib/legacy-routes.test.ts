import { describe, expect, it } from "vitest";
import { legacyDestination } from "@/lib/legacy-routes";

describe("legacyDestination", () => {
  it("redirects former building records to current vacancies", () => {
    expect(legacyDestination("/buildings/1-kingfisher")).toBe("/vacancies");
    expect(legacyDestination("/buildings/6-weaver-avenue/")).toBe("/vacancies");
  });

  it("redirects amenity building records to the amenities pillar", () => {
    expect(legacyDestination("/buildings/amenityhub")).toBe("/amenities");
    expect(legacyDestination("/buildings/corporate-apartments")).toBe("/amenities");
  });

  it("redirects every former unit record to current vacancies", () => {
    expect(legacyDestination("/units/unit-1-1-weaver")).toBe("/vacancies");
    expect(legacyDestination("/units/stand-11")).toBe("/vacancies");
  });

  it("does not intercept unrelated routes", () => {
    expect(legacyDestination("/offices")).toBeNull();
    expect(legacyDestination("/buildings")).toBeNull();
  });
});
