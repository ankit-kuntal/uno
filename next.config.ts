import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://example.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;
