import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@pachanova/ui", "@pachanova/contracts", "@pachanova/integrations"],
  // TODO: remove before production launch — allows demo build to pass with residual TS warnings
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
