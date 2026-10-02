export function redirectDestination(toPath: string, requestUrl: string): URL {
  const source = new URL(requestUrl);
  const destination = new URL(toPath, source);
  if (!["http:", "https:"].includes(destination.protocol) || destination.username || destination.password) throw new Error("Use an HTTP or HTTPS redirect destination.");
  // Preserve campaign and other incoming query parameters, with explicit
  // destination values taking precedence.
  const explicitKeys = new Set(destination.searchParams.keys());
  for (const [key, value] of source.searchParams) {
    if (!explicitKeys.has(key)) destination.searchParams.append(key, value);
  }
  return destination;
}
