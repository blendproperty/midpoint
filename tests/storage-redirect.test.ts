import { afterEach, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

afterEach(() => vi.unstubAllGlobals());

it("prefers the configured storage destination and retains legacy fallbacks", async () => {
  vi.resetModules();
  vi.stubGlobal("fetch", vi.fn(async (url: string) => new Response(JSON.stringify(
    String(url).includes("/api/redirects/all")
      ? [{ fromPath: "/units/stor24-self-storage-midpoint-midrand", toPath: "/vacancies/storage", statusCode: 301 }]
      : []
  ), { headers: { "content-type": "application/json" } })));
  const { middleware } = await import("../middleware");
  const specific = await middleware(new NextRequest("https://www.mid-point.co.za/units/stor24-self-storage-midpoint-midrand"));
  expect(specific.status).toBe(301);
  expect(specific.headers.get("location")).toBe("https://www.mid-point.co.za/vacancies/storage");
  const fallback = await middleware(new NextRequest("https://www.mid-point.co.za/units/unknown-old-unit"));
  expect(fallback.status).toBe(308);
  expect(fallback.headers.get("location")).toBe("https://www.mid-point.co.za/vacancies");
});
