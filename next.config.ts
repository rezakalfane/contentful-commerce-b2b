import type { NextConfig } from "next";

// In development, local tooling on localhost may frame the site too (the editor itself is always Contentful's web app).
const FRAME_ANCESTORS = `'self' https://app.contentful.com https://app.eu.contentful.com${process.env.NODE_ENV === "production" ? "" : " http://localhost:* https://localhost:*"}`;

const nextConfig: NextConfig = {
  // Only Contentful's web app may embed the site in a frame.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: `frame-ancestors ${FRAME_ANCESTORS}` },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      // Contentful asset delivery
      { protocol: "https", hostname: "images.ctfassets.net" },
      // BigCommerce product images
      { protocol: "https", hostname: "cdn11.bigcommerce.com" },
    ],
  },
};

export default nextConfig;
