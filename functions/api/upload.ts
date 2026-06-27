import { json, errorJson, type Env } from './lib/types';
import { requireAuth } from './lib/auth';

const EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'image/svg+xml': '.svg',
  'video/mp4': '.mp4',
  'video/webm': '.webm',
};

// POST /api/upload  (multipart/form-data with field "file")
// -> { url } : 回傳 R2 物件的公開 URL（透過 /media/ 路由或 R2 custom domain）
//   這裡回傳 /media/<key>（需要 R2 bucket public access 或 custom domain 設定）
export const onRequestPost: PagesFunction<Env> = async (context) => {
  const auth = await requireAuth(context.request, context.env);
  if (auth instanceof Response) return auth;

  const formData = await context.request.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) return errorJson('file 欄位為必填', 400);

  const ext = EXT[file.type] || '.' + (file.name.split('.').pop() || 'bin');
  const key = `uploads/${crypto.randomUUID()}${ext}`;

  await context.env.MEDIA.put(key, file.stream(), {
    httpMetadata: { contentType: file.type || 'application/octet-stream' },
  });

  return json({ url: `/media/${key}`, key });
};