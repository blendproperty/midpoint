import BlogForm from "@/components/admin/BlogForm";
import { createBlogPost } from "../actions";

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">New blog post</h1>
      <BlogForm action={createBlogPost} submitLabel="Publish / save draft" />
    </div>
  );
}
