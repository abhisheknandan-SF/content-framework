import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/content-framework',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
