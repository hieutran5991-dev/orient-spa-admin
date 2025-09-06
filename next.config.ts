import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: process.env.NEXT_STORAGE_HOST!,
        port: process.env.NEXT_STORAGE_PORT!,
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: process.env.NEXT_STORAGE_HOST!,
        port: process.env.NEXT_STORAGE_PORT!,
        pathname: '/storage/**',
      },
    ],
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
