import { organizationJsonLd } from "@/lib/seo";

export default function ContentAuthor() {
  const author = organizationJsonLd();
  return (
    <aside aria-label="About the author" className="mt-5 border-l-2 border-midpoint-cyan pl-4 text-sm leading-6 text-midpoint-grey-400">
      <p>By <a href={author.url} rel="author" className="font-semibold text-midpoint-dark underline">{author.name}</a></p>
      <p className="mt-1">{author.description}</p>
    </aside>
  );
}
