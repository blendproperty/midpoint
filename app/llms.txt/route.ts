import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";
import { STATIC_PAGES } from "@/lib/static-pages";

export const dynamic = "force-dynamic";

// llms.txt (see llmstxt.org) — a plain-markdown map of the site aimed at LLM
// answer engines (ChatGPT, Claude, Perplexity, etc.) rather than traditional
// search crawlers. Generated live from the database on every request, so it
// never drifts out of sync with what's actually published — unlike a static
// hand-maintained file would.
export async function GET() {
  const settings = await getSiteSettings();

  const [pillarPages, pages, blogPosts] = await Promise.all([
    prisma.pillarPage.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { title: "asc" },
      select: { title: true, slug: true, seoDescription: true, heroAnswer: true },
    }),
    prisma.page.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { title: "asc" },
      select: { title: true, slug: true, seoDescription: true },
    }),
    prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { updatedAt: "desc" },
      take: 25,
      select: { title: true, slug: true, excerpt: true, seoDescription: true },
    }),
  ]);

  const lines: string[] = [];
  lines.push(`# ${settings.siteName}`);
  lines.push("");
  lines.push(
    `> ${settings.siteName} is a secure business estate in Midrand, Gauteng, South Africa, offering warehouse, office and serviced office space to rent on the N1 between Johannesburg and Pretoria. Leasing enquiries: ${settings.phone} / ${settings.email}.`
  );
  lines.push("");
  lines.push("## Key pages");
  lines.push("");
  for (const p of STATIC_PAGES) {
    lines.push(`- [${p.label}](${settings.domain}${p.path})`);
  }
  for (const p of pillarPages) {
    const summary = (p.seoDescription || p.heroAnswer || "").replace(/\s+/g, " ").trim().slice(0, 160);
    lines.push(`- [${p.title}](${settings.domain}/${p.slug})${summary ? `: ${summary}` : ""}`);
  }
  lines.push(`- [Current availability / vacancy schedule](${settings.domain}/availability-report)`);
  lines.push(`- [Vacancies](${settings.domain}/vacancies)`);
  lines.push(`- [FAQs](${settings.domain}/faqs)`);
  lines.push(`- [Contact / leasing enquiries](${settings.domain}/contact-us)`);

  if (pages.length > 0) {
    lines.push("");
    lines.push("## Additional pages");
    lines.push("");
    for (const p of pages) {
      const summary = (p.seoDescription || "").replace(/\s+/g, " ").trim().slice(0, 160);
      lines.push(`- [${p.title}](${settings.domain}/p/${p.slug})${summary ? `: ${summary}` : ""}`);
    }
  }

  if (blogPosts.length > 0) {
    lines.push("");
    lines.push("## Recent articles");
    lines.push("");
    for (const p of blogPosts) {
      const summary = (p.seoDescription || p.excerpt || "").replace(/\s+/g, " ").trim().slice(0, 160);
      lines.push(`- [${p.title}](${settings.domain}/blog/${p.slug})${summary ? `: ${summary}` : ""}`);
    }
  }

  return new Response(lines.join("\n") + "\n", {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
