import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { canonicalStaySlug } from "@/lib/stay-brand";
import { prisma } from "@/lib/prisma";

describe("The Suites at Midpoint branding", () => {
  it("preserves old room links using accommodation-only slugs", () => {
    expect(canonicalStaySlug("onpoint-studio")).toBe("studio");
    expect(canonicalStaySlug("onpoint-executive-suite")).toBe("executive-suite");
    expect(canonicalStaySlug("studio")).toBe("studio");
    expect(canonicalStaySlug("unknown")).toBe("unknown");
  });
  it("uses the accommodation brand in search metadata", () => {
    const page = readFileSync("app/stay/page.tsx", "utf8");
    expect(page).toContain("The Suites at Midpoint | Corporate Accommodation Midrand");
    expect(page).not.toContain("Stay at OnPoint");
  });
  it.skipIf(process.env.BOOKING_INTEGRATION !== "1")("migrates room labels without changing reservation keys", async () => {
    expect(await prisma.roomCategory.findUnique({ where: { id: "onpoint-studio" }, select: { name: true, slug: true } }))
      .toEqual({ name: "Studio", slug: "studio" });
    expect(await prisma.roomCategory.findUnique({ where: { id: "onpoint-executive" }, select: { name: true, slug: true } }))
      .toEqual({ name: "Executive Suite", slug: "executive-suite" });
  });
});
