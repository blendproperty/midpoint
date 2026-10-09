import Image from "next/image";
import Link from "next/link";

type Post = { id: string; slug: string; title: string; excerpt: string | null; coverImage: string | null };

export default function SupportingArticles({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;
  return (
    <section id="supporting-articles" className="bg-[#f4f7f6] px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-midpoint-grey-400">Explore this topic</p>
        <h2 className="mt-3 text-3xl font-semibold text-midpoint-dark md:text-4xl">Supporting articles</h2>
        <p className="mt-4 max-w-2xl text-midpoint-grey-400">Go deeper into the questions covered by this guide.</p>
        <div className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col overflow-hidden rounded-card bg-white shadow-sm">
              {post.coverImage && <div className="relative aspect-[16/10] overflow-hidden"><Image src={post.coverImage} alt={post.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" /></div>}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-semibold text-midpoint-dark">{post.title}</h3>
                {post.excerpt && <p className="mt-3 flex-1 text-sm leading-6 text-midpoint-grey-400">{post.excerpt}</p>}
                <span className="mt-6 text-sm font-semibold text-midpoint-dark">Read article &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
