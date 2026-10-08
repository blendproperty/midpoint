import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "@/lib/prisma";
import { syncVacanciesFromListings } from "@/lib/listings-sync";

const prefix = "vacancy-sync-test-20261008-";
const record = { id: prefix + "source", name: "Test office", marketSector: "COMMERCIAL", status: "LIVE", gla: 250, ratePerM2: 105 };
const feed = (data: unknown[]) => ({ ok: true, json: async () => ({ data, pagination: { page: 1, limit: 100, total: data.length, totalPages: Math.ceil(data.length / 100) } }) }) as Response;

describe.skipIf(process.env.VACANCY_SYNC_INTEGRATION !== "1")("vacancy reconciliation against disposable PostgreSQL", () => {
  beforeEach(async () => {
    if (!process.env.DATABASE_URL?.includes("localhost:55439/midpoint_booking_test")) throw new Error("Dedicated disposable database required");
    await prisma.vacancy.deleteMany({ where: { building: { startsWith: prefix } } });
    await prisma.vacancy.deleteMany({ where: { externalId: { startsWith: prefix } } });
    vi.stubEnv("LISTINGS_API_KEY", "test-only");
  });
  afterAll(async () => {
    vi.unstubAllGlobals();
    await prisma.vacancy.deleteMany({ where: { OR: [{ externalId: { startsWith: prefix } }, { building: { startsWith: prefix } }] } });
    await prisma.$disconnect();
  });
  it("rolls back earlier writes on a later mapping failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(feed([record, { ...record, id: prefix + "broken", name: { invalid: true } }])));
    const result = await syncVacanciesFromListings();
    expect(result.error).toBeTruthy();
    expect(result.created).toBe(0);
    expect(await prisma.vacancy.count({ where: { externalId: record.id } })).toBe(0);
  });
  it("serializes concurrent reconciliations and preserves manual vacancies", async () => {
    await prisma.vacancy.create({ data: { building: prefix + "manual", sector: "OFFICE", sizeSqm: 20, ratePerSqm: 100, availability: "Immediately", description: "Manual test", features: [], status: "PUBLISHED" } });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(feed([record])));
    const results = await Promise.all([syncVacanciesFromListings(), syncVacanciesFromListings()]);
    expect(results.every(result => !result.error)).toBe(true);
    expect(await prisma.vacancy.count({ where: { externalId: record.id } })).toBe(1);
    expect(await prisma.vacancy.count({ where: { building: prefix + "manual", status: "PUBLISHED" } })).toBe(1);
    expect(results.map(result => result.created).sort()).toEqual([0, 1]);
  });
});
