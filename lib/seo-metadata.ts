import type { Metadata } from "next";
import { pageRobots } from "@/lib/indexing";
import { stripSiteNameSuffix } from "@/lib/seo";

export type SeoFields = {
  seoTitle?: string | null; seoDescription?: string | null;
  ogTitle?: string | null; ogDescription?: string | null; ogImage?: string | null;
  canonicalUrl?: string | null; noIndex?: boolean; passwordProtected?: boolean;
};
export type SeoSite = {
  domain: string; siteName: string; defaultSocialImage: string;
  defaultMetaDescription: string; allowIndexing: boolean;
};

export function publicSeoUrl(value: string | null | undefined, domain: string): string | undefined {
  if (!value?.trim()) return undefined;
  try {
    const url = new URL(value.trim(), domain);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) return undefined;
    url.hash = "";
    return url.href;
  } catch { return undefined; }
}

export function buildPageMetadata({ path, title, description, image, fields = {}, settings, article = false }: {
  path: string; title: string; description?: string | null; image?: string | null;
  fields?: SeoFields | null; settings: SeoSite; article?: boolean;
}): Metadata {
  const seo = fields || {};
  const pageTitle = stripSiteNameSuffix(seo.seoTitle || title, settings.siteName);
  const pageDescription = seo.seoDescription || description || settings.defaultMetaDescription;
  const canonical = publicSeoUrl(seo.canonicalUrl, settings.domain) || new URL(path, settings.domain).href;
  const socialTitle = stripSiteNameSuffix(seo.ogTitle || pageTitle, settings.siteName);
  const socialDescription = seo.ogDescription || pageDescription;
  const socialImage = publicSeoUrl(seo.ogImage || image, settings.domain) || publicSeoUrl(settings.defaultSocialImage, settings.domain);
  return {
    title: path === "/" ? { absolute: pageTitle } : pageTitle, description: pageDescription,
    alternates: { canonical },
    robots: pageRobots(seo.noIndex, seo.passwordProtected, settings.allowIndexing),
    openGraph: {
      type: article ? "article" : "website", locale: "en_ZA", siteName: settings.siteName,
      url: canonical, title: socialTitle, description: socialDescription,
      images: socialImage ? [{ url: socialImage }] : [],
    },
    twitter: { card: "summary_large_image", title: socialTitle, description: socialDescription, images: socialImage ? [socialImage] : [] },
  };
}
