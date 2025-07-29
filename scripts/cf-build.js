#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Preparing Cloudflare build with optimizations...');

// 1. Copy optimized config
console.log('📋 Copying optimized Next.js config...');
const configSrc = path.join(__dirname, '..', 'next.config.web.ts');
const configDest = path.join(__dirname, '..', 'next.config.ts');
fs.copyFileSync(configSrc, configDest);

// 2. Set environment variables
process.env.DEPLOYMENT_TARGET = 'web';
process.env.NODE_ENV = 'production';

console.log('🏗️  Building with OpenNext Cloudflare adapter...');
console.log('   DEPLOYMENT_TARGET:', process.env.DEPLOYMENT_TARGET);
console.log('   NODE_ENV:', process.env.NODE_ENV);

// 3. Run OpenNext build
try {
  execSync('opennextjs-cloudflare build', {
    stdio: 'inherit',
    env: process.env
  });
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}