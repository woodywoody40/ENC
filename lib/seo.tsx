import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  publishedTime?: string;
  tags?: string[];
  keywords?: string;
  noindex?: boolean;
}

const SITE_NAME = 'Woody 維運實踐';
const SITE_URL = 'https://xn--hrrs16bo6z.com';
const DEFAULT_OG_IMAGE = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200&h=630';
const DEFAULT_DESC = '網管與資安維運實踐 | Ubuntu、VMware vSphere、Fortinet 網路安全、HPE 儲存架構 — 從底層基礎設施到高可用架構的技術筆記與實戰記錄。';

export const OrganizationSchema: React.FC = () => (
  <Helmet>
    <script type="application/ld+json">{`
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "${SITE_NAME}",
  "url": "${SITE_URL}",
  "description": "${DEFAULT_DESC}",
  "sameAs": [
    "https://github.com/woodywoody40",
    "https://linkedin.com/in/woodywu"
  ]
}`}</script>
  </Helmet>
);

export const WebSiteSchema: React.FC = () => (
  <Helmet>
    <script type="application/ld+json">{`
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "${SITE_NAME}",
  "url": "${SITE_URL}",
  "description": "${DEFAULT_DESC}",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "${SITE_URL}/blog?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}`}</script>
  </Helmet>
);

export { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE, DEFAULT_DESC };

export const SEOMeta: React.FC<SEOProps> = ({
  title,
  description,
  path,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  publishedTime,
  tags,
  keywords,
  noindex,
}) => {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex && <meta name="robots" content="noindex" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="zh_TW" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Article specific */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {tags?.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
    </Helmet>
  );
};

/* ---------- JSON-LD Structured Data ---------- */

export const PersonSchema: React.FC = () => (
  <Helmet>
    <script type="application/ld+json">{`
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Woody Wu",
  "givenName": "東謙",
  "familyName": "吳",
  "alternateName": "Woody",
  "jobTitle": "資深基礎架構與資安工程師",
  "description": "151+ VM 基礎架構管理、Fortinet HA 部署、HPE 儲存架構調校、Ubuntu 24.04 自動化運維",
  "url": "${SITE_URL}",
  "sameAs": [
    "https://github.com/woodywoody40",
    "https://linkedin.com/in/woodywu"
  ],
  "knowsAbout": ["Linux", "VMware vSphere", "Fortinet FortiGate", "HPE Storage", "Docker", "Ubuntu", "Network Security"]
}`}</script>
  </Helmet>
);

interface BreadcrumbItem {
  name: string;
  path: string;
}

export const BreadcrumbSchema: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => (
  <Helmet>
    <script type="application/ld+json">{`
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    ${items.map((item, i) => {
      const isLast = i === items.length - 1;
      return `{
      "@type": "ListItem",
      "position": ${i + 1},
      "name": "${item.name}"${isLast ? '' : `,
      "item": "${SITE_URL}${item.path}"`}
    }`;
    }).join(',\n    ')}
  ]
}`}</script>
  </Helmet>
);

export const BlogPostSchema: React.FC<{
  title: string;
  description: string;
  path: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  tags?: string[];
}> = ({ title, description, path, image, datePublished, dateModified, authorName = 'Woody Wu', tags }) => (
  <Helmet>
    <script type="application/ld+json">{`
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "${title.replace(/"/g, '\\"')}",
  "description": "${description.replace(/"/g, '\\"')}",
  "url": "${SITE_URL}${path}",
  "image": [
    "${image}"
  ],
  "datePublished": "${datePublished}",
  "dateModified": "${dateModified || datePublished}",
  "author": {
    "@type": "Person",
    "name": "${authorName}",
    "url": "${SITE_URL}/about"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Woody 維運實踐",
    "logo": {
      "@type": "ImageObject",
      "url": "${SITE_URL}/favicon-192x192.png"
    }
  }${tags && tags.length > 0 ? `,
  "keywords": "${tags.join(', ')}"` : ''},
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "${SITE_URL}${path}"
  }
}`}</script>
  </Helmet>
);
