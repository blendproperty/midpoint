import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { UPLOADS_DIR } from "@/lib/uploads";

const MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;
  const requested = segments.join("/");

  // Prevent path traversal outside the uploads directory.
  const resolvedUploadsDir = path.normalize(UPLOADS_DIR);
  const resolved = path.normalize(path.join(resolvedUploadsDir, requested));
  if (!resolved.startsWith(resolvedUploadsDir)) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  try {
    const buffer = await readFile(resolved);
    const ext = path.extname(resolved).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    // NextResponse's BodyInit type doesn't include Node's Buffer, even though
    // it works fine at runtime (Buffer is a Uint8Array). Wrap explicitly to
    // satisfy the type checker.
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
