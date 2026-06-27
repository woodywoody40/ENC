import { jwtVerify, createRemoteJWKSet } from 'jose';
import type { Env } from './types';

/**
 * Cloudflare Access JWT 驗證
 * - JWT 由 CF Access 於登入後注入至 `Cf-Access-Jwt-Assertion` header
 * - 使用 CF Team domain 的公鑰 (JWKS) 進行簽章驗證
 * - 也檢查 audience (AUD) 是否符合本應用
 */
function extractTokens(request: Request): string[] {
  const tokens: string[] = [];
  const headerToken = request.headers.get('Cf-Access-Jwt-Assertion');
  if (headerToken) tokens.push(headerToken);

  // Access 登入後會在 domain 寫入 CF_Authorization cookie（JWT 內容），所有 fetch 皆會攜帶
  const cookieHeader = request.headers.get('Cookie') || '';
  const cfAuthCookie = cookieHeader
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith('CF_Authorization='));
  if (cfAuthCookie) tokens.push(decodeURIComponent(cfAuthCookie.slice('CF_Authorization='.length)));

  return tokens;
}

export async function verifyAccess(request: Request, env: Env): Promise<{ email: string } | null> {
  // 本地開發環境 (localhost) 自動放行，免去 CF Access 驗證
  const url = new URL(request.url);
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname.endsWith('.localhost')) {
    return { email: 'local-dev@example.com' };
  }

  const tokens = extractTokens(request);
  if (tokens.length === 0) return null;

  const team = env.CF_ACCESS_TEAM?.replace(/^https?:\/\//, '');
  if (!team || !env.CF_ACCESS_AUD || env.CF_ACCESS_AUD.startsWith('REPLACE')) {
    // 未設定時 fallback：僅檢查 token 存在（仍仰賴 Access policy 把關）
    return { email: '(access-not-configured)' };
  }

  let lastError: any = null;
  for (const token of tokens) {
    try {
      const jwks = createRemoteJWKSet(new URL(`https://${team}/cdn-cgi/access/certs`));
      const { payload } = await jwtVerify(token, jwks, {
        audience: env.CF_ACCESS_AUD,
        issuer: `https://${team}`,
      });
      const email =
        (payload as any).email ??
        (Array.isArray(payload.amr) ? payload.amr[0] : 'unknown');
      return { email: String(email) };
    } catch (err) {
      lastError = err;
    }
  }
  console.error('Access verify failed:', lastError?.message, lastError?.code);
  return null;
}

export function requireAuth(request: Request, env: Env): Promise<Response | { email: string }> {
  return verifyAccess(request, env).then((r) => {
    if (!r) {
      return Promise.reject(errorJsonResponse('Unauthorized: Cloudflare Access 驗證失敗', 401));
    }
    return r;
  });
}

function errorJsonResponse(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}