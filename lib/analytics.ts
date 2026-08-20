export type AnalyticsValue = string | number | boolean | undefined;
export type AnalyticsParameters = Record<string, AnalyticsValue>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (command: "event", eventName: string, parameters?: AnalyticsParameters) => void;
  }
}

export function trackAnalyticsEvent(eventName: string, parameters: AnalyticsParameters = {}) {
  if (typeof window === "undefined") return;
  const payload = { page_location: window.location.href, page_path: window.location.pathname, ...parameters };
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, payload);
    return;
  }
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...payload });
}

const DOWNLOAD_EXTENSIONS = /\.(?:pdf|docx?|xlsx?|pptx?|zip|csv|txt|rtf)(?:$|[?#])/i;

export function automaticLinkEvent(href: string) {
  const normalized = href.trim();
  if (/^(?:https?:\/\/)?(?:www\.)?(?:wa\.me|api\.whatsapp\.com)\//i.test(normalized)) return "whatsapp_click";
  if (/^tel:/i.test(normalized)) return "phone_click";
  if (/^mailto:/i.test(normalized)) return "email_click";
  if (DOWNLOAD_EXTENSIONS.test(normalized)) return "file_download";
  return null;
}
