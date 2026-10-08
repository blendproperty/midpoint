import { beforeEach, describe, expect, it, vi } from "vitest";

const db = vi.hoisted(() => ({
  vacancy: { count: vi.fn(), findUnique: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn() },
  siteSetting: { upsert: vi.fn() }, $executeRaw: vi.fn(), $transaction: vi.fn(),
}));
vi.mock("@/lib/prisma", () => ({ prisma: db }));
import { syncVacanciesFromListings } from "@/lib/listings-sync";

const record = { id: "source-one", name: "Suite 1", building: { name: "OnPoint" }, marketSector: "COMMERCIAL", status: "LIVE", gla: 172.66, ratePerM2: 117.5, availability: "6 months notice", features: ["Parking"], images: [{ url: "https://listings.blendproperty.co.za/property.jpg" }] };
const response = (data: unknown[], total = data.length, page = 1) => ({ ok: true, json: async () => ({ data, pagination: { total, page, limit: 100, totalPages: Math.ceil(total / 100) } }) });

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv("LISTINGS_API_KEY", "test-only");
  vi.stubGlobal("fetch", vi.fn());
  db.$transaction.mockImplementation(async fn => fn(db));
  db.vacancy.count.mockResolvedValue(1);
  db.vacancy.findUnique.mockResolvedValue(null);
  db.vacancy.findMany.mockResolvedValue([{ id: "stale", externalId: "removed", status: "PUBLISHED" }]);
});

describe("full vacancy reconciliation", () => {
  it("authenticates, preserves availability labels, maps suites and hides removed external rows", async () => {
    vi.mocked(fetch).mockResolvedValue(response([record]) as Response);
    const result = await syncVacanciesFromListings();
    expect(result).toMatchObject({ created: 1, deprecated: 1, fetched: 1 });
    expect(result.error).toBeUndefined();
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/midpoint/listings"), expect.objectContaining({ headers: { Authorization: "Bearer test-only" }, cache: "no-store", signal: expect.any(AbortSignal) }));
    expect(db.vacancy.create).toHaveBeenCalledWith({ data: expect.objectContaining({ building: "OnPoint", unitName: "Suite 1", sector: "SERVICED_OFFICE", availability: "6 months notice", ratePerSqm: 117.5 }) });
    expect(db.vacancy.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { externalId: { not: null } } }));
    expect(db.$executeRaw).toHaveBeenCalled();
  });

  it.each([
    ["missing pagination", { data: [record] }],
    ["duplicate ID", { data: [record, record], pagination: { page: 1, limit: 100, total: 2, totalPages: 1 } }],
    ["incomplete feed", { data: [record], pagination: { page: 1, limit: 100, total: 2, totalPages: 1 } }],
    ["invalid amount", { data: [{ ...record, ratePerM2: -1 }], pagination: { page: 1, limit: 100, total: 1, totalPages: 1 } }],
  ])("preserves saved vacancies after %s", async (_label, body) => {
    vi.mocked(fetch).mockResolvedValue({ ok: true, json: async () => body } as Response);
    expect((await syncVacanciesFromListings()).error).toBeTruthy();
    expect(db.vacancy.create).not.toHaveBeenCalled();
    expect(db.vacancy.update).not.toHaveBeenCalled();
  });

  it("refuses an empty feed that would remove every published synced vacancy", async () => {
    vi.mocked(fetch).mockResolvedValue(response([]) as Response);
    expect((await syncVacanciesFromListings()).error).toContain("Empty feed");
    expect(db.vacancy.update).not.toHaveBeenCalled();
  });

  it("finishes all pages before writing and rejects a later page failure", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(response([record], 101) as Response).mockResolvedValueOnce({ ok: false, status: 503 } as Response);
    expect((await syncVacanciesFromListings()).error).toContain("503");
    expect(db.vacancy.create).not.toHaveBeenCalled();
    expect(db.vacancy.update).not.toHaveBeenCalled();
  });

  it("reports zero committed changes when a database write fails", async () => {
    vi.mocked(fetch).mockResolvedValue(response([record]) as Response);
    db.vacancy.update.mockRejectedValueOnce(new Error("test write failure"));
    expect(await syncVacanciesFromListings()).toMatchObject({ created: 0, updated: 0, deprecated: 0, error: "test write failure" });
  });

  it("records missing API configuration without touching vacancies", async () => {
    vi.stubEnv("LISTINGS_API_KEY", "");
    expect((await syncVacanciesFromListings()).error).toContain("not configured");
    expect(fetch).not.toHaveBeenCalled();
    expect(db.$transaction).not.toHaveBeenCalled();
  });
});
