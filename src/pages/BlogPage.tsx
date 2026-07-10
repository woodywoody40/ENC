import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { BlogAPI } from '../services/apiClient';
import type { BlogPost } from '../types';
import { Calendar, ArrowUpRight, Loader2, BookOpen, Search, X, Play } from 'lucide-react';
import { SEOMeta, BreadcrumbSchema } from '../lib/seo';
import BlurText from '../components/BlurText';
import FadingVideo from '../components/FadingVideo';

const ALL_POSTS = '全部';

const HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260619_191346_9d19d66e-86a4-47f7-8dc6-712c1788c3b2.mp4';

const blurIn = {
  initial: { filter: 'blur(10px)', opacity: 0, y: 20 },
  animate: { filter: 'blur(0px)', opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: 'easeOut' as const },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};

const itemVariants = {
  hidden: { filter: 'blur(10px)', opacity: 0, y: 24 },
  visible: {
    filter: 'blur(0px)',
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' as const },
  },
};

const BlogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const qParam = searchParams.get('q') ?? '';
  const categoryParam = searchParams.get('category');
  const filter = categoryParam && categoryParam.trim() ? categoryParam : ALL_POSTS;
  const [searchInput, setSearchInput] = useState(qParam);

  useEffect(() => {
    setSearchInput(qParam);
  }, [qParam]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await BlogAPI.list();
        setPosts(data || []);
      } catch (err) {
        console.error('Fetch blog error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const updateParams = useCallback(
    (next: { q?: string; category?: string | null }) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          if (next.q !== undefined) {
            const trimmed = next.q.trim();
            if (trimmed) params.set('q', trimmed);
            else params.delete('q');
          }
          if (next.category !== undefined) {
            if (next.category && next.category !== ALL_POSTS) params.set('category', next.category);
            else params.delete('category');
          }
          return params;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  useEffect(() => {
    const t = window.setTimeout(() => {
      if (searchInput.trim() === qParam.trim()) return;
      updateParams({ q: searchInput });
    }, 280);
    return () => window.clearTimeout(t);
  }, [searchInput, qParam, updateParams]);

  const setFilter = (cat: string) => {
    updateParams({ category: cat === ALL_POSTS ? null : cat });
  };

  const categories = useMemo(
    () => [ALL_POSTS, ...Array.from(new Set(posts.map((p) => p.category || '未分類')))],
    [posts]
  );

  const query = qParam.trim().toLowerCase();

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const catOk = filter === ALL_POSTS || p.category === filter;
      if (!catOk) return false;
      if (!query) return true;
      const hay = `${p.title || ''} ${p.excerpt || ''} ${p.category || ''}`.toLowerCase();
      return hay.includes(query);
    });
  }, [posts, filter, query]);

  const featuredPost =
    filter === ALL_POSTS && !query && filteredPosts.length > 0 ? filteredPosts[0] : null;
  const gridPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts;

  if (loading) {
    return (
      <div className="blog-cinematic min-h-screen flex items-center justify-center px-6 bg-black">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="liquid-glass h-16 w-16 rounded-full flex items-center justify-center">
            <Loader2 className="animate-spin text-white/50" size={24} strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <p className="font-body text-sm font-light tracking-wide text-white/80">
              Loading knowledge base
            </p>
            <p className="font-heading italic text-white/30 text-lg tracking-tight">
              Decrypting notes…
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOMeta
        title="技術筆記"
        description="Woody 的基礎架構與資安技術筆記 — Ubuntu 24.04 實戰、Netplan 網路配置、VMware vSphere 叢集管理、Fortinet 防火牆部署、HPE 儲存架構調校。"
        path="/blog"
        keywords="技術筆記,Ubuntu,Netplan,VMware,Fortinet,HPE,基礎架構,資安"
      />
      <BreadcrumbSchema items={[{ name: '首頁', path: '/' }, { name: '技術筆記', path: '/blog' }]} />

      <div className="blog-cinematic relative min-h-screen overflow-hidden bg-black">
        {/* Atmospheric video backdrop */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-40">
          <FadingVideo
            src={HERO_VIDEO}
            className="absolute left-1/2 top-0 -translate-x-1/2 object-cover object-top"
            style={{ width: '120%', height: '80%', maxHeight: '720px' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black" />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 min-h-screen pt-[120px] sm:pt-[140px] pb-24 sm:pb-32 px-5 sm:px-8 lg:px-16 max-w-7xl mx-auto"
        >
          {/* ══ HEADER ═══════════════════════════════════════ */}
          <header className="mb-14 sm:mb-20 relative z-10 text-center">
            <motion.div
              {...blurIn}
              transition={{ ...blurIn.transition, delay: 0.2 }}
              className="inline-flex items-center gap-2 liquid-glass rounded-full px-4 py-2 mb-8"
            >
              <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-body font-semibold uppercase tracking-wider text-black">
                Notes
              </span>
              <span className="font-body text-sm font-light text-white/90">
                {filteredPosts.length} articles · infrastructure & security
              </span>
            </motion.div>

            <div className="mb-5">
              <BlurText
                text="技術筆記"
                className="font-heading italic text-6xl md:text-7xl lg:text-[5.5rem] text-white leading-[0.85] tracking-[-3px] md:tracking-[-4px]"
                delay={0.15}
              />
            </div>

            <motion.p
              {...blurIn}
              transition={{ ...blurIn.transition, delay: 0.55 }}
              className="mx-auto max-w-2xl font-body text-sm md:text-base font-light leading-tight text-white/90"
            >
              基礎架構、資安與運維的實戰紀錄 — 精準排版、可重現步驟，以及值得長期維護的筆記。
            </motion.p>

            {/* Meta row */}
            <motion.div
              {...blurIn}
              transition={{ ...blurIn.transition, delay: 0.7 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-3"
            >
              <span className="liquid-glass rounded-full px-4 py-1.5 font-body text-[11px] font-medium text-white/80">
                {filteredPosts.length} ARTICLES
              </span>
              <span className="liquid-glass rounded-full px-4 py-1.5 font-body text-[11px] font-medium text-white/80">
                KNOWLEDGE BASE
              </span>
              <a
                href="/rss.xml"
                className="liquid-glass-strong rounded-full px-4 py-1.5 font-body text-[11px] font-medium text-white transition hover:text-white"
              >
                RSS
              </a>
            </motion.div>

            {/* Search */}
            <motion.div
              {...blurIn}
              transition={{ ...blurIn.transition, delay: 0.85 }}
              className="mx-auto mt-10 max-w-xl"
            >
              <label className="relative block group">
                <span className="sr-only">搜尋筆記</span>
                <Search
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-white/50 transition-colors group-focus-within:text-white/80"
                />
                <input
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="搜尋標題、摘要、分類…"
                  className="
                    liquid-glass-strong w-full
                    pl-11 pr-11 py-3.5 rounded-full
                    font-body text-sm font-light tracking-wide
                    text-white placeholder:text-white/35
                    focus:outline-none focus:ring-1 focus:ring-white/20
                    transition-all duration-300
                  "
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput('');
                      updateParams({ q: '' });
                    }}
                    className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full p-1.5 text-white/40 transition-colors hover:text-white/80"
                    aria-label="清除搜尋"
                  >
                    <X size={14} />
                  </button>
                )}
              </label>
              {query && (
                <p className="mt-3 font-body text-[11px] font-light tracking-wide text-white/40">
                  QUERY · <span className="text-white/70">{query}</span>
                </p>
              )}
            </motion.div>

            {/* Category filter pills */}
            <motion.div
              {...blurIn}
              transition={{ ...blurIn.transition, delay: 1.0 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-2"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  className={`
                    rounded-full px-4 py-1.5 font-body text-[11px] font-medium whitespace-nowrap transition-all duration-300
                    ${
                      filter === cat
                        ? 'liquid-glass-strong text-white'
                        : 'liquid-glass text-white/70 hover:text-white'
                    }
                  `}
                >
                  {cat}
                </button>
              ))}
            </motion.div>
          </header>

          {/* ══ CONTENT ═════════════════════════════════════ */}
          {filteredPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-28 text-center"
            >
              <div className="liquid-glass mx-auto max-w-sm rounded-[1.25rem] p-10">
                <BookOpen className="mx-auto mb-6 text-white/20" size={48} strokeWidth={1} />
                <p className="font-heading italic text-2xl tracking-tight text-white mb-3">
                  {query ? '找不到符合的筆記' : '此分類尚無任何筆記'}
                </p>
                <p className="font-body text-sm font-light text-white/50">
                  {query ? 'No matching protocols' : 'No protocols published'}
                </p>
                {(query || filter !== ALL_POSTS) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput('');
                      updateParams({ q: '', category: null });
                    }}
                    className="mt-8 liquid-glass-strong rounded-full px-5 py-2.5 font-body text-sm font-medium text-white"
                  >
                    清除篩選
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <>
              {/* Featured */}
              {featuredPost && (
                <motion.div
                  {...blurIn}
                  transition={{ ...blurIn.transition, delay: 1.1 }}
                  className="mb-10 sm:mb-14 group"
                >
                  <Link to={`/blog/${featuredPost.id}`} className="block">
                    <div className="liquid-glass relative overflow-hidden rounded-[1.25rem] transition-transform duration-500 group-hover:-translate-y-1">
                      <div className="grid md:grid-cols-2 gap-0">
                        <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[340px] overflow-hidden bg-black">
                          <img
                            src={featuredPost.image}
                            alt={featuredPost.title}
                            className="absolute inset-0 h-full w-full object-cover opacity-55 transition-all duration-[1.2s] ease-out group-hover:scale-105 group-hover:opacity-75"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
                          <div className="absolute top-4 left-4 z-10">
                            <span className="liquid-glass rounded-full px-3 py-1.5 font-body text-[11px] font-medium text-white/90">
                              {featuredPost.category || '技術筆記'}
                            </span>
                          </div>
                          <div className="absolute top-4 right-4 z-10">
                            <span className="liquid-glass-strong rounded-full px-3 py-1.5 font-body text-[10px] font-medium text-white">
                              <Play size={10} className="inline -mt-0.5 mr-1 fill-white" />
                              Latest
                            </span>
                          </div>
                        </div>

                        <div className="relative z-10 flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                          <div className="mb-4 flex items-center gap-2 font-body text-[11px] font-medium text-white/60">
                            <Calendar size={12} className="text-white/50" />
                            {featuredPost.date}
                          </div>

                          <h2 className="font-heading italic text-3xl sm:text-4xl lg:text-[2.75rem] leading-[0.95] tracking-[-1px] text-white mb-4 line-clamp-3">
                            {featuredPost.title}
                          </h2>

                          <p className="mb-6 line-clamp-3 font-body text-sm sm:text-base font-light leading-snug text-white/80 max-w-[36ch]">
                            {featuredPost.excerpt}
                          </p>

                          <div className="inline-flex items-center gap-2 font-body text-sm font-medium text-white transition-colors">
                            閱讀全文
                            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Grid */}
              {gridPosts.length > 0 && (
                <motion.div
                  key={`${filter}::${query}`}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 relative z-10"
                >
                  <AnimatePresence mode="popLayout">
                    {gridPosts.map((post) => (
                      <motion.article key={post.id} layout variants={itemVariants} className="group">
                        <Link to={`/blog/${post.id}`} className="block h-full">
                          <div className="liquid-glass relative flex h-full min-h-[360px] flex-col overflow-hidden rounded-[1.25rem] transition-transform duration-500 group-hover:-translate-y-1">
                            <div className="relative aspect-[16/11] overflow-hidden bg-black">
                              <img
                                src={post.image}
                                alt={post.title}
                                className="h-full w-full object-cover opacity-45 transition-all duration-1000 ease-out group-hover:scale-105 group-hover:opacity-65"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                              <div className="absolute top-3 left-3">
                                <span className="liquid-glass rounded-full px-3 py-1 font-body text-[11px] font-medium text-white/90 whitespace-nowrap">
                                  {post.category}
                                </span>
                              </div>
                            </div>

                            <div className="relative z-10 flex flex-1 flex-col p-6">
                              <div className="mb-3 flex items-center gap-1.5 font-body text-[11px] font-medium text-white/50">
                                <Calendar size={11} />
                                {post.date}
                              </div>

                              <h3 className="font-heading italic text-2xl md:text-3xl tracking-[-1px] leading-none text-white mb-3 line-clamp-2">
                                {post.title}
                              </h3>

                              <p className="mb-5 flex-1 line-clamp-2 font-body text-sm font-light leading-snug text-white/80 max-w-[32ch]">
                                {post.excerpt}
                              </p>

                              <div className="mt-auto flex items-center gap-2 font-body text-[12px] font-medium text-white/70 transition-colors group-hover:text-white">
                                Read
                                <ArrowUpRight size={14} className="ml-auto transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.article>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </>
          )}

          {filteredPosts.length > 0 && (
            <motion.footer
              {...blurIn}
              transition={{ ...blurIn.transition, delay: 1.3 }}
              className="mt-20 sm:mt-28 flex flex-col items-center gap-4"
            >
              <div className="liquid-glass rounded-full px-5 py-2.5 font-body text-sm font-light text-white/80">
                {filteredPosts.length} 篇筆記存檔 · crafted for operators
              </div>
            </motion.footer>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default BlogPage;
