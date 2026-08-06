import { describe, expect, it } from "vitest";
import { vacancySummary } from "@/lib/vacancies";

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
