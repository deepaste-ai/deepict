# Cloudflare Container Deployment Guide

This guide explains how to deploy Deepict to Cloudflare Workers using Containers and Durable Objects.

## Architecture Overview

Cloudflare Containers use Durable Objects to run containerized applications. The architecture consists of:

1. **Worker Entry Point** (`src/cf-worker.ts`): Manages container lifecycle and routing
2. **Container Class** (`DeepictContainer`): Extends the Container base class to configure the container
3. **Dockerfile** (`Dockerfile.cloudflare`): Builds the Next.js application container
4. **Configuration** (`wrangler.json`): Cloudflare deployment configuration

## Prerequisites

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Authenticate with Cloudflare:
   ```bash
   wrangler login
   ```

3. Ensure Docker is installed and running on your system.

## Configuration Files

### wrangler.json
The main configuration file for Cloudflare deployment:
- Container class: `DeepictContainer`
- Durable Object binding: `DEEPICT_CONTAINER`
- Max instances: 10
- Uses nodejs_compat for Node.js compatibility

### src/cf-worker.ts
The Worker entry point that:
- Defines the container class with lifecycle hooks
- Routes all requests to the container instance
- Configures container port (3000) and sleep timeout (5m)

### Dockerfile.cloudflare
Optimized Dockerfile for Cloudflare Containers:
- Based on Node.js 20 Alpine
- Multi-stage build for smaller image size
- Runs Next.js in standalone mode
- Exposes port 3000 (matches container configuration)

## Deployment Steps

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Test locally with Wrangler:**
   ```bash
   pnpm cf:dev
   ```

3. **Deploy to Cloudflare:**
   ```bash
   pnpm cf:deploy
   ```

4. **View logs:**
   ```bash
   pnpm cf:logs
   ```

5. **Generate TypeScript types:**
   ```bash
   pnpm cf:types
   ```

## Available Scripts

- `pnpm cf:deploy` - Deploy to Cloudflare Workers
- `pnpm cf:dev` - Run locally with Wrangler
- `pnpm cf:logs` - Tail production logs
- `pnpm cf:types` - Generate TypeScript types for bindings

## Container Lifecycle

The container has the following lifecycle hooks:

- **onStart()**: Called when the container starts
- **onStop()**: Called when the container shuts down
- **onError()**: Called when the container encounters an error

The container will automatically sleep after 5 minutes of inactivity to save resources.

## Health Check

The application includes a health check endpoint at `/api/health` that returns:
- Status (healthy/unhealthy)
- Timestamp
- Version information
- Environment details
- Memory usage
- Available features

## Environment Variables

The container receives these environment variables:
- `NODE_ENV=production`
- `DEPLOYMENT_TARGET=web`
- `NEXT_TELEMETRY_DISABLED=1`
- `PORT=3000`
- `HOSTNAME=0.0.0.0`

## Troubleshooting

1. **Container Build Issues:** Ensure Docker is running and the Dockerfile builds successfully
2. **Deployment Errors:** Check `wrangler.json` configuration and authentication
3. **Runtime Errors:** Check logs with `pnpm cf:logs`
4. **Type Errors:** Run `pnpm cf:types` to generate updated type definitions

## Notes

- Containers run in Durable Objects with automatic scaling
- Each container instance can handle multiple requests
- Containers automatically sleep after inactivity to save resources
- The Worker routes all requests to a single container instance (singleton pattern)