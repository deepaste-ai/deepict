# Cloudflare Deployment Guide (OpenNext)

This guide explains how to deploy Deepict to Cloudflare Workers using the OpenNext adapter.

## Overview

This deployment uses [@opennextjs/cloudflare](https://opennext.js.org/cloudflare) adapter to run Next.js applications on Cloudflare Workers without Docker containers, providing faster builds and deployments.

## Prerequisites

1. **Node.js 18+** installed
2. **pnpm** package manager
3. **Cloudflare account** with Workers enabled
4. **Wrangler CLI** (installed as dev dependency)

## Configuration Files

### wrangler.toml
Main configuration for Cloudflare Workers:
```toml
main = ".open-next/worker.js"
name = "deepict"
compatibility_date = "2025-03-25"
compatibility_flags = ["nodejs_compat"]

[vars]
NODE_ENV = "production"
DEPLOYMENT_TARGET = "web"

[assets]
directory = ".open-next/assets"
binding = "ASSETS"
```

### open-next.config.ts
OpenNext adapter configuration:
```typescript
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig();
```

## Development Workflow

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Local Development (Next.js Dev Server)
```bash
pnpm dev
```
This uses the Next.js development server for the best developer experience.

### 3. Preview with Cloudflare Runtime
```bash
pnpm preview
```
This builds and runs your app in the Cloudflare Workers runtime locally.

### 4. Deploy to Production
```bash
pnpm deploy
```
This builds and deploys your app to Cloudflare Workers.

## Available Scripts

- `pnpm dev` - Start Next.js development server
- `pnpm cf:build` - Build with optimizations for Cloudflare
- `pnpm cf:preview` - Build and preview in Cloudflare runtime
- `pnpm cf:deploy` - Build and deploy to Cloudflare Workers
- `pnpm cf:typegen` - Generate TypeScript types for Cloudflare bindings
- `pnpm cf:logs` - Tail production logs

## Custom Domain Setup

The custom domain is configured in `wrangler.toml`:
```toml
routes = [
  { pattern = "deepict.deepaste.ai", custom_domain = true }
]
```

To use a different domain:
1. Update the `pattern` in `wrangler.toml`
2. Ensure the domain is managed by Cloudflare
3. Deploy the application

## Environment Variables

Environment variables are set in the `[vars]` section of `wrangler.toml`:
- `NODE_ENV=production`
- `DEPLOYMENT_TARGET=web`

For sensitive data, use Cloudflare secrets:
```bash
wrangler secret put API_KEY
```

## Troubleshooting

### Build Issues
- Ensure you're using Node.js 18 or later
- Run `pnpm install` to update dependencies
- Clear the build cache: `rm -rf .open-next`

### Deployment Errors
- Check `wrangler.toml` configuration
- Verify Cloudflare authentication: `wrangler login`
- Check compatibility date and flags

### Runtime Errors
- View logs: `pnpm cf:logs`
- Check browser console for client-side errors
- Verify API endpoints are working

## Performance Benefits

Using OpenNext adapter provides:
- **Faster builds** - No Docker image creation
- **Quick deployments** - Direct Worker upload
- **Better cold starts** - Optimized for Workers runtime
- **Native Workers features** - Full access to Cloudflare APIs

## Build Optimizations

The build process uses optimizations from `next.config.web.ts`:
- **Chunk Splitting** - Reduces number of JS files
- **Vendor Bundling** - Groups dependencies for better caching
- **SWC Minification** - Faster and better compression
- **Package Optimization** - Only imports used components

To ensure optimizations are applied:
1. The build script copies `next.config.web.ts` to `next.config.ts`
2. Sets `DEPLOYMENT_TARGET=web` environment variable
3. Runs OpenNext build with production optimizations

## Monitoring

After deployment:
1. Check deployment status in Cloudflare dashboard
2. Monitor performance metrics
3. Set up alerts for errors
4. Use `pnpm cf:logs` for real-time logs

## Notes

- The adapter handles all Next.js features including SSR, SSG, and API routes
- Static assets are served through Workers Assets
- The build output is in `.open-next` directory
- Compatible with Next.js 13+ App Router and Pages Router