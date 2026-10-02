import { publicSeoUrl } from "@/lib/seo-metadata";

export function readCanonicalUrl(form: FormData): string | null {
  const value = String(form.get("canonicalUrl") || "").trim();
  if (!value) return null;
  if (!/^https?:\/\//i.test(value) || !publicSeoUrl(value, "https://www.mid-point.co.za")) throw new Error("Canonical URL must be a full HTTP or HTTPS URL without credentials.");
  return publicSeoUrl(value, "https://www.mid-point.co.za")!;
}
