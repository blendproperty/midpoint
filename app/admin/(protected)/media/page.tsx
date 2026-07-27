import { prisma } from "@/lib/prisma";
import { uploadMedia, deleteMedia } from "./actions";

export const dynamic = "force-dynamic";

export default async function MediaAdminPage() {
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-2xl font-semibold">Media</h1>
      <p className="mt-1 text-sm text-slate-500">
        Upload images here, then copy the URL into the Image field on a blog post, page, or vacancy.
      </p>

      <form action={uploadMedia} className="mt-6 flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
        <input type="file" name="file" required accept="image/*" className="text-sm" />
        <button type="submit" className="rounded-full bg-midpoint-dark px-4 py-2 text-sm font-medium text-white">
          Upload
        </button>
      </form>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {media.map((m) => (
          <div key={m.id} className="overflow-hidden rounded-xl bg-white shadow-sm">
            {m.mimeType.startsWith("image/") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.url} alt={m.filename} className="h-32 w-full object-cover" />
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
