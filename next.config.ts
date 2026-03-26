import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingExcludes: {
    '*': [
      './public/data/providers/**',
      './public/data/fraud-features.json',
      './public/data/covid-test-billing.json',
      './public/data/wound-care.json',
    ],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
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
