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
  async redirects() {
    return [
      // Legacy Webflow unit pages that map cleanly to a current listing.
      {
        source: "/units/8-sunbird",
        destination: "/vacancies/cms4oiw4s0003n601ccyt2r1q",
        permanent: true,
      },
      {
        source: "/units/1-kingfisher",
        destination: "/vacancies/cmsfvflhj0010oy014b1ytkku",
        permanent: true,
      },
      {
        source: "/units/stand-3-2-kingfisher",
        destination: "/vacancies/cmsfvflha000zoy01wxkk2efu",
        permanent: true,
      },
      // Legacy unit pages from an older numbering scheme with no clear
      // current equivalent — send to the vacancies listing rather than
      // guess wrong.
      {
        source: "/units/unit2",
        destination: "/vacancies",
        permanent: true,
      },
      {
        source: "/units/unit-1",
        destination: "/vacancies",
        permanent: true,
      },
      {
        source: "/units/unit-1-2",
        destination: "/vacancies",
        permanent: true,
      },
      {
        source: "/units/unit-2-2",
        destination: "/vacancies",
        permanent: true,
      },
      {
        source: "/units/unit-3",
        destination: "/vacancies",
        permanent: true,
      },
      {
        source: "/units/unit-3-3",
        destination: "/vacancies",
        permanent: true,
      },
      {
        source: "/units/unit-5",
        destination: "/vacancies",
        permanent: true,
      },
      {
        source: "/units/unit-6",
        destination: "/vacancies",
        permanent: true,
      },
      {
        source: "/units/unit-6-1",
        destination: "/vacancies",
        permanent: true,
      },
      {
        source: "/units/unit-8",
        destination: "/vacancies",
        permanent: true,
      },
      {
        source: "/units/unit-7-1-loerie",
        destination: "/vacancies",
        permanent: true,
      },
      {
        source: "/units/stand-3",
        destination: "/vacancies",
        permanent: true,
      },
      {
        source: "/units/stand11",
        destination: "/vacancies",
        permanent: true,
      },
      {
        source: "/units/corporate-apartments",
        destination: "/vacancies",
        permanent: true,
      },
    ];
  },
};
module.exports = nextConfig;
