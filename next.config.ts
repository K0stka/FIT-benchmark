import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  reactCompiler: true,
  // Allow build to continue even if fonts can't be fetched (they'll use fallbacks)
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;