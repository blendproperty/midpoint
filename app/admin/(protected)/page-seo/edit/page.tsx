import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { STATIC_PAGES } from "@/lib/static-pages";
import { getStaticPageContent } from "@/lib/static-page-content";
import { scoreStaticPage } from "@/lib/seo-score";
import { updatePageSeoOverride } from "../actions";
import PageSeoForm from "@/components/admin/PageSeoForm";
import SeoScoreCard from "@/components/admin/SeoScoreCard";

export const dynamic = "force-dynamic";

export default async function EditPageSeoPage({ searchParams }: { searchParams: Promise<{ path?: string }> }) {
  const { path } = await searchParams;
  const vacancyId = path ? /^\/vacancies\/([^/?#]+)$/.exec(path)?.[1] : undefined;
  const vacancy = vacancyId ? await prisma.vacancy.findFirst({ where: { id: decodeURIComponent(vacancyId), status: "PUBLISHED" } }) : null;
  const known = STATIC_PAGES.find((p) => p.path === path) || (vacancy && { path: path!, label: `${vacancy.building}${vacancy.unitName ? ` - ${vacancy.unitName}` : ""}` });
  if (!path || !known) notFound();

  const override = await prisma.pageSeoOverride.findUnique({ where: { path } });
  const content = vacancy?.description || getStaticPageContent(path);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Edit SEO: {known.label}</h1>
      <PageSeoForm
        action={updatePageSeoOverride}
        path={path}
        label={known.label}
        content={content}
        defaultValues={{
          seoTitle: override?.seoTitle || "",
          seoDescription: override?.seoDescription || "",
          ogTitle: override?.ogTitle || "",
          ogDescription: override?.ogDescription || "",
          ogImage: override?.ogImage || "",
          noIndex: override?.noIndex || false,
          canonicalUrl: override?.canonicalUrl || "",
          schemaJson: override?.schemaJson ? JSON.stringify(override.schemaJson, null, 2) : "",
          headCode: override?.headCode || "",
          bodyCode: override?.bodyCode || "",
        }}
      />
      <SeoScoreCard
        result={scoreStaticPage({
          title: known.label,
          path,
          seoTitle: override?.seoTitle,
          seoDescription: override?.seoDescription,
          ogImage: override?.ogImage,
          pageContent: content || undefined,
        })}
      />
    </div>
  );
}
