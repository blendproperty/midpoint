import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    blogCount,
    pageCount,
    pillarCount,
    vacancyCount,
    faqCount,
    enquiryTotal,
    enquiryUnhandled,
    recentEnquiries,
    topPagesRaw,
    topVacanciesRaw,
  ] = await Promise.all([
    prisma.blogPost.count(),
    prisma.page.count(),
    prisma.pillarPage.count(),
    prisma.vacancy.count(),
    prisma.faq.count(),
    prisma.enquiry.count(),
    prisma.enquiry.count({ where: { handled: false } }),
    prisma.enquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.pageView.groupBy({
      by: ["path"],
      where: { createdAt: { gte: since30d } },
      _count: { path: true },
      orderBy: { _count: { path: "desc" } },
      take: 8,
    }),
    prisma.vacancyEvent.groupBy({
      by: ["building"],
      where: { type: "ENQUIRE", createdAt: { gte: since30d } },
      _count: { building: true },
      orderBy: { _count: { building: "desc" } },
      take: 5,
    }),
  ]);

  const cards = [
    { label: "Blog posts", value: blogCount, href: "/admin/blog" },
    { label: "Pages", value: pageCount, href: "/admin/pages" },
    { label: "Pillar pages", value: pillarCount, href: "/admin/pillar-pages" },
    { label: "Vacancies", value: vacancyCount, href: "/admin/vacancies" },
    { label: "FAQs", value: faqCount, href: "/admin/faqs" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className="mt-2 text-3xl font-semibold">{c.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Enquiries</h2>
            <Link href="/admin/enquiries" className="text-sm text-midpoint-dark underline">
              View all
            </Link>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            {enquiryTotal} total ·{" "}
            <span className={enquiryUnhandled > 0 ? "font-semibold text-red-600" : ""}>
              {enquiryUnhandled} unhandled
            </span>
          </p>
          <ul className="mt-4 divide-y divide-slate-100">
            {recentEnquiries.map((e) => (
              <li key={e.id} className="py-3 text-sm">
                <p className="font-medium">{[e.firstName, e.lastName].filter(Boolean).join(" ") || e.email}</p>
                <p className="text-slate-500">
                  {e.interest || "General enquiry"} · {e.createdAt.toLocaleDateString()}
                </p>
              </li>
            ))}
            {recentEnquiries.length === 0 && <li className="py-3 text-sm text-slate-400">No enquiries yet.</li>}
          </ul>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Top pages (last 30 days)</h2>
          <ul className="mt-4 divide-y divide-slate-100">
            {topPagesRaw.map((row) => (
              <li key={row.path} className="flex items-center justify-between py-3 text-sm">
                <span>{row.path}</span>
                <span className="font-semibold">{row._count.path}</span>
              </li>
            ))}
            {topPagesRaw.length === 0 && <li className="py-3 text-sm text-slate-400">No page view data yet.</li>}
          </ul>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold">Vacancy interest — Enquire clicks (last 30 days)</h2>
          <ul className="mt-4 divide-y divide-slate-100">
            {topVacanciesRaw.map((row) => (
              <li key={row.building || "unknown"} className="flex items-center justify-between py-3 text-sm">
                <span>{row.building || "Unknown listing"}</span>
                <span className="font-semibold">{row._count.building}</span>
              </li>
            ))}
            {topVacanciesRaw.length === 0 && (
              <li className="py-3 text-sm text-slate-400">No vacancy interest data yet.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
