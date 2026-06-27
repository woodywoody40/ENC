import { json, errorJson, type Env } from '../lib/types';
import { requireAuth } from '../lib/auth';

// PUT /api/config/:key  { value: "..." }   (需 Access)
export const onRequestPut: PagesFunction<Env> = async (context) => {
  const auth = await requireAuth(context.request, context.env);
  if (auth instanceof Response) return auth;

  const key = context.params.key as string;
  const body = await context.request.json<any>();
  const value = typeof body === 'string' ? body : body?.value ?? '';

  await context.env.DB.prepare(
    `INSERT INTO site_configs (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`
  ).bind(key, String(value)).run();

  return json({ key, value: String(value) });
};