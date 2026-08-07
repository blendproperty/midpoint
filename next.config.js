/** @type {import('next').NextConfig} */
const nextConfig = {
  // Distinguish each production build so an open browser tab cannot mix
  // navigation data and static chunks from different Docker deployments.
  // Next.js will force a full navigation when it detects version skew.
  deploymentId: process.env.NEXT_DEPLOYMENT_ID || undefined,
  // Required for a lean, self-contained Docker image (see Dockerfile).
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2592000,
    remotePatterns: [
      { protocol: "https", hostname: "cdn.prod.website-files.com" },
      { protocol: "https", hostname: "listings.blendproperty.co.za" },
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
