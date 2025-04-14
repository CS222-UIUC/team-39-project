import type { NextConfig } from "next";

const removeImports = require('next-remove-imports')();
module.exports = removeImports({});

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    // Add this to ignore TypeScript errors in react-markdown
    config.module.rules.push({
      test: /node_modules\/react-markdown/,
      use: 'ignore-loader',
    });
    
    return config;
  },
  typescript: {
    // This will completely disable TypeScript during builds
    ignoreBuildErrors: true,
  },
};
module.exports = nextConfig;

export default nextConfig;