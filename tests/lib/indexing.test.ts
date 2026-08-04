import { describe, expect, it } from "vitest";
import { pageRobots } from "@/lib/indexing";

describe("pageRobots", () => {
  it("allows indexing by default", () => {
    expect(pageRobots()).toEqual({ index: true, follow: true });
  });

  it("blocks indexing only when manually selected", () => {
    expect(pageRobots(true)).toEqual({ index: false, follow: true });
  });

  it("keeps password-protected pages out of the index", () => {
    expect(pageRobots(false, true)).toEqual({ index: false, follow: true });
  });
});
