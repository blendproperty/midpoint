import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteBlogPost } from "./actions";
import { scoreContent } from "@/lib/seo-score";
import SeoScoreBadge from "@/components/admin/SeoScoreBadge";

export const dynamic = "force-dynamic";

export default async function BlogAdminPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Blog posts</h1>
        <Link href="/admin/blog/new" className="rounded-full bg-midpoint-dark px-4 py-2 text-sm font-medium text-white">
          New post
        </Link>
      </div>
      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">SEO</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => {
              const { score } = scoreContent(post);
              return (
                <tr key={post.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium">{post.title}</td>
                  <td className="px-4 py-3">
                    <span className={post.status === "PUBLISHED" ? "text-emerald-600" : "text-slate-400"}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <SeoScoreBadge score={score} />
                  </td>
                  <td className="px-4 py-3 text-slate-500">{post.updatedAt.toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/blog/${post.id}/edit`} className="mr-3 text-midpoint-dark underline">
                      Edit
                    </Link>
                    <form action={deleteBlogPost.bind(null, post.id)} className="inline">
                      <button className="text-red-600 underline">Delete</button>
                    </form>
                  </td>
                </tr>
              );
            })}
            {posts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                  No blog posts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
