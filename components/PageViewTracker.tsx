"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Fires a beacon on every route change so /admin can show "top pages" — no
// cookies, no session ID, just a path and timestamp. Uses sendBeacon so it
// never delays or blocks the page itself.
export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    const body = JSON.stringify({ path: pathname });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track/pageview", new Blob([body], { type: "application/json" }));
    } else {
      fetch("/api/track/pageview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  }, [pathname]);

  return null;
}
