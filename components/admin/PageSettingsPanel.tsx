"use client";

import { useRef, useState } from "react";
import MediaPicker from "@/components/admin/MediaPicker";
import SeoPreviewCard from "@/components/admin/SeoPreviewCard";
import { generateSeoTitle, generateSeoDescription } from "@/lib/seo-generate";

type SchemaKind = "article" | "webpage" | "pillar";

type Props = {
  titleField?: string;
  titleFallback?: string;
  sourceFields?: string[];
  siteName?: string;
  previewDomain?: string;
  previewPath?: string;
  schemaKind?: SchemaKind;
  defaultValues?: {
    seoTitle?: string;
    seoDescription?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    noIndex?: boolean;
    canonicalUrl?: string;
    schemaJson?: string;
    headCode?: string;
    bodyCode?: string;
  };
};

function field(form: HTMLFormElement, name: string) {
  const c = form.elements.namedItem(name);
  if (c instanceof HTMLInputElement || c instanceof HTMLTextAreaElement || c instanceof HTMLSelectElement) {
    return c.value.trim();
  }
  return "";
}

function stripHtml(v: string) {
  return v.replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/\s+/g, " ").trim();
}

function buildSchema(kind: SchemaKind, title: string, description: string, image: string) {
  const base = { "@context": "https://schema.org" };
  if (kind === "article") {
    return { ...base, "@type": "BlogPosting", headline: title, description, image: image || undefined };
  }
  if (kind === "pillar") {
    return { ...base, "@type": "WebPage", name: title, description, image: image || undefined };
  }
  return { ...base, "@type": "WebPage", name: title, description };
}

const inputCls = "mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder-white/30";
const codeCls = "mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 font-mono text-xs text-emerald-300";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-3">
      <label className="block text-xs font-medium text-white/70">{label}</label>
      {children}
    </div>
  );
}

