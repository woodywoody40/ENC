import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { BlogAPI } from '../services/apiClient';
import type { BlogPost } from '../types';
import { SEOMeta, BlogPostSchema, BreadcrumbSchema } from '../lib/seo';
import BlurText from '../components/BlurText';
import FadingVideo from '../components/FadingVideo';
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  Check,
  Clock,
  Copy,
  Cpu,
  Eye,
  Info,
  List,
  Loader2,
  Share2,
  Terminal,
} from 'lucide-react';
import { CAP_VIDEO } from '../constants';

type TocItem = { id: string; text: string; level: 2 | 3 };

const blurIn = {
  initial: { filter: 'blur(10px)', opacity: 0, y: 20 },
  animate: { filter: 'blur(0px)', opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: 'easeOut' as const },
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const slugify = (text: string) => {
  const base = text
    .trim()
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return base || 'section';
};

const buildHeadingSlugs = (content: string): Map<string, string> => {
  const used = new Map<string, number>();
  const byKey = new Map<string, string>();

  const lines = content.replace(/```[\s\S]*?```/g, (block) => block.replace(/[^\n]/g, ' ')).split('\n');
  let headingIndex = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    let text: string | null = null;
    let level: 2 | 3 | null = null;

    if (trimmed.match(/^##\s+/) && !trimmed.match(/^###\s+/)) {
      text = trimmed.replace(/^##\s+/, '');
      level = 2;
    } else if (trimmed.startsWith('### ')) {
      text = trimmed.replace(/^###\s+/, '');
      level = 3;
    }

    if (text !== null && level !== null) {
      let id = slugify(text);
      const count = used.get(id) ?? 0;
      used.set(id, count + 1);
      if (count > 0) id = `${id}-${count + 1}`;
      byKey.set(`${level}|${headingIndex}|${text}`, id);
      headingIndex++;
    }
  }

  return byKey;
};

const extractToc = (content: string, slugMap: Map<string, string>): TocItem[] => {
  const items: TocItem[] = [];
  const lines = content.replace(/```[\s\S]*?```/g, (block) => block.replace(/[^\n]/g, ' ')).split('\n');
  let headingIndex = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    let text: string | null = null;
    let level: 2 | 3 | null = null;

    if (trimmed.match(/^##\s+/) && !trimmed.match(/^###\s+/)) {
      text = trimmed.replace(/^##\s+/, '');
      level = 2;
    } else if (trimmed.startsWith('### ')) {
      text = trimmed.replace(/^###\s+/, '');
      level = 3;
    }

    if (text !== null && level !== null) {
      const id = slugMap.get(`${level}|${headingIndex}|${text}`) || slugify(text);
      items.push({ id, text, level });
      headingIndex++;
    }
  }

  return items;
};

const renderInline = (text: string) =>
  text.split(/(\*\*.*?\*\*)/g).map((part, idx) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={idx} className="font-medium text-white">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <React.Fragment key={idx}>{part}</React.Fragment>
    )
  );

const getReadingMinutes = (content = '') => {
  const clean = content.replace(/```[\s\S]*?```/g, '').replace(/[#*`>-]/g, '');
  const chineseChars = clean.match(/[\u4e00-\u9fff]/g)?.length || 0;
  const latinWords = clean.match(/[A-Za-z0-9_]+/g)?.length || 0;
  const units = chineseChars + latinWords;
  return Math.max(3, Math.ceil(units / 420));
};

const BlogDetailPage: React.FC = () => {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedBlock, setCopiedBlock] = useState<number | null>(null);
  const [shared, setShared] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    restDelta: 0.001,
  });

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setPost(null);
      setRelated([]);
      try {
        const data = await BlogAPI.get(id as string);
        setPost(data ?? null);
      } catch (err) {
        console.error('Fetch blog post error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    if (!post?.id) return;
    let cancelled = false;
    (async () => {
      try {
        const list = (await BlogAPI.list()) || [];
        const same = list
          .filter((p) => p.id !== post.id && p.category && p.category === post.category)
          .slice(0, 3);
        const filled =
          same.length >= 2
            ? same
            : [
                ...same,
                ...list
                  .filter((p) => p.id !== post.id && !same.some((s) => s.id === p.id))
                  .slice(0, 3 - same.length),
              ].slice(0, 3);
        if (!cancelled) setRelated(filled);
      } catch (err) {
        console.error('Fetch related posts error:', err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [post?.id, post?.category]);

  const slugMap = useMemo(() => buildHeadingSlugs(post?.content || ''), [post?.content]);
  const toc = useMemo(() => extractToc(post?.content || '', slugMap), [post?.content, slugMap]);

  const scrollToHeading = (headingId: string) => {
    const el = document.getElementById(headingId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `#${headingId}`);
    }
  };

  const highlightCode = (code: string) => {
    const lines = code.trim().split('\n');

    return lines.map((line, idx) => {
      const tokens = [
        { regex: /#.*$|\/\/.*$/g, cls: 'text-white/35 italic' },
        { regex: /(['"])(?:(?!\1|\\).|\\.)*\1/g, cls: 'text-emerald-300/90' },
        {
          regex:
            /\b(sudo|apt|install|systemctl|mkdir|cd|rm|cp|mv|echo|grep|sed|awk|export|ssh|ip|ls|cat|nano|vi|vim|docker|git|pve|qm|pct|ufw|netplan|nmcli|ping|curl|wget)\b/g,
          cls: 'text-rose-300/90 font-medium',
        },
        { regex: /\b-{1,2}[a-zA-Z0-9-]+\b/g, cls: 'text-white/70' },
        { regex: /\$[A-Z_a-z0-9]+/g, cls: 'text-sky-300/90' },
        { regex: /\b\d+\b/g, cls: 'text-amber-300/90' },
        { regex: /[|&><!]+/g, cls: 'text-white/30' },
      ];

      let pos = 0;
      let highlighted = '';

      while (pos < line.length) {
        let nearestMatch: RegExpExecArray | null = null;
        let nearestToken: (typeof tokens)[number] | null = null;

        for (const token of tokens) {
          token.regex.lastIndex = pos;
          const match = token.regex.exec(line);
          if (match && (nearestMatch === null || match.index < nearestMatch.index)) {
            nearestMatch = match;
            nearestToken = token;
          }
        }

        if (nearestMatch && nearestMatch.index === pos && nearestToken) {
          highlighted += `<span class="${nearestToken.cls}">${escapeHtml(nearestMatch[0])}</span>`;
          pos += nearestMatch[0].length;
        } else {
          highlighted += escapeHtml(line[pos]);
          pos++;
        }
      }

      return (
        <div key={idx} className="flex min-w-max gap-4 py-0.5">
          <span className="w-8 shrink-0 select-none text-right font-mono text-[11px] leading-7 text-white/20">
            {idx + 1}
          </span>
          <span
            className="font-mono text-[12px] leading-7 text-white/85 sm:text-[13px]"
            dangerouslySetInnerHTML={{ __html: highlighted || '&nbsp;' }}
          />
        </div>
      );
    });
  };

  const handleCopy = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedBlock(index);
    window.setTimeout(() => setCopiedBlock(null), 2000);
  };

  const handleShare = async () => {
    const shareData = {
      title: post?.title || 'Woody 技術筆記',
      text: post?.excerpt || '',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShared(true);
        window.setTimeout(() => setShared(false), 1800);
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Share failed:', err);
      }
    }
  };

  const renderTextLines = (text: string, blockKey: string, headingIds: string[], headingIndex: { i: number }) => {
    const lines = text.split('\n');
    const nodes: React.ReactNode[] = [];
    let listItems: React.ReactNode[] = [];
    let tableRows: string[] = [];

    const flushList = () => {
      if (!listItems.length) return;
      nodes.push(
        <ul
          key={`${blockKey}-list-${nodes.length}`}
          className="my-7 space-y-3 border-l border-white/10 pl-5 sm:pl-6"
        >
          {listItems}
        </ul>
      );
      listItems = [];
    };

    const flushTable = () => {
      if (tableRows.length < 2) {
        tableRows = [];
        return;
      }
      const headerCells = tableRows[0]
        .split('|')
        .filter((c) => c.trim().length > 0)
        .map((c) => c.trim());
      const bodyRows = tableRows
        .slice(2)
        .filter((r) => r.trim().length > 0 && !r.match(/^\|?\s*[-:]+\s*\|/));

      nodes.push(
        <div
          key={`${blockKey}-table-${nodes.length}`}
          className="liquid-glass my-10 overflow-x-auto rounded-[1.25rem]"
        >
          <table className="w-full border-collapse text-[0.95rem]">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03]">
                {headerCells.map((cell, i) => (
                  <th
                    key={i}
                    className="px-5 py-3.5 text-left font-body text-[12px] font-medium uppercase tracking-[0.08em] text-white/80"
                  >
                    {renderInline(cell)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, ri) => {
                const cells = row
                  .split('|')
                  .filter((c) => c.trim().length > 0)
                  .map((c) => c.trim());
                return (
                  <tr
                    key={ri}
                    className="border-b border-white/5 transition hover:bg-white/[0.02]"
                  >
                    {cells.map((cell, ci) => (
                      <td
                        key={ci}
                        className="px-5 py-3.5 font-body text-[0.95rem] font-light leading-7 text-white/80"
                      >
                        {renderInline(cell)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
    };

    const isTableLine = (l: string) =>
      l.trim().startsWith('|') && l.trim().endsWith('|') && l.trim().length > 2;

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      if (isTableLine(trimmed)) {
        tableRows.push(trimmed);
        return;
      }

      flushTable();

      if (!trimmed) {
        flushList();
        return;
      }

      if (trimmed.startsWith('- ')) {
        listItems.push(
          <li
            key={`${blockKey}-li-${index}`}
            className="relative list-none font-body text-[1rem] font-light leading-8 text-white/85 [overflow-wrap:anywhere] sm:text-[1.0625rem]"
          >
            <span className="absolute -left-[1.35rem] top-3 h-1.5 w-1.5 rounded-full bg-white/50" />
            {renderInline(trimmed.replace('- ', ''))}
          </li>
        );
        return;
      }

      flushList();

      if (trimmed.match(/^!\[.*\]\(.*\)/)) {
        const match = trimmed.match(/^!\[(.*)\]\((.*?)(?:\s+"(.*)")?\)/);
        if (match) {
          const alt = match[1] || '';
          const src = match[2] || '';
          const caption = match[3] || alt;
          nodes.push(
            <figure key={`${blockKey}-fig-${index}`} className="my-12 sm:my-16">
              <div className="liquid-glass overflow-hidden rounded-[1.25rem]">
                <img src={src} alt={alt} className="w-full object-cover" loading="lazy" />
              </div>
              {caption && (
                <figcaption className="mt-4 text-center font-body text-[13px] font-light leading-relaxed text-white/50">
                  {caption}
                </figcaption>
              )}
            </figure>
          );
          return;
        }
      }

      if (trimmed.match(/^##\s+/) && !trimmed.match(/^###\s+/)) {
        const headingText = trimmed.replace(/^##\s+/, '');
        const headingId = headingIds[headingIndex.i++] || slugify(headingText);
        nodes.push(
          <h2
            key={`${blockKey}-h2-${index}`}
            id={headingId}
            className="mt-16 scroll-mt-28 border-t border-white/10 pt-10 font-heading italic text-[1.75rem] leading-tight tracking-[-1px] text-white sm:mt-20 sm:text-[2.25rem]"
          >
            {headingText}
          </h2>
        );
        return;
      }

      if (trimmed.startsWith('### ')) {
        const headingText = trimmed.replace(/^###\s+/, '');
        const headingId = headingIds[headingIndex.i++] || slugify(headingText);
        nodes.push(
          <h3
            key={`${blockKey}-h3-${index}`}
            id={headingId}
            className="mt-10 scroll-mt-28 font-heading italic text-[1.25rem] leading-snug tracking-tight text-white sm:text-[1.45rem]"
          >
            {headingText}
          </h3>
        );
        return;
      }

      const cleanLine = trimmed.startsWith('# ') ? trimmed.replace('# ', '') : trimmed;
      nodes.push(
        <p
          key={`${blockKey}-p-${index}`}
          className="my-6 font-body text-[1rem] font-light leading-8 text-white/85 [overflow-wrap:anywhere] sm:text-[1.0625rem] sm:leading-9"
        >
          {renderInline(cleanLine)}
        </p>
      );
    });

    flushTable();
    flushList();
    return nodes;
  };

  const renderContent = (content: string) => {
    if (!content) return null;
    const headingIds = toc.map((t) => t.id);
    const headingIndex = { i: 0 };
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (!part.startsWith('```')) {
        return (
          <React.Fragment key={`text-${index}`}>
            {renderTextLines(part, `text-${index}`, headingIds, headingIndex)}
          </React.Fragment>
        );
      }

      const match = part.match(/```(\w+)?\n?([\s\S]*?)```/);
      const lang = match?.[1] || 'bash';
      const code = match?.[2] || '';
      const copied = copiedBlock === index;

      return (
        <section
          key={`code-${index}`}
          className="liquid-glass-strong my-10 overflow-hidden rounded-[1.25rem] sm:my-12"
        >
          <div className="flex min-h-12 items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <Terminal size={16} className="shrink-0 text-white/60" />
              <span className="truncate font-body text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">
                {lang}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(code, index)}
              className="liquid-glass inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-3 font-body text-[11px] font-medium uppercase tracking-[0.12em] text-white/80 transition hover:text-white focus:outline-none focus:ring-1 focus:ring-white/30 active:scale-[0.98]"
              aria-label="複製程式碼"
            >
              {copied ? <Check size={15} className="text-white" /> : <Copy size={15} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="overflow-x-auto px-3 py-5 sm:px-5">
            <code>{highlightCode(code)}</code>
          </pre>
        </section>
      );
    });
  };

  if (loading) {
    return (
      <div className="blog-cinematic min-h-screen bg-black px-6 pt-32">
        <div className="mx-auto max-w-3xl animate-pulse space-y-8">
          <div className="liquid-glass h-11 w-32 rounded-full" />
          <div className="space-y-4">
            <div className="liquid-glass h-6 w-44 rounded-full" />
            <div className="liquid-glass h-12 w-full rounded-[1.25rem]" />
            <div className="liquid-glass h-12 w-4/5 rounded-[1.25rem]" />
          </div>
          <div className="liquid-glass h-72 rounded-[1.25rem]" />
          <div className="flex items-center gap-3 font-body text-[11px] font-light tracking-wide text-white/40">
            <Loader2 className="animate-spin" size={16} /> Loading article
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="blog-cinematic flex min-h-screen items-center justify-center bg-black px-6 text-center">
        <div className="liquid-glass max-w-md rounded-[1.25rem] p-10">
          <h2 className="mb-4 font-heading italic text-3xl tracking-tight text-white">
            找不到這篇文章
          </h2>
          <p className="mb-8 font-body text-sm font-light leading-7 text-white/60">
            文章可能已經移除，或目前無法從資料庫讀取。
          </p>
          <Link
            to="/blog"
            className="liquid-glass-strong inline-flex min-h-11 items-center justify-center gap-3 rounded-full px-5 font-body text-sm font-medium text-white"
          >
            <ArrowLeft size={16} /> 返回筆記
          </Link>
        </div>
      </div>
    );
  }

  const readingMinutes = getReadingMinutes(post.content || '');

  return (
    <div className="blog-cinematic relative min-h-screen overflow-hidden bg-black">
      <SEOMeta
        title={post.title}
        description={post.excerpt?.replace(/^# /, '').slice(0, 160) || '技術筆記'}
        path={`/blog/${post.id}`}
        ogImage={post.image}
        ogType="article"
        publishedTime={post.date}
        tags={post.category ? [post.category] : undefined}
        keywords={`${post.category || ''},${(post.title || '').slice(0, 40)}`}
      />
      <BlogPostSchema
        title={post.title}
        description={post.excerpt?.replace(/^# /, '').slice(0, 200) || ''}
        path={`/blog/${post.id}`}
        image={post.image}
        datePublished={post.date}
        tags={post.category ? [post.category] : undefined}
      />
      <BreadcrumbSchema
        items={[
          { name: '首頁', path: '/' },
          { name: '技術筆記', path: '/blog' },
          { name: post.title.slice(0, 30), path: `/blog/${post.id}` },
        ]}
      />

      {/* Atmospheric video */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-25">
        <FadingVideo
          src={CAP_VIDEO}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/85 to-black" />
      </div>

      <motion.div
        className="fixed left-0 right-0 top-0 z-50 h-[2px] origin-left bg-white/60"
        style={{ scaleX }}
      />

      <div className="relative z-10">
        <header className="px-5 pb-10 pt-28 sm:px-8 sm:pb-14 sm:pt-32 lg:px-16 lg:pb-16">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end lg:gap-12">
            <div className="min-w-0">
              <motion.div {...blurIn} transition={{ ...blurIn.transition, delay: 0.15 }}>
                <Link
                  to="/blog"
                  className="liquid-glass mb-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 font-body text-[12px] font-medium tracking-wide text-white/90 transition hover:text-white"
                >
                  <ArrowLeft size={16} /> 返回筆記
                </Link>
              </motion.div>

              <motion.div
                {...blurIn}
                transition={{ ...blurIn.transition, delay: 0.3 }}
                className="mb-6 flex flex-wrap items-center gap-3"
              >
                <span className="liquid-glass-strong rounded-full px-3 py-1.5 font-body text-[11px] font-medium text-white">
                  {post.category || '技術筆記'}
                </span>
                <span className="font-body text-[12px] font-light text-white/60">{post.date}</span>
              </motion.div>

              <div className="max-w-5xl">
                <BlurText
                  text={post.title}
                  align="start"
                  className="font-heading italic text-[clamp(1.75rem,6.5vw,3.75rem)] leading-[0.95] tracking-[-2px] text-white"
                  delay={0.25}
                />
              </div>
            </div>

            <motion.div
              {...blurIn}
              transition={{ ...blurIn.transition, delay: 0.45 }}
              className="liquid-glass overflow-hidden rounded-[1.25rem]"
            >
              <img
                src={post.image}
                alt={post.title}
                className="aspect-[16/11] h-full w-full object-cover opacity-80"
                loading="eager"
              />
            </motion.div>
          </div>
        </header>

        {/* Summary bar */}
        <motion.section
          {...blurIn}
          transition={{ ...blurIn.transition, delay: 0.55 }}
          className="px-5 py-6 sm:px-8 lg:px-16"
        >
          <div className="liquid-glass mx-auto grid max-w-7xl gap-6 rounded-[1.25rem] p-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
            <div className="max-w-3xl border-l border-white/20 pl-5">
              <div className="mb-3 flex items-center gap-2 font-body text-[11px] font-medium uppercase tracking-[0.18em] text-white/60">
                <Info size={14} className="text-white/50" /> Summary
              </div>
              <p className="font-body text-[1.05rem] font-light leading-8 text-white/90 [overflow-wrap:anywhere] sm:text-xl sm:leading-9">
                {post.excerpt?.replace(/^# /, '')}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center lg:grid-cols-1 lg:text-left">
              <MetaItem icon={<Calendar size={16} />} label="發布" value={post.date} />
              <MetaItem icon={<Clock size={16} />} label="閱讀" value={`${readingMinutes} 分鐘`} />
              <MetaItem icon={<Cpu size={16} />} label="難度" value="Expert" />
            </div>
          </div>
        </motion.section>

        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,76ch)_300px] lg:gap-16 lg:px-16 lg:py-20">
          <article className="min-w-0">
            <div className="content-rendered">{renderContent(post.content || '')}</div>

            {related.length > 0 && (
              <section className="mt-16 border-t border-white/10 pt-12 sm:mt-20 sm:pt-14">
                <p className="mb-4 font-body text-sm text-white/60">// Related</p>
                <h2 className="mb-8 font-heading italic text-3xl tracking-[-1px] text-white sm:text-4xl">
                  相關筆記
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((rp) => (
                    <Link
                      key={rp.id}
                      to={`/blog/${rp.id}`}
                      className="liquid-glass group block overflow-hidden rounded-[1.25rem] transition duration-500 hover:-translate-y-1"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-black">
                        <img
                          src={rp.image}
                          alt={rp.title}
                          className="h-full w-full object-cover opacity-45 transition duration-700 group-hover:scale-105 group-hover:opacity-65"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <span className="liquid-glass absolute left-3 top-3 rounded-full px-2.5 py-1 font-body text-[10px] font-medium text-white/90">
                          {rp.category}
                        </span>
                      </div>
                      <div className="relative z-10 p-4">
                        <p className="mb-2 flex items-center gap-1.5 font-body text-[10px] font-medium text-white/50">
                          <Calendar size={10} />
                          {rp.date}
                        </p>
                        <h3 className="mb-3 line-clamp-2 font-heading italic text-lg leading-snug tracking-tight text-white">
                          {rp.title}
                        </h3>
                        <span className="inline-flex items-center gap-1.5 font-body text-[11px] font-medium text-white/60 transition-colors group-hover:text-white">
                          Read
                          <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </article>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:h-fit">
            {toc.length > 0 && (
              <nav
                aria-label="目錄"
                className="liquid-glass rounded-[1.25rem] p-5"
              >
                <div className="mb-4 flex items-center gap-3 border-b border-white/10 pb-4">
                  <div className="liquid-glass flex h-9 w-9 items-center justify-center rounded-[0.75rem]">
                    <List size={15} className="text-white/70" />
                  </div>
                  <p className="font-body text-[11px] font-medium uppercase tracking-[0.18em] text-white/60">
                    On This Page
                  </p>
                </div>
                <ul className="max-h-[min(50vh,360px)] space-y-1 overflow-y-auto pr-1">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => scrollToHeading(item.id)}
                        className={`
                          w-full rounded-xl px-2.5 py-2 text-left font-body text-[12px] leading-snug transition duration-200
                          hover:bg-white/5 hover:text-white focus:outline-none focus:ring-1 focus:ring-white/20
                          ${
                            item.level === 3
                              ? 'pl-5 font-light text-white/50'
                              : 'font-medium text-white/80'
                          }
                        `}
                      >
                        {item.text}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            <div className="liquid-glass rounded-[1.25rem] p-5">
              <div className="mb-5 flex items-center gap-3 border-b border-white/10 pb-5">
                <div className="liquid-glass flex h-9 w-9 items-center justify-center rounded-[0.75rem]">
                  <Eye size={15} className="text-white/70" />
                </div>
                <p className="font-body text-[11px] font-medium uppercase tracking-[0.18em] text-white/60">
                  Article Tools
                </p>
              </div>

              <button
                type="button"
                onClick={handleShare}
                className="liquid-glass-strong inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full px-4 font-body text-[12px] font-medium tracking-wide text-white transition active:scale-[0.98]"
              >
                {shared ? <Check size={17} /> : <Share2 size={17} />}
                {shared ? '已複製連結' : '分享文章'}
              </button>

              <div className="liquid-glass mt-6 rounded-[1rem] p-4">
                <div className="mb-2 flex items-center gap-2 text-white/70">
                  <Terminal size={14} />
                  <span className="font-body text-[11px] font-medium uppercase tracking-[0.14em]">
                    Verified Note
                  </span>
                </div>
                <p className="font-body text-sm font-light leading-6 text-white/70">
                  內容以實務部署與可重現步驟為核心，建議依照自己的環境變數與版本差異調整。
                </p>
              </div>
            </div>
          </aside>
        </div>

        <footer className="border-t border-white/10 px-5 py-14 text-center sm:px-8">
          <p className="font-heading italic text-xl tracking-tight text-white/40">
            Knowledge Core
          </p>
          <p className="mt-2 font-body text-[11px] font-light tracking-[0.25em] uppercase text-white/25">
            cinematic notes · liquid glass
          </p>
        </footer>
      </div>
    </div>
  );
};

const MetaItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({
  icon,
  label,
  value,
}) => (
  <div className="liquid-glass rounded-[1rem] px-3 py-4">
    <div className="mb-2 flex items-center justify-center gap-2 text-white/50 lg:justify-start">
      {icon}
      <span className="font-body text-[10px] font-medium tracking-[0.14em]">{label}</span>
    </div>
    <p className="truncate font-heading italic text-lg tracking-tight text-white lg:text-xl">
      {value}
    </p>
  </div>
);

export default BlogDetailPage;
