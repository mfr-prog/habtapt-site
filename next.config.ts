import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'motion', '@radix-ui/react-accordion', '@radix-ui/react-dialog', '@radix-ui/react-tabs'],
  },
};

export default nextConfig;
