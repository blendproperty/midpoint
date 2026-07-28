// Renders an admin-authored custom-code snippet (from PageSettingsPanel's
// "Custom code" section) inline in the page. Next.js App Router has no API
// for injecting arbitrary raw HTML/script into <head> from within a
// page.tsx the way Webflow does — the Metadata API only accepts structured
// fields, not free-form markup. In practice this covers the common cases
// (GTM/analytics snippets, verification tags), which run correctly
// regardless of exact head/body placement; it is not a literal <head>
// injection for spec purists.
export default function CustomCodeBlock({ code }: { code?: string | null }) {
  if (!code) return null;
  return <div dangerouslySetInnerHTML={{ __html: code }} />;
}
