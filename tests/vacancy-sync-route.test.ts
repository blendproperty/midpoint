import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ sync: vi.fn(), revalidate: vi.fn(), findUnique: vi.fn(), count: vi.fn() }));
vi.mock("@/lib/listings-sync", () => ({ syncVacanciesFromListings: mocks.sync }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidate }));
vi.mock("@/lib/prisma", () => ({ prisma: { siteSetting: { findUnique: mocks.findUnique }, vacancy: { count: mocks.count } } }));
import { GET, POST } from "@/app/api/cron/sync-vacancies/route";
const request = (secret = "test-only") => new Request("http://localhost/api/cron/sync-vacancies", { headers: { "x-cron-secret": secret } });
beforeEach(() => { vi.resetAllMocks(); vi.stubEnv("VACANCY_SYNC_SECRET", "test-only"); vi.stubEnv("LISTINGS_API_KEY", "test-key"); });
describe("authenticated sync endpoint", () => {
  it("rejects unauthenticated reads and writes before any data access", async () => {
    expect((await GET(request("wrong"))).status).toBe(401);
    expect((await POST(request("wrong"))).status).toBe(401);
    expect(mocks.sync).not.toHaveBeenCalled();
    expect(mocks.findUnique).not.toHaveBeenCalled();
  });
  it("reports missing secret configuration explicitly", async () => {
    vi.stubEnv("VACANCY_SYNC_SECRET", "");
    expect((await POST(request())).status).toBe(503);
  });
  it("invalidates listing and detail routes after committed changes", async () => {
    mocks.sync.mockResolvedValue({ created: 1, updated: 0, deprecated: 0 });
    expect((await POST(request())).status).toBe(200);
    expect(mocks.revalidate).toHaveBeenCalledWith("/vacancies/[id]", "page");
  });
  it("fails verification on stale or failed syncs without writing anything", async () => {
    mocks.count.mockResolvedValue(13);
    mocks.findUnique.mockResolvedValue({ lastVacancySync: { ranAt: "2026-01-01T00:00:00Z", fetched: 13 } });
    expect((await GET(request())).status).toBe(503);
    mocks.findUnique.mockResolvedValue({ lastVacancySync: { ranAt: new Date().toISOString(), error: "upstream failure" } });
    expect((await GET(request())).status).toBe(503);
    mocks.findUnique.mockResolvedValue({ lastVacancySync: { ranAt: new Date().toISOString(), fetched: 13 } });
    expect((await GET(request())).status).toBe(200);
    expect(mocks.sync).not.toHaveBeenCalled();
  });
});
