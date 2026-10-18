import { afterEach, describe, expect, it, vi } from "vitest";
import { automaticLinkEvent, trackAnalyticsEvent, trackSavedLeasingEnquiry } from "@/lib/analytics";

const location = { origin: "https://mid-point.co.za", href: "https://mid-point.co.za/contact-us?space=private%40example.test", pathname: "/contact-us" };
const destination = (id: string | null) => vi.stubGlobal("document", { body: { getAttribute: () => id } });

describe("automaticLinkEvent", () => {
  it.each([
    ["https://wa.me/27111234567", "whatsapp_click"], ["tel:+27111234567", "phone_click"],
    ["mailto:leasing@example.com", "email_click"], ["/brochures/midpoint.pdf", "file_download"], ["/vacancies", null],
  ])("classifies %s", (href, expected) => expect(automaticLinkEvent(href)).toBe(expected));
});

describe("trackAnalyticsEvent", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends a confirmed lead event through gtag once", () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", {
      location,
      gtag,
    });

    trackAnalyticsEvent("generate_lead", { lead_id: "enquiry-123" });

    expect(gtag).toHaveBeenCalledOnce();
    expect(gtag).toHaveBeenCalledWith("event", "generate_lead", {
      page_location: "https://mid-point.co.za/contact-us",
      page_path: "/contact-us",
      lead_id: "enquiry-123",
    });
  });

  it("falls back to one dataLayer event when gtag is unavailable", () => {
    const dataLayer: unknown[] = [];
    vi.stubGlobal("window", {
      location,
      dataLayer,
    });

    trackAnalyticsEvent("generate_lead", { lead_id: "enquiry-456" });

    expect(dataLayer).toEqual([{
      event: "generate_lead",
      page_location: "https://mid-point.co.za/contact-us",
      page_path: "/contact-us",
      lead_id: "enquiry-456",
    }]);
  });

  it("queues a real gtag command for the configured property before gtag loads", () => {
    const dataLayer: unknown[] = [];
    vi.stubGlobal("window", { location, dataLayer });
    destination("G-9XLN2SH5ER");
    expect(trackAnalyticsEvent("generate_lead", { lead_id: "early-save" })).toBe(true);
    expect(dataLayer).toHaveLength(1);
    expect(Array.from(dataLayer[0] as IArguments)).toEqual(["event", "generate_lead", {
      lead_id: "early-save", send_to: "G-9XLN2SH5ER", page_location: "https://mid-point.co.za/contact-us", page_path: "/contact-us",
    }]);
    expect((dataLayer[0] as { event?: string }).event).toBeUndefined();
  });

  it("routes to the configured GA4 property and protects a saved form from tag errors", () => {
    const gtag = vi.fn().mockImplementation(() => { throw new Error("extension failure"); });
    vi.stubGlobal("window", { location, gtag }); destination("G-9XLN2SH5ER");
    expect(() => trackAnalyticsEvent("generate_lead")).not.toThrow();
    expect(trackAnalyticsEvent("generate_lead")).toBe(false);
    expect(gtag).toHaveBeenCalledWith("event", "generate_lead", expect.objectContaining({ send_to: "G-9XLN2SH5ER" }));
  });

  it("does not transmit on an explicitly disabled staging property", () => {
    const gtag = vi.fn(); vi.stubGlobal("window", { location, gtag }); destination("");
    expect(trackAnalyticsEvent("generate_lead")).toBe(false); expect(gtag).not.toHaveBeenCalled();
  });

  it("emits one saved leasing submission per ID with the CRM join key and no contact details", () => {
    const gtag = vi.fn(); vi.stubGlobal("window", { location, gtag }); destination("G-9XLN2SH5ER");
    const result = { ok: true, enquiryId: "saved-leasing-unique", crmDelivered: true };
    expect(trackSavedLeasingEnquiry(result, "Warehouse space", { lastTouch: { source: "google", medium: "organic", campaign: "private@example.test" } })).toBe(true);
    expect(trackSavedLeasingEnquiry(result, "Warehouse space")).toBe(false);
    expect(gtag).toHaveBeenCalledOnce();
    const [command, name, payload] = gtag.mock.calls[0];
    expect(command).toBe("event"); expect(name).toBe("generate_lead");
    expect(payload).toMatchObject({ lead_id: result.enquiryId, form_name: "contact_enquiry", lead_type: "leasing", lead_stage: "submitted", crm_delivery_status: "accepted", medium: "organic" });
    expect(JSON.stringify(payload)).not.toContain("@");
    expect(JSON.stringify(payload)).not.toContain("qualify_lead");
  });

  it("does not count unsaved, failed or accommodation requests as leasing leads", () => {
    const gtag = vi.fn(); vi.stubGlobal("window", { location, gtag }); destination("G-9XLN2SH5ER");
    for (const result of [{ ok: false, enquiryId: "failed" }, { ok: true }, { ok: true, enquiryId: "private@example.test" }]) {
      expect(trackSavedLeasingEnquiry(result, "Warehouse space")).toBe(false);
    }
    expect(trackSavedLeasingEnquiry({ ok: true, enquiryId: "suite-request" }, "Accommodation")).toBe(false);
    expect(gtag).not.toHaveBeenCalled();
  });

  it("still counts a saved submission when CRM delivery is unconfirmed", () => {
    const gtag = vi.fn(); vi.stubGlobal("window", { location, gtag }); destination("G-9XLN2SH5ER");
    expect(trackSavedLeasingEnquiry({ ok: true, enquiryId: "saved-crm-unconfirmed", crmDelivered: false }, "Office space")).toBe(true);
    expect(gtag).toHaveBeenCalledWith("event", "generate_lead", expect.objectContaining({ crm_delivery_status: "unconfirmed", lead_stage: "submitted" }));
  });
});
