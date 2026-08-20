const MIDPOINT_BASE_URL = "https://www.mid-point.co.za";

export type BlendCrmLead = {
  externalId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  interest?: string | null;
  message?: string | null;
  sourcePath?: string | null;
  attribution?: unknown;
};

type Touch = { source?: string; medium?: string; campaign?: string; landingPage?: string; gclid?: string; fbclid?: string; msclkid?: string };

function attributionLines(value: unknown) {
  if (!value || typeof value !== "object") return [];
  const touches = value as { firstTouch?: Touch; lastTouch?: Touch };
  const first = touches.firstTouch;
  const last = touches.lastTouch;
  const format = (label: string, touch?: Touch) => touch?.source
    ? `${label}: ${touch.source} / ${touch.medium || "unknown"}${touch.campaign ? ` / ${touch.campaign}` : ""}`
    : undefined;
  return [
    format("First source", first), format("Conversion source", last),
    last?.landingPage ? `Landing page: ${last.landingPage}` : undefined,
    last?.gclid ? `Google Ads click ID: ${last.gclid}` : undefined,
    last?.fbclid ? `Meta click ID: ${last.fbclid}` : undefined,
    last?.msclkid ? `Microsoft Ads click ID: ${last.msclkid}` : undefined,
  ].filter((line): line is string => Boolean(line));
}

function sourcePage(path?: string | null) {
  if (!path?.startsWith("/")) return MIDPOINT_BASE_URL;

  return new URL(path, MIDPOINT_BASE_URL).toString();
}

export async function pushLeadToBlendCrm(
  payload: BlendCrmLead,
): Promise<boolean> {
  const url = process.env.BLEND_CRM_LEADS_URL;
  const apiKey = process.env.BLEND_CRM_LEADS_API_KEY;

  if (!url || !apiKey) {
    console.error("Blend CRM lead integration is not configured");
    return false;
  }

  const message = [
    payload.interest ? `Interest: ${payload.interest}` : undefined,
    payload.message || undefined,
    ...attributionLines(payload.attribution),
  ]
    .filter(Boolean)
    .join("\n\n");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-crm-api-key": apiKey,
      },
      body: JSON.stringify({
        source: {
          slug: "midpoint",
          name: "Midpoint",
          domain: "www.mid-point.co.za",
        },
        externalId: payload.externalId,
        contact: {
          firstName:
            payload.firstName?.trim() ||
            payload.lastName?.trim() ||
            "Unknown",
          lastName: payload.firstName?.trim()
            ? payload.lastName?.trim() || undefined
            : undefined,
          email: payload.email,
          phone: payload.phone || undefined,
        },
        message: message || undefined,
        sourcePage: sourcePage(payload.sourcePath),
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      console.error(`Blend CRM lead push returned ${response.status}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to push enquiry to Blend CRM", error);
    return false;
  } finally {
    clearTimeout(timeout);
  }
}
