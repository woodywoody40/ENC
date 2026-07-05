/// <reference types="@cloudflare/workers-types" />
import type { Env } from './api/lib/types';

const SITE_URL = 'https://xn--hrrs16bo6z.com';
const SITE_NAME = 'Woody 維運實踐';
const AUTHOR = 'Woody Wu';

interface MetaTags {
  title: string;
  description: string;
  image?: string;
  ogType?: string;
  /** Extra data needed for JSON-LD that differs from OG meta */
  ld?: {
    datePublished?: string;
    dateModified?: string;
    category?: string;
    isArticle?: boolean;
  };
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200&h=630';

const DEFAULT_META: MetaTags = {
  title: `${SITE_NAME}`,
  description: 'Woody Wu — 網管與資安維運實踐。151+ VM 叢集管理、Fortinet HA 部署、HPE 儲存架構調校、Ubuntu 24.04 自動化運維。',
  image: DEFAULT_IMAGE,
};

const STATIC_META: Record<string, MetaTags> = {
  '/blog': {
    title: `技術筆記 | ${SITE_NAME}`,
    description: '開源專案深度分析、AI 開發者工具評測、系統維運經驗分享。每日更新 GitHub Trending 精選。',
  },
  '/portfolio': {
    title: `作品集 | ${SITE_NAME}`,
    description: 'Woody 的專案作品集 — Cloudflare Pages SPA、AI Agent 應用、系統維運工具、前端開發。',
  },
  '/about': {
    title: `關於 | ${SITE_NAME}`,
    description: '關於 Woody Wu — 網管工程師、基礎架構維運、AI 應用開發、開源技術愛好者。',
  },
  '/resume': {
    title: `履歷 | ${SITE_NAME}`,
    description: 'Woody Wu 的專業履歷 — 系統維運、網路架構設計、自動化部署與監控。',
  },
};

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escJson(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

// ── Meta tag builders ──────────────────────────────────────────

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
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:locale" content="zh_TW" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${desc}" />`,
    `<link rel="canonical" href="${fullUrl}" />`,
  ].join('\n    ');
}

// ── JSON-LD builders ────────────────────────────────────────────

function buildWebSiteLd(): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    author: { '@type': 'Person', name: AUTHOR },
    description: DEFAULT_META.description,
  });
}

function buildBreadcrumbLd(path: string, articleTitle?: string): string {
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 0) return '';

  const items: { '@type': 'ListItem'; position: number; name: string; item: string }[] = [
    { '@type': 'ListItem', position: 1, name: '首頁', item: SITE_URL },
  ];

  let current = '';
  for (let i = 0; i < segments.length; i++) {
    current += '/' + segments[i];
    // Build a human-readable label
    let name = segments[i];
    if (name === 'blog') name = '技術筆記';
    else if (name === 'portfolio') name = '作品集';
    else if (name === 'about') name = '關於';
    else if (name === 'resume') name = '履歷';
    else if (name.match(/^[0-9a-f-]{36}$/)) name = articleTitle || '(文章)';
    items.push({
      '@type': 'ListItem',
      position: i + 2,
      name,
      item: `${SITE_URL}${current}`,
    });
  }
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  });
}

function buildArticleLd(
  title: string,
  desc: string,
  image: string,
  url: string,
  datePublished?: string,
  dateModified?: string,
  category?: string,
): string {
  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: desc,
    image: image,
    url: url,
    author: { '@type': 'Person', name: AUTHOR },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };
  if (datePublished) ld.datePublished = datePublished;
  if (dateModified) ld.dateModified = dateModified;
  if (category) ld.articleSection = category;
  return JSON.stringify(ld);
}

function buildCollectionPageLd(description: string, url: string): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: description.length > 60 ? description.slice(0, 57) + '...' : description,
    description,
    url,
    author: { '@type': 'Person', name: AUTHOR },
  });
}

function buildWebPageLd(name: string, desc: string, url: string): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description: desc,
    url,
  });
}

// ── Stripping regex patterns ────────────────────────────────────

const STRIP_PATTERNS = [
  /<title>.*?<\/title>/g,
  /<meta name="description"[^>]*\/?>/gi,
  /<meta property="og:[a-z_]+"[^>]*\/?>/gi,
  /<meta name="twitter:[a-z_]+"[^>]*\/?>/gi,
  /<meta name="twitter:card"[^>]*\/?>/gi,
  /<link rel="canonical"[^>]*\/?>/gi,
  /<meta property="og:site_name"[^>]*\/?>/gi,
  /<meta property="og:locale"[^>]*\/?>/gi,
  /<script type="application\/ld\+json">.*?<\/script>/gs, // strip old JSON-LD if any
];

// ── Main handler ────────────────────────────────────────────────

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

  // ── Determine meta & JSON-LD ────────────────────────────────

  let meta: MetaTags;
  let ldScripts: string[] = [buildWebSiteLd()]; // always add WebSite schema

  let ssrContent: string | null = null;

  if (path.startsWith('/blog/') && path.length > '/blog/'.length) {
    const postId = path.replace('/blog/', '');
    if (/^[0-9a-f-]{36}$/.test(postId)) {
      try {
        const result = await env.DB.prepare(
          'SELECT title, excerpt, image, date, category, content FROM blog_posts WHERE id = ?'
        ).bind(postId).first<{
          title: string;
          excerpt: string | null;
          image: string | null;
          date: string | null;
          category: string | null;
          content: string | null;
        }>();

        if (result) {
          meta = {
            title: `${result.title} | ${SITE_NAME}`,
            description: result.excerpt || result.title,
            image: result.image || DEFAULT_IMAGE,
            ogType: 'article',
            ld: {
              datePublished: result.date || undefined,
              dateModified: result.date || undefined,
              category: result.category || undefined,
              isArticle: true,
            },
          };
          // Breadcrumb: 首頁 > 技術筆記 > 文章標題
          const bc = buildBreadcrumbLd('/blog/' + postId, result.title);
          ldScripts.push(bc);
          ldScripts.push(
            buildArticleLd(
              result.title,
              result.excerpt || result.title,
              result.image || DEFAULT_IMAGE,
              `${SITE_URL}/blog/${postId}`,
              result.date || undefined,
              result.date || undefined,
              result.category || undefined,
            ),
          );
          // SSR content for Googlebot / search engines
          if (result.content) {
            ssrContent = `# ${result.title}\n\n${result.excerpt ? result.excerpt + '\n\n' : ''}${result.content}`;
          }
        } else {
          meta = { ...DEFAULT_META, title: `文章未找到 | ${SITE_NAME}` };
          ldScripts.push(buildBreadcrumbLd(path));
        }
      } catch {
        meta = DEFAULT_META;
        ldScripts.push(buildBreadcrumbLd(path));
      }
    } else {
      meta = { ...(STATIC_META['/blog'] || DEFAULT_META), image: DEFAULT_IMAGE };
      ldScripts.push(buildBreadcrumbLd(path));
      ldScripts.push(buildCollectionPageLd(meta.description, `${SITE_URL}${path}`));
    }
  } else if (path === '/blog') {
    meta = { ...(STATIC_META['/blog'] || DEFAULT_META), image: DEFAULT_IMAGE };
    ldScripts.push(buildCollectionPageLd(meta.description, `${SITE_URL}/blog`));
  } else if (path === '/') {
    meta = { ...DEFAULT_META };
  } else if (STATIC_META[path]) {
    meta = { ...STATIC_META[path], image: DEFAULT_IMAGE };
    ldScripts.push(buildBreadcrumbLd(path));
    ldScripts.push(buildWebPageLd(meta.title, meta.description, `${SITE_URL}${path}`));
  } else {
    meta = { ...DEFAULT_META };
    ldScripts.push(buildWebPageLd(meta.title, meta.description, `${SITE_URL}${path}`));
  }

  // ── Apply to HTML ───────────────────────────────────────────

  // Step 1: strip old SEO tags & old JSON-LD
  let modified = html;
  for (const re of STRIP_PATTERNS) {
    modified = modified.replace(re, '');
  }

  // Step 2: build JSON-LD block
  const jsonLdHtml = ldScripts
    .map((s) => `<script type="application/ld+json">${s}</script>`)
    .join('\n    ');

  // Step 3: insert meta + JSON-LD after <meta charset>
  const metaHtml = buildMeta(meta, path);
  modified = modified.replace(
    '<meta charset="UTF-8">',
    `<meta charset="UTF-8">\n    ${metaHtml}\n    ${jsonLdHtml}`,
  );

  // Step 3.5: inject article content for search engines (SPA workaround)
  // Googlebot sees full text without needing JS rendering
  if (ssrContent) {
    const escaped = ssrContent
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
    modified = modified.replace(
      '</body>',
      `<div style="display:none">${escaped}</div></body>`,
    );
  }

  // Step 4: clean up excess blank lines
  modified = modified.replace(/\n\s*\n\s*\n/g, '\n  \n');

  return new Response(modified, {
    status: response.status,
    statusText: response.statusText,
    headers: new Headers(response.headers),
  });
};
