import { describe, expect, it } from "vitest";
import { vacancyAvailability, vacancyRate, vacancySize } from "@/lib/vacancy-shared";

describe("vacancy presentation", () => {
  it("shows unknown price and area explicitly instead of zero", () => {
    expect(vacancyRate(0)).toBe("On request");
    expect(vacancyRate(NaN)).toBe("On request");
    expect(vacancySize(0)).toBe("Area on request");
    expect(vacancyRate(117.5)).toContain("117");
  });
  it("formats upstream timestamps and retains notice-period text", () => {
    expect(vacancyAvailability("2027-01-01T00:00:00.000Z")).toBe("1 January 2027");
    expect(vacancyAvailability("6 months notice")).toBe("6 months notice");
    expect(vacancyAvailability("")).toBe("On request");
  });
});
