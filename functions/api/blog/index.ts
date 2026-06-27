import { rowToBlog, json, errorJson, randomId, type Env, type BlogRow } from '../lib/types';
import { requireAuth } from '../lib/auth';

// GET /api/blog
// POST /api/blog
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const result = await env.DB.prepare('SELECT * FROM blog_posts ORDER BY date DESC').all<BlogRow>();
  return json((result.results || []).map(rowToBlog));
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const auth = await requireAuth(context.request, context.env);
  if (auth instanceof Response) return auth;

  const body = await context.request.json<any>();
  if (!body?.title) return errorJson('title 為必填', 400);

  const id = body.id || randomId();
  await context.env.DB.prepare(
    `INSERT INTO blog_posts (id, title, excerpt, content, date, category, image)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id,
    body.title,
    body.excerpt || '',
    body.content || '',
    body.date || new Date().toISOString().split('T')[0],
    body.category || '',
    body.image || '',
  ).run();

  const row = await context.env.DB.prepare('SELECT * FROM blog_posts WHERE id = ?')
    .bind(id)
    .first<BlogRow>();
  return json(rowToBlog(row as BlogRow), 201);
};