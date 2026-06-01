import type { NextConfig } from "next";

const storageHost = process.env.NEXT_STORAGE_HOST?.trim() || "localhost";
const storagePort = process.env.NEXT_STORAGE_PORT?.trim() || "8000";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: storageHost,
        port: storagePort,
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: storageHost,
        port: storagePort,
        pathname: "/storage/**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();
