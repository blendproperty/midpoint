"use client";

import { useEffect, useRef } from "react";
import { trackAnalyticsEvent } from "@/lib/analytics";

export default function VacancyViewTracker({ vacancyId, vacancyName }: { vacancyId: string; vacancyName: string }) {
  // React can reuse this component instance across client-side navigation
  // between different vacancy pages (only props change, no remount) — so
  // the guard has to be keyed by vacancyId, not fire-once-per-instance,
  // or every vacancy after the first silently stops recording a view.
  const sentForRef = useRef<string | null>(null);
  useEffect(() => {
    if (sentForRef.current === vacancyId) return;
    sentForRef.current = vacancyId;
    trackAnalyticsEvent("view_item", { item_id: vacancyId, item_name: vacancyName, item_category: "vacancy" });
    const body = JSON.stringify({ vacancyId, building: vacancyName, type: "VIEW" });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/track/vacancy-event", new Blob([body], { type: "application/json" }));
    else fetch("/api/track/vacancy-event", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
  }, [vacancyId, vacancyName]);
  return null;
}
