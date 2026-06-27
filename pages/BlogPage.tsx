
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BlogAPI } from '../services/apiClient';
import { Calendar, ArrowRight, Loader2, BookOpen, Clock, Hash, Zap, Sparkles } from 'lucide-react';

const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('全部');

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

  const categories = ['全部', ...Array.from(new Set(posts.map(p => p.category || '未分類')))];
  const filteredPosts = filter === '全部' ? posts : posts.filter(p => p.category === filter);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <div className="flex flex-col items-center gap-6">
        <Loader2 className="animate-spin dark:text-white/20 text-slate-900/20" size={60} strokeWidth={1} />
        <span className="text-[10px] font-black uppercase tracking-[0.5em] dark:text-white/20 text-slate-900/20">Decrypting Knowledge Base...</span>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-[160px] pb-32 px-6 max-w-7xl mx-auto relative"
    >
      {/* 背景裝飾：動態科技光暈 */}
      <div className="fixed top-0 right-0 w-[60vw] h-[60vh] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[40vw] h-[40vh] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none -z-10" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <header className="mb-32 relative z-10">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-4 mb-10"
        >
          <div className="w-16 h-[1px] bg-emerald-500 shadow-[0_0_15px_#10b981]" />
          <span className="dark:text-emerald-500 text-emerald-600 font-black text-[11px] tracking-[0.6em] uppercase flex items-center gap-3">
            <Zap size={14} /> Engineering Protocol
          </span>
        </motion.div>
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-16">
          <div className="relative">
             <h2 className="text-7xl md:text-[10rem] font-[900] tracking-tighter heading-gradient leading-[0.8] text-glow uppercase select-none">
              技術<span className="opacity-10 italic font-light">週記</span>
            </h2>
            <div className="absolute -top-12 -left-8 text-[12rem] font-black text-white/[0.02] -z-10 tracking-tighter leading-none select-none pointer-events-none">
              KNOWLEDGE
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                  filter === cat 
                    ? 'bg-emerald-500 text-black border-transparent shadow-[0_15px_40px_rgba(16,185,129,0.4)] scale-105' 
                    : 'glass-panel dark:text-white/40 text-morandi-stone/60 dark:border-white/10 border-black/5 hover:border-emerald-500/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 relative z-10">
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post, idx) => (
            <motion.article
              key={post.id}
              layout
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="group"
            >
              <Link to={`/blog/${post.id}`} className="block h-full">
                <div className="glass-panel p-8 h-full flex flex-col transition-all duration-700 hover:-translate-y-5 hover:border-emerald-500/40 dark:bg-black/40 bg-white/60 dark:border-white/10 border-black/5 dark:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] group-hover:shadow-[0_60px_120px_-20px_rgba(16,185,129,0.15)] relative overflow-hidden rounded-[3rem]">
                  
                  {/* 背景裝飾：浮水印 */}
                  <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] group-hover:rotate-12 transition-all duration-700 pointer-events-none">
                    <Hash size={160} strokeWidth={1} />
                  </div>

                  <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden mb-10 bg-black shadow-2xl">
                    <img src={post.image} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[1.5s] ease-out" alt={post.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
                    <div className="absolute top-6 left-6">
                       <span className="px-5 py-2 glass-panel bg-white/10 border-white/20 text-white text-[9px] font-black uppercase tracking-widest backdrop-blur-xl">
                         {post.category}
                       </span>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col relative z-10">
                    <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.5em] mb-8 dark:text-white/30 text-morandi-stone/40">
                      <div className="flex items-center gap-2.5">
                        <Calendar size={14} className="text-emerald-500/60" /> {post.date}
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Clock size={14} className="text-emerald-500/60" /> 8 MIN READ
                      </div>
                    </div>
                    
                    <h3 className="text-3xl lg:text-4xl font-[900] dark:text-white text-morandi-slate mb-8 leading-[1.1] group-hover:text-glow transition-all tracking-tighter uppercase line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="dark:text-slate-400 text-morandi-stone text-base leading-relaxed mb-12 flex-1 line-clamp-3 font-medium opacity-60 group-hover:opacity-100 transition-opacity">
                      {post.excerpt}
                    </p>
                    
                    <div className="pt-8 border-t dark:border-white/5 border-black/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Sparkles size={16} className="text-emerald-500/40 group-hover:animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] dark:text-white/20 text-morandi-stone/40 group-hover:text-emerald-500 transition-colors">
                          Access Protocol
                        </span>
                      </div>
                      <ArrowRight size={20} className="dark:text-white/10 text-morandi-stone/10 group-hover:text-emerald-500 group-hover:translate-x-4 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
      
      {/* 底部裝飾 */}
      <footer className="mt-40 text-center opacity-20">
        <div className="w-px h-24 bg-gradient-to-b from-emerald-500 to-transparent mx-auto mb-10" />
        <p className="text-[11px] font-black uppercase tracking-[1em] dark:text-white">End of Feed</p>
      </footer>
    </motion.div>
  );
};

export default BlogPage;
