import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [blogCount, pageCount, vacancyCount, faqCount] = await Promise.all([
    prisma.blogPost.count(),
    prisma.page.count(),
    prisma.vacancy.count(),
    prisma.faq.count(),
  ]);

  const cards = [
    { label: "Blog posts", value: blogCount, href: "/admin/blog" },
    { label: "Pages", value: pageCount, href: "/admin/pages" },
    { label: "Vacancies", value: vacancyCount, href: "/admin/vacancies" },
    { label: "FAQs", value: faqCount, href: "/admin/faqs" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">
        This section is still being built out — vacancies, FAQs, blog, and page editing screens are coming next.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className="mt-2 text-3xl font-semibold">{c.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
