import { rowToBlog, json, errorJson, type Env, type BlogRow } from '../lib/types';
import { requireAuth } from '../lib/auth';

export const onRequestGet: PagesFunction<Env> = async ({ env, params }) => {
  const row = await env.DB.prepare('SELECT * FROM blog_posts WHERE id = ?')
    .bind(params.id as string)
    .first<BlogRow>();
  if (!row) return errorJson('Blog post not found', 404);
  return json(rowToBlog(row));
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
  const auth = await requireAuth(context.request, context.env);
  if (auth instanceof Response) return auth;

  const id = context.params.id as string;
  const body = await context.request.json<any>();

  await context.env.DB.prepare(
    `UPDATE blog_posts
        SET title=?, excerpt=?, content=?, date=?, category=?, image=?
      WHERE id=?`
  ).bind(
    body.title || '',
    body.excerpt || '',
    body.content || '',
    body.date || new Date().toISOString().split('T')[0],
    body.category || '',
    body.image || '',
    id,
  ).run();

  const row = await context.env.DB.prepare('SELECT * FROM blog_posts WHERE id = ?')
    .bind(id)
    .first<BlogRow>();
  if (!row) return errorJson('Blog post not found', 404);
  return json(rowToBlog(row));
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const auth = await requireAuth(context.request, context.env);
  if (auth instanceof Response) return auth;

  await context.env.DB.prepare('DELETE FROM blog_posts WHERE id = ?')
    .bind(context.params.id as string)
    .run();

  return json({ ok: true });
};