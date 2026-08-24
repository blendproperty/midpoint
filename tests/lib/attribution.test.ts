import { describe, expect, it } from "vitest";
import { deriveAttribution } from "@/lib/attribution";

describe("deriveAttribution", () => {
  it("preserves Google Ads campaign and click attribution", () => {
    expect(deriveAttribution("https://www.mid-point.co.za/?utm_source=google&utm_medium=cpc&utm_campaign=midrand-offices&gclid=abc123")).toMatchObject({
      source: "google", medium: "cpc", campaign: "midrand-offices", gclid: "abc123", landingPage: "/?utm_source=google&utm_medium=cpc&utm_campaign=midrand-offices&gclid=abc123",
    });
  });
  it("classifies organic Google referrals", () => {
    expect(deriveAttribution("https://www.mid-point.co.za/vacancies", "https://www.google.co.za/search?q=offices")).toMatchObject({ source: "google", medium: "organic" });
  });
  it("classifies an untagged visit as direct", () => {
    expect(deriveAttribution("https://www.mid-point.co.za/contact-us")).toMatchObject({ source: "direct", medium: "none" });
  });
  it("does not throw on an unparseable referrer", () => {
    expect(() => deriveAttribution("https://www.mid-point.co.za/vacancies", "android-app://not a url")).not.toThrow();
  });
});
