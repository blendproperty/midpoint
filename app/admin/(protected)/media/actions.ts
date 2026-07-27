"use server";

import { unlink } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { saveUploadedFile, UPLOADS_DIR } from "@/lib/uploads";
import { revalidatePath } from "next/cache";

export async function uploadMedia(formData: FormData) {
  const session = await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("No file selected");
  }

  const saved = await saveUploadedFile(file);
  await prisma.media.create({
    data: {
      filename: saved.filename,
      url: saved.url,
      mimeType: saved.mimeType,
      size: saved.size,
      uploadedById: session.sub,
    },
  });

  revalidatePath("/admin/media");
}

export async function deleteMedia(id: string) {
  await requireAdmin();
  const media = await prisma.media.findUnique({ where: { id } });
  if (media) {
    try {
      await unlink(path.join(UPLOADS_DIR, media.filename));
    } catch {
      // File already gone from disk — still remove the DB row below.
    }
  }
  await prisma.media.delete({ where: { id } });
  revalidatePath("/admin/media");
}
