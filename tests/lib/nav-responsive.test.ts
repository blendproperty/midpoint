import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("shared navigation responsive handover", () => {
  it("keeps the crowded desktop header above xl and prevents contact wrapping", () => {
    const source = fs.readFileSync(path.join(process.cwd(), "components", "Nav.tsx"), "utf8");
    expect(source.match(/xl:flex/g)?.length).toBe(2);
    expect(source.match(/xl:hidden/g)?.length).toBe(2);
    expect(source.match(/whitespace-nowrap/g)?.length).toBe(2);
    expect(source).not.toContain("md:flex");
    expect(source).not.toContain("md:hidden");
  });
});
