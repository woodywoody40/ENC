import { requireAuth } from '../lib/auth';
import type { Env } from '../lib/types';

// GET /api/agent/trigger — proxy to BlogWriterAgent Worker (auth required)
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const auth = await requireAuth(context.request, context.env);
  if (auth instanceof Response) return auth;

  const agentWorkerUrl = 'https://woody-blog-agent.woody40814.workers.dev';
  const url = new URL(context.request.url);
  const action = url.searchParams.get('action') || 'write';

  try {
    const resp = await fetch(`${agentWorkerUrl}?action=${action}`);
    const data = await resp.json();
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
