import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd().replace(/[\\/]apps[\\/]web$/, ""),
  transpilePackages: ["@pachanova/ui", "@pachanova/contracts", "@pachanova/integrations"],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
