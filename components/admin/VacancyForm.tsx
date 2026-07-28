"use client";

type Props = {
  action: (formData: FormData) => void;
  defaultValues?: {
    building?: string;
    unitName?: string;
    sector?: string;
    sizeSqm?: number;
    ratePerSqm?: number;
    availability?: string;
    description?: string;
    features?: string[];
    image?: string;
    status?: string;
    sortOrder?: number;
  };
  submitLabel?: string;
};

export default function VacancyForm({ action, defaultValues, submitLabel = "Save" }: Props) {
  return (
    <form action={action} className="mt-6 max-w-2xl space-y-5 rounded-xl bg-white p-6 shadow-sm">
      <div>
        <label className="block text-sm font-medium">Building</label>
        <input name="building" defaultValue={defaultValues?.building} required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium">Unit / suite name (optional)</label>
        <input
          name="unitName"
          defaultValue={defaultValues?.unitName}
          placeholder="e.g. Suite 4 — only needed when several listings share one Building name (like OnPoint)"
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <p className="mt-1 text-xs text-slate-400">
          Shown on the card and carried through to the enquiry so it's clear which specific space someone is
          asking about.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Sector</label>
          <select name="sector" defaultValue={defaultValues?.sector || "OFFICE"} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option value="WAREHOUSE">Warehouse</option>
            <option value="OFFICE">Office</option>
            <option value="SERVICED_OFFICE">Serviced office</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Status</label>
          <select name="status" defaultValue={defaultValues?.status || "PUBLISHED"} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option value="PUBLISHED">Published (visible on site)</option>
            <option value="DRAFT">Draft (hidden)</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Size (m²)</label>
          <input type="number" step="0.01" name="sizeSqm" defaultValue={defaultValues?.sizeSqm} required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium">Rate (R/m²)</label>
          <input type="number" step="0.01" name="ratePerSqm" defaultValue={defaultValues?.ratePerSqm} required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Availability</label>
        <input name="availability" defaultValue={defaultValues?.availability} placeholder="e.g. Available immediately, or 1 March 2027" required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea name="description" defaultValue={defaultValues?.description} rows={5} required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium">Features (one per line)</label>
        <textarea name="features" defaultValue={defaultValues?.features?.join("\n")} rows={4} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium">Image URL</label>
        <input name="image" defaultValue={defaultValues?.image} placeholder="Paste a URL from Media" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
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
