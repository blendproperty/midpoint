import { afterEach, beforeEach, expect, it, vi } from "vitest";
const db = vi.hoisted(() => ({ vacancy: { findUnique: vi.fn(), create: vi.fn(), update: vi.fn(), findMany: vi.fn() }, siteSetting: { upsert: vi.fn() } }));
vi.mock("@/lib/prisma", () => ({ prisma: db }));
import { syncVacanciesFromListings } from "@/lib/listings-sync";
const row = (id: string) => ({ id, name: "Synthetic office", marketSector: "Office" });
const response = (data: unknown[], pagination?: object) => new Response(JSON.stringify({ data, ...(pagination ? { pagination } : {}) }), { status: 200 });
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("LISTINGS_API_KEY", "synthetic-only");
  db.vacancy.findUnique.mockResolvedValue({ id: "local-seen" });
  db.vacancy.findMany.mockResolvedValue([{ id: "local-missing", externalId: "missing", status: "PUBLISHED" }]);
  db.vacancy.update.mockResolvedValue({});
  db.siteSetting.upsert.mockResolvedValue({});
});
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.restoreAllMocks(); vi.useRealTimers(); });
it.each([
  [response([row("seen")])],
  [response([row("seen")], { page: 1, limit: 100, total: 2, totalPages: 1 })],
  [response([row("seen"), row("seen")], { page: 1, limit: 100, total: 2, totalPages: 1 })],
  [response([row("seen")], { page: 1, limit: 1, total: 2, totalPages: 2 }), response([], { page: 2, limit: 1, total: 2, totalPages: 2 })],
  [response([row("seen")], { page: 1, limit: 1, total: 2, totalPages: 2 }), response([row("other")], { page: 2, limit: 1, total: 3, totalPages: 3 })],
])("does not change inventory after an incomplete or inconsistent feed %#", async (...pages) => {
  const fetch = vi.fn(); for (const page of pages) fetch.mockResolvedValueOnce(page);
  vi.stubGlobal("fetch", fetch);
  const result = await syncVacanciesFromListings();
  expect(db.vacancy.update).not.toHaveBeenCalled();
  expect(result.error).toMatch(/incomplete|inconsistent|repeated/);
  expect(result.deprecated).toBe(0);
  expect(db.vacancy.create).not.toHaveBeenCalled();
  expect(db.vacancy.findMany).not.toHaveBeenCalled();
});
it("does not reconcile when a later page stalls and is aborted", async () => {
  vi.useFakeTimers();
  vi.spyOn(AbortSignal, "timeout").mockImplementation(ms => {
    expect(ms).toBe(8000); const controller = new AbortController();
    setTimeout(() => controller.abort(), ms); return controller.signal;
  });
  const fetch = vi.fn().mockResolvedValueOnce(response([row("seen")], { page: 1, limit: 1, total: 2, totalPages: 2 }))
    .mockImplementationOnce((_url, options) => new Promise((_resolve, reject) => options.signal.addEventListener("abort", () => reject(new Error("Synthetic timeout")))));
  vi.stubGlobal("fetch", fetch);
  const pending = syncVacanciesFromListings(); await vi.advanceTimersByTimeAsync(8001);
  expect((await pending).error).toBe("Synthetic timeout");
  expect(db.vacancy.update).not.toHaveBeenCalled();
  expect(db.vacancy.findMany).not.toHaveBeenCalled();
});
it("reconciles only after all pages succeed, retaining existing IDs", async () => {
  vi.stubGlobal("fetch", vi.fn()
    .mockResolvedValueOnce(response([row("seen")], { page: 1, limit: 1, total: 2, totalPages: 2 }))
    .mockResolvedValueOnce(response([row("other")], { page: 2, limit: 1, total: 2, totalPages: 2 })));
  const result = await syncVacanciesFromListings();
  expect(result.error).toBeUndefined(); expect(result.fetched).toBe(2); expect(result.deprecated).toBe(1);
  expect(db.vacancy.update).toHaveBeenCalledWith({ where: { id: "local-missing" }, data: { status: "DRAFT" } });
  expect(db.vacancy.update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "local-seen" } }));
  expect(db.vacancy.create).not.toHaveBeenCalled();
});
it("accepts a conclusively empty feed", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response([], { page: 1, limit: 100, total: 0, totalPages: 0 })));
  const result = await syncVacanciesFromListings();
  expect(result.error).toBeUndefined(); expect(result.deprecated).toBe(1);
});
