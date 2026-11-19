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
const request = (overrides: Record<string, unknown> = {}) => new Request("https://midpoint.example.test/api/enquiry", { method: "POST", body: JSON.stringify({ company: "  Acme Logistics  ", firstName: "Anne-Marie", lastName: "O’Connor", phone: "011 234 5678", spaceSize: "500 m²", moveIn: "Within 1–3 months", consent: "on", email: "test@example.test", interest: "Warehouse space", message: "Loading access", sourcePath: "/contact-us?interest=Warehouse%20space", attribution, "g-recaptcha-response": "test-token", ...overrides }) });

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
  it.each([undefined, null, "", " ", "Private", " pRiVaTe ", "B.S.", "P r i v a t e", "N/A", "None", "unemployed", "job seeker", "12345", "!!!", "aaaaaa", {}, [], "A".repeat(151)])("rejects invalid company %j before any contact or lead side effects", async (company) => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    const response = await POST(request({ company }));
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ field: "company" });
    for (const mock of [mocks.verify, mocks.contact, mocks.create, mocks.crm, mocks.listings, fetchMock]) expect(mock).not.toHaveBeenCalled();
  });

  it.each([
    [{ email: " person+leasing@GMAIL.COM " }, "email"],
    [{ email: "person@googlemail.com" }, "email"],
    [{ email: "person@outlook.com" }, "email"],
    [{ email: "person@invalid" }, "email"],
    [{ company: "No Company Name" }, "company"],
    [{ company: "Looking for any job" }, "company"],
    [{ message: "I would like to submit my CV." }, "message"],
  ] as const)("rejects non-leasing submissions before downstream writes", async (payload, field) => {
    const response = await POST(request(payload));
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ field });
    for (const mock of [mocks.verify, mocks.contact, mocks.create, mocks.crm, mocks.listings]) expect(mock).not.toHaveBeenCalled();
  });

  it("accepts a business address and a property vacancy enquiry", async () => {
    const response = await POST(request({
      email: "tenant@gmail-logistics.co.za",
      message: "Is the warehouse vacancy still available?",
    }));
    expect(response.status).toBe(200);
    expect(mocks.crm).toHaveBeenCalledWith(expect.objectContaining({ email: "tenant@gmail-logistics.co.za" }));
  });

  it.each(["firstName", "lastName", "phone", "interest", "spaceSize", "moveIn", "message", "consent"])("requires %s before downstream writes", async (field) => {
    const response = await POST(request({ [field]: " " }));
    expect(response.status).toBe(400);
    for (const mock of [mocks.verify, mocks.contact, mocks.create, mocks.crm, mocks.listings]) expect(mock).not.toHaveBeenCalled();
  });

  it.each([
    ["company", "Ｂ．Ｓ．"], ["firstName", "BS"], ["lastName", "asdf"],
    ["firstName", "1234"], ["lastName", "BS"], ["phone", "BS"], ["phone", "call me"], ["phone", "12345"],
    ["phone", "0123456789"], ["phone", "+27 82 123"], ["phone", "0999999999"],
    ["spaceSize", "BS"], ["spaceSize", "xxx"], ["spaceSize", "n/a"], ["spaceSize", "123"],
    ["message", "BS"], ["message", "blah blah"], ["message", "qwertyqwerty"],
    ["message", "????"], ["message", "test test"],
  ])("rejects junk in %s (%s) before any lead write", async (field, value) => {
    const response = await POST(request({ [field]: value }));
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ field });
    for (const mock of [mocks.verify, mocks.contact, mocks.create, mocks.crm, mocks.listings]) expect(mock).not.toHaveBeenCalled();
  });

  it.each(["082 123 4567", "+27 (82) 123-4567", "0027 82 123 4567", "+44 20 7946 0958"])(
    "accepts short requirements and formatted phone %s", async (phone) => {
      const response = await POST(request({ spaceSize: "12 desks", message: "Need loading access.", phone }));
      expect(response.status).toBe(200);
      expect(mocks.crm).toHaveBeenCalledWith(expect.objectContaining({
        phone, message: expect.stringContaining("12 desks"),
      }));
    }
  );

  it("passes the normalized company to all saved records and integrations", async () => {
    process.env.N8N_ENQUIRY_WEBHOOK = "https://notifications.example.test/enquiry";
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}", { status: 200 }));
    const message = "Property: 6 Weaver Avenue\n\nApproximate size or desks: 500 m²\n\nMove-in timing: Within 1–3 months\n\nLoading access";
    expect((await POST(request({ spaceName: "6 Weaver Avenue" }))).status).toBe(200);
    expect(mocks.contact).toHaveBeenCalledWith(expect.objectContaining({ company: "Acme Logistics" }));
    expect(mocks.create).toHaveBeenCalledWith({ data: expect.objectContaining({ company: "Acme Logistics", message }) });
    expect(mocks.crm).toHaveBeenCalledWith(expect.objectContaining({ company: "Acme Logistics", message }));
    expect(mocks.listings).toHaveBeenCalledWith(expect.objectContaining({ company: "Acme Logistics", message }));
    expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string)).toMatchObject({ company: "Acme Logistics", message, spaceSize: "500 m²", moveIn: "Within 1–3 months" });
  });

  it("returns the saved receipt when an optional notification times out", async () => {
    process.env.N8N_ENQUIRY_WEBHOOK = "https://notifications.example.test/enquiry";
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async (_url, options) => {
      expect(options?.signal).toBeInstanceOf(AbortSignal);
      throw new DOMException("Timed out", "TimeoutError");
    });
    const response = await POST(request());
    expect(await response.json()).toMatchObject({ ok: true, enquiryId: "enquiry-test", webhook: false });
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(mocks.create).toHaveBeenCalledOnce();
  });

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
