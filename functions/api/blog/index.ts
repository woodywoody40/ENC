import { rowToBlog, rowToBlogSummary, json, errorJson, randomId, PUBLIC_CACHE, type Env, type BlogRow } from '../lib/types';
import { requireAuth } from '../lib/auth';

// GET /api/blog  — list without full content
// POST /api/blog — create (auth required)
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const result = await env.DB.prepare(
    'SELECT id, title, excerpt, date, category, image FROM blog_posts ORDER BY date DESC',
  ).all<Pick<BlogRow, 'id' | 'title' | 'excerpt' | 'date' | 'category' | 'image'>>();

  const rows = (result.results || []).map((r) =>
    rowToBlogSummary({
      id: r.id,
      title: r.title,
      excerpt: r.excerpt,
      content: null,
      date: r.date,
      category: r.category,
      image: r.image,
    }),
  );

  return json(rows, 200, PUBLIC_CACHE);
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const auth = await requireAuth(context.request, context.env);
  if (auth instanceof Response) return auth;

  const body = await context.request.json<any>();
  if (!body?.title) return errorJson('title 為必填', 400);

  const id = body.id || randomId();
  await context.env.DB.prepare(
    `INSERT INTO blog_posts (id, title, excerpt, content, date, category, image)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      id,
      body.title,
      body.excerpt || '',
      body.content || '',
      body.date || new Date().toISOString().split('T')[0],
      body.category || '',
      body.image || '',
    )
    .run();

  const row = await context.env.DB.prepare('SELECT * FROM blog_posts WHERE id = ?')
    .bind(id)
    .first<BlogRow>();
  return json(rowToBlog(row as BlogRow), 201);
};
