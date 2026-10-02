import { describe, expect, it } from "vitest";
import { legacyDestination } from "@/lib/legacy-routes";
import { redirectDestination } from "@/lib/seo-redirects";

describe("legacyDestination", () => {
  it("routes the old availability report through the query-preserving handler", () => {
    const destination = legacyDestination("/availability-report/");
    expect(destination).toBe("/vacancies");
    expect(redirectDestination(destination!, "https://www.mid-point.co.za/availability-report?utm_source=campaign&tag=a&tag=b").href)
      .toBe("https://www.mid-point.co.za/vacancies?utm_source=campaign&tag=a&tag=b");
  });
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
