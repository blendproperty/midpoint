import { describe, expect, it } from "vitest";
import { publishedRentalRange } from "@/lib/business-schema";

describe("published rental range", () => {
  it("follows the supplied current asking rates with explicit units and no total-rental inference", () => {
    expect(publishedRentalRange([{ ratePerSqm: 117.5 }, { ratePerSqm: 90 }, { ratePerSqm: 120 }])).toBe("R90–R120 per m² per month");
    expect(publishedRentalRange([{ ratePerSqm: 117.5 }])).toBe("R117,5 per m² per month");
  });
  it("ignores invalid rates and omits a range when none are published", () => {
    expect(publishedRentalRange([0, -10, NaN, Infinity].map(ratePerSqm => ({ ratePerSqm })))).toBeUndefined();
    expect(publishedRentalRange([])).toBeUndefined();
    expect(publishedRentalRange([{ ratePerSqm: 0 }, { ratePerSqm: 109 }])).toBe("R109 per m² per month");
  });
});
