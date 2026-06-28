import type { Env } from '../api/lib/types';

// GET /media/...key
// 對外提供 R2 物件，並設置長效快取
export const onRequestGet: PagesFunction<Env> = async ({ env, params, request }) => {
  // [...key] 是 splat parameter，會是字串陣列，將各段用 / 組合
  const keySegments = params.key as string[];
  const key = Array.isArray(keySegments) ? keySegments.join('/') : (keySegments as any) || '';
  if (!key) return new Response('Not Found', { status: 404 });

  const object = await env.MEDIA.get(key);
  if (!object) return new Response('Not Found', { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  headers.set('ETag', object.httpEtag);

  return new Response(object.body, {
    headers,
    status: 200,
  });
};