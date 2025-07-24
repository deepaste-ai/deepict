import { NextResponse } from 'next/server';

export async function GET() {
  const healthInfo = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '0.1.0',
    environment: process.env.NODE_ENV || 'development',
    platform: process.env.DEPLOYMENT_TARGET || 'web',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    features: {
      anthropicAPI: !!process.env.ANTHROPIC_API_KEY,
      sse: true,
      fileUpload: true,
    },
  };

  return NextResponse.json(healthInfo, {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    },
  });
}

export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    },
  });
}
