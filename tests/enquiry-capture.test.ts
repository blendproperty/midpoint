import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  create: vi.fn(), verify: vi.fn(), limit: vi.fn(), contact: vi.fn(), crm: vi.fn(), listings: vi.fn(),
}));
vi.mock("@/lib/prisma", () => ({ prisma: { enquiry: { create: mocks.create } } }));
vi.mock("@/lib/recaptcha", () => ({ verifyRecaptcha: mocks.verify }));
vi.mock("@/lib/rate-limit", () => ({ checkRateLimit: mocks.limit, getClientIp: () => "127.0.0.1" }));
vi.mock("@/lib/contacts", () => ({ upsertContact: mocks.contact }));
vi.mock("@/lib/blend-crm-leads", () => ({ pushLeadToBlendCrm: mocks.crm }));
vi.mock("@/lib/listings-leads", () => ({ pushLeadToListings: mocks.listings }));
import { POST } from "@/app/api/enquiry/route";

const attribution = { firstTouch: { source: "google", medium: "organic", landingPage: "/blog/storage" }, lastTouch: { source: "google", medium: "organic", landingPage: "/blog/storage" } };
const request = () => new Request("https://midpoint.example.test/api/enquiry", { method: "POST", body: JSON.stringify({ firstName: "Test", email: "test@example.test", interest: "Warehouse space", message: "Test only", sourcePath: "/contact-us?interest=Warehouse%20space", attribution, "g-recaptcha-response": "test-token" }) });

beforeEach(() => {
  vi.resetAllMocks();
  mocks.verify.mockResolvedValue(true); mocks.limit.mockReturnValue(true);
  mocks.contact.mockResolvedValue({ id: "contact-test" });
  mocks.create.mockResolvedValue({ id: "enquiry-test" });
  mocks.crm.mockResolvedValue(false);
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  delete process.env.N8N_ENQUIRY_WEBHOOK;
});
afterEach(() => { vi.restoreAllMocks(); });

describe("saved-enquiry conversion boundary", () => {
  it("returns a saved ID and preserves attribution when downstream delivery is unavailable", async () => {
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, enquiryId: "enquiry-test", crmDelivered: false, webhook: false });
    expect(mocks.create).toHaveBeenCalledWith({ data: expect.objectContaining({ attribution, contactId: "contact-test", interest: "Warehouse space" }) });
    expect(mocks.crm).toHaveBeenCalledOnce();
    expect(mocks.crm).toHaveBeenCalledWith(expect.objectContaining({ externalId: "enquiry-test", attribution }));
  });
  it("reports CRM acceptance separately from successful submission", async () => {
    mocks.crm.mockResolvedValue(true);
    const response = await POST(request());
    expect(await response.json()).toMatchObject({ ok: true, enquiryId: "enquiry-test", crmDelivered: true });
  });
  it("does not report success or forward a lead when saving fails", async () => {
    mocks.create.mockRejectedValue(new Error("database unavailable"));
    const response = await POST(request());
    expect(response.status).toBe(500);
    expect(await response.json()).toMatchObject({ ok: false });
    expect(mocks.crm).not.toHaveBeenCalled(); expect(mocks.listings).not.toHaveBeenCalled();
  });
  it("does not save or forward a rejected captcha", async () => {
    mocks.verify.mockResolvedValue(false);
    expect((await POST(request())).status).toBe(400);
    expect(mocks.create).not.toHaveBeenCalled(); expect(mocks.crm).not.toHaveBeenCalled();
  });
});
