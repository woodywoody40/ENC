import { rowToProject, json, errorJson, randomId, type Env, type ProjectRow } from '../lib/types';
import { requireAuth } from '../lib/auth';

// GET /api/projects          -> 列出全部（依 created_at desc）
// POST /api/projects         -> 新增（需 Access 認證）
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const result = await env.DB.prepare('SELECT * FROM projects ORDER BY created_at DESC').all<ProjectRow>();
  return json((result.results || []).map(rowToProject));
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const auth = await requireAuth(context.request, context.env);
  if (auth instanceof Response) return auth;

  const body = await context.request.json<any>();
  if (!body?.title) return errorJson('title 為必填', 400);

  const id = body.id || randomId();
  const tags = JSON.stringify(body.tags || []);
  const media = JSON.stringify(body.media || []);

  await context.env.DB.prepare(
    `INSERT INTO projects (id, title, description, details, image, tags, link, media, type, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`
  ).bind(
    id,
    body.title,
    body.description || '',
    body.details || '',
    body.image || '',
    tags,
    body.link || '',
    media,
    body.type || '',
  ).run();

  const inserted = await context.env.DB.prepare('SELECT * FROM projects WHERE id = ?')
    .bind(id)
    .first<ProjectRow>();

  return json(rowToProject(inserted as ProjectRow), 201);
};