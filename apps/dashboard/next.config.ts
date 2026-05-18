import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@pachanova/ui", "@pachanova/contracts", "@pachanova/integrations"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
