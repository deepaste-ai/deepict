import type { NextConfig } from 'next';
import path from 'node:path';

// Determine deployment target
const isElectron = process.env.DEPLOYMENT_TARGET === 'electron';
const isWeb = process.env.DEPLOYMENT_TARGET === 'web' || !isElectron;

const nextConfig: NextConfig = {
  sassOptions: {
    implementation: 'sass-embedded',
    additionalData: `@use "${path.join(process.cwd(), 'src/styles/_mantine').replace(/\\/g, '/')}" as mantine;`,
  },
  compiler: {
    emotion: true,
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              icon: true,
            },
          },
        ],
        as: '*.js',
      },
    },
  },
  webpack: (config) => {
    // Grab the existing rule that handles SVG imports
    const existingSVGRule = config.module.rules.find((rule: any) => rule.test?.test?.('.svg'));

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...existingSVGRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: existingSVGRule.issuer,
        resourceQuery: { not: [...existingSVGRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              icon: true,
            },
          },
        ],
      }
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    existingSVGRule.exclude = /\.svg$/i;

    // Environment variables are already handled by Next.js
    // No need to manually add DefinePlugin

    return config;
  },
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
  // Use standalone for both Electron and web deployment
  output: 'standalone',

  // Environment variables
  env: {
    IS_ELECTRON: isElectron.toString(),
    IS_WEB: isWeb.toString(),
    DEPLOYMENT_TARGET: process.env.DEPLOYMENT_TARGET || 'web',
  },

  // Web-specific configurations
  ...(isWeb && {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: '/fapi/:path*',
        },
      ];
    },

    // Enable compression for web deployment
    compress: true,

    // Production optimizations for web
    productionBrowserSourceMaps: false,

    // Security headers for web deployment
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-Frame-Options',
              value: 'DENY',
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'Referrer-Policy',
              value: 'strict-origin-when-cross-origin',
            },
            {
              key: 'X-XSS-Protection',
              value: '1; mode=block',
            },
          ],
        },
      ];
    },
  }),
};

export default nextConfig;

// Log the deployment target for debugging
console.log(`🚀 Building for: ${isElectron ? 'Electron' : 'Web'} deployment`);
if (isWeb) {
  console.log('📦 Web deployment features enabled: compression, security headers, API rewrites');
}
