"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// useSearchParams requires a Suspense boundary in the App Router (otherwise
// `next build` fails/bails the whole page to client-only rendering with a
// build warning) — so the token-reading logic lives in a child component
// wrapped in Suspense here, matching the pattern Next.js docs recommend.
function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords don't match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/admin/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong");
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/admin/login"), 2000);
  }

  if (!token) {
    return (
      <p className="mt-6 text-sm text-red-600">
        This reset link is missing its token. Request a new one from the sign-in page.
      </p>
    );
  }

  if (done) {
    return <p className="mt-6 text-sm text-midpoint-dark">Password updated — redirecting to sign in…</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-midpoint-dark">New password</label>
        <input
          type="password"
          required
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-midpoint-grey-100 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-midpoint-dark">Confirm new password</label>
        <input
          type="password"
          required
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="mt-1 w-full rounded-lg border border-midpoint-grey-100 px-3 py-2 text-sm"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-midpoint-dark px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        {loading ? "Saving…" : "Reset password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-midpoint-dark px-6">
      <div className="w-full max-w-sm rounded-card bg-white p-8">
        <h1 className="text-2xl font-semibold text-midpoint-dark">Choose a new password</h1>
        <Suspense fallback={<p className="mt-6 text-sm text-midpoint-grey-400">Loading…</p>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
