import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BlogAPI } from '../services/apiClient';
import { Calendar, ArrowRight, Loader2, Hash, Zap, Sparkles, BookOpen, Search } from 'lucide-react';
import { SEOMeta, BreadcrumbSchema } from '../lib/seo';

const ALL_POSTS = '全部';

// ─── Animation ───────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

// ═════════════════════════════════════════════════════════════
const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(ALL_POSTS);

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

  const categories = [ALL_POSTS, ...Array.from(new Set(posts.map((p) => p.category || '未分類')))];
  const filteredPosts = filter === ALL_POSTS ? posts : posts.filter((p) => p.category === filter);

  // Featured = first post when viewing ALL
  const featuredPost = filter === ALL_POSTS && filteredPosts.length > 0 ? filteredPosts[0] : null;
  const gridPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts;

  // ── Loading ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="relative">
            <Loader2 className="animate-spin dark:text-emerald-500/30 text-emerald-600/30" size={52} strokeWidth={1} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] dark:text-white/30 text-morandi-stone/50">
              解密知識庫
            </p>
            <p className="text-[8px] font-mono dark:text-white/10 text-morandi-stone/20 tracking-widest">
              DECRYPTING :: KNOWLEDGE_BASE
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen pt-[130px] sm:pt-[160px] pb-24 sm:pb-32 px-5 sm:px-8 max-w-7xl mx-auto relative overflow-x-hidden"
      >
        {/* ── Ambient glow ──────────────────────────────── */}
        <div className="fixed top-0 right-0 w-[50vw] h-[50vh] dark:bg-emerald-500/5 bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />
        <div className="fixed bottom-0 left-0 w-[40vw] h-[40vh] dark:bg-sky-500/5 bg-sky-500/8 blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* ══ HEADER ═══════════════════════════════════════ */}
        <header className="mb-14 sm:mb-16 md:mb-20 relative z-10">
          {/* ── Eyeline ──────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 mb-8 sm:mb-12"
          >
            <span className="dark:text-emerald-400/60 text-emerald-600/80 text-[8px] sm:text-[9px] font-mono font-black tracking-[0.3em] uppercase">
              // ENGINEERING PROTOCOL
            </span>
            <span className="w-px h-3 dark:bg-emerald-500/30 bg-emerald-500/50" />
            <span className="dark:text-emerald-400/30 text-emerald-600/30 text-[7px] font-mono tracking-widest">
              v2.4
            </span>
          </motion.div>

          {/* ── Main heading ─────────────────────────────── */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
            className="text-[clamp(2.5rem,10vw,6rem)] md:text-[clamp(3.5rem,7vw,7rem)] font-black tracking-tight leading-[0.88] dark:text-white text-morandi-slate select-none mb-5 sm:mb-7"
          >
            技術筆記
          </motion.h1>

          {/* ── Separator + metadata ─────────────────────── */}
          <div className="flex items-center gap-4 pb-5 sm:pb-6 border-b dark:border-white/[0.06] border-black/[0.06]">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="h-px dark:bg-emerald-500/50 bg-emerald-600/60 origin-left flex-1 max-w-[120px]"
            />
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="text-[9px] sm:text-[10px] font-mono tracking-[0.2em] dark:text-white/25 text-morandi-stone/40 whitespace-nowrap"
            >
              {filteredPosts.length} ARTICLES
            </motion.span>
            <span className="w-px h-3 dark:bg-white/8 bg-black/8" />
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-[9px] sm:text-[10px] font-mono tracking-[0.15em] dark:text-white/15 text-morandi-stone/30"
            >
              KNOWLEDGE BASE
            </motion.span>
          </div>

          {/* ── Category filter ──────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="mt-5 sm:mt-6 flex flex-wrap items-center gap-x-2 gap-y-2"
          >
            {categories.map((cat, i) => (
              <React.Fragment key={cat}>
                {i > 0 && (
                  <span className="dark:text-white/8 text-morandi-stone/[0.07] mx-0.5 select-none text-xs font-extralight">/</span>
                )}
                <button
                  onClick={() => setFilter(cat)}
                  className={`
                    text-[10px] sm:text-[11px] font-mono font-black tracking-[0.2em] uppercase
                    transition-all duration-300 py-1 relative
                    ${filter === cat
                      ? 'dark:text-emerald-300 text-emerald-700'
                      : 'dark:text-white/15 text-morandi-stone/25 hover:dark:text-white/35 hover:text-morandi-slate/45'
                    }
                  `}
                >
                  {cat}
                </button>
              </React.Fragment>
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
            <div className="max-w-xs mx-auto">
              <BookOpen className="mx-auto mb-8 dark:text-white/5 text-morandi-slate/10" size={80} strokeWidth={0.8} />
              <p className="dark:text-white/20 text-morandi-stone/40 font-black uppercase tracking-[0.35em] text-[11px] mb-4">
                此分類尚無任何筆記
              </p>
              <p className="dark:text-white/10 text-morandi-stone/20 text-[9px] font-mono tracking-wider">
                NO PROTOCOLS PUBLISHED
              </p>
            </div>
          </motion.div>
        ) : (
          <>
            {/* ── Featured Post ────────────────────────────── */}
            {featuredPost && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="mb-10 sm:mb-14 lg:mb-16 group"
              >
                <Link to={`/blog/${featuredPost.id}`} className="block">
                  <div className="
                    relative overflow-hidden rounded-3xl border dark:border-white/[0.06] border-black/[0.06]
                    transition-all duration-700
                    dark:hover:border-white/15 hover:border-emerald-500/30
                    dark:bg-white/[0.02] bg-white/80
                    dark:hover:bg-white/[0.04] hover:bg-white/95
                    hover:-translate-y-1.5
                    dark:shadow-[0_30px_80px_-40px_rgba(16,185,129,0.12)]
                  ">
                    <div className="grid md:grid-cols-2 gap-0">
                      {/* Image side */}
                      <div className="relative aspect-[4/3] md:aspect-auto md:h-full min-h-[280px] sm:min-h-[340px] overflow-hidden bg-black">
                        <img
                          src={featuredPost.image}
                          alt={featuredPost.title}
                          className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-75 group-hover:scale-105 transition-all duration-[1.2s] ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r dark:from-black/90 from-black/30 via-black/20 to-transparent" />

                        {/* Category badge */}
                        <div className="absolute top-4 left-4 z-10">
                          <span className="px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] dark:bg-emerald-500/20 bg-emerald-500/80 dark:text-emerald-300 text-white backdrop-blur-sm border dark:border-emerald-500/30 border-emerald-500/40">
                            {featuredPost.category || '技術筆記'}
                          </span>
                        </div>

                        {/* Latest badge */}
                        <div className="absolute top-4 right-4 z-10">
                          <span className="px-3 py-1.5 rounded-lg text-[7px] font-black uppercase tracking-[0.25em] dark:bg-white/10 bg-black/50 dark:text-white/70 text-white/80 backdrop-blur-sm border dark:border-white/20 border-white/30">
                            <Zap size={10} className="inline -mt-0.5 mr-1 text-emerald-400" />
                            Latest Protocol
                          </span>
                        </div>
                      </div>

                      {/* Content side */}
                      <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] dark:text-white/25 text-morandi-stone/40 mb-4">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={12} className="text-emerald-500/60" />
                            {featuredPost.date}
                          </span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-[900] dark:text-white text-morandi-slate mb-4 leading-[1.15] group-hover:text-glow transition-all tracking-tight line-clamp-3">
                          {featuredPost.title}
                        </h2>

                        <p className="dark:text-white/45 text-morandi-stone/70 text-sm sm:text-base leading-relaxed mb-6 line-clamp-3">
                          {featuredPost.excerpt}
                        </p>

                        <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.18em] dark:text-emerald-400/70 text-emerald-700 group-hover:text-emerald-500 transition-colors">
                          閱讀全文
                          <ArrowRight size={15} className="group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* ── Grid Posts ──────────────────────────────── */}
            {gridPosts.length > 0 && (
              <motion.div
                key={filter}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 relative z-10"
              >
                <AnimatePresence mode="popLayout">
                  {(featuredPost ? [featuredPost, ...gridPosts] : gridPosts).slice(featuredPost ? 0 : 0).map((post, idx) => {
                    // Don't render featuredPost again in the grid - it's already shown above
                    if (featuredPost && idx === 0 && filter === ALL_POSTS) return null;
                    const actualIdx = featuredPost ? idx - 1 : idx;
                    if (featuredPost && idx === 0) return null;

                    return (
                      <motion.article
                        key={post.id}
                        layout
                        variants={itemVariants}
                        className="group"
                      >
                        <Link to={`/blog/${post.id}`} className="block h-full">
                          <div className="
                            relative h-full overflow-hidden rounded-2xl border dark:border-white/[0.06] border-black/[0.06]
                            transition-all duration-500
                            dark:hover:border-white/15 hover:border-emerald-500/30
                            dark:bg-white/[0.02] bg-white/80
                            dark:hover:bg-white/[0.04] hover:bg-white/95
                            hover:-translate-y-1.5
                          ">
                            {/* Image */}
                            <div className="relative aspect-[16/11] overflow-hidden bg-black">
                              <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover opacity-40 group-hover:opacity-65 group-hover:scale-105 transition-all duration-[1s] ease-out"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t dark:from-black/80 from-black/30 via-black/10 to-transparent" />
                              <div className="absolute top-3 left-3">
                                <span className="px-2.5 py-1 rounded-lg text-[7px] font-black uppercase tracking-widest dark:bg-black/60 bg-black/40 dark:text-white/70 text-white/90 backdrop-blur-sm border dark:border-white/10 border-white/20">
                                  {post.category}
                                </span>
                              </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                              <div className="flex items-center gap-3 text-[8px] font-black uppercase tracking-[0.2em] dark:text-white/20 text-morandi-stone/35 mb-3">
                                <span className="flex items-center gap-1">
                                  <Calendar size={10} className="text-emerald-500/50" />
                                  {post.date}
                                </span>
                              </div>

                              <h3 className="text-lg sm:text-xl font-[900] dark:text-white text-morandi-slate mb-3 leading-[1.2] group-hover:text-glow transition-all tracking-tight line-clamp-2">
                                {post.title}
                              </h3>

                              <p className="dark:text-white/35 text-morandi-stone/60 text-xs sm:text-sm leading-relaxed mb-5 line-clamp-2">
                                {post.excerpt}
                              </p>

                              <div className="flex items-center gap-2 dark:text-white/20 text-morandi-stone/30 group-hover:text-emerald-500 transition-colors text-[9px] font-black uppercase tracking-[0.18em]">
                                <Sparkles size={12} className="opacity-50" />
                Read
                                <ArrowRight size={13} className="ml-auto group-hover:translate-x-1.5 transition-transform" />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.article>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </>
        )}

        {/* ── Footer ──────────────────────────────────────── */}
        {filteredPosts.length > 0 && (
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-20 sm:mt-28 text-center"
          >
            <div className="w-px h-16 bg-gradient-to-b from-emerald-500/50 to-transparent mx-auto mb-6" />
            <p className="text-[9px] sm:text-[10px] font-mono dark:text-white/10 text-morandi-stone/20 tracking-[0.4em] uppercase">
              {filteredPosts.length} 篇筆記存檔
            </p>
          </motion.footer>
        )}
      </motion.div>
    </>
  );
};

export default BlogPage;
