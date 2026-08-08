import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    cpus: 1,
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
