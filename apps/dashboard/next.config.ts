import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["@pachanova/ui", "@pachanova/contracts", "@pachanova/integrations"],
  serverExternalPackages: ["@supabase/supabase-js", "dotenv", "postgres"],
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  turbopack: {
    root: path.resolve(__dirname, "../.."),
  },
};

export default nextConfig;
