import { beforeEach, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ findUnique: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("react", () => ({ cache: (fn: unknown) => fn }));
vi.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn }));
vi.mock("@/lib/prisma", () => ({ prisma: { siteSetting: { findUnique: mocks.findUnique } } }));
import { getSiteSettings } from "@/lib/site-settings";

beforeEach(() => mocks.findUnique.mockReset());

it.each(["0000000000", "+00 000 00000", "", null])("replaces placeholder %s with the canonical destination", async (whatsapp) => {
  mocks.findUnique.mockResolvedValue({ whatsapp });
  expect((await getSiteSettings()).whatsapp).toBe("27600185206");
});

it("preserves a configured real destination", async () => {
  mocks.findUnique.mockResolvedValue({ whatsapp: "+27 60 018 5206" });
  expect((await getSiteSettings()).whatsapp).toBe("+27 60 018 5206");
});
