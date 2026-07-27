import { mkdir, writeFile } from "fs/promises";
import path from "path";

// Defaults to a local `uploads` folder for `next dev`; in production
// (compose.prod.yml) this is set to /app/uploads, a persistent Docker volume
// so files survive rebuilds/redeploys.
export const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(process.cwd(), "uploads");

export async function saveUploadedFile(file: File): Promise<{
  filename: string;
  url: string;
  size: number;
  mimeType: string;
}> {
  await mkdir(UPLOADS_DIR, { recursive: true });

  const ext = path.extname(file.name) || "";
  const safeBase = path
    .basename(file.name, ext)
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .slice(0, 60);
  const filename = `${Date.now()}-${safeBase}${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOADS_DIR, filename), buffer);

  return {
    filename,
    url: `/api/uploads/${filename}`,
    size: buffer.byteLength,
    mimeType: file.type || "application/octet-stream",
  };
}
