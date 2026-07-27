/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for a lean, self-contained Docker image (see Dockerfile).
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.prod.website-files.com" },
    ],
  },
  experimental: {
    // Default is 1MB, too small for image uploads via the Media library's
    // server action (app/admin/(protected)/media/actions.ts).
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};
module.exports = nextConfig;
