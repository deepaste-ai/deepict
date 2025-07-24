import 'server-only';
import fapiServer from '@/servers/fapi';
import { handle } from 'hono/vercel';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const GET = handle(fapiServer);
export const POST = handle(fapiServer);
export const PUT = handle(fapiServer);
export const PATCH = handle(fapiServer);
export const DELETE = handle(fapiServer);
export const HEAD = handle(fapiServer);
export const OPTIONS = handle(fapiServer);
