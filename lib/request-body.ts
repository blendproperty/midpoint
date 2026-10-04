export class RequestBodyError extends Error {
  constructor(message: string, readonly status: number) { super(message); }
}

// Bound streamed bytes too: Content-Length is optional and cannot be trusted.
export async function readBoundedJson(request: Request, maxBytes = 64 * 1024): Promise<Record<string, unknown>> {
  const length = Number(request.headers.get("content-length"));
  if (Number.isFinite(length) && length > maxBytes) throw new RequestBodyError("Request too large.", 413);
  if (!request.body) throw new RequestBodyError("Invalid JSON request.", 400);
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        throw new RequestBodyError("Request too large.", 413);
      }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  let result: unknown;
  try { result = JSON.parse(new TextDecoder().decode(bytes)); }
  catch { throw new RequestBodyError("Invalid JSON request.", 400); }
  if (!result || typeof result !== "object" || Array.isArray(result)) throw new RequestBodyError("Expected a JSON object.", 400);
  return result as Record<string, unknown>;
}
