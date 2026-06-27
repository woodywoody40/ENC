import { json, type Env } from '../lib/types';
import { verifyAccess } from '../lib/auth';

// GET /api/auth/me -> { authenticated, email }
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const user = await verifyAccess(request, env);
  if (!user) return json({ authenticated: false }, 401);
  return json({ authenticated: true, email: user.email });
};