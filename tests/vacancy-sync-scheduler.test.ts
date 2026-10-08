import { describe, expect, it, vi } from "vitest";
// @ts-expect-error Runtime scheduler is intentionally plain Node ESM.
import { dueTasks, requestSync } from "../scripts/vacancy-sync-scheduler.mjs";

describe("vacancy scheduler", () => {
  it("runs nightly at 00:30 SAST and verifies Monday at 01:00 SAST", () => {
    expect(dueTasks(new Date("2026-10-08T22:29:00Z"), "", "").sync).toBe(false);
    expect(dueTasks(new Date("2026-10-08T22:30:00Z"), "", "").sync).toBe(true);
    expect(dueTasks(new Date("2026-10-08T22:31:00Z"), "2026-10-08", "").sync).toBe(false);
    expect(dueTasks(new Date("2026-10-11T23:00:00Z"), "2026-10-11", "").verify).toBe(true);
    expect(dueTasks(new Date("2026-10-11T23:00:00Z"), "2026-10-11", "2026-10-11").verify).toBe(false);
  });
  it("uses internal networking and server-only authentication", async () => {
    const fetcher = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ healthy: true }) });
    await requestSync("GET", { VACANCY_SYNC_SECRET: "test-only" }, fetcher);
    expect(fetcher).toHaveBeenCalledWith("http://web:3000/api/cron/sync-vacancies", expect.objectContaining({ method: "GET", headers: { "x-cron-secret": "test-only" } }));
  });
  it("treats HTTP and unhealthy verification as failures", async () => {
    const fetcher = vi.fn().mockResolvedValue({ ok: false, status: 503, json: async () => ({ error: "private-provider-detail" }) });
    await expect(requestSync("POST", { VACANCY_SYNC_SECRET: "test-only" }, fetcher)).rejects.toThrow("HTTP 503");
    await expect(requestSync("GET", {}, fetcher)).rejects.toThrow("not configured");
  });
});
