import { describe, expect, it } from "vitest";
import { vacancyEnquiryHref, formatVacancyRate } from "@/lib/vacancy-shared";

describe("vacancy enquiry context", () => {
  it.each([["Warehouse", "Warehouse space"], ["Office", "Office space"], ["Serviced office", "Serviced offices"]] as const)("preselects %s without losing the named unit", (sector, interest) => {
    const url = new URL(vacancyEnquiryHref({ building: "Local & test", unitName: "Suite 4", sector }), "https://www.mid-point.co.za");
    expect(url.searchParams.get("space")).toBe("Local & test — Suite 4");
    expect(url.searchParams.get("interest")).toBe(interest);
    expect(url.hash).toBe("#Contact");
  });
  it("formats actual monetary values consistently without adding commercial terms", () => {
    expect(formatVacancyRate(105)).toBe(`R ${(105).toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    expect(formatVacancyRate(105.5)).toContain((105.5).toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  });
});
