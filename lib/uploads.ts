import { mkdir, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";

// Defaults to a local `uploads` folder for `next dev`; in production this is
// a persistent Docker volume so files survive rebuilds and redeploys.
export const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(process.cwd(), "uploads");

const MAX_IMAGE_DIMENSION = 2000;
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const WEBP_QUALITY = 82;
const OPTIMIZABLE_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/tiff",
]);

export async function optimizeImageBuffer(bytes: Uint8Array) {
  return sharp(bytes)
    .rotate()
    .resize({
      width: MAX_IMAGE_DIMENSION,
      height: MAX_IMAGE_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY, effort: 4, smartSubsample: true })
    .toBuffer();
}

export async function saveUploadedFile(file: File): Promise<{
  filename: string;
  url: string;
  size: number;
  mimeType: string;
}> {
  await mkdir(UPLOADS_DIR, { recursive: true });

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("File is too large. Upload a file smaller than 10 MB.");
  }

  const originalExtension = path.extname(file.name) || "";
  const safeBase = path
    .basename(file.name, originalExtension)
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .slice(0, 60);
  const uploadedBytes = new Uint8Array(await file.arrayBuffer());
  const normalizedMimeType = file.type.toLowerCase();
  const imageExtension = /^\.(jpe?g|png|webp|avif|tiff?)$/i.test(originalExtension);
  const isImage = OPTIMIZABLE_IMAGE_TYPES.has(normalizedMimeType) || imageExtension;

  if (normalizedMimeType.startsWith("image/") && !isImage) {
    throw new Error("Unsupported image type. Upload a JPEG, PNG, WebP, AVIF or TIFF image.");
  }

  const storedBytes = isImage ? await optimizeImageBuffer(uploadedBytes) : uploadedBytes;
  const storedExtension = isImage ? ".webp" : originalExtension;
  const storedMimeType = isImage ? "image/webp" : file.type || "application/octet-stream";
  const filename = `${Date.now()}-${safeBase}${storedExtension}`;

  await writeFile(path.join(UPLOADS_DIR, filename), new Uint8Array(storedBytes));

  return {
    filename,
    url: `/api/uploads/${filename}`,
    size: storedBytes.byteLength,
    mimeType: storedMimeType,
  };
}
