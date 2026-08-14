import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd().replace(/[\\/]apps[\\/]dashboard$/, ""),
  transpilePackages: ["@pachanova/ui", "@pachanova/contracts", "@pachanova/integrations"],
};

export default nextConfig;
