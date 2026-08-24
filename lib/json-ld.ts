// JSON.stringify does not escape "<", so a string field that contains the
// literal substring "</script>" (an admin-edited FAQ answer, page title,
// listing name, etc.) breaks out of the surrounding
// <script type="application/ld+json"> tag and injects arbitrary HTML/JS
// for every visitor. Escaping "<" as its unicode sequence keeps the JSON
// value identical after parsing while making that breakout impossible.
export function safeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
