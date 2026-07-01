/// <reference types="@cloudflare/workers-types" />
import type { Env, BlogRow, ProjectRow } from './api/lib/types';

const SITE_URL = 'https://enc.woodywoody40.com';
const LASTMOD = new Date().toISOString().split('T')[0];

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
  // 並行查詢部落格文章與專案
  const [blogResult, projectResult] = await Promise.all([
    env.DB.prepare('SELECT id, title, date, image FROM blog_posts ORDER BY date DESC').all<Pick<BlogRow, 'id' | 'title' | 'date' | 'image'>>(),
    env.DB.prepare('SELECT id, title, image, created_at FROM projects ORDER BY created_at DESC').all<Pick<ProjectRow, 'id' | 'title' | 'image' | 'created_at'>>(),
  ]);

  const blogPosts = blogResult.results || [];
  const projects = projectResult.results || [];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
${STATIC_PAGES.map(p => urlTag(p.loc, p.priority, p.changefreq, LASTMOD)).join('')}
${blogPosts.map(p => urlTag(
  `/blog/${p.id}`,
  '0.8',
  'monthly',
  p.date || LASTMOD,
  p.image || undefined,
  p.title,
)).join('')}
${projects.map(p => urlTag(
  `/projects/${p.id}`,
  '0.8',
  'monthly',
  p.created_at?.split('T')[0] || LASTMOD,
  p.image || undefined,
  p.title,
)).join('')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=7200',
    },
  });
};
