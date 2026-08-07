import { describe, expect, it } from "vitest";
import { listings } from "@/lib/listings";

describe("homepage destination links", () => {
  it("sends Corporate Accommodation to the amenities page", () => {
    const accommodation = listings.find(
      (listing) => listing.name === "Corporate Accommodation"
    );

    expect(accommodation?.href).toBe("/amenities");
  });
});
