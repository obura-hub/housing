import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.bomayangu.go.ke',
      },
      {
        protocol: 'https',
        hostname: 'bomayangu.go.ke',
      },
    ],
  },
};

export default nextConfig;
