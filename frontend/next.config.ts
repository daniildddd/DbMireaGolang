import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: "dist",
  images: {
    unoptimized: false,
  },
  experimental: {
    optimizePackageImports: ["@gravity-ui/uikit"],
  },
};

export default nextConfig;
