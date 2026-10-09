import { prisma } from "@/lib/prisma";
import BlogForm from "@/components/admin/BlogForm";
import { createBlogPost } from "../actions";

export default async function NewBlogPostPage() {
  const pillars = await prisma.pillarPage.findMany({ select: { id: true, title: true }, orderBy: { title: "asc" } });
  return (
    <div>
      <h1 className="text-2xl font-semibold">New blog post</h1>
      <BlogForm pillars={pillars} action={createBlogPost} submitLabel="Publish / save draft" />
    </div>
  );
}
