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
// 對外提供 R2 物件串流，並設置長效快取與 Range (206) 分段載入支援
export const onRequestGet: PagesFunction<Env> = async ({ env, params, request }) => {
  const keySegments = params.key as string[];
  const key = Array.isArray(keySegments) ? keySegments.join('/') : String(keySegments || '');
  if (!key) return new Response('Not Found', { status: 404 });

  // 支援 Range Header (影片快進/分段載入) 與 If-None-Match (304)
  const object = await env.MEDIA.get(key, {
    range: request.headers,
    onlyIf: request.headers,
  });

  if (!object) return new Response('Not Found', { status: 404 });

  // Determine correct content type from extension
  const ext = '.' + key.split('.').pop()?.toLowerCase();
  const contentType = MIME_MAP[ext] || 'application/octet-stream';

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('Content-Type', contentType);
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  headers.set('ETag', object.httpEtag);
  headers.set('Accept-Ranges', 'bytes');
  headers.set('Access-Control-Allow-Origin', '*');

  if (!('body' in object)) {
    return new Response(null, {
      status: 304,
      headers,
    });
  }

  // 如果物件有 range 範圍，回傳 206 Partial Content
  const status = (object as any).range ? 206 : 200;

  return new Response(object.body, {
    status,
    headers,
  });
};