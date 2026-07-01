import type { Env } from '../api/lib/types';

const MIME_MAP: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

// GET /media/...key
// 對外提供 R2 物件，並設置長效快取
export const onRequestGet: PagesFunction<Env> = async ({ env, params, request }) => {
  // [...key] 是 splat parameter，會是字串陣列，將各段用 / 組合
  const keySegments = params.key as string[];
  const key = Array.isArray(keySegments) ? keySegments.join('/') : (keySegments as any) || '';
  if (!key) return new Response('Not Found', { status: 404 });

  const object = await env.MEDIA.get(key);
  if (!object) return new Response('Not Found', { status: 404 });

  // Determine correct content type from extension
  const ext = '.' + key.split('.').pop()?.toLowerCase();
  const contentType = MIME_MAP[ext] || 'application/octet-stream';

  // Read body as ArrayBuffer
  const body = await object.arrayBuffer();

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'ETag': object.httpEtag,
      'Access-Control-Allow-Origin': '*',
    },
  });
};