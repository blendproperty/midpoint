import { describe, it, expect } from "vitest";
import { scoreContent, scorePillarPage, countWords, stripHtml } from "@/lib/seo-score";

describe("stripHtml", () => {
  it("removes tags and collapses whitespace", () => {
    expect(stripHtml("<p>Hello   <strong>world</strong></p>")).toBe("Hello world");
  });
});

describe("countWords", () => {
  it("counts words separated by whitespace", () => {
    expect(countWords("one two three")).toBe(3);
  });

  it("returns 0 for empty text", () => {
    expect(countWords("")).toBe(0);
  });
});

describe("scoreContent", () => {
  it("scores well-optimized content as good on its individual checks", () => {
    const longParagraph = "word ".repeat(310);
    const result = scoreContent({
      title: "Offices to Rent in Midrand",
      slug: "offices",
      seoTitle: "Offices to Rent in Midrand | Midpoint Business Park",
      seoDescription:
        "Modern offices to rent in Midrand at Midpoint, between Joburg and Pretoria, with backup power and on-site amenities included today.",
      contentHtml: `<h2>Section one</h2><p>${longParagraph}</p><h2>Section two</h2><p>More content with a <a href="/contact-us">link</a> and an image <img src="/x.jpg" alt="Office space" />.</p>`,
      focusKeyword: "office space Midrand",
    });

    expect(result.checks.find((c) => c.id === "content-length")?.status).toBe("good");
    expect(result.checks.find((c) => c.id === "headings")?.status).toBe("good");
    expect(result.checks.find((c) => c.id === "image-alt")?.status).toBe("good");
    expect(result.checks.find((c) => c.id === "internal-links")?.status).toBe("good");
  });

  it("flags a completely empty page as poor", () => {
    const result = scoreContent({
      title: "Untitled",
      slug: "untitled",
      seoTitle: "",
      seoDescription: "",
      contentHtml: "",
      focusKeyword: "",
    });

    expect(result.grade).toBe("Poor");
    expect(result.checks.find((c) => c.id === "title-length")?.status).toBe("bad");
    expect(result.checks.find((c) => c.id === "content-length")?.status).toBe("bad");
  });

  it("flags images missing alt text", () => {
    const result = scoreContent({
      title: "Test",
      slug: "test",
      contentHtml: `<img src="/x.jpg" />`,
    });
    expect(result.checks.find((c) => c.id === "image-alt")?.status).toBe("bad");
  });

  it("rewards a focus keyword that appears in title, description, and content", () => {
    const result = scoreContent({
      title: "Test",
      slug: "warehouse-space-midrand",
      seoTitle: "Warehouse Space Midrand | Midpoint",
      seoDescription: "Warehouse space Midrand available now with high eaves and N1 access.",
      contentHtml: "<p>Our warehouse space Midrand listings are updated weekly.</p>",
      focusKeyword: "warehouse space Midrand",
    });
    expect(result.checks.find((c) => c.id === "focus-keyword")?.status).toBe("good");
  });
});

describe("scorePillarPage", () => {
  it("applies the stricter 3,000-5,500 word range instead of the generic 300-word minimum", () => {
    const shortContent = "word ".repeat(310); // passes scoreContent's bar, should fail the pillar bar
    const result = scorePillarPage({
      title: "Test pillar",
      slug: "test-pillar",
      contentHtml: `<p>${shortContent}</p>`,
      heroAnswer: "word ".repeat(50),
      faqs: Array.from({ length: 12 }, (_, i) => ({ question: `Q${i}`, answer: `A${i}` })),
      expertName: "Jane Doe",
      expertBio: "10 years in commercial leasing.",
      lastReviewedAt: new Date(),
    });

    expect(result.checks.find((c) => c.id === "pillar-length")?.status).toBe("bad");
    expect(result.checks.find((c) => c.id === "content-length")).toBeUndefined();
  });

  it("scores a fully-built pillar page well across all pillar-specific checks", () => {
    const bigContent = "word ".repeat(3500);
    const result = scorePillarPage({
      title: "Offices to Rent in Midrand",
      slug: "offices",
      seoTitle: "Offices to Rent in Midrand | Midpoint Business Park",
      seoDescription:
        "Modern offices to rent in Midrand at Midpoint, between Joburg and Pretoria, with backup power and amenities included.",
      contentHtml: `<h2>One</h2><p>${bigContent}</p><h2>Two</h2>`,
      heroAnswer: "word ".repeat(50),
      faqs: Array.from({ length: 12 }, (_, i) => ({ question: `Q${i}`, answer: `A${i}` })),
      expertName: "Boitumelo",
      expertBio: "Leasing Manager, Midpoint.",
      lastReviewedAt: new Date(),
    });

    expect(result.checks.find((c) => c.id === "pillar-length")?.status).toBe("good");
    expect(result.checks.find((c) => c.id === "faq-count")?.status).toBe("good");
    expect(result.checks.find((c) => c.id === "expert")?.status).toBe("good");
    expect(result.checks.find((c) => c.id === "review-freshness")?.status).toBe("good");
  });

  it("flags an overdue review", () => {
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 400);

    const result = scorePillarPage({
      title: "Test",
      slug: "test",
      contentHtml: "<p>content</p>",
      lastReviewedAt: oldDate,
    });

    expect(result.checks.find((c) => c.id === "review-freshness")?.status).toBe("bad");
  });

  it("flags a missing named expert as required for E-E-A-T", () => {
    const result = scorePillarPage({
      title: "Test",
      slug: "test",
      contentHtml: "<p>content</p>",
    });
    expect(result.checks.find((c) => c.id === "expert")?.status).toBe("bad");
  });
});
