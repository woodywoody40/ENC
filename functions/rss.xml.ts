/// <reference types="@cloudflare/workers-types" />
import type { Env, BlogRow } from './api/lib/types';

const SITE_URL = 'https://xn--hrrs16bo6z.com';
const SITE_NAME = 'Woody 維運實踐';
const SITE_DESC = '網管與資安維運實踐 — Ubuntu、VMware、Fortinet、HPE 技術筆記與實戰記錄。';

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** RFC 822 date from YYYY-MM-DD */
function toRfc822(date: string | null | undefined): string {
  const d = date && /^\d{4}-\d{2}-\d{2}$/.test(date)
    ? new Date(`${date}T00:00:00Z`)
    : new Date();
  return d.toUTCString();
}

export const onRequest: PagesFunction<Env> = async ({ env }) => {
  try {
    const result = await env.DB.prepare(
      'SELECT id, title, excerpt, date, category, image FROM blog_posts ORDER BY date DESC LIMIT 50',
    ).all<Pick<BlogRow, 'id' | 'title' | 'excerpt' | 'date' | 'category' | 'image'>>();

    const posts = result.results || [];
    const lastBuild = posts[0]?.date ? toRfc822(posts[0].date) : new Date().toUTCString();

    const items = posts
      .map((p) => {
        const link = `${SITE_URL}/blog/${encodeURIComponent(p.id)}`;
        const desc = escapeXml(p.excerpt || p.title || '');
        return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${toRfc822(p.date)}</pubDate>
      <description>${desc}</description>
      ${p.category ? `<category>${escapeXml(p.category)}</category>` : ''}
    </item>`;
      })
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}/blog</link>
    <description>${escapeXml(SITE_DESC)}</description>
    <language>zh-TW</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=1800, s-maxage=3600',
      },
    });
  } catch {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}/blog</link>
    <description>${escapeXml(SITE_DESC)}</description>
    <language>zh-TW</language>
  </channel>
</rss>`;
    return new Response(xml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      },
    });
  }
};
