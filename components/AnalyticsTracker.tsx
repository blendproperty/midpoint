"use client";

import { useEffect } from "react";
import { automaticLinkEvent, trackAnalyticsEvent, type AnalyticsParameters } from "@/lib/analytics";
import { captureAttribution } from "@/lib/attribution";

export default function AnalyticsTracker() {
  useEffect(() => {
    captureAttribution();
    function handleClick(event: MouseEvent) {
      if (window.location.pathname.startsWith("/admin")) return;
      const target = event.target instanceof Element ? event.target.closest("a") : null;
      if (!(target instanceof HTMLAnchorElement)) return;
      const eventName = target.dataset.analyticsEvent || automaticLinkEvent(target.href || target.getAttribute("href") || "");
      if (!eventName) return;
      const parameters: AnalyticsParameters = {
        link_url: target.href,
        link_text: target.dataset.analyticsLabel || target.getAttribute("aria-label") || target.textContent?.trim().slice(0, 100),
        link_location: target.dataset.analyticsLocation,
        vacancy_id: target.dataset.vacancyId,
        vacancy_name: target.dataset.vacancyName,
        file_name: eventName === "file_download" ? target.href.split("/").pop()?.split(/[?#]/)[0] : undefined,
      };
      trackAnalyticsEvent(eventName, parameters);
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);
  return null;
}
