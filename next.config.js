/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for a lean, self-contained Docker image (see Dockerfile).
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.prod.website-files.com" },
    ],
  },
};
module.exports = nextConfig;
