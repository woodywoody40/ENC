/// <reference types="@cloudflare/workers-types" />
import type { Env } from './api/lib/types';

const SITE_URL = 'https://xn--hrrs16bo6z.com';

interface MetaTags {
  title: string;
  description: string;
  image?: string;
  ogType?: string;
}

const DEFAULT_META: MetaTags = {
  title: 'Woody | 網管與資安維運實踐',
  description: 'Woody Wu — 網管與資安維運實踐。151+ VM 叢集管理、Fortinet HA 部署、HPE 儲存架構調校、Ubuntu 24.04 自動化運維。',
  image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200&h=630',
};

const ROUTE_META: Record<string, MetaTags> = {
  '/': {
    title: 'Woody | 網管與資安維運實踐',
    description: 'Woody Wu — 151+ VM 叢集管理、Fortinet HA 部署、HPE 儲存架構調校、Ubuntu 24.04 自動化運維。',
  },
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

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildMetaTags(meta: MetaTags, path: string): string {
  const title = escapeHtml(meta.title);
  const desc = escapeHtml(meta.description);
  const image = meta.image ? escapeHtml(meta.image) : '';
  const ogType = meta.ogType || 'website';
  const fullUrl = `${SITE_URL}${path}`;

  return `<title>${title}</title>
    <meta name="description" content="${desc}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:url" content="${fullUrl}" />
    <meta property="og:type" content="${ogType}" />
    <meta property="og:image" content="${image}" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${desc}" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="canonical" href="${fullUrl}" />`;
}

export const onRequest: PagesFunction<Env> = async ({ request, next, env }) => {
  const url = new URL(request.url);
  const path = url.pathname;

  // Skip non-SPA routes (API, static assets)
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

  // Only modify HTML responses
  if (!contentType.includes('text/html')) {
    return response;
  }

  const html = await response.text();

  // Determine meta tags based on path
  let meta: MetaTags;

  if (path.startsWith('/blog/') && path.length > '/blog/'.length) {
    // Blog detail page — fetch post data from D1
    const postId = path.replace('/blog/', '');
    // Validate UUID format
    if (/^[0-9a-f-]{36}$/.test(postId)) {
      try {
        const result = await env.DB.prepare(
          'SELECT title, excerpt, image FROM blog_posts WHERE id = ?'
        ).bind(postId).first<{ title: string; excerpt: string | null; image: string | null }>();

        if (result) {
          meta = {
            title: `${result.title} | Woody 維運實踐`,
            description: result.excerpt || result.title,
            image: result.image || DEFAULT_META.image,
            ogType: 'article',
          };
        } else {
          meta = { ...DEFAULT_META, title: '文章未找到 | Woody 維運實踐' };
        }
      } catch {
        meta = DEFAULT_META;
      }
    } else {
      meta = { ...ROUTE_META['/blog'] || DEFAULT_META, image: DEFAULT_META.image };
    }
  } else if (ROUTE_META[path]) {
    meta = { ...ROUTE_META[path], image: DEFAULT_META.image };
  } else {
    meta = DEFAULT_META;
  }

  const metaHtml = buildMetaTags(meta, path);

  // Replace <title> with full meta block, remove old meta that we're replacing
  let modified = html
    .replace(/<title>.*?<\/title>/, metaHtml)
    .replace(/<meta name="description"[^>]*\/?>/g, '')
    .replace(/<meta property="og:title"[^>]*\/?>/g, '')
    .replace(/<meta property="og:description"[^>]*\/?>/g, '')
    .replace(/<meta property="og:url"[^>]*\/?>/g, '')
    .replace(/<meta property="og:type"[^>]*\/?>/g, '')
    .replace(/<meta property="og:image"[^>]*\/?>/g, '')
    .replace(/<meta property="og:site_name"[^>]*\/?>/g, '')
    .replace(/<meta property="og:locale"[^>]*\/?>/g, '')
    .replace(/<meta name="twitter:title"[^>]*\/?>/g, '')
    .replace(/<meta name="twitter:description"[^>]*\/?>/g, '')
    .replace(/<meta name="twitter:card"[^>]*\/?>/g, '')
    .replace(/<link rel="canonical"[^>]*\/?>/g, '');

  // Inject image fallback in OG meta if none present
  if (!modified.includes('property="og:image"')) {
    modified = modified.replace(
      '<meta property="og:type"',
      `<meta property="og:image" content="${escapeHtml(meta.image || DEFAULT_META.image || '')}" />\n    <meta property="og:type"`
    );
  }

  return new Response(modified, {
    status: response.status,
    statusText: response.statusText,
    headers: new Headers(response.headers),
  });
};
