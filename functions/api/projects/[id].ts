import { rowToProject, json, errorJson, type Env, type ProjectRow } from '../lib/types';
import { requireAuth } from '../lib/auth';

// GET /api/projects/:id
// PUT /api/projects/:id   (需 Access)
// DELETE /api/projects/:id (需 Access)
export const onRequestGet: PagesFunction<Env> = async ({ env, params }) => {
  const row = await env.DB.prepare('SELECT * FROM projects WHERE id = ?')
    .bind(params.id as string)
    .first<ProjectRow>();
  if (!row) return errorJson('Project not found', 404);
  return json(rowToProject(row));
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
  const auth = await requireAuth(context.request, context.env);
  if (auth instanceof Response) return auth;

  const id = context.params.id as string;
  const body = await context.request.json<any>();

  const tags = JSON.stringify(body.tags || []);
  const media = JSON.stringify(body.media || []);

  await context.env.DB.prepare(
    `UPDATE projects
       SET title=?, description=?, details=?, image=?, tags=?, link=?, media=?, type=?
     WHERE id=?`
  ).bind(
    body.title || '',
    body.description || '',
    body.details || '',
    body.image || '',
    tags,
    body.link || '',
    media,
    body.type || '',
    id,
  ).run();

  const row = await context.env.DB.prepare('SELECT * FROM projects WHERE id = ?')
    .bind(id)
    .first<ProjectRow>();
  if (!row) return errorJson('Project not found', 404);
  return json(rowToProject(row));
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const auth = await requireAuth(context.request, context.env);
  if (auth instanceof Response) return auth;

  await context.env.DB.prepare('DELETE FROM projects WHERE id = ?')
    .bind(context.params.id as string)
    .run();

  return json({ ok: true });
};