import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: "dist",
  images: {
    unoptimized: false,
  },
  experimental: {
    optimizePackageImports: ["gravity-uikit"],
  },
};

export default nextConfig;
