import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { STATIC_PAGES } from "@/lib/static-pages";
import { getStaticPageContent } from "@/lib/static-page-content";
import { updatePageSeoOverride } from "../actions";
import PageSeoForm from "@/components/admin/PageSeoForm";

export const dynamic = "force-dynamic";

export default async function EditPageSeoPage({ searchParams }: { searchParams: Promise<{ path?: string }> }) {
  const { path } = await searchParams;
  const known = STATIC_PAGES.find((p) => p.path === path);
  if (!path || !known) notFound();

  const override = await prisma.pageSeoOverride.findUnique({ where: { path } });

  return (
    <div>
      <h1 className="text-2xl font-semibold">Edit SEO: {known.label}</h1>
      <PageSeoForm
        action={updatePageSeoOverride}
        path={path}
        label={known.label}
        content={getStaticPageContent(path)}
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
    </div>
  );
}
