import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@pachanova/ui", "@pachanova/contracts", "@pachanova/integrations"],
};

export default nextConfig;
