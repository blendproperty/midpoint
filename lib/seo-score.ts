// A Yoast/RankMath-style on-page SEO checklist. No equivalent tool exists in
// the listings.blendproperty.co.za codebase to copy from, so this is built
// from scratch using the standard set of on-page checks those tools use.
export type SeoCheckStatus = "good" | "ok" | "bad";

export type SeoCheck = {
  id: string;
  label: string;
  status: SeoCheckStatus;
  message: string;
};

export type SeoScoreResult = {
  score: number; // 0-100
  grade: "Good" | "Needs improvement" | "Poor";
  checks: SeoCheck[];
};

type ScoreInput = {
  title: string;
  slug: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  contentHtml: string;
  focusKeyword?: string | null;
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

const STATUS_POINTS: Record<SeoCheckStatus, number> = { good: 1, ok: 0.5, bad: 0 };

export function scoreContent(input: ScoreInput): SeoScoreResult {
  const checks: SeoCheck[] = [];
  const effectiveTitle = input.seoTitle || input.title;
  const plainText = stripHtml(input.contentHtml);
  const wordCount = countWords(plainText);
  const keyword = input.focusKeyword?.trim().toLowerCase() || "";

  // Title length
  const titleLen = effectiveTitle.length;
  checks.push(
    titleLen >= 40 && titleLen <= 60
      ? { id: "title-length", label: "SEO title length", status: "good", message: `${titleLen} characters — a good length for search results.` }
      : titleLen > 0
        ? { id: "title-length", label: "SEO title length", status: "ok", message: `${titleLen} characters — aim for 40–60 so it doesn't get cut off in search results.` }
        : { id: "title-length", label: "SEO title length", status: "bad", message: "No title set." }
  );

  // Meta description
  const descLen = (input.seoDescription || "").length;
  checks.push(
    descLen >= 120 && descLen <= 156
      ? { id: "meta-description", label: "Meta description", status: "good", message: `${descLen} characters — a good length.` }
      : descLen > 0
        ? { id: "meta-description", label: "Meta description", status: "ok", message: `${descLen} characters — aim for 120–156.` }
        : { id: "meta-description", label: "Meta description", status: "bad", message: "No meta description set — search engines will generate one automatically, which you can't control." }
  );

  // Content length
  checks.push(
    wordCount >= 300
      ? { id: "content-length", label: "Content length", status: "good", message: `${wordCount} words.` }
      : wordCount >= 150
        ? { id: "content-length", label: "Content length", status: "ok", message: `${wordCount} words — aim for 300+ for stronger topical coverage.` }
        : { id: "content-length", label: "Content length", status: "bad", message: `Only ${wordCount} words — thin content is unlikely to rank well.` }
  );

  // Subheadings
  const h2Count = (input.contentHtml.match(/<h2[\s>]/gi) || []).length;
  checks.push(
    h2Count >= 2
      ? { id: "headings", label: "Subheadings", status: "good", message: `${h2Count} H2 subheadings — good structure.` }
      : h2Count === 1
        ? { id: "headings", label: "Subheadings", status: "ok", message: "Only 1 subheading — consider breaking the content up further." }
        : { id: "headings", label: "Subheadings", status: "bad", message: "No H2 subheadings — long-form content should be broken up with headings." }
  );

  // Image alt text
  const imgTags = input.contentHtml.match(/<img[^>]*>/gi) || [];
  const imagesWithoutAlt = imgTags.filter((tag) => !/alt\s*=\s*"[^"]+"/i.test(tag));
  checks.push(
    imgTags.length === 0
      ? { id: "image-alt", label: "Image alt text", status: "ok", message: "No images in this content." }
      : imagesWithoutAlt.length === 0
        ? { id: "image-alt", label: "Image alt text", status: "good", message: `All ${imgTags.length} image(s) have alt text.` }
        : { id: "image-alt", label: "Image alt text", status: "bad", message: `${imagesWithoutAlt.length} of ${imgTags.length} image(s) are missing alt text.` }
  );

  // Internal links
  const internalLinks = (input.contentHtml.match(/href\s*=\s*"\/(?!\/)[^"]*"/gi) || []).length;
  checks.push(
    internalLinks >= 1
      ? { id: "internal-links", label: "Internal links", status: "good", message: `${internalLinks} internal link(s) found.` }
      : { id: "internal-links", label: "Internal links", status: "ok", message: "No internal links — linking to other pages on the site helps both SEO and readers." }
  );

  // URL slug
  const slugLen = input.slug.length;
  checks.push(
    slugLen > 0 && slugLen <= 75 && !/[A-Z\s_]/.test(input.slug)
      ? { id: "slug", label: "URL slug", status: "good", message: "Slug is clean and lowercase." }
      : { id: "slug", label: "URL slug", status: "ok", message: "Slug should be short, lowercase, and hyphen-separated." }
  );

  // Focus keyword (only scored if one is set)
  if (keyword) {
    const inTitle = effectiveTitle.toLowerCase().includes(keyword);
    const inDescription = (input.seoDescription || "").toLowerCase().includes(keyword);
    const inContent = plainText.toLowerCase().includes(keyword);
    const inSlug = input.slug.toLowerCase().includes(keyword.replace(/\s+/g, "-"));
    const hits = [inTitle, inDescription, inContent, inSlug].filter(Boolean).length;

    checks.push(
      hits >= 3
        ? { id: "focus-keyword", label: "Focus keyword usage", status: "good", message: `"${keyword}" appears in ${hits} of 4 key places (title, description, slug, content).` }
        : hits >= 1
          ? { id: "focus-keyword", label: "Focus keyword usage", status: "ok", message: `"${keyword}" only appears in ${hits} of 4 key places — try including it in the title, description, and content.` }
          : { id: "focus-keyword", label: "Focus keyword usage", status: "bad", message: `"${keyword}" doesn't appear in the title, description, slug, or content.` }
    );
  }

  const total = checks.reduce((sum, c) => sum + STATUS_POINTS[c.status], 0);
  const score = Math.round((total / checks.length) * 100);
  const grade = score >= 80 ? "Good" : score >= 50 ? "Needs improvement" : "Poor";

  return { score, grade, checks };
}
