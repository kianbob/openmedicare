import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/investigations/specialty-pay-gap',
        destination: '/investigations/specialty-gap',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
