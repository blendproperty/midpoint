"use client";

type Props = {
  action: (formData: FormData) => void;
  defaultValues?: { question?: string; answer?: string; sortOrder?: number };
  submitLabel?: string;
};

export default function FaqForm({ action, defaultValues, submitLabel = "Save" }: Props) {
  return (
    <form action={action} className="mt-6 max-w-2xl space-y-5 rounded-xl bg-white p-6 shadow-sm">
      <div>
        <label className="block text-sm font-medium">Question</label>
        <input name="question" defaultValue={defaultValues?.question} required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium">Answer</label>
        <textarea name="answer" defaultValue={defaultValues?.answer} rows={6} required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium">Sort order (lower shows first)</label>
        <input type="number" name="sortOrder" defaultValue={defaultValues?.sortOrder ?? 0} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </div>
      <button type="submit" className="rounded-full bg-midpoint-dark px-5 py-2.5 text-sm font-semibold text-white">
        {submitLabel}
      </button>
    </form>
  );
}
