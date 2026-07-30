"use client";

import { useEffect, useState } from "react";

type MediaItem = { id: string; url: string; filename: string; mimeType: string; alt: string };

type Props = {
  name: string;
  label: string;
  defaultValue?: string;
  onChange?: (url: string, alt?: string) => void;
};

// Replaces "paste a URL you copied from the Media page" with an actual
// picker: browse the existing library, or upload a new image inline,
// without leaving the form. Manual URL entry still works underneath, for
// external images. Alt text is required on inline upload, same as the
// standalone /admin/media page — enforced at upload time, not after.
export default function MediaPicker({ name, label, defaultValue = "", onChange }: Props) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [altDraft, setAltDraft] = useState("");
  const [uploadError, setUploadError] = useState("");

  function update(next: string, alt?: string) {
    setValue(next);
    onChange?.(next, alt);
  }

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch("/api/admin/media")
      .then((r) => r.json())
      .then((data) => setItems(data.media || []))
      .finally(() => setLoading(false));
  }, [open]);

  function handleFileChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadError("");
    setAltDraft("");
    setPendingFile(file);
  }

  async function confirmUpload() {
    if (!pendingFile) return;
    const alt = altDraft.trim();
    if (!alt) {
      setUploadError("Alt text is required before uploading.");
      return;
    }
    setUploading(true);
    const fd = new FormData();
    fd.append("file", pendingFile);
    fd.append("alt", alt);
    try {
      const res = await fetch("/api/admin/media", { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        setItems((prev) => [data.media, ...prev]);
        update(data.media.url, data.media.alt);
        setPendingFile(null);
        setAltDraft("");
        setOpen(false);
      } else {
        const data = await res.json().catch(() => ({}));
        setUploadError(data.error || "Upload failed");
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {label && <label className="block text-sm font-medium">{label}</label>}
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
          onChange={(e) => update(e.target.value)}
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
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setPendingFile(null);
                  setUploadError("");
                }}
                className="text-sm text-slate-500"
              >
                Close
              </button>
            </div>

            <div className="mt-4">
              <span className="text-sm font-medium">Upload new</span>
              {!pendingFile ? (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChosen}
                  className="mt-1 block text-sm"
                />
              ) : (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-500">{pendingFile.name}</span>
                  <input
                    type="text"
                    value={altDraft}
                    onChange={(e) => setAltDraft(e.target.value)}
                    placeholder="Alt text (required)"
                    className="min-w-[220px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={confirmUpload}
                    disabled={uploading}
                    className="rounded-full bg-midpoint-dark px-3 py-2 text-xs font-medium text-white"
                  >
                    {uploading ? "Uploading…" : "Upload"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPendingFile(null);
                      setUploadError("");
                    }}
                    className="text-xs text-slate-500 underline"
                  >
                    Cancel
                  </button>
                </div>
              )}
              {uploadError && <p className="mt-1 text-xs text-red-600">{uploadError}</p>}
            </div>

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
                    update(m.url, m.alt);
                    setOpen(false);
                  }}
                  title={m.alt || m.filename}
                  className="overflow-hidden rounded-lg border border-slate-200 hover:border-midpoint-dark"
                >
                  {m.mimeType.startsWith("image/") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.url} alt={m.alt || m.filename} className="h-24 w-full object-cover" />
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
