"use client";

import { useEffect, useRef } from "react";
import { trackAnalyticsEvent } from "@/lib/analytics";

export default function VacancyViewTracker({ vacancyId, vacancyName }: { vacancyId: string; vacancyName: string }) {
  const sentRef = useRef(false);
  useEffect(() => {
    if (sentRef.current) return;
    sentRef.current = true;
    trackAnalyticsEvent("view_item", { item_id: vacancyId, item_name: vacancyName, item_category: "vacancy" });
    const body = JSON.stringify({ vacancyId, building: vacancyName, type: "VIEW" });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/track/vacancy-event", new Blob([body], { type: "application/json" }));
    else fetch("/api/track/vacancy-event", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
  }, [vacancyId, vacancyName]);
  return null;
}
