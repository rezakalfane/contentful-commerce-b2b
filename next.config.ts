import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
