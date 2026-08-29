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

const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30 MB

// POST /api/upload  (multipart/form-data with field "file")
// -> { url, key } : 回傳 R2 物件的公開 URL
export const onRequestPost: PagesFunction<Env> = async (context) => {
  const auth = await requireAuth(context.request, context.env);
  if (auth instanceof Response) return auth;

  const formData = await context.request.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) return errorJson('file 欄位為必填', 400);

  if (file.size > MAX_FILE_SIZE) {
    return errorJson('檔案大小超過上限 (30MB)', 400);
  }

  const mimeType = file.type?.toLowerCase() || '';
  const ext = EXT[mimeType];
  if (!ext) {
    return errorJson(`不支援的檔案格式: ${file.type || 'unknown'}。僅支援常見圖片與影片格式`, 400);
  }

  const key = `${crypto.randomUUID()}${ext}`;

  await context.env.MEDIA.put(key, file.stream(), {
    httpMetadata: { contentType: mimeType || 'application/octet-stream' },
  });

  return json({ url: `/media/${key}`, key });
};