import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BlogAPI } from '../services/apiClient';
import { Calendar, ArrowRight, Loader2, Clock, Hash, Zap, Sparkles } from 'lucide-react';
import { SEOMeta, BreadcrumbSchema } from '../lib/seo';

const ALL_POSTS = '全部';

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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-6">
      <div className="flex flex-col items-center gap-6 text-center">
        <Loader2 className="animate-spin dark:text-white/20 text-slate-900/20" size={56} strokeWidth={1} />
        <span className="text-[10px] font-black uppercase tracking-[0.35em] dark:text-white/20 text-slate-900/20">Decrypting Knowledge Base...</span>
      </div>
    </div>
  );

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
      <div className="fixed top-0 right-0 w-[60vw] h-[60vh] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed inset-0 opacity-[0.018] pointer-events-none -z-10" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '56px 56px' }} />

      <header className="mb-14 sm:mb-20 md:mb-28 relative z-10">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-3 sm:gap-4 mb-7 sm:mb-10"
        >
          <div className="w-10 sm:w-16 h-px bg-emerald-500 shadow-[0_0_15px_#10b981]" />
          <span className="dark:text-emerald-500 text-emerald-600 font-black text-[10px] sm:text-[11px] tracking-[0.28em] sm:tracking-[0.45em] uppercase flex items-center gap-3">
            <Zap size={14} /> Engineering Protocol
          </span>
        </motion.div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 lg:gap-16">
          <div className="relative min-w-0">
            <h2 className="text-[clamp(2rem,8vw,3.5rem)] md:text-[clamp(3rem,6vw,5rem)] font-black tracking-normal heading-gradient leading-[0.92] text-glow select-none">
              技術筆記
            </h2>
            <div className="absolute -top-8 -left-4 sm:-left-8 text-[4rem] sm:text-[5rem] md:text-[7rem] font-black dark:text-white/[0.02] text-morandi-slate/[0.04] -z-10 tracking-tight leading-none select-none pointer-events-none">
              KNOWLEDGE
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 sm:px-6 py-3 rounded-2xl text-[10px] font-black tracking-[0.16em] transition-all border ${
                  filter === cat
                    ? 'bg-emerald-500 text-black border-transparent shadow-[0_15px_35px_rgba(16,185,129,0.28)]'
                    : 'glass-panel dark:text-white/45 text-morandi-stone/65 dark:border-white/10 border-black/5 hover:border-emerald-500/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 relative z-10">
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post, idx) => (
            <motion.article
              key={post.id}
              layout
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="group"
            >
              <Link to={`/blog/${post.id}`} className="block h-full">
                <div className="glass-panel p-4 sm:p-5 h-full flex flex-col transition-all duration-500 hover:-translate-y-2 hover:border-emerald-500/40 dark:bg-black/40 bg-white/60 dark:border-white/10 border-black/5 dark:shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] group-hover:shadow-[0_40px_90px_-30px_rgba(16,185,129,0.2)] relative overflow-hidden rounded-3xl">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] group-hover:rotate-12 transition-all duration-700 pointer-events-none">
                    <Hash size={130} strokeWidth={1} />
                  </div>

                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-black shadow-2xl">
                    <img src={post.image} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out" alt={post.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 glass-panel dark:bg-white/10 bg-black/40 dark:border-white/20 border-black/30 dark:text-white text-white text-[9px] font-black tracking-widest backdrop-blur-xl rounded-xl">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col relative z-10 px-1 sm:px-2 pb-2">
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-black uppercase tracking-[0.22em] mb-5 dark:text-white/30 text-morandi-stone/45">
                      <div className="flex items-center gap-2">
                        <Calendar size={13} className="text-emerald-500/60" /> {post.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={13} className="text-emerald-500/60" /> 8 MIN
                      </div>
                    </div>

                    <h3 className="text-2xl sm:text-[1.7rem] lg:text-3xl font-[900] dark:text-white text-morandi-slate mb-5 leading-[1.18] group-hover:text-glow transition-all tracking-normal line-clamp-3">
                      {post.title}
                    </h3>

                    <p className="dark:text-slate-400 text-morandi-stone text-sm sm:text-base leading-relaxed mb-8 flex-1 line-clamp-3 font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                      {post.excerpt}
                    </p>

                    <div className="pt-5 border-t dark:border-white/5 border-black/5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Sparkles size={15} className="text-emerald-500/45 group-hover:animate-pulse shrink-0" />
                        <span className="text-[10px] font-black uppercase tracking-[0.22em] dark:text-white/25 text-morandi-stone/45 group-hover:text-emerald-500 transition-colors truncate">
                          Access Protocol
                        </span>
                      </div>
                      <ArrowRight size={18} className="dark:text-white/15 text-morandi-stone/20 group-hover:text-emerald-500 group-hover:translate-x-2 transition-all shrink-0" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      <footer className="mt-24 sm:mt-36 text-center opacity-20">
        <div className="w-px h-20 sm:h-24 bg-gradient-to-b from-emerald-500 to-transparent mx-auto mb-8 sm:mb-10" />
        <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.5em] sm:tracking-[0.8em] dark:text-white text-morandi-stone/40">End of Feed</p>
      </footer>
    </motion.div>
    </>
  );
};

export default BlogPage;
