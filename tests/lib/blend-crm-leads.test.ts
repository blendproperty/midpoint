import { afterEach, describe, expect, it, vi } from "vitest";

import { pushLeadToBlendCrm } from "@/lib/blend-crm-leads";

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.BLEND_CRM_LEADS_URL;
  delete process.env.BLEND_CRM_LEADS_API_KEY;
});

describe("pushLeadToBlendCrm", () => {
  it("maps a Midpoint enquiry to the Blend CRM intake contract", async () => {
    process.env.BLEND_CRM_LEADS_URL =
      "https://crm.example.test/api/v1/leads";
    process.env.BLEND_CRM_LEADS_API_KEY = "test-key";
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 201 });
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      pushLeadToBlendCrm({
        externalId: "enquiry-123",
        email: "brett@example.test",
        firstName: "Brett",
        lastName: "Dovey",
        phone: "0115555555",
        interest: "Warehouse space",
        message: "Test lead",
        sourcePath: "/spaces/1-kingfisher-avenue",
      }),
    ).resolves.toBe(true);

    const [, request] = fetchMock.mock.calls[0];
    expect(request.headers["x-api-key"]).toBe("test-key");
    expect(JSON.parse(request.body)).toEqual({
      source: {
        slug: "midpoint",
        name: "Midpoint",
        domain: "www.mid-point.co.za",
      },
      externalId: "enquiry-123",
      contact: {
        firstName: "Brett",
        lastName: "Dovey",
        email: "brett@example.test",
        phone: "0115555555",
      },
      message: "Interest: Warehouse space\n\nTest lead",
      sourcePage:
        "https://www.mid-point.co.za/spaces/1-kingfisher-avenue",
    });
  });

  it("returns false when the CRM rejects the lead", async () => {
    process.env.BLEND_CRM_LEADS_URL =
      "https://crm.example.test/api/v1/leads";
    process.env.BLEND_CRM_LEADS_API_KEY = "test-key";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 401 }),
    );
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    await expect(
      pushLeadToBlendCrm({
        externalId: "enquiry-123",
        email: "brett@example.test",
        firstName: "Brett",
      }),
    ).resolves.toBe(false);
  });
});
