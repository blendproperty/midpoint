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

  const payload = {
    page_location: window.location.href,
    page_path: window.location.pathname,
    ...parameters,
  };

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, payload);
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...payload });
}
