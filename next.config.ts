import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        v8: false,
      };
    }
    return config;
  },
  turbopack: {},
};

export default nextConfig;
