// A Yoast/RankMath-style on-page SEO checklist, extended with pillar-page-
// specific rules from Midpoint_Pillar_Page_Blueprint_EEAT_SEO_AI_Search.docx
// (word count, FAQ count, named expert reviewer, review freshness).
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

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

export const STATUS_POINTS: Record<SeoCheckStatus, number> = { good: 1, ok: 0.5, bad: 0 };

function finalize(checks: SeoCheck[]): SeoScoreResult {
  const total = checks.reduce((sum, c) => sum + STATUS_POINTS[c.status], 0);
  const score = Math.round((total / checks.length) * 100);
  const grade = score >= 80 ? "Good" : score >= 50 ? "Needs improvement" : "Poor";
  return { score, grade, checks };
}

export function scoreContent(input: ScoreInput): SeoScoreResult {
  const checks: SeoCheck[] = [];
  const effectiveTitle = input.seoTitle || input.title;
  const plainText = stripHtml(input.contentHtml);
  const wordCount = countWords(plainText);
  const keyword = input.focusKeyword?.trim().toLowerCase() || "";

  const titleLen = effectiveTitle.length;
  checks.push(
    titleLen >= 40 && titleLen <= 60
      ? { id: "title-length", label: "SEO title length", status: "good", message: `${titleLen} characters — a good length for search results.` }
      : titleLen > 0
        ? { id: "title-length", label: "SEO title length", status: "ok", message: `${titleLen} characters — aim for 40–60 so it doesn't get cut off in search results.` }
        : { id: "title-length", label: "SEO title length", status: "bad", message: "No title set." }
  );

  const descLen = (input.seoDescription || "").length;
  checks.push(
    descLen >= 120 && descLen <= 156
      ? { id: "meta-description", label: "Meta description", status: "good", message: `${descLen} characters — a good length.` }
      : descLen > 0
        ? { id: "meta-description", label: "Meta description", status: "ok", message: `${descLen} characters — aim for 120–156.` }
        : { id: "meta-description", label: "Meta description", status: "bad", message: "No meta description set — search engines will generate one automatically, which you can't control." }
  );

  checks.push(
    wordCount >= 300
      ? { id: "content-length", label: "Content length", status: "good", message: `${wordCount} words.` }
      : wordCount >= 150
        ? { id: "content-length", label: "Content length", status: "ok", message: `${wordCount} words — aim for 300+ for stronger topical coverage.` }
        : { id: "content-length", label: "Content length", status: "bad", message: `Only ${wordCount} words — thin content is unlikely to rank well.` }
  );

  const h2Count = (input.contentHtml.match(/<h2[\s>]/gi) || []).length;
  checks.push(
    h2Count >= 2
      ? { id: "headings", label: "Subheadings", status: "good", message: `${h2Count} H2 subheadings — good structure.` }
      : h2Count === 1
        ? { id: "headings", label: "Subheadings", status: "ok", message: "Only 1 subheading — consider breaking the content up further." }
        : { id: "headings", label: "Subheadings", status: "bad", message: "No H2 subheadings — long-form content should be broken up with headings." }
  );

  const imgTags = input.contentHtml.match(/<img[^>]*>/gi) || [];
  const imagesWithoutAlt = imgTags.filter((tag) => !/alt\s*=\s*"[^"]+"/i.test(tag));
  checks.push(
    imgTags.length === 0
      ? { id: "image-alt", label: "Image alt text", status: "ok", message: "No images in this content." }
      : imagesWithoutAlt.length === 0
        ? { id: "image-alt", label: "Image alt text", status: "good", message: `All ${imgTags.length} image(s) have alt text.` }
        : { id: "image-alt", label: "Image alt text", status: "bad", message: `${imagesWithoutAlt.length} of ${imgTags.length} image(s) are missing alt text.` }
  );

  // Every published page's JSON-LD is now generated automatically from
  // these same fields (see lib/seo.ts's richPageJsonLd/blogPostingJsonLd and
  // the pillar/CMS page graphs) — there's no way for structured data to be
  // literally missing anymore, but a blank or very short meta description
  // still means the schema's own `description` falls back to just the
  // title, which is weak. This reflects that specifically, distinct from
  // the "Meta description" check above, which is about the search snippet
  // rather than the structured data.
  const schemaDescription = (input.seoDescription || "").trim();
  checks.push(
    schemaDescription.length >= 50
      ? {
          id: "structured-data",
          label: "Structured data (JSON-LD)",
          status: "good",
          message: "Schema markup is generated automatically and includes a real description.",
        }
      : {
          id: "structured-data",
          label: "Structured data (JSON-LD)",
          status: "ok",
          message:
            "Schema markup is generated automatically, but without a meta description it falls back to using just the title.",
        }
  );

  const internalLinks = (input.contentHtml.match(/href\s*=\s*"\/(?!\/)[^"]*"/gi) || []).length;
  checks.push(
    internalLinks >= 1
      ? { id: "internal-links", label: "Internal links", status: "good", message: `${internalLinks} internal link(s) found.` }
      : { id: "internal-links", label: "Internal links", status: "ok", message: "No internal links — linking to other pages on the site helps both SEO and readers." }
  );

  const slugLen = input.slug.length;
  checks.push(
    slugLen > 0 && slugLen <= 75 && !/[A-Z\s_]/.test(input.slug)
      ? { id: "slug", label: "URL slug", status: "good", message: "Slug is clean and lowercase." }
      : { id: "slug", label: "URL slug", status: "ok", message: "Slug should be short, lowercase, and hyphen-separated." }
  );

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

  return finalize(checks);
}

type PillarScoreInput = ScoreInput & {
  heroAnswer?: string | null;
  expertName?: string | null;
  expertBio?: string | null;
  faqs?: { question: string; answer: string }[] | null;
  lastReviewedAt?: Date | null;
};

// Pillar pages follow the blueprint's own rules (3,000–5,500 words, 10–18
// FAQs, named expert reviewer, 6-monthly review cadence) which are stricter
// and different from the general blog/page checklist above, so this reuses
// the shared checks and appends the pillar-specific ones rather than
// duplicating the generic content-length check.
export function scorePillarPage(input: PillarScoreInput): SeoScoreResult {
  const base = scoreContent(input);
  const checks = base.checks.filter((c) => c.id !== "content-length");
  const plainText = stripHtml(input.contentHtml);
  const wordCount = countWords(plainText);

  checks.push(
    wordCount >= 3000 && wordCount <= 5500
      ? { id: "pillar-length", label: "Pillar page length", status: "good", message: `${wordCount} words — within the recommended 3,000–5,500 range.` }
      : wordCount > 5500
        ? { id: "pillar-length", label: "Pillar page length", status: "ok", message: `${wordCount} words — above the 5,500 target; check for padding.` }
        : { id: "pillar-length", label: "Pillar page length", status: "bad", message: `${wordCount} words — below the 3,000 minimum for a pillar page.` }
  );

  const heroWords = countWords(input.heroAnswer || "");
  checks.push(
    heroWords >= 40 && heroWords <= 80
      ? { id: "hero-answer", label: "Hero direct answer", status: "good", message: `${heroWords} words — a good answer-first length.` }
      : heroWords > 0
        ? { id: "hero-answer", label: "Hero direct answer", status: "ok", message: `${heroWords} words — aim for 40–80.` }
        : { id: "hero-answer", label: "Hero direct answer", status: "bad", message: "No hero direct answer set." }
  );

  const faqCount = input.faqs?.length || 0;
  checks.push(
    faqCount >= 10 && faqCount <= 18
      ? { id: "faq-count", label: "FAQ count", status: "good", message: `${faqCount} FAQs — within the recommended 10–18.` }
      : faqCount > 0
        ? { id: "faq-count", label: "FAQ count", status: "ok", message: `${faqCount} FAQs — aim for 10–18 genuinely useful questions.` }
        : { id: "faq-count", label: "FAQ count", status: "bad", message: "No FAQs added." }
  );

  checks.push(
    input.expertName && input.expertBio
      ? { id: "expert", label: "Named expert reviewer", status: "good", message: `${input.expertName} is credited with a bio.` }
      : input.expertName
        ? { id: "expert", label: "Named expert reviewer", status: "ok", message: "Expert name set but no bio — add their relevant experience." }
        : { id: "expert", label: "Named expert reviewer", status: "bad", message: "No named expert/reviewer — required for E-E-A-T." }
  );

  if (input.lastReviewedAt) {
    const daysSinceReview = (Date.now() - input.lastReviewedAt.getTime()) / (1000 * 60 * 60 * 24);
    checks.push(
      daysSinceReview <= 180
        ? { id: "review-freshness", label: "Review freshness", status: "good", message: `Last reviewed ${Math.round(daysSinceReview)} days ago.` }
        : daysSinceReview <= 365
          ? { id: "review-freshness", label: "Review freshness", status: "ok", message: `Last reviewed ${Math.round(daysSinceReview)} days ago — due for review.` }
          : { id: "review-freshness", label: "Review freshness", status: "bad", message: `Last reviewed ${Math.round(daysSinceReview)} days ago — overdue per the blueprint's 6-monthly cycle.` }
    );
  } else {
    checks.push({ id: "review-freshness", label: "Review freshness", status: "bad", message: "No last-reviewed date set." });
  }

  return finalize(checks);
}

type StaticScoreInput = {
  title: string;
  path: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  ogImage?: string | null;
  // Static pages (About Us, Contact Us, etc.) are hand-coded JSX, not
  // database content — there's no contentHtml to run scoreContent() against.
  // lib/static-page-content.ts keeps a maintained plain-text mirror of each
  // page's real copy specifically so this scorer (and the schema/description
  // "Generate" buttons) have something real to check instead of just a title.
  pageContent?: string;
};

// A lighter checklist for static pages, built from what actually exists for
// them (an SEO override + a maintained copy mirror) rather than pretending
// they have the same fields as CMS content. No headings/image-alt/internal-
// link/focus-keyword checks here — those need real markup this page type
// doesn't have — but title, description, real copy length, schema, and
// social image are all genuinely checkable, so static pages get an honest
// score instead of a permanent "—".
export function scoreStaticPage(input: StaticScoreInput): SeoScoreResult {
  const checks: SeoCheck[] = [];
  const effectiveTitle = input.seoTitle || input.title;
  const titleLen = effectiveTitle.length;

  checks.push(
    titleLen >= 40 && titleLen <= 60
      ? { id: "title-length", label: "SEO title length", status: "good", message: `${titleLen} characters — a good length for search results.` }
      : titleLen > 0
        ? { id: "title-length", label: "SEO title length", status: "ok", message: `${titleLen} characters — aim for 40–60 so it doesn't get cut off in search results.` }
        : { id: "title-length", label: "SEO title length", status: "bad", message: "No title set." }
  );

  const descLen = (input.seoDescription || "").length;
  checks.push(
    descLen >= 120 && descLen <= 156
      ? { id: "meta-description", label: "Meta description", status: "good", message: `${descLen} characters — a good length.` }
      : descLen > 0
        ? { id: "meta-description", label: "Meta description", status: "ok", message: `${descLen} characters — aim for 120–156.` }
        : { id: "meta-description", label: "Meta description", status: "bad", message: "No meta description set — search engines will generate one automatically, which you can't control." }
  );

  const wordCount = countWords(input.pageContent || "");
  checks.push(
    wordCount >= 300
      ? { id: "content-length", label: "Page copy length", status: "good", message: `~${wordCount} words of real copy on this page.` }
      : wordCount >= 150
        ? { id: "content-length", label: "Page copy length", status: "ok", message: `~${wordCount} words — on the thin side; consider adding more real copy to the page itself.` }
        : { id: "content-length", label: "Page copy length", status: "bad", message: `~${wordCount} words — thin content is unlikely to rank well. (Estimate based on a maintained mirror of this page's copy, since static pages aren't stored in the database.)` }
  );

  const schemaDescription = (input.seoDescription || "").trim();
  checks.push(
    schemaDescription.length >= 50
      ? {
          id: "structured-data",
          label: "Structured data (JSON-LD)",
          status: "good",
          message: "Schema markup is generated automatically and includes a real description.",
        }
      : {
          id: "structured-data",
          label: "Structured data (JSON-LD)",
          status: "ok",
          message:
            "Schema markup is generated automatically, but without a meta description it falls back to using just the title.",
        }
  );

  checks.push(
    input.ogImage
      ? { id: "og-image", label: "Social share image", status: "good", message: "A custom image is set for social shares." }
      : { id: "og-image", label: "Social share image", status: "ok", message: "No custom social image set — the site default will be used instead." }
  );

  return finalize(checks);
}

type VacancyScoreInput = {
  building: string;
  description: string;
  image?: string | null;
  features: string[];
};

// Vacancies have no seoTitle/seoDescription/slug of their own — they're
// leasing inventory, not pages — but the same description/image/features
// feed straight into listingsJsonLd()'s per-listing Product/Offer schema
// (see lib/seo.ts) and the public VacancyCard, so a thin or incomplete
// listing genuinely does mean weaker schema and a weaker on-page result,
// not just a cosmetic gap. This is what lets vacancies show up in the
// site-wide audit instead of being invisible to it.
export function scoreVacancyListing(input: VacancyScoreInput): SeoScoreResult {
  const checks: SeoCheck[] = [];
  const descLen = (input.description || "").trim().length;

  checks.push(
    descLen >= 150
      ? { id: "listing-description", label: "Listing description", status: "good", message: `${descLen} characters — enough real detail for both readers and the schema.org description.` }
      : descLen >= 60
        ? { id: "listing-description", label: "Listing description", status: "ok", message: `${descLen} characters — a bit thin; more specifics (layout, finishes, access) help both SEO and enquiries.` }
        : { id: "listing-description", label: "Listing description", status: "bad", message: descLen > 0 ? `Only ${descLen} characters — too thin to be useful in search results or the listing schema.` : "No description set." }
  );

  checks.push(
    input.image
      ? { id: "listing-image", label: "Listing image", status: "good", message: "An image is set — used on the card and in the listing's schema.org markup." }
      : { id: "listing-image", label: "Listing image", status: "bad", message: "No image set — the listing schema's image field will be empty." }
  );

  const featureCount = input.features?.length || 0;
  checks.push(
    featureCount >= 3
      ? { id: "listing-features", label: "Listed features", status: "good", message: `${featureCount} features listed.` }
      : featureCount > 0
        ? { id: "listing-features", label: "Listed features", status: "ok", message: `Only ${featureCount} feature(s) listed — add more to help this space stand out.` }
        : { id: "listing-features", label: "Listed features", status: "bad", message: "No features listed." }
  );

  return finalize(checks);
}
