"use client";

import { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

type Props = {
  name: string;
  defaultValue?: string;
  height?: number;
  onChange?: (html: string) => void;
};

type MediaItem = { id: string; url: string; filename: string; mimeType: string; alt: string };

// Self-hosted TinyMCE (assets copied into public/tinymce at Docker build
// time, see Dockerfile) — no cloud API key, no usage nag. licenseKey="gpl"
// tells the editor it's running under TinyMCE's open-source license.
//
// The form still uses a plain server action reading FormData by field name
// (no client submit handler), so this renders a hidden <input> that always
// mirrors the editor's current HTML under the given `name`.
export default function RichTextEditor({ name, defaultValue = "", height = 420, onChange }: Props) {
  const [value, setValue] = useState(defaultValue);

  // Backs the Image dialog's "Source" browse button (file_picker_callback)
  // so every image inserted into content comes from the same Media library
  // used elsewhere, with alt text pre-filled (existing media) or required
  // (new upload) — instead of TinyMCE's default "paste any URL" dialog,
  // which never touched alt text at all.
  const [pickerOpen, setPickerOpen] = useState(false);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [altDraft, setAltDraft] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [pickCallback, setPickCallback] = useState<((url: string, meta?: { alt?: string }) => void) | null>(null);

  useEffect(() => {
    if (!pickerOpen) return;
    setLoading(true);
    fetch("/api/admin/media")
      .then((r) => r.json())
      .then((data) => setItems(data.media || []))
      .finally(() => setLoading(false));
  }, [pickerOpen]);

  function openPicker(cb: (url: string, meta?: { alt?: string }) => void) {
    setPickCallback(() => cb);
    setPendingFile(null);
    setAltDraft("");
    setUploadError("");
    setPickerOpen(true);
  }

  function choose(item: MediaItem) {
    pickCallback?.(item.url, { alt: item.alt });
    setPickerOpen(false);
  }

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
        pickCallback?.(data.media.url, { alt: data.media.alt });
        setPendingFile(null);
        setAltDraft("");
        setPickerOpen(false);
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
      <input type="hidden" name={name} value={value} readOnly />
      <div className="mt-1 overflow-hidden rounded-lg border border-slate-200">
        <Editor
          tinymceScriptSrc="/tinymce/tinymce.min.js"
          licenseKey="gpl"
          initialValue={defaultValue}
          onEditorChange={(content) => {
            setValue(content);
            onChange?.(content);
          }}
          init={{
            height,
            menubar: false,
            branding: false,
            plugins: "link image lists table code blockquote hr autolink",
            toolbar:
              "undo redo | blocks | bold italic | bullist numlist | link image blockquote | alignleft aligncenter alignright | code",
            content_style: "body { font-family: system-ui, -apple-system, sans-serif; font-size: 14px }",
            // Disable the native upload tab so "Source" only offers our
            // file_picker_callback (the Media library) — no way to slip
            // in an image without an alt-tagged Media record.
            image_uploadtab: false,
            file_picker_types: "image",
            file_picker_callback: (cb) => {
              openPicker((url, meta) => cb(url, meta));
            },
          }}
        />
      </div>

      {pickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
          <div className="max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Media library</h3>
              <button
                type="button"
                onClick={() => {
                  setPickerOpen(false);
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
                <input type="file" accept="image/*" onChange={handleFileChosen} className="mt-1 block text-sm" />
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
                  onClick={() => choose(m)}
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
