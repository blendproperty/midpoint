import { describe, expect, it } from "vitest";
import { legacyDestination } from "@/lib/legacy-routes";
import { redirectDestination } from "@/lib/seo-redirects";
import nextConfig from "../../next.config";

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

  it("redirects other former unit records to current vacancies", () => {
    expect(legacyDestination("/units/unit-1-1-weaver")).toBe("/vacancies");
    expect(legacyDestination("/units/stand-11")).toBe("/vacancies");
  });

  it("keeps the retired Sunbird URL away from its missing listing in both redirect layers", async () => {
    const destination = legacyDestination("/units/8-sunbird/");
    expect(destination).toBe("/offices");
    const redirects = await nextConfig.redirects();
    expect(redirects.find((route: { source: string }) => route.source === "/units/8-sunbird"))
      .toMatchObject({ destination, permanent: true });
    expect(redirectDestination(destination!, "https://www.mid-point.co.za/units/8-sunbird?utm_source=audit&tag=a&tag=b").href)
      .toBe("https://www.mid-point.co.za/offices?utm_source=audit&tag=a&tag=b");
  });

  it("does not intercept unrelated routes", () => {
    expect(legacyDestination("/offices")).toBeNull();
    expect(legacyDestination("/buildings")).toBeNull();
  });
});
