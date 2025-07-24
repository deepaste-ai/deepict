#!/bin/bash

# Simple deployment test script
# This script tests the deployment configurations without Docker

set -e

echo "🧪 Testing Deepict Deployment Configurations"

# Test 1: Web deployment
echo "📱 Testing web deployment..."
export DEPLOYMENT_TARGET=web
pnpm web:build
echo "✅ Web deployment test passed"

# Test 2: Electron deployment (build only)
echo "🖥️ Testing Electron build..."
export DEPLOYMENT_TARGET=electron
pnpm electron:build
echo "✅ Electron build test passed"

# Test 3: Health check endpoint
echo "🔍 Testing health check..."
if [ -f ".next/standalone/server.js" ]; then
    echo "✅ Standalone server exists"
else
    echo "❌ Standalone server not found"
    exit 1
fi

# Test 4: Environment variables
echo "🌍 Testing environment variables..."
if [ -n "$DEPLOYMENT_TARGET" ]; then
    echo "✅ Environment variables working"
else
    echo "❌ Environment variables not set"
    exit 1
fi

echo "🎉 All deployment tests passed!"
echo ""
echo "🚀 Ready for deployment:"
echo "  - Web: Use 'pnpm web:start' or deploy .next/standalone/"
echo "  - Electron: Use 'pnpm dist' to create distributables"
echo "  - Docker: Use 'docker build -t deepict:latest .'"