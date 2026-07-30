// Any fixed-looking key works for IndexNow — it only has to match the file
// served at <domain>/<key>.txt. It doesn't need to be secret; it just proves
// control of the domain. Kept in its own module (rather than inside
// lib/indexnow.ts) purely so lib/site-settings.ts can import it without a
// circular dependency, since lib/indexnow.ts itself imports getSiteSettings.
export const DEFAULT_INDEXNOW_KEY = "a1f9c3d7e2b84a6f9d0c5b8e1f2a3c47";
