import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

describe("Suites landing-page booking button", () => {
  it("opens staging booking search with clear wording and preserves production enquiries", () => {
    const page = readFileSync("app/the-suites-at-midpoint/page.tsx", "utf8");
    expect(page).toContain('href={staging ? "/stay" : "#request-to-book"}');
    expect(page).toContain('{staging ? "Book your stay" : "Enquire about The Suites"}');
    expect(page).not.toContain("Check dates");
  });
});
