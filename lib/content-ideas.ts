export const IDEA_STATUSES = ["idea", "researching", "ready", "writing", "published", "parked"] as const;
export const IDEA_FORMATS = ["article", "guide", "faq", "page"] as const;
export const IDEA_PRIORITIES = ["high", "normal", "low"] as const;

export function readContentIdea(form: FormData, domain: string) {
  const text = (key: string) => String(form.get(key) || "").trim();
  const title = text("title");
  const status = text("status") || "idea";
  const format = text("format") || "guide";
  const priority = text("priority") || "normal";
  if (!title || title.length > 200) throw new Error("Enter a content idea of up to 200 characters.");
  if (!IDEA_STATUSES.some(v => v === status) || !IDEA_FORMATS.some(v => v === format) || !IDEA_PRIORITIES.some(v => v === priority)) throw new Error("Choose a valid progress, format and priority.");
  const publishedUrl = text("publishedUrl") || null;
  if (publishedUrl) {
    let url: URL;
    try { url = new URL(publishedUrl); } catch { throw new Error("Use a full HTTPS Midpoint content link."); }
    if (url.protocol !== "https:" || url.origin !== new URL(domain).origin || url.username || url.password) throw new Error("Use a full HTTPS link on the configured Midpoint website.");
  }
  const date = text("targetDate");
  const targetDate = date ? new Date(`${date}T00:00:00.000Z`) : null;
  if (date && (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !targetDate || Number.isNaN(targetDate.getTime()) || targetDate.toISOString().slice(0, 10) !== date)) throw new Error("Choose a valid target date.");
  return { title, status, format, priority, targetDate, publishedUrl,
    keyword: text("keyword") || null, audience: text("audience") || null,
    brief: text("brief") || null, research: text("research") || null };
}
