"use client";

import { useEffect, useState } from "react";

type MediaItem = { id: string; url: string; filename: string; mimeType: string };

type Props = {
  name: string;
  label: string;
  defaultValue?: string;
};

// Replaces "paste a URL you copied from the Media page" with an actual
// picker: browse the existing library, or upload a new image inline,
// without leaving the form. Manual URL entry still works underneath, for
// external images.
export default function MediaPicker({ name, label, defaultValue = "" }: Props) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch("/api/admin/media")
      .then((r) => r.json())
      .then((data) => setItems(data.media || []))
      .finally(() => setLoading(false));
  }, [open]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/media", { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        setItems((prev) => [data.media, ...prev]);
        setValue(data.media.url);
        setOpen(false);
      }
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <input type="hidden" name={name} value={value} readOnly />
      <div className="mt-1 flex items-center gap-3">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-14 w-14 rounded-lg border border-slate-200 object-cover" />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-dashed border-slate-300 text-[10px] text-slate-400">
            No image
          </div>
        )}
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Paste a URL, or choose from the library"
          className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="whitespace-nowrap rounded-full border border-midpoint-dark px-3 py-2 text-xs font-semibold text-midpoint-dark"
        >
          Choose
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
          <div className="max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Media library</h3>
              <button type="button" onClick={() => setOpen(false)} className="text-sm text-slate-500">
                Close
              </button>
            </div>

            <label className="mt-4 block">
              <span className="text-sm font-medium">Upload new</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                className="mt-1 block text-sm"
              />
              {uploading && <span className="mt-1 block text-xs text-slate-400">Uploading…</span>}
            </label>

            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {loading && <p className="col-span-full text-sm text-slate-400">Loading…</p>}
              {!loading && items.length === 0 && (
                <p className="col-span-full text-sm text-slate-400">No media uploaded yet.</p>
              )}
              {items.map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => {
                    setValue(m.url);
                    setOpen(false);
                  }}
                  className="overflow-hidden rounded-lg border border-slate-200 hover:border-midpoint-dark"
                >
                  {m.mimeType.startsWith("image/") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.url} alt={m.filename} className="h-24 w-full object-cover" />
                  ) : (
                    <div className="flex h-24 items-center justify-center bg-slate-100 text-[10px] text-slate-400">
                      {m.mimeType}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
