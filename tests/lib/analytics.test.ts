import { afterEach, describe, expect, it, vi } from "vitest";
import { automaticLinkEvent, trackAnalyticsEvent } from "@/lib/analytics";

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
      location: { href: "https://mid-point.co.za/contact-us", pathname: "/contact-us" },
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
      location: { href: "https://mid-point.co.za/contact-us", pathname: "/contact-us" },
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
});
