import { NextRequest } from 'next/server';
import { handleRequest } from '@/lib/request-handler';

// Catch-all route handler
async function handler(req: NextRequest, props: { params: Promise<{ slug: string[] }> }) {
    const params = await props.params;
    return handleRequest(req, params);
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
export const HEAD = handler;
export const OPTIONS = handler;
