import { beforeEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ find: vi.fn(), save: vi.fn() }));
vi.mock("@/lib/prisma", () => ({ prisma: { vacancy: { findFirst: mocks.find }, pageSeoOverride: { upsert: mocks.save } } }));
vi.mock("@/lib/require-admin", () => ({ requireAdmin: async () => ({ id: "test-admin" }) }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: () => { throw new Error("redirect"); } }));
import { updatePageSeoOverride } from "@/app/admin/(protected)/page-seo/actions";

beforeEach(() => vi.resetAllMocks());

it.each(["old-id", "onpoint-office-g-02-midrand"])("saves vacancy SEO to its canonical path when opened through %s", async value => {
  mocks.find.mockResolvedValue({ id: "old-id", slug: "onpoint-office-g-02-midrand" });
  const form = new FormData();
  form.set("path", `/vacancies/${value}`);
  form.set("seoTitle", "Approved title");
  form.set("noIndex", "on");
  await expect(updatePageSeoOverride(form)).rejects.toThrow("redirect");
  expect(mocks.save).toHaveBeenCalledWith(expect.objectContaining({ where: { path: "/vacancies/onpoint-office-g-02-midrand" }, update: expect.objectContaining({ seoTitle: "Approved title", noIndex: true }) }));
});

it("rejects unknown or unpublished vacancy SEO targets", async () => {
  mocks.find.mockResolvedValue(null);
  const form = new FormData();
  form.set("path", "/vacancies/missing");
  await expect(updatePageSeoOverride(form)).rejects.toThrow("Choose an existing public page");
  expect(mocks.save).not.toHaveBeenCalled();
});
