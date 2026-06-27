import type { Env } from '../api/lib/types';

// GET /media/uploads/<key>
// 對外提供 R2 物件，並設置長效快取
export const onRequestGet: PagesFunction<Env> = async ({ env, params }) => {
  const key = (params.key as string) || '';
  if (!key) return new Response('Not Found', { status: 404 });

  const object = await env.MEDIA.get(key);
  if (!object) return new Response('Not Found', { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  headers.set('ETag', object.httpEtag);

  return new Response(object.body, { headers });
};