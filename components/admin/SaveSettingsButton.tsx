"use client";

import { useFormStatus } from "react-dom";

// Server actions give no built-in feedback that a click did anything — the
// page just sits there until the redirect lands. useFormStatus is the only
// way to know "submitting" is in flight from inside the form itself (it has
// to be a separate client component nested in the <form>, not the form's
// own server component).
export default function SaveSettingsButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-midpoint-dark px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save settings"}
    </button>
  );
}
