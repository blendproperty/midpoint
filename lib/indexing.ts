import type { Metadata } from "next";

// Public pages are indexable unless an editor explicitly selects noIndex.
// Password-protected content remains non-indexable because crawlers cannot
// access the protected page, even if noIndex was not manually selected.
export function pageRobots(noIndex = false, passwordProtected = false, allowIndexing = true): NonNullable<Metadata["robots"]> {
  return passwordProtected || noIndex || !allowIndexing
    ? { index: false, follow: true }
    : { index: true, follow: true };
}