function PanelSection({
  title,
  id,
  open,
  onToggle,
  children,
}: {
  title: string;
  id: string;
  open: boolean;
  onToggle: (id: string | null) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-white/10">
      <button
        type="button"
        onClick={() => onToggle(open ? null : id)}
        className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-white"
      >
        {title}
        <span className="text-white/40">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
}

// The Webflow-style "page settings" drawer: SEO, Open Graph, Schema markup
// and Custom code, all in one place — same shape as the panel Brett shared
// screenshots of. Content fields (title, body, images) stay in the main
// form; this panel only owns metadata/settings, exactly like Webflow splits
// canvas editing from page settings.
//
// It lives *inside* the surrounding <form> and writes into hidden inputs so
// the existing FormData-based server actions pick everything up without any
// changes to how the form submits.
export default function PageSettingsPanel({
  titleField = "title",
  titleFallback = "",
  sourceFields = ["contentHtml"],
  siteName = "Midpoint Midrand",
  previewDomain = "www.mid-point.co.za",
  previewPath = "",
  schemaKind = "webpage",
  defaultValues,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<string | null>("seo");

  const [seoTitle, setSeoTitle] = useState(defaultValues?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(defaultValues?.seoDescription || "");
  const [ogTitle, setOgTitle] = useState(defaultValues?.ogTitle || "");
  const [ogDescription, setOgDescription] = useState(defaultValues?.ogDescription || "");
  const [ogImage, setOgImage] = useState(defaultValues?.ogImage || "");
  const [sameTitle, setSameTitle] = useState(!defaultValues?.ogTitle);
  const [sameDescription, setSameDescription] = useState(!defaultValues?.ogDescription);
  const [noIndex, setNoIndex] = useState(defaultValues?.noIndex || false);
  const [canonicalUrl, setCanonicalUrl] = useState(defaultValues?.canonicalUrl || "");
  const [schemaJson, setSchemaJson] = useState(defaultValues?.schemaJson || "");
  const [schemaError, setSchemaError] = useState<string | null>(null);
  const [headCode, setHeadCode] = useState(defaultValues?.headCode || "");
  const [bodyCode, setBodyCode] = useState(defaultValues?.bodyCode || "");

  function form() {
    return rootRef.current?.closest("form") ?? null;
  }

  function handleGenerateSeo() {
    const f = form();
    const title = (f ? field(f, titleField) : "") || titleFallback;
    const source = (f ? sourceFields.map((n) => stripHtml(field(f, n))).find(Boolean) : "") || title;
    setSeoTitle(generateSeoTitle(title, siteName));
    setSeoDescription(generateSeoDescription(source));
  }

  function handleGenerateSchema() {
    const f = form();
    const title = (f ? field(f, titleField) : "") || titleFallback || seoTitle;
    const image = (f && (field(f, "coverImage") || field(f, "heroImage"))) || ogImage || "";
    const schema = buildSchema(schemaKind, title, seoDescription, image);
    setSchemaJson(JSON.stringify(schema, null, 2));
    setSchemaError(null);
  }

  function handleSchemaChange(value: string) {
    setSchemaJson(value);
    if (!value.trim()) {
      setSchemaError(null);
      return;
    }
    try {
      JSON.parse(value);
      setSchemaError(null);
    } catch {
      setSchemaError("This isn't valid JSON — it won't be used until it parses correctly.");
    }
  }

  const effectiveOgTitle = sameTitle ? seoTitle : ogTitle;
  const effectiveOgDescription = sameDescription ? seoDescription : ogDescription;

  return (
    <div ref={rootRef}>
      <input type="hidden" name="seoTitle" value={seoTitle} readOnly />
      <input type="hidden" name="seoDescription" value={seoDescription} readOnly />
      <input type="hidden" name="ogTitle" value={sameTitle ? "" : ogTitle} readOnly />
      <input type="hidden" name="ogDescription" value={sameDescription ? "" : ogDescription} readOnly />
      <input type="hidden" name="noIndex" value={noIndex ? "on" : ""} readOnly />
      <input type="hidden" name="canonicalUrl" value={canonicalUrl} readOnly />
      <input type="hidden" name="schemaJson" value={schemaJson} readOnly />
      <input type="hidden" name="headCode" value={headCode} readOnly />
      <input type="hidden" name="bodyCode" value={bodyCode} readOnly />

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
      >
        ⚙️ Page settings
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
          <div className="flex h-full w-full max-w-md flex-col overflow-y-auto bg-[#161b22]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <h2 className="text-sm font-semibold text-white">Page settings</h2>
              <button type="button" onClick={() => setOpen(false)} className="text-sm text-white/60">
                Close
              </button>
            </div>

            <PanelSection title="SEO settings" id="seo" open={section === "seo"} onToggle={setSection}>
              <p className="text-xs text-white/50">
                Specify this page&apos;s title and description. Preview below shows how it&apos;ll look in Google.
              </p>
              <SeoPreviewCard title={seoTitle} description={seoDescription} domain={previewDomain} path={previewPath} />
              <button
                type="button"
                onClick={handleGenerateSeo}
                className="mt-3 rounded-full bg-[#d4af37] px-4 py-2 text-xs font-bold text-slate-950"
              >
                Generate
              </button>
              <Field label="Title tag">
                <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className={inputCls} />
              </Field>
              <Field label="Meta description">
                <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={3} className={inputCls} />
              </Field>
              <Field label="Canonical URL (optional)">
                <input value={canonicalUrl} onChange={(e) => setCanonicalUrl(e.target.value)} placeholder="https://…" className={inputCls} />
              </Field>
              <label className="mt-3 flex items-center gap-2 text-sm text-white">
                <input type="checkbox" checked={!noIndex} onChange={(e) => setNoIndex(!e.target.checked)} />
                Allow search engines to index this page
              </label>
            </PanelSection>

            <PanelSection title="Open Graph settings" id="og" open={section === "og"} onToggle={setSection}>
              <p className="text-xs text-white/50">Controls how this page looks when shared on Facebook, X, and LinkedIn.</p>
              <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-white text-slate-900">
                {ogImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ogImage} alt="" className="h-40 w-full object-cover" />
                )}
                <div className="p-3">
                  <p className="text-sm font-semibold">{effectiveOgTitle || "Open Graph title"}</p>
                  <p className="text-xs text-slate-500">{effectiveOgDescription || "Open Graph description"}</p>
                  <p className="mt-1 text-[11px] text-slate-400">{previewDomain}</p>
                </div>
              </div>
              <div className="mt-3">
                <MediaPicker name="ogImage" label="Open Graph image" defaultValue={ogImage} onChange={setOgImage} />
              </div>
              <label className="mt-3 flex items-center gap-2 text-sm text-white">
                <input type="checkbox" checked={sameTitle} onChange={(e) => setSameTitle(e.target.checked)} />
                Same as SEO title tag
              </label>
              {!sameTitle && (
                <Field label="Open Graph title">
                  <input value={ogTitle} onChange={(e) => setOgTitle(e.target.value)} className={inputCls} />
                </Field>
              )}
              <label className="mt-2 flex items-center gap-2 text-sm text-white">
                <input type="checkbox" checked={sameDescription} onChange={(e) => setSameDescription(e.target.checked)} />
                Same as meta description
              </label>
              {!sameDescription && (
                <Field label="Open Graph description">
                  <textarea value={ogDescription} onChange={(e) => setOgDescription(e.target.value)} rows={2} className={inputCls} />
                </Field>
              )}
            </PanelSection>

            <PanelSection title="Schema markup" id="schema" open={section === "schema"} onToggle={setSection}>
              <p className="text-xs text-white/50">
                JSON-LD structured data for this page. Leave blank to use the schema Midpoint already generates
                automatically for this content type; fill this in to override it with your own.
              </p>
              <button
                type="button"
                onClick={handleGenerateSchema}
                className="mt-2 rounded-full bg-[#d4af37] px-4 py-2 text-xs font-bold text-slate-950"
              >
                Generate schema markup
              </button>
              <textarea
                value={schemaJson}
                onChange={(e) => handleSchemaChange(e.target.value)}
                rows={12}
                placeholder="Leave blank to use the automatic schema"
                className={`mt-3 w-full ${codeCls}`}
              />
              {schemaError && <p className="mt-1 text-xs text-red-400">{schemaError}</p>}
            </PanelSection>

            <PanelSection title="Custom code" id="code" open={section === "code"} onToggle={setSection}>
              <p className="text-xs text-white/50">
                Runs on this page only, after site-wide code. Only add code from a source you trust — it runs
                unescaped on the live site.
              </p>
              <Field label="Inside <head> tag">
                <textarea value={headCode} onChange={(e) => setHeadCode(e.target.value)} rows={4} className={codeCls} />
              </Field>
              <Field label="Before </body> tag">
                <textarea value={bodyCode} onChange={(e) => setBodyCode(e.target.value)} rows={4} className={codeCls} />
              </Field>
            </PanelSection>
          </div>
        </div>
      )}
    </div>
  );
}
