"use client";

import { useActionState } from "react";
import { unlockSuitesPreview } from "@/app/suites/actions";

export default function SuitesPreviewGate() {
  const [state, formAction, pending] = useActionState(unlockSuitesPreview, {});

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold text-midpoint-dark">
        The Suites at Midpoint
      </h1>
      <p className="mt-2 text-sm text-neutral-500">
        This page is a private preview. Enter the password to continue.
      </p>
      <form
        action={async (formData) => {
          const result = await formAction(formData);
          if (!result && !state.error) {
            window.location.reload();
          }
        }}
        className="mt-6 flex flex-col gap-3"
      >
        <input
          type="password"
          name="password"
          required
          placeholder="Preview password"
          className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-midpoint-cyan"
        />
        {state.error ? (
          <p className="text-sm text-red-600">{state.error}</p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-midpoint-cyan px-4 py-2.5 text-sm font-semibold text-midpoint-dark disabled:opacity-50"
        >
          {pending ? "Checking…" : "Enter"}
        </button>
      </form>
    </div>
  );
}
