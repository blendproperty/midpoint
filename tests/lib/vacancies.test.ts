import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { vacancySector, vacancySummary } from "@/lib/vacancies";

describe("vacancySummary", () => {
  it("decodes listing entities and removes markup", () => {
    expect(vacancySummary("264.46 m&sup2; <strong>serviced office</strong> &amp; meeting rooms."))
      .toBe("264.46 m² serviced office & meeting rooms.");
  });

  it("keeps a concise two-sentence opening", () => {
    const source = "First useful sentence. Second useful sentence. " + "Long additional detail. ".repeat(30);
    expect(vacancySummary(source)).toBe("First useful sentence. Second useful sentence.");
  });

  it("caps a single long sentence without cutting the final word", () => {
    const result = vacancySummary("A practical office with " + "excellent workspace ".repeat(30), 90);
    expect(result.length).toBeLessThanOrEqual(90);
    expect(result.endsWith("…")).toBe(true);
  });
});

describe("vacancy client boundary", () => {
  it("keeps server-only vacancy database code out of client components", () => {
    for (const file of ["components/VacancyCard.tsx", "components/VacancySchedule.tsx"]) {
      const source = readFileSync(resolve(process.cwd(), file), "utf8");
      expect(source).not.toContain('from "@/lib/vacancies"');
      expect(source).toContain("@/lib/vacancy-shared");
    }
  });
});

describe("vacancySector", () => {
  it("corrects warehousing portfolio rows mislabelled as offices upstream", () => {
    expect(vacancySector("OFFICE", "Midpoint Warehousing")).toBe("Warehouse");
  });

  it("preserves normal office and serviced-office classifications", () => {
    expect(vacancySector("OFFICE", "1 Weaver Avenue")).toBe("Office");
    expect(vacancySector("SERVICED_OFFICE", "OnPoint")).toBe("Serviced office");
  });
});
