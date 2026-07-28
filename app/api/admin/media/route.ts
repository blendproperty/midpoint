import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { saveUploadedFile } from "@/lib/uploads";

// Backs components/admin/MediaPicker.tsx — lets forms browse/upload media
// inline instead of needing to open /admin/media in another tab and copy a
// URL by hand. Already covered by middleware.ts's /api/admin/:path* guard,
// requireAdmin() here is defense-in-depth.
export async function GET() {
  await requireAdmin();
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return NextResponse.json({ media });
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No file selected" }, { status: 400 });
  }

  const saved = await saveUploadedFile(file);
  const media = await prisma.media.create({
    data: {
      filename: saved.filename,
      url: saved.url,
      mimeType: saved.mimeType,
      size: saved.size,
      uploadedById: session.sub,
    },
  });

  return NextResponse.json({ media });
}
