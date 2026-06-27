
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ProjectsAPI } from '../services/apiClient';
import { ArrowRight, Loader2, Boxes, AlertCircle, PlusCircle } from 'lucide-react';

const PortfolioPage: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('全部');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await ProjectsAPI.list();
        setProjects(data || []);
      } catch (err: any) {
        console.error("Fetch Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const allTags = ['全部', ...Array.from(new Set(projects.flatMap(p => p.tags || [])))];
  const filteredProjects = filter === '全部' ? projects : projects.filter(p => p.tags?.includes(filter));

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <Loader2 className="animate-spin text-white/10" size={48} strokeWidth={1} />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">正在同步雲端節點...</p>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-[120px] md:pt-[180px] pb-32 px-6 max-w-7xl mx-auto"
    >
      <header className="mb-16 md:mb-24 text-center px-4">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="dark:text-white/40 text-morandi-stone font-black text-[10px] tracking-[0.5em] uppercase mb-6"
        >
          Operational Case Studies
        </motion.p>
        <motion.h2 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-[2.5rem] xs:text-[3rem] sm:text-[5rem] md:text-[7rem] lg:text-[9rem] font-black mb-12 tracking-tighter heading-gradient leading-[0.9] text-glow uppercase"
        >
          維運<span className="opacity-20 italic font-light">實績</span>
        </motion.h2>
        
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto overflow-x-auto no-scrollbar py-4 px-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className={`px-6 py-3 rounded-2xl text-[9px] md:text-[10px] font-black tracking-widest uppercase transition-all shrink-0 border ${
                filter === tag 
                  ? 'bg-morandi-slate text-white dark:bg-white dark:text-black border-transparent shadow-2xl scale-105' 
                  : 'bg-white/5 dark:text-slate-500 text-morandi-stone border-black/5 dark:border-white/5 hover:border-morandi-slate/30'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </header>

      {error && (
        <div className="glass-panel p-10 max-w-2xl mx-auto border-rose-500/20 text-center flex flex-col items-center gap-6 mb-20">
          <AlertCircle className="text-rose-500" size={48} />
          <div>
            <h4 className="text-white font-black uppercase tracking-widest mb-2">資料鏈路異常</h4>
            <p className="text-xs text-white/40 leading-relaxed px-4">
              偵測到 RLS 權限鎖定。這代表資料表暫不允許讀取。
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        <AnimatePresence mode="popLayout">
          {filteredProjects.length === 0 && !error ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-24 md:py-40 text-center glass-panel border-dashed border-white/5 bg-white/[0.01]"
            >
              <Boxes className="mx-auto mb-8 text-white/5" size={100} strokeWidth={0.5} />
              <p className="text-white/20 font-black uppercase tracking-[0.4em] text-xs px-6">目前叢集中尚無部署任何專案實績</p>
            </motion.div>
          ) : (
            filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group"
              >
                <Link to={`/portfolio/${project.id}`} className="block h-full">
                  <div className="glass-panel p-6 h-full flex flex-col transition-all duration-700 hover:-translate-y-4 hover:border-white/20 dark:bg-black/40 bg-white/40 border-white/5 shadow-xl">
                    <div className="aspect-[16/10] rounded-[2rem] overflow-hidden mb-8 bg-black relative">
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1s]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                    </div>
                    
                    <div className="flex-1 flex flex-col px-2">
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tags?.slice(0, 2).map((tag: string) => (
                          <span key={tag} className="text-[8px] font-black uppercase tracking-widest text-white/40 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-2xl font-[900] mb-4 text-white group-hover:text-glow transition-all tracking-tight leading-tight uppercase line-clamp-2">
                        {project.title}
                      </h3>
                      <p className="text-white/40 text-[13px] mb-8 leading-relaxed line-clamp-3 flex-1">
                        {project.description}
                      </p>
                      <div className="flex items-center justify-between pt-6 border-t border-white/5">
                        <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] group-hover:text-white/40 transition-colors">Infrastructure Details</span>
                        <ArrowRight size={18} className="text-white/20 group-hover:text-white group-hover:translate-x-3 transition-all" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PortfolioPage;
