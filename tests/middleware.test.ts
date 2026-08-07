import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "../middleware";

describe("middleware HTML transformation protection", () => {
  it("prevents intermediary HTML rewriting on public pages", async () => {
    const response = await middleware(
      new NextRequest("https://www.mid-point.co.za/", {
        headers: { accept: "text/html,application/xhtml+xml" },
      })
    );

    expect(response.headers.get("cache-control")).toContain("no-transform");
  });

  it("does not change cache policy for API responses", async () => {
    const response = await middleware(
      new NextRequest("https://www.mid-point.co.za/api/leads", {
        headers: { accept: "application/json" },
      })
    );

    expect(response.headers.has("cache-control")).toBe(false);
  });
});
