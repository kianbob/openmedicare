import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/investigations/specialty-pay-gap',
        destination: '/investigations/specialty-gap',
        permanent: true,
      },
      {
        source: '/watchlist',
        destination: '/fraud/watchlist',
        permanent: true,
      },
      {
        source: '/markup-analysis',
        destination: '/markup',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
