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
  webpack: (config, { isServer }) => {
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
      },
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    existingSVGRule.exclude = /\.svg$/i;

    // Production optimizations
    if (!isServer && isWeb) {
      // Optimize chunk splitting for production
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk for all node_modules
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 10,
            },
            // Common chunk for code used in multiple places
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 5,
              reuseExistingChunk: true,
              enforce: true,
            },
            // Mantine components in a separate chunk
            mantine: {
              name: 'mantine',
              test: /[\\/]node_modules[\\/]@mantine[\\/]/,
              chunks: 'all',
              priority: 20,
            },
            // AI SDK in a separate chunk
            ai: {
              name: 'ai',
              test: /[\\/]node_modules[\\/](@ai-sdk|ai)[\\/]/,
              chunks: 'all',
              priority: 15,
            },
          },
        },
        // Minimize number of chunks
        runtimeChunk: 'single',
        moduleIds: 'deterministic',
      };
    }

    return config;
  },
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks', '@tabler/icons-react'],
  },
  // Move serverExternalPackages to the root level
  serverExternalPackages: ['sharp'],
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
    
    // Optimize images
    images: {
      minimumCacheTTL: 60,
      formats: ['image/webp'],
    },
    
    // Enable build cache
    cacheHandler: process.env.NODE_ENV === 'production' ? undefined : undefined,
    cacheMaxMemorySize: 0, // Disable in-memory caching

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
