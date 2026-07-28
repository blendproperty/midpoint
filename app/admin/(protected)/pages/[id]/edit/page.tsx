import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PageForm from "@/components/admin/PageForm";
import SeoScoreCard from "@/components/admin/SeoScoreCard";
import { updatePage } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditCmsPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) notFound();

  const action = updatePage.bind(null, id);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Edit page</h1>
      <PageForm
        action={action}
        submitLabel="Save changes"
        defaultValues={{
          title: page.title,
          slug: page.slug,
          contentHtml: page.contentHtml,
          status: page.status,
          passwordProtected: page.passwordProtected,
          hasAccessPassword: Boolean(page.accessPasswordHash),
          seoTitle: page.seoTitle || "",
          seoDescription: page.seoDescription || "",
          focusKeyword: page.focusKeyword || "",
          ogTitle: page.ogTitle || "",
          ogDescription: page.ogDescription || "",
          ogImage: page.ogImage || "",
          noIndex: page.noIndex,
          canonicalUrl: page.canonicalUrl || "",
          schemaJson: page.schemaJson ? JSON.stringify(page.schemaJson, null, 2) : "",
          headCode: page.headCode || "",
          bodyCode: page.bodyCode || "",
        }}
      />
      <SeoScoreCard
        title={page.title}
        slug={page.slug}
        seoTitle={page.seoTitle}
        seoDescription={page.seoDescription}
        contentHtml={page.contentHtml}
        focusKeyword={page.focusKeyword}
      />
    </div>
  );
}
