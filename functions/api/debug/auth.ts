import { json, type Env } from '../lib/types';

// GET /api/debug/auth -> 檢查 request 中的 CF Access 相關 headers/cookies
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const cookieHeader = request.headers.get('Cookie') || '';
  const cfJwt = request.headers.get('Cf-Access-Jwt-Assertion');
  const cfAu = cookieHeader
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith('CF_AU='));

  const url = new URL(request.url);
  const isLocalDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname.endsWith('.localhost');

  return json({
    has_cf_jwt_header: !!cfJwt,
    cf_jwt_header_length: cfJwt?.length || 0,
    has_cf_au_cookie: !!cfAu,
    cf_au_cookie_length: cfAu ? cfAu.length - 'CF_AU='.length : 0,
    cookie_header_present: !!cookieHeader,
    cookie_names: cookieHeader
      ? cookieHeader.split(';').map((c) => c.trim().split('=')[0])
      : [],
    team: env.CF_ACCESS_TEAM,
    aud: env.CF_ACCESS_AUD ? env.CF_ACCESS_AUD.slice(0, 12) + '...' : '(not set)',
    is_local_dev: isLocalDev,
  });
};