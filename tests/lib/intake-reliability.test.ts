import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const database = vi.hoisted(() => ({ enquiry: { create: vi.fn() } }));
vi.mock("@/lib/prisma", () => ({ prisma: database }));
vi.mock("@/lib/contacts", () => ({ upsertContact: vi.fn().mockResolvedValue({ id: "local-contact" }) }));
vi.mock("@/lib/recaptcha", () => ({ verifyRecaptcha: vi.fn().mockResolvedValue(true) }));
vi.mock("@/lib/blend-crm-leads", () => ({ pushLeadToBlendCrm: vi.fn().mockResolvedValue(true) }));
vi.mock("@/lib/listings-leads", () => ({ pushLeadToListings: vi.fn().mockResolvedValue(undefined) }));
import { POST } from "@/app/api/enquiry/route";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { upsertContact } from "@/lib/contacts";
import { pushLeadToBlendCrm } from "@/lib/blend-crm-leads";
import { pushLeadToListings } from "@/lib/listings-leads";

beforeEach(() => {
  vi.mocked(verifyRecaptcha).mockResolvedValue(true);
  vi.mocked(upsertContact).mockResolvedValue({ id: "local-contact" } as Awaited<ReturnType<typeof upsertContact>>);
  vi.mocked(pushLeadToBlendCrm).mockResolvedValue(true);
  vi.mocked(pushLeadToListings).mockResolvedValue(undefined);
});

afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); database.enquiry.create.mockReset(); });

describe("enquiry transport reliability", () => {
  it("rejects oversized and malformed JSON without database side effects", async () => {
    for (const [body, expected] of [["{", 400], [JSON.stringify({ message: "x".repeat(70000) }), 413]] as const) {
      const response = await POST(new Request("http://localhost/api/enquiry", { method: "POST", body, headers: { "cf-connecting-ip": "test-" + expected } }));
      expect(response.status).toBe(expected);
    }
    expect(database.enquiry.create).not.toHaveBeenCalled();
  });
  it("returns the saved enquiry after a stalled webhook is aborted", async () => {
    vi.useFakeTimers();
    vi.stubEnv("N8N_ENQUIRY_WEBHOOK", "https://webhook.example.test/local-only");
    database.enquiry.create.mockResolvedValue({ id: "local-enquiry" });
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.spyOn(AbortSignal, "timeout").mockImplementation(ms => {
      expect(ms).toBe(8000);
      const controller = new AbortController();
      setTimeout(() => controller.abort(), ms);
      return controller.signal;
    });
    vi.stubGlobal("fetch", vi.fn((_url, options) => new Promise((_resolve, reject) => options.signal.addEventListener("abort", () => reject(new Error("local timeout"))))));
    const result = POST(new Request("http://localhost/api/enquiry", { method: "POST", headers: { "cf-connecting-ip": "local-webhook-test" }, body: JSON.stringify({ firstName: "Local", email: "local@example.test", message: "Synthetic test" }) }));
    await vi.advanceTimersByTimeAsync(8001);
    const response = await result;
    expect(response.status, JSON.stringify(await response.clone().json())).toBe(200);
    expect(await response.json()).toEqual({ ok: true, enquiryId: "local-enquiry", webhook: false });
    expect(database.enquiry.create).toHaveBeenCalledTimes(1);
  });
});
