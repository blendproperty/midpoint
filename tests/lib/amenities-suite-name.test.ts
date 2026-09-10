import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("The Suites at Midpoint amenity name", () => {
  it("uses the requested feature-card heading in the seed and production migration", () => {
    const root = process.cwd();
    const seed = fs.readFileSync(path.join(root, "prisma/seed.ts"), "utf8");
    const migration = fs.readFileSync(
      path.join(root, "prisma/migrations/20260910120000_rename_midpoint_suites_amenity/migration.sql"),
      "utf8",
    );

    expect(seed).toContain('{ heading: "The Suites at Midpoint"');
    expect(migration).toContain("to_jsonb('The Suites at Midpoint'::text)");
    expect(migration).toContain('WHERE "slug" = \'amenities\'');
  });
});
