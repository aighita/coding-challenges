import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'http://gateway:8080/:path*',
      },
      // Direct mapping for challenges if preferred, but let's use a prefix to be clear
      // Or we can map /challenges/* to http://gateway:8080/challenges/*
      // But wait, /challenges is also a frontend route.
      // So we MUST use a prefix for API calls.
    ];
  },
};

export default nextConfig;
