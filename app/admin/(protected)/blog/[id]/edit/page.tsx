import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BlogForm from "@/components/admin/BlogForm";
import SeoScoreCard from "@/components/admin/SeoScoreCard";
import { updateBlogPost } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  const action = updateBlogPost.bind(null, id);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Edit blog post</h1>
      <BlogForm
        action={action}
        submitLabel="Save changes"
        defaultValues={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || "",
          contentHtml: post.contentHtml,
          coverImage: post.coverImage || "",
          status: post.status,
          seoTitle: post.seoTitle || "",
          seoDescription: post.seoDescription || "",
          focusKeyword: post.focusKeyword || "",
        }}
      />
      <SeoScoreCard
        title={post.title}
        slug={post.slug}
        seoTitle={post.seoTitle}
        seoDescription={post.seoDescription}
        contentHtml={post.contentHtml}
        focusKeyword={post.focusKeyword}
      />
    </div>
  );
}
