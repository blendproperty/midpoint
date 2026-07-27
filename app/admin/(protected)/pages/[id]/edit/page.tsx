import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PageForm from "@/components/admin/PageForm";
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
          seoTitle: page.seoTitle || "",
          seoDescription: page.seoDescription || "",
        }}
      />
    </div>
  );
}
