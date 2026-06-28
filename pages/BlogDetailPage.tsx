import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { BlogAPI } from '../services/apiClient';
import { BLOG_POSTS } from '../constants';
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  Copy,
  Cpu,
  Eye,
  Info,
  Loader2,
  Share2,
  Terminal,
} from 'lucide-react';

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const renderInline = (text: string) =>
  text.split(/(\*\*.*?\*\*)/g).map((part, idx) => (
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={idx} className="font-semibold text-zinc-950 dark:text-white">{part.slice(2, -2)}</strong>
      : <React.Fragment key={idx}>{part}</React.Fragment>
  ));

const getReadingMinutes = (content = '') => {
  const clean = content.replace(/```[\s\S]*?```/g, '').replace(/[#*`>-]/g, '');
  const chineseChars = clean.match(/[\u4e00-\u9fff]/g)?.length || 0;
  const latinWords = clean.match(/[A-Za-z0-9_]+/g)?.length || 0;
  const units = chineseChars + latinWords;
  return Math.max(3, Math.ceil(units / 420));
};

const BlogDetailPage: React.FC = () => {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
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
      const staticPost = BLOG_POSTS.find((p) => p.id === id);
      if (staticPost) {
        setPost(staticPost);
        setLoading(false);
        return;
      }

      try {
        const data = await BlogAPI.get(id as string);
        setPost(data);
      } catch (err) {
        console.error('Fetch blog post error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const highlightCode = (code: string) => {
    const lines = code.trim().split('\n');

    return lines.map((line, idx) => {
      const tokens = [
        { regex: /#.*$|\/\/.*$/g, cls: 'text-zinc-500 italic' },
        { regex: /(['"])(?:(?!\1|\\).|\\.)*\1/g, cls: 'text-emerald-300' },
        { regex: /\b(sudo|apt|install|systemctl|mkdir|cd|rm|cp|mv|echo|grep|sed|awk|export|ssh|ip|ls|cat|nano|vi|vim|docker|git|pve|qm|pct|ufw|netplan|nmcli|ping|curl|wget)\b/g, cls: 'text-rose-300 font-semibold' },
        { regex: /\b-{1,2}[a-zA-Z0-9-]+\b/g, cls: 'text-zinc-300' },
        { regex: /\$[A-Z_a-z0-9]+/g, cls: 'text-sky-300' },
        { regex: /\b\d+\b/g, cls: 'text-amber-300' },
        { regex: /[|&><!]+/g, cls: 'text-white/35' },
      ];

      let pos = 0;
      let highlighted = '';

      while (pos < line.length) {
        let nearestMatch: RegExpExecArray | null = null;
        let nearestToken: any = null;

        for (const token of tokens) {
          token.regex.lastIndex = pos;
          const match = token.regex.exec(line);
          if (match && (nearestMatch === null || match.index < nearestMatch.index)) {
            nearestMatch = match;
            nearestToken = token;
          }
        }

        if (nearestMatch && nearestMatch.index === pos) {
          highlighted += `<span class="${nearestToken.cls}">${escapeHtml(nearestMatch[0])}</span>`;
          pos += nearestMatch[0].length;
        } else {
          highlighted += escapeHtml(line[pos]);
          pos++;
        }
      }

      return (
        <div key={idx} className="flex min-w-max gap-4 py-0.5">
          <span className="w-8 shrink-0 select-none text-right font-mono text-[11px] leading-7 text-white/20">{idx + 1}</span>
          <span className="font-mono text-[12px] leading-7 text-zinc-200 sm:text-[13px]" dangerouslySetInnerHTML={{ __html: highlighted || '&nbsp;' }} />
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

  const renderTextLines = (text: string, blockKey: string) => {
    const lines = text.split('\n');
    const nodes: React.ReactNode[] = [];
    let listItems: React.ReactNode[] = [];

    const flushList = () => {
      if (!listItems.length) return;
      nodes.push(
        <ul key={`${blockKey}-list-${nodes.length}`} className="my-7 space-y-3 border-l border-zinc-200 pl-5 dark:border-white/10 sm:pl-6">
          {listItems}
        </ul>
      );
      listItems = [];
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      if (!trimmed) {
        flushList();
        return;
      }

      if (trimmed.startsWith('- ')) {
        listItems.push(
          <li key={`${blockKey}-li-${index}`} className="relative list-none text-[1rem] leading-8 text-zinc-700 [overflow-wrap:anywhere] dark:text-zinc-300 sm:text-[1.0625rem]">
            <span className="absolute -left-[1.35rem] top-3 h-2 w-2 rounded-full bg-emerald-500" />
            {renderInline(trimmed.replace('- ', ''))}
          </li>
        );
        return;
      }

      flushList();

      if (trimmed.startsWith('## ')) {
        nodes.push(
          <h2 key={`${blockKey}-h2-${index}`} className="mt-16 scroll-mt-28 border-t border-zinc-200 pt-10 text-[1.75rem] font-black leading-tight tracking-tight text-zinc-950 dark:border-white/10 dark:text-white sm:mt-20 sm:text-[2.25rem]">
            {trimmed.replace('## ', '')}
          </h2>
        );
        return;
      }

      if (trimmed.startsWith('### ')) {
        nodes.push(
          <h3 key={`${blockKey}-h3-${index}`} className="mt-10 text-[1.2rem] font-bold leading-snug text-zinc-950 dark:text-white sm:text-[1.45rem]">
            {trimmed.replace('### ', '')}
          </h3>
        );
        return;
      }

      const cleanLine = trimmed.startsWith('# ') ? trimmed.replace('# ', '') : trimmed;
      nodes.push(
        <p key={`${blockKey}-p-${index}`} className="my-6 text-[1rem] leading-8 text-zinc-700 [overflow-wrap:anywhere] dark:text-zinc-300 sm:text-[1.0625rem] sm:leading-9">
          {renderInline(cleanLine)}
        </p>
      );
    });

    flushList();
    return nodes;
  };

  const renderContent = (content: string) => {
    if (!content) return null;
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (!part.startsWith('```')) {
        return <React.Fragment key={`text-${index}`}>{renderTextLines(part, `text-${index}`)}</React.Fragment>;
      }

      const match = part.match(/```(\w+)?\n?([\s\S]*?)```/);
      const lang = match?.[1] || 'bash';
      const code = match?.[2] || '';
      const copied = copiedBlock === index;

      return (
        <section key={`code-${index}`} className="my-10 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.9)] dark:bg-[#0f1117] sm:my-12">
          <div className="flex min-h-12 items-center justify-between gap-3 border-b border-white/10 bg-white/[0.04] px-4 py-3 sm:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <Terminal size={16} className="shrink-0 text-emerald-400" />
              <span className="truncate text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-300">{lang}</span>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(code, index)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-300 transition duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/70 active:scale-[0.98]"
              aria-label="複製程式碼"
            >
              {copied ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
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

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 px-6 pt-32 text-white">
      <div className="mx-auto max-w-3xl animate-pulse space-y-8">
        <div className="h-11 w-32 rounded-2xl bg-white/10" />
        <div className="space-y-4">
          <div className="h-6 w-44 rounded-full bg-white/10" />
          <div className="h-12 w-full rounded-2xl bg-white/10" />
          <div className="h-12 w-4/5 rounded-2xl bg-white/10" />
        </div>
        <div className="h-72 rounded-[2rem] bg-white/10" />
        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
          <Loader2 className="animate-spin" size={16} /> Loading article
        </div>
      </div>
    </div>
  );

  if (!post) return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-center text-white">
      <div className="max-w-md">
        <h2 className="mb-4 text-3xl font-black tracking-tight">找不到這篇文章</h2>
        <p className="mb-8 text-sm leading-7 text-zinc-400">文章可能已經移除，或目前無法從資料庫讀取。</p>
        <Link to="/blog" className="inline-flex min-h-11 items-center justify-center gap-3 rounded-2xl bg-white px-5 text-[12px] font-bold tracking-[0.16em] text-zinc-950 transition hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-400/70">
          <ArrowLeft size={16} /> 返回筆記
        </Link>
      </div>
    </div>
  );

  const readingMinutes = getReadingMinutes(post.content);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f5f5f2] text-zinc-950 selection:bg-zinc-950 selection:text-white dark:bg-[#090a0f] dark:text-white">
      <motion.div
        className="fixed left-0 right-0 top-0 z-50 h-1 origin-left bg-emerald-500"
        style={{ scaleX }}
      />

      <header className="px-5 pb-10 pt-28 sm:px-8 sm:pb-14 sm:pt-32 lg:pb-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end lg:gap-12">
          <div className="min-w-0">
            <Link
              to="/blog"
              className="mb-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-zinc-300 bg-white/70 px-4 text-[12px] font-bold tracking-[0.12em] text-zinc-700 shadow-sm transition duration-200 hover:border-zinc-950 hover:text-zinc-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/70 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:border-white/25 dark:hover:text-white"
            >
              <ArrowLeft size={16} /> 返回筆記
            </Link>

            <div className="mb-6 flex flex-wrap items-center gap-3 text-[12px] font-bold tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
              <span className="rounded-full bg-zinc-950 px-3 py-1.5 text-white dark:bg-white dark:text-zinc-950">{post.category || '技術筆記'}</span>
              <span>{post.date}</span>
            </div>

            <h1 className="max-w-5xl break-all text-[clamp(1.75rem,8.2vw,4.35rem)] font-black leading-[1.12] tracking-tight text-zinc-950 [overflow-wrap:anywhere] dark:text-white sm:break-words sm:leading-[1.08] sm:tracking-[-0.015em]">
              {post.title}
            </h1>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-zinc-200 shadow-[0_24px_80px_-50px_rgba(24,24,27,0.75)] dark:border-white/10 dark:bg-white/5">
            <img
              src={post.image}
              alt={post.title}
              className="aspect-[16/11] h-full w-full object-cover"
              loading="eager"
            />
          </div>
        </div>
      </header>

      <section className="border-y border-zinc-200 bg-white/65 px-5 py-6 backdrop-blur dark:border-white/10 dark:bg-white/[0.035] sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
          <div className="max-w-3xl border-l-2 border-emerald-500 pl-5">
            <div className="mb-3 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
              <Info size={16} className="text-emerald-500" /> Summary
            </div>
            <p className="text-[1.08rem] leading-8 text-zinc-700 [overflow-wrap:anywhere] dark:text-zinc-300 sm:text-xl sm:leading-9">
              {post.excerpt?.replace(/^# /, '')}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center lg:grid-cols-1 lg:text-left">
            <MetaItem icon={<Calendar size={16} />} label="發布" value={post.date} />
            <MetaItem icon={<Clock size={16} />} label="閱讀" value={`${readingMinutes} 分鐘`} />
            <MetaItem icon={<Cpu size={16} />} label="難度" value="Expert" />
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,76ch)_300px] lg:gap-20 lg:py-20">
        <article className="min-w-0">
          <div className="content-rendered">
            {renderContent(post.content)}
          </div>
        </article>

        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <div className="rounded-3xl border border-zinc-200 bg-white/80 p-5 shadow-[0_18px_60px_-45px_rgba(24,24,27,0.7)] dark:border-white/10 dark:bg-white/[0.04]">
            <div className="mb-5 flex items-center gap-3 border-b border-zinc-200 pb-5 dark:border-white/10">
              <Eye size={17} className="text-emerald-500" />
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Article Tools</p>
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl bg-zinc-950 px-4 text-[12px] font-bold tracking-[0.12em] text-white transition duration-200 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/70 active:scale-[0.98] dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              {shared ? <Check size={17} /> : <Share2 size={17} />}
              {shared ? '已複製連結' : '分享文章'}
            </button>

            <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <div className="mb-2 flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <Terminal size={16} />
                <span className="text-[11px] font-black uppercase tracking-[0.16em]">Verified Note</span>
              </div>
              <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                內容以實務部署與可重現步驟為核心，建議依照自己的環境變數與版本差異調整。
              </p>
            </div>
          </div>
        </aside>
      </div>

      <footer className="border-t border-zinc-200 px-5 py-14 text-center dark:border-white/10 sm:px-8">
        <p className="text-[11px] font-black uppercase tracking-[0.35em] text-zinc-400 dark:text-zinc-600">Knowledge Core v3.1</p>
      </footer>
    </main>
  );
};

const MetaItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="rounded-2xl border border-zinc-200 bg-white px-3 py-4 dark:border-white/10 dark:bg-white/[0.04]">
    <div className="mb-2 flex items-center justify-center gap-2 text-zinc-400 lg:justify-start">
      {icon}
      <span className="text-[10px] font-black tracking-[0.18em]">{label}</span>
    </div>
    <p className="truncate text-sm font-bold text-zinc-950 dark:text-white">{value}</p>
  </div>
);

export default BlogDetailPage;
