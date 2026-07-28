import { permanentRedirect } from "next/navigation";

// This page used to render the exact same listings as /vacancies (same
// getAllVacancies() call, same VacancyCard components, same JSON-LD) —
// two indexable URLs competing for the same content and search intent.
// /vacancies is the one canonical page now; this route just forwards any
// existing bookmarks, backlinks, or already-indexed search results there
// with a permanent redirect instead of leaving them to 404.
export default function AvailabilityReport() {
  permanentRedirect("/vacancies");
}
