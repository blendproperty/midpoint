"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/admin/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-midpoint-dark px-6">
      <div className="w-full max-w-sm rounded-card bg-white p-8">
        <h1 className="text-2xl font-semibold text-midpoint-dark">Reset your password</h1>
        <p className="mt-1 text-sm text-midpoint-grey-400">
          Enter the email on your admin account and we&apos;ll send a reset link.
        </p>

        {submitted ? (
          <p className="mt-6 text-sm text-midpoint-dark">
            If that email is registered, a reset link has been sent — check your inbox.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-midpoint-dark">Email</label>
              <input
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-midpoint-grey-100 px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-midpoint-dark px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {loading ? "Sending…" : "Send reset link"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm">
          <Link href="/admin/login" className="text-midpoint-dark underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
