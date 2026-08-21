"use client";

import { useState } from "react";
import type { SuiteFormValues } from "@/app/admin/(protected)/suites/actions";

type Props = {
  action: (values: SuiteFormValues) => Promise<void>;
  submitLabel: string;
  defaultValues?: Partial<SuiteFormValues>;
};

export default function SuiteForm({ action, submitLabel, defaultValues }: Props) {
  const [values, setValues] = useState<SuiteFormValues>({
    name: defaultValues?.name ?? "",
    slug: defaultValues?.slug ?? "",
    description: defaultValues?.description ?? "",
    maxGuests: defaultValues?.maxGuests ?? 2,
    nightlyRate: defaultValues?.nightlyRate ?? 0,
    image: defaultValues?.image ?? "",
    features: defaultValues?.features ?? [],
    status: defaultValues?.status ?? "DRAFT",
  });
  const [featuresText, setFeaturesText] = useState((defaultValues?.features ?? []).join("\n"));
  const [pending, setPending] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        await action({
          ...values,
          features: featuresText.split("\n").map((f) => f.trim()).filter(Boolean),
        });
        setPending(false);
      }}
      className="grid gap-4 max-w-2xl"
    >
      <label className="text-sm font-medium">
        Name
        <input
          required
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
        />
      </label>
      <label className="text-sm font-medium">
        Slug
        <input
          required
          value={values.slug}
          onChange={(e) => setValues((v) => ({ ...v, slug: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
        />
      </label>
      <label className="text-sm font-medium">
        Description
        <textarea
          required
          rows={4}
          value={values.description}
          onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
        />
      </label>
      <div className="grid grid-cols-2 gap-4">
        <label className="text-sm font-medium">
          Max guests
          <input
            type="number"
            min={1}
            value={values.maxGuests}
            onChange={(e) => setValues((v) => ({ ...v, maxGuests: Number(e.target.value) }))}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
          />
        </label>
        <label className="text-sm font-medium">
          Nightly rate (R)
          <input
            type="number"
            min={0}
            step="0.01"
            value={values.nightlyRate}
            onChange={(e) => setValues((v) => ({ ...v, nightlyRate: Number(e.target.value) }))}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
          />
        </label>
      </div>
      <label className="text-sm font-medium">
        Image URL
        <input
          value={values.image}
          onChange={(e) => setValues((v) => ({ ...v, image: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
        />
      </label>
      <label className="text-sm font-medium">
        Features (one per line)
        <textarea
          rows={4}
          value={featuresText}
          onChange={(e) => setFeaturesText(e.target.value)}
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
        />
      </label>
      <label className="text-sm font-medium">
        Status
        <select
          value={values.status}
          onChange={(e) =>
            setValues((v) => ({ ...v, status: e.target.value as SuiteFormValues["status"] }))
          }
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
        >
          <option value="DRAFT">Draft</option>
          <option value="REVIEW">Review</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-midpoint-cyan px-4 py-2.5 text-sm font-semibold text-midpoint-dark disabled:opacity-50"
      >
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
