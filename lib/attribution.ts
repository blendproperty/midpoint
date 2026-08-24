export type AttributionTouch = {
  source: string;
  medium: string;
  campaign?: string;
  term?: string;
  content?: string;
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
  landingPage: string;
  referrer?: string;
  capturedAt: string;
};

export type ConversionAttribution = { firstTouch: AttributionTouch; lastTouch: AttributionTouch };

const STORAGE_KEY = "midpoint_conversion_attribution_v1";
const SEARCH_HOSTS: Record<string, string> = {
  "google.com": "google", "www.google.com": "google", "google.co.za": "google", "www.google.co.za": "google",
  "bing.com": "bing", "www.bing.com": "bing", "yahoo.com": "yahoo", "www.yahoo.com": "yahoo",
};

function clean(value: string | null, limit = 500) {
  return value?.trim().slice(0, limit) || undefined;
}

// document.referrer isn't guaranteed to be a valid URL — some browsers/
// privacy extensions rewrite it to an arbitrary non-URL string, and this
// runs unguarded in a root-layout useEffect with no error boundary, so a
// throw here would crash the whole page for that visitor.
function safeHostname(value: string): string {
  try {
    return new URL(value).hostname.toLowerCase();
  } catch {
    return "";
  }
}

export function deriveAttribution(locationHref: string, referrerValue = ""): AttributionTouch {
  const url = new URL(locationHref);
  const params = url.searchParams;
  const referrer = clean(referrerValue);
  const referrerHost = referrer ? safeHostname(referrer) : "";
  const ownReferral = referrerHost === url.hostname.toLowerCase();
  const gclid = clean(params.get("gclid"), 255);
  const fbclid = clean(params.get("fbclid"), 255);
  const msclkid = clean(params.get("msclkid"), 255);
  const utmSource = clean(params.get("utm_source"), 100);
  const utmMedium = clean(params.get("utm_medium"), 100);

  let source = utmSource || "direct";
  let medium = utmMedium || "none";
  if (!utmSource && gclid) { source = "google"; medium = "cpc"; }
  else if (!utmSource && fbclid) { source = "facebook"; medium = "paid_social"; }
  else if (!utmSource && msclkid) { source = "bing"; medium = "cpc"; }
  else if (!utmSource && referrer && !ownReferral) {
    source = SEARCH_HOSTS[referrerHost] || referrerHost.replace(/^www\./, "") || "referral";
    medium = SEARCH_HOSTS[referrerHost] ? "organic" : "referral";
  }

  return {
    source, medium,
    campaign: clean(params.get("utm_campaign"), 200), term: clean(params.get("utm_term"), 200),
    content: clean(params.get("utm_content"), 200), gclid, fbclid, msclkid,
    landingPage: `${url.pathname}${url.search}`.slice(0, 1000),
    referrer: referrer && !ownReferral ? referrer : undefined,
    capturedAt: new Date().toISOString(),
  };
}

export function captureAttribution(): ConversionAttribution | null {
  if (typeof window === "undefined") return null;
  const touch = deriveAttribution(window.location.href, document.referrer);
  let existing: ConversionAttribution | null = null;
  try { existing = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null"); } catch { existing = null; }
  const isMeaningful = touch.source !== "direct" || touch.medium !== "none";
  const attribution = {
    firstTouch: existing?.firstTouch || touch,
    lastTouch: isMeaningful || !existing?.lastTouch ? touch : existing.lastTouch,
  };
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(attribution)); } catch { /* tracking must not break the site */ }
  return attribution;
}

export function getStoredAttribution(): ConversionAttribution | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null"); } catch { return null; }
}

// Single source of truth for "source / medium / campaign" formatting —
// previously reimplemented separately in the admin enquiries table and in
// the Blend CRM lead note, which could (and did) drift apart in null
// handling.
export function formatTouchSource(touch?: Pick<AttributionTouch, "source" | "medium" | "campaign">): string | null {
  if (!touch?.source) return null;
  return [touch.source, touch.medium || "unknown", touch.campaign].filter(Boolean).join(" / ");
}
