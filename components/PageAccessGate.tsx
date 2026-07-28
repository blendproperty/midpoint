"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  pageId: string;
  title: string;
};

// Rendered instead of the real page content whenever a Page/PillarPage has
// passwordProtected=true and the visitor doesn't already have a valid
// mp_page_access_<id> cookie. On a correct password, router.refresh() re-runs
// the server component so the (now-set) cookie is picked up and the real
// content renders.
export default function PageAccessGate({ pageId, title }: Props) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/page-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageId, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Incorrect password");
      return;
    }

    router.refresh();
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-midpoint-dark px-6 py-16">
      <div className="w-full max-w-sm rounded-card bg-white p-8">
        <h1 className="text-2xl font-semibold text-midpoint-dark">{title}</h1>
        <p className="mt-1 text-sm text-midpoint-grey-400">This page is password protected.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-midpoint-dark">Password</label>
            <input
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-midpoint-grey-100 px-3 py-2 text-sm"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-midpoint-dark px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Checking…" : "View page"}
          </button>
        </form>
      </div>
    </div>
  );
}
