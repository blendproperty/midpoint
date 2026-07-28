"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// The "New" control on the unified Pages hub — picks which underlying
// content type to create, since Blog posts, Pages, and Pillar Pages have
// meaningfully different fields (this is the "select if it's a pillar page
// or normal page" step).
export default function NewPageMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-full bg-midpoint-dark px-4 py-2 text-sm font-semibold text-white"
      >
        New ▾
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-2 w-64 rounded-xl bg-white p-2 shadow-lg">
          <Link href="/admin/blog/new" className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-50">
            <span className="font-medium">Blog post</span>
            <p className="text-xs text-slate-500">Dated articles — news, tips, updates.</p>
          </Link>
          <Link href="/admin/pages/new" className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-50">
            <span className="font-medium">Page</span>
            <p className="text-xs text-slate-500">A standalone page, lives at /p/&lt;slug&gt;.</p>
          </Link>
          <Link href="/admin/pillar-pages/new" className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-50">
            <span className="font-medium">Pillar page</span>
            <p className="text-xs text-slate-500">Long-form SEO strategy page with hero, FAQs, expert review.</p>
          </Link>
        </div>
      )}
    </div>
  );
}
