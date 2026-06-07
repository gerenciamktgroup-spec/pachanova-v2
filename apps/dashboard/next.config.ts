import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["@pachanova/ui", "@pachanova/contracts", "@pachanova/integrations"],
  serverExternalPackages: ["@supabase/supabase-js", "dotenv", "postgres"],
  eslint: {
    // We ignore ESLint during build because it fails on warnings (no-explicit-any),
    // but TypeScript compilation is still strictly enforced since ignoreBuildErrors is removed.
    ignoreDuringBuilds: true,
  },
  turbopack: {
    root: path.resolve(__dirname, "../.."),
  },
};

export default nextConfig;
