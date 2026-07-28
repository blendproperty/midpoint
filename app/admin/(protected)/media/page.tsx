import { prisma } from "@/lib/prisma";
import { uploadMedia, deleteMedia, updateMediaAlt } from "./actions";

export const dynamic = "force-dynamic";

export default async function MediaAdminPage() {
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
  const missingAltCount = media.filter((m) => !m.alt).length;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Media</h1>
      <p className="mt-1 text-sm text-slate-500">
        Upload images here, then copy the URL into the Image field on a blog post, page, or vacancy. Alt text is
        required for every upload — it's used for accessibility (screen readers) and SEO.
      </p>

      <form action={uploadMedia} className="mt-6 flex flex-wrap items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
        <input type="file" name="file" required accept="image/*" className="text-sm" />
        <input
          type="text"
          name="alt"
          required
          placeholder="Alt text (required) — e.g. \"Aerial view of Midpoint Midrand office park\""
          className="min-w-[280px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <button type="submit" className="rounded-full bg-midpoint-dark px-4 py-2 text-sm font-medium text-white">
          Upload
        </button>
      </form>

      {missingAltCount > 0 && (
        <p className="mt-4 text-sm text-amber-600">
          {missingAltCount} existing image{missingAltCount === 1 ? "" : "s"} uploaded before this requirement {""}
          {missingAltCount === 1 ? "is" : "are"} missing alt text — fill it in below.
        </p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {media.map((m) => (
          <div key={m.id} className="overflow-hidden rounded-xl bg-white shadow-sm">
            {m.mimeType.startsWith("image/") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.url} alt={m.alt || m.filename} className="h-32 w-full object-cover" />
            ) : (
              <div className="flex h-32 items-center justify-center bg-slate-100 text-xs text-slate-400">
                {m.mimeType}
              </div>
            )}
            <div className="p-3">
              <input
                readOnly
                value={m.url}
                onFocus={(e) => e.currentTarget.select()}
                className="w-full rounded border border-slate-200 px-2 py-1 text-xs"
              />
              <form action={updateMediaAlt.bind(null, m.id)} className="mt-2 flex gap-1">
                <input
                  type="text"
                  name="alt"
                  required
                  defaultValue={m.alt}
                  placeholder="Alt text"
                  className={`w-full rounded border px-2 py-1 text-xs ${
                    m.alt ? "border-slate-200" : "border-amber-400"
                  }`}
                />
                <button type="submit" className="whitespace-nowrap text-xs text-midpoint-dark underline">
                  Save
                </button>
              </form>
              <form action={deleteMedia.bind(null, m.id)} className="mt-2">
                <button className="text-xs text-red-600 underline">Delete</button>
              </form>
            </div>
          </div>
        ))}
        {media.length === 0 && <p className="col-span-full text-slate-400">No media uploaded yet.</p>}
      </div>
    </div>
  );
}
