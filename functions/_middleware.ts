/// <reference types="@cloudflare/workers-types" />
import type { Env } from './api/lib/types';

const SITE_URL = 'https://xn--hrrs16bo6z.com';

interface MetaTags {
  title: string;
  description: string;
  image?: string;
  ogType?: string;
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200&h=630';

const DEFAULT_META: MetaTags = {
  title: 'Woody | 網管與資安維運實踐',
  description: 'Woody Wu — 網管與資安維運實踐。151+ VM 叢集管理、Fortinet HA 部署、HPE 儲存架構調校、Ubuntu 24.04 自動化運維。',
  image: DEFAULT_IMAGE,
};

// Static page meta (used when no dynamic data is needed)
const STATIC_META: Record<string, MetaTags> = {
  '/blog': {
    title: '技術筆記 | Woody 維運實踐',
    description: '開源專案深度分析、AI 開發者工具評測、系統維運經驗分享。每日更新 GitHub Trending 精選。',
  },
  '/portfolio': {
    title: '作品集 | Woody 維運實踐',
    description: 'Woody 的專案作品集 — Cloudflare Pages SPA、AI Agent 應用、系統維運工具、前端開發。',
  },
  '/about': {
    title: '關於 | Woody 維運實踐',
    description: '關於 Woody Wu — 網管工程師、基礎架構維運、AI 應用開發、開源技術愛好者。',
  },
  '/resume': {
    title: '履歷 | Woody 維運實踐',
    description: 'Woody Wu 的專業履歷 — 系統維運、網路架構設計、自動化部署與監控。',
  },
};

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Generate all meta tags as a single HTML string. */
function buildMeta(meta: MetaTags, path: string): string {
  const title = esc(meta.title);
  const desc = esc(meta.description);
  const image = meta.image ? esc(meta.image) : esc(DEFAULT_IMAGE);
  const fullUrl = `${SITE_URL}${path}`;
  const ogType = meta.ogType || 'website';

  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${desc}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${desc}" />`,
    `<meta property="og:url" content="${fullUrl}" />`,
    `<meta property="og:type" content="${ogType}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:site_name" content="Woody 維運實踐" />`,
    `<meta property="og:locale" content="zh_TW" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${desc}" />`,
    `<link rel="canonical" href="${fullUrl}" />`,
  ].join('\n    ');
}

/** Remove old SEO meta tags (so we can replace them cleanly). */
const STRIP_PATTERNS = [
  /<title>.*?<\/title>/g,
  /<meta name="description"[^>]*\/?>/gi,
  /<meta property="og:[a-z_]+"[^>]*\/?>/gi,
  /<meta name="twitter:[a-z_]+"[^>]*\/?>/gi,
  /<meta name="twitter:card"[^>]*\/?>/gi,
  /<link rel="canonical"[^>]*\/?>/gi,
  /<meta property="og:site_name"[^>]*\/?>/gi,
  /<meta property="og:locale"[^>]*\/?>/gi,
];

export const onRequest: PagesFunction<Env> = async ({ request, next, env }) => {
  const url = new URL(request.url);
  const path = url.pathname;

  // Skip non-SPA routes
  if (
    path.startsWith('/api/') ||
    path.startsWith('/media/') ||
    path.startsWith('/assets/') ||
    path === '/sitemap.xml' ||
    path === '/manifest.json' ||
    path === '/robots.txt' ||
    path === '/favicon.ico'
  ) {
    return next();
  }

  const response = await next();
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) {
    return response;
  }

  const html = await response.text();

  // Determine meta tags
  let meta: MetaTags;

  if (path.startsWith('/blog/') && path.length > '/blog/'.length) {
    const postId = path.replace('/blog/', '');
    if (/^[0-9a-f-]{36}$/.test(postId)) {
      try {
        const result = await env.DB.prepare(
          'SELECT title, excerpt, image FROM blog_posts WHERE id = ?'
        ).bind(postId).first<{ title: string; excerpt: string | null; image: string | null }>();

        if (result) {
          meta = {
            title: `${result.title} | Woody 維運實踐`,
            description: result.excerpt || result.title,
            image: result.image || DEFAULT_IMAGE,
            ogType: 'article',
          };
        } else {
          meta = { ...DEFAULT_META, title: '文章未找到 | Woody 維運實踐' };
        }
      } catch {
        meta = DEFAULT_META;
      }
    } else {
      meta = STATIC_META['/blog'] || DEFAULT_META;
    }
  } else if (STATIC_META[path]) {
    meta = { ...STATIC_META[path], image: DEFAULT_IMAGE };
  } else {
    meta = { ...DEFAULT_META };
  }

  // Step 1: strip all old SEO tags
  let modified = html;
  for (const re of STRIP_PATTERNS) {
    modified = modified.replace(re, '');
  }

  // Step 2: insert new meta block right after <head> (or <meta charset>)
  const metaHtml = buildMeta(meta, path);
  modified = modified.replace('<meta charset="UTF-8">', `<meta charset="UTF-8">\n    ${metaHtml}`);

  // Step 3: clean up excessive blank lines left from stripping
  modified = modified.replace(/\n\s*\n\s*\n/g, '\n  \n');

  return new Response(modified, {
    status: response.status,
    statusText: response.statusText,
    headers: new Headers(response.headers),
  });
};
