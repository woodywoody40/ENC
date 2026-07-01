/// <reference types="@cloudflare/workers-types" />
import type { Env, BlogRow, ProjectRow } from './api/lib/types';

const SITE_URL = 'https://xn--hrrs16bo6z.com';

/** 今天日期 YYYY-MM-DD (fallback) */
const today = (): string => new Date().toISOString().split('T')[0];

/** ISO 8601 日期正規表示 (YYYY-MM-DD) */
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** 驗證字串是否為有效 ISO 日期，否則 fallback 到 today */
const safeDate = (d: string | null | undefined, fallback?: string): string | undefined => {
  if (d && ISO_DATE_RE.test(d)) return d;
  return fallback ?? today();
};

/** 確保 image URL 是絕對路徑 */
const absoluteUrl = (path: string | null | undefined): string | undefined => {
  if (!path) return undefined;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  // 相對路徑補上站點網域
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

const STATIC_PAGES: { loc: string; priority: string; changefreq: string }[] = [
  { loc: '/',            priority: '1.0', changefreq: 'weekly'   },
  { loc: '/portfolio',   priority: '0.8', changefreq: 'weekly'   },
  { loc: '/blog',        priority: '0.9', changefreq: 'weekly'   },
  { loc: '/about',       priority: '0.7', changefreq: 'monthly'  },
  { loc: '/resume',      priority: '0.7', changefreq: 'monthly'  },
];

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function urlTag(
  loc: string,
  priority: string,
  changefreq: string,
  lastmod?: string,
  image?: string,
  imageTitle?: string,
): string {
  let xml = '  <url>\n';
  xml += `    <loc>${SITE_URL}${loc}</loc>\n`;
  if (lastmod) xml += `    <lastmod>${lastmod}</lastmod>\n`;
  xml += `    <changefreq>${changefreq}</changefreq>\n`;
  xml += `    <priority>${priority}</priority>\n`;
  if (image) {
    xml += `    <image:image>\n`;
    xml += `      <image:loc>${escapeXml(image)}</image:loc>\n`;
    if (imageTitle) xml += `      <image:title>${escapeXml(imageTitle)}</image:title>\n`;
    xml += `    </image:image>\n`;
  }
  xml += '  </url>\n';
  return xml;
}

export const onRequest: PagesFunction<Env> = async ({ env }) => {
  try {
    // 並行查詢部落格文章與專案
    const [blogResult, projectResult] = await Promise.all([
      env.DB.prepare('SELECT id, title, date, image FROM blog_posts ORDER BY date DESC').all<Pick<BlogRow, 'id' | 'title' | 'date' | 'image'>>(),
      env.DB.prepare('SELECT id, title, image, created_at FROM projects ORDER BY created_at DESC').all<Pick<ProjectRow, 'id' | 'title' | 'image' | 'created_at'>>(),
    ]);

    const blogPosts = blogResult.results || [];
    const projects = projectResult.results || [];

    const now = today();

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
${STATIC_PAGES.map(p => urlTag(p.loc, p.priority, p.changefreq, now)).join('')}
${blogPosts.map(p => urlTag(
  `/blog/${p.id}`,
  '0.8',
  'monthly',
  safeDate(p.date),
  absoluteUrl(p.image),
  p.title,
)).join('')}
${projects.map(p => urlTag(
  `/projects/${p.id}`,
  '0.8',
  'monthly',
  safeDate(p.created_at?.split(' ')[0]),
  absoluteUrl(p.image),
  p.title,
)).join('')}
</urlset>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=7200',
      },
    });
  } catch (err) {
    // 若資料庫查詢失敗，改用靜態備份清單
    const now = today();
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${STATIC_PAGES.map(p => urlTag(p.loc, p.priority, p.changefreq, now)).join('')}
</urlset>`;
    return new Response(fallbackXml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }
};
