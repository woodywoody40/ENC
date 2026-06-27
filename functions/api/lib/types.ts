/// <reference types="@cloudflare/workers-types" />

export interface Env {
  DB: D1Database;
  MEDIA: R2Bucket;
  CF_ACCESS_TEAM: string;
  CF_ACCESS_AUD: string;
}

export interface ProjectRow {
  id: string;
  title: string;
  description: string | null;
  details: string | null;
  image: string | null;
  tags: string | null;       // JSON string
  link: string | null;
  media: string | null;      // JSON string
  type: string | null;
  created_at: string;
}

export interface BlogRow {
  id: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  date: string | null;
  category: string | null;
  image: string | null;
}

export interface ConfigRow {
  key: string;
  value: string | null;
}

export interface ApiProject {
  id: string;
  title: string;
  description: string;
  details: string;
  image: string;
  tags: string[];
  link: string;
  media: ProjectMedia[];
  type: string;
  created_at: string;
}

export interface ApiBlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  image: string;
}

export interface ProjectMedia {
  url: string;
  type: 'image' | 'video';
  frame: 'none' | 'phone' | 'desktop';
}

const parseArray = (raw: string | null | undefined): any[] => {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
};

export const rowToProject = (r: ProjectRow): ApiProject => ({
  id: r.id,
  title: r.title,
  description: r.description ?? '',
  details: r.details ?? '',
  image: r.image ?? '',
  tags: parseArray(r.tags),
  link: r.link ?? '',
  media: parseArray(r.media),
  type: r.type ?? '',
  created_at: r.created_at,
});

export const rowToBlog = (r: BlogRow): ApiBlogPost => ({
  id: r.id,
  title: r.title,
  excerpt: r.excerpt ?? '',
  content: r.content ?? '',
  date: r.date ?? '',
  category: r.category ?? '',
  image: r.image ?? '',
});

export const json = (data: unknown, status = 200): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

export const errorJson = (message: string, status = 400): Response =>
  json({ error: message }, status);

export const randomId = (): string => crypto.randomUUID();