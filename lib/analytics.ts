export type AnalyticsValue = string | number | boolean | undefined;
export type AnalyticsParameters = Record<string, AnalyticsValue>;

function analyticsDestination() {
  if (typeof document === "undefined") return undefined;
  const configured = document.body?.getAttribute("data-ga4-id");
  if (configured == null) return undefined;
  return /^G-[A-Z0-9]+$/.test(configured) ? configured : null;
}

// Use the same command shape as Google's gtag bootstrap. A plain GTM event
// object is not a GA4 command and needs a separate custom-event tag to work.
function queueGoogleEvent(..._args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(arguments);
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (
      command: "event",
      eventName: string,
      parameters?: AnalyticsParameters,
    ) => void;
  }
}

export function trackAnalyticsEvent(
  eventName: string,
  parameters: AnalyticsParameters = {},
) {
  if (typeof window === "undefined") return false;
  const destination = analyticsDestination();
  if (destination === null) return false; // Explicitly disabled, including staging.
  const booking =
    window.location.pathname.startsWith("/stay") ||
    window.location.pathname === "/manage-booking" || eventName === "generate_lead";
  const payload = {
    page_location: booking
      ? window.location.origin + window.location.pathname
      : window.location.href,
    page_path: window.location.pathname,
    ...parameters,
    ...(destination ? { send_to: destination } : {}),
  };
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, payload);
    } else if (destination) {
      queueGoogleEvent("event", eventName, payload);
    } else {
      // Legacy GTM-only surfaces retain their existing event contract.
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: eventName, ...payload });
    }
    return true;
  } catch {
    // A tag/extension error must never turn a saved enquiry into a form error.
    return false;
  }
}

const submittedLeads = new Set<string>();
const LEASING_INTERESTS = new Set(["Office space", "Warehouse space", "Serviced offices"]);

function attributionLabel(value: unknown) {
  return typeof value === "string" && !value.includes("@")
    ? value.trim().slice(0, 100) || undefined : undefined;
}

/** A saved leasing submission, never a click or a human qualification. */
export function trackSavedLeasingEnquiry(
  result: { ok?: boolean; enquiryId?: string; crmDelivered?: boolean },
  interest: unknown,
  attribution?: { lastTouch?: { source?: string; medium?: string; campaign?: string } } | null,
) {
  const id = result.enquiryId;
  if (!result.ok || typeof id !== "string" || !/^[a-zA-Z0-9_-]{1,100}$/.test(id)
    || typeof interest !== "string" || !LEASING_INTERESTS.has(interest)
    || submittedLeads.has(id)) return false;
  const sent = trackAnalyticsEvent("generate_lead", {
    form_name: "contact_enquiry",
    lead_id: id, // Same opaque key as CRM externalId, not contact information.
    event_id: id,
    lead_type: "leasing",
    lead_stage: "submitted",
    crm_delivery_status: result.crmDelivered === true ? "accepted" : "unconfirmed",
    interest,
    source: attributionLabel(attribution?.lastTouch?.source),
    medium: attributionLabel(attribution?.lastTouch?.medium),
    campaign: attributionLabel(attribution?.lastTouch?.campaign),
  });
  if (sent) submittedLeads.add(id);
  return sent;
}

const DOWNLOAD_EXTENSIONS =
  /\.(?:pdf|docx?|xlsx?|pptx?|zip|csv|txt|rtf)(?:$|[?#])/i;

export function automaticLinkEvent(href: string) {
  const normalized = href.trim();
  if (
    /^(?:https?:\/\/)?(?:www\.)?(?:wa\.me|api\.whatsapp\.com)\//i.test(
      normalized,
    )
  )
    return "whatsapp_click";
  if (/^tel:/i.test(normalized)) return "phone_click";
  if (/^mailto:/i.test(normalized)) return "email_click";
  if (DOWNLOAD_EXTENSIONS.test(normalized)) return "file_download";
  return null;
}
