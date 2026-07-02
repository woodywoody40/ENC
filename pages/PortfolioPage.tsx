
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ProjectsAPI } from '../services/apiClient';
import {
  ArrowRight, Loader2, Boxes, AlertCircle,
  Server, Shield, HardDrive, Network, Cloud,
  Terminal, Hash, Activity, Cpu
} from 'lucide-react';

// ─── Tag visuals ─────────────────────────────────────────────
const tagVisuals: Record<string, { icon: React.ReactNode; accent: string; dot: string }> = {
  VMware:     { icon: <Server size={11} />,     accent: 'from-amber-500/40',  dot: 'bg-amber-400' },
  Linux:      { icon: <Terminal size={11} />,   accent: 'from-sky-500/40',    dot: 'bg-sky-400' },
  Ubuntu:     { icon: <Terminal size={11} />,   accent: 'from-orange-500/40', dot: 'bg-orange-400' },
  Fortinet:   { icon: <Shield size={11} />,     accent: 'from-red-500/40',    dot: 'bg-red-400' },
  HPE:        { icon: <HardDrive size={11} />,  accent: 'from-blue-500/40',   dot: 'bg-blue-400' },
  Networking: { icon: <Network size={11} />,    accent: 'from-purple-500/40', dot: 'bg-purple-400' },
  Cloud:      { icon: <Cloud size={11} />,      accent: 'from-cyan-500/40',   dot: 'bg-cyan-400' },
  Security:   { icon: <Shield size={11} />,     accent: 'from-rose-500/40',   dot: 'bg-rose-400' },
  Storage:    { icon: <HardDrive size={11} />,  accent: 'from-indigo-500/40', dot: 'bg-indigo-400' },
  DevOps:     { icon: <Activity size={11} />,   accent: 'from-emerald-500/40',dot: 'bg-emerald-400' },
};

const defaultVis = { icon: <Hash size={11} />, accent: 'from-white/20', dot: 'bg-white/30' };
const getVis = (tag: string) => tagVisuals[tag] ?? defaultVis;

// ─── Animation ───────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

// ═════════════════════════════════════════════════════════════
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
        console.error('Fetch Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const allTags = ['全部', ...Array.from(new Set(projects.flatMap(p => p.tags || [])))];
  const filteredProjects = filter === '全部' ? projects : projects.filter(p => p.tags?.includes(filter));

  // ── Loading ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <Loader2 className="animate-spin dark:text-emerald-500/30 text-emerald-600/30" size={52} strokeWidth={1} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
          <div className="space-y-2 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] dark:text-white/30 text-morandi-stone/50">
              正在同步雲端節點
            </p>
            <p className="text-[8px] font-mono dark:text-white/10 text-morandi-stone/20 tracking-widest">
              FETCHING :: INFRASTRUCTURE_ARCHIVE
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-[120px] md:pt-[160px] pb-32 px-5 sm:px-8 max-w-7xl mx-auto overflow-x-hidden"
    >
      {/* ── Ambient glow ─────────────────────────────────── */}
      <div className="fixed top-1/4 -left-32 w-[40vw] h-[40vh] dark:bg-emerald-500/5 bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-0 -right-32 w-[35vw] h-[35vh] dark:bg-sky-500/5 bg-sky-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* ══ HEADER ══════════════════════════════════════════ */}
      <header className="mb-16 md:mb-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-12 h-px bg-gradient-to-r from-emerald-500/80 to-transparent" />
          <span className="dark:text-emerald-400/80 text-emerald-700 font-black text-[10px] sm:text-[11px] tracking-[0.35em] uppercase flex items-center gap-2.5">
            <Cpu size={13} /> Operational Archive
          </span>
        </motion.div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="relative min-w-0">
            <h1 className="text-[clamp(2.8rem,12vw,6rem)] md:text-[clamp(4rem,8vw,8rem)] font-black tracking-tight leading-[0.88] select-none">
              <span className="heading-gradient text-glow block">維運</span>
              <span className="dark:text-white/10 text-morandi-slate/20 italic font-light block -mt-2 sm:-mt-4">
                實績
              </span>
            </h1>
            <div className="absolute -top-12 -left-8 sm:-left-12 text-[6rem] sm:text-[10rem] md:text-[14rem] font-black dark:text-white/[0.015] text-morandi-slate/[0.03] -z-10 tracking-tight leading-none select-none pointer-events-none">
              PROJECTS
            </div>
          </div>

          <p className="dark:text-white/30 text-morandi-stone/60 text-xs sm:text-sm font-mono max-w-xs lg:text-right leading-relaxed shrink-0">
            {filteredProjects.length} 個基礎建設專案實錄<br className="hidden sm:block" />
            <span className="dark:text-white/10 text-morandi-stone/30 text-[10px]">CASE STUDIES · INFRASTRUCTURE</span>
          </p>
        </div>

        {/* ── Tag filter ────────────────────────────────── */}
        <div className="mt-10 sm:mt-14 overflow-x-auto pb-2 -mx-5 sm:-mx-8 px-5 sm:px-8">
          <div className="flex gap-2.5 min-w-max">
            {allTags.map(tag => {
              const isActive = filter === tag;
              const vis = tag !== '全部' ? getVis(tag) : null;
              return (
                <motion.button
                  key={tag}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setFilter(tag)}
                  className={`
                    relative px-4 py-2.5 rounded-xl text-[10px] font-black tracking-[0.15em] uppercase
                    transition-all duration-300 border whitespace-nowrap flex items-center gap-2
                    ${isActive
                      ? 'dark:bg-emerald-500/20 bg-emerald-500/90 dark:text-emerald-300 text-white border-emerald-500/40 dark:shadow-[0_0_30px_-8px_rgba(16,185,129,0.3)]'
                      : 'dark:bg-white/[0.04] bg-white/70 dark:text-white/40 text-morandi-stone/60 dark:border-white/8 border-black/8 hover:dark:border-white/20 hover:border-morandi-slate/30'
                    }
                  `}
                >
                  {vis?.icon}
                  {tag}
                </motion.button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ══ CONTENT ════════════════════════════════════════ */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto mb-20 p-8 rounded-3xl border dark:border-red-500/20 border-red-500/30 dark:bg-red-500/5 bg-red-500/10 text-center"
        >
          <AlertCircle className="mx-auto mb-5 text-red-500/80" size={44} strokeWidth={1.5} />
          <h4 className="dark:text-red-400/90 text-red-700 font-black uppercase tracking-widest text-xs mb-2">
            資料鏈路異常
          </h4>
          <p className="text-xs dark:text-red-300/50 text-red-600/60 font-mono leading-relaxed px-4">
            RLS 權限鎖定 · 資料表暫不允許讀取
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2.5 rounded-xl text-[10px] font-black tracking-[0.2em] uppercase dark:bg-white/10 bg-black/10 dark:text-white/60 text-black/60 hover:dark:bg-white/20 hover:bg-black/20 transition-colors"
          >
            重新連線
          </button>
        </motion.div>
      )}

      {!error && (
        <AnimatePresence mode="popLayout">
          {filteredProjects.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full py-28 text-center"
            >
              <div className="max-w-xs mx-auto">
                <Boxes className="mx-auto mb-8 dark:text-white/5 text-morandi-slate/10" size={80} strokeWidth={0.8} />
                <p className="dark:text-white/20 text-morandi-stone/40 font-black uppercase tracking-[0.35em] text-[11px] mb-4">
                  目前叢集中尚無部署
                </p>
                <p className="dark:text-white/10 text-morandi-stone/20 text-[9px] font-mono tracking-wider">
                  NO ACTIVE DEPLOYMENTS IN THIS CATEGORY
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={filter}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {filteredProjects.map((project, idx) => {
                const primaryTag = project.tags?.[0] || '';
                const vis = getVis(primaryTag);
                const isFeatured = idx === 0 && filter === '全部' && !error;

                return (
                  <motion.div
                    key={project.id}
                    variants={itemVariants}
                    layout
                    className={`group relative ${isFeatured ? 'md:col-span-2 lg:col-span-2' : ''}`}
                  >
                    <Link to={`/portfolio/${project.id}`} className="block h-full">
                      <div className={`
                        relative h-full overflow-hidden rounded-3xl border dark:border-white/[0.06] border-black/[0.06]
                        transition-all duration-700 
                        dark:hover:border-white/15 hover:border-morandi-slate/25
                        dark:bg-white/[0.02] bg-white/80
                        dark:hover:bg-white/[0.04] hover:bg-white/95
                        hover:-translate-y-1.5
                      `}>
                        {/* ── Accent gradient bar ─────────── */}
                        <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${vis.accent} to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500`} />

                        {/* ── Image ──────────────────────── */}
                        <div className={`relative overflow-hidden ${isFeatured ? 'aspect-[21/9] sm:aspect-[21/8]' : 'aspect-[16/10]'} bg-black`}>
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover opacity-40 group-hover:opacity-70 group-hover:scale-105 transition-all duration-[1.2s] ease-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t dark:from-black/80 from-black/40 via-black/10 to-transparent" />

                          {/* ── Tags on image ─────────────── */}
                          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                            {project.tags?.slice(0, isFeatured ? 3 : 2).map((t: string) => {
                              const tv = getVis(t);
                              return (
                                <span
                                  key={t}
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[7px] font-black uppercase tracking-widest dark:bg-black/60 bg-black/40 dark:text-white/60 text-white/80 backdrop-blur-sm border dark:border-white/10 border-white/20"
                                >
                                  {tv.icon} {t}
                                </span>
                              );
                            })}
                          </div>

                          {/* ── Featured badge ────────────── */}
                          {isFeatured && (
                            <div className="absolute bottom-3 left-4">
                              <span className="px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-[0.25em] dark:bg-emerald-500/20 bg-emerald-500/80 dark:text-emerald-300 text-white backdrop-blur-sm border dark:border-emerald-500/30 border-emerald-500/40">
                                Featured Case Study
                              </span>
                            </div>
                          )}
                        </div>

                        {/* ── Content ──────────────────────── */}
                        <div className={`p-6 ${isFeatured ? 'sm:p-8' : ''}`}>
                          <div className="flex items-center gap-2 mb-3">
                            <span className={`w-1.5 h-1.5 rounded-full ${vis.dot} opacity-70`} />
                            <span className="dark:text-white/25 text-morandi-stone/40 text-[8px] font-mono uppercase tracking-[0.2em]">
                              {primaryTag || 'INFRASTRUCTURE'}
                            </span>
                          </div>

                          <h3 className={`
                            font-[900] dark:text-white text-morandi-slate
                            group-hover:text-glow transition-all tracking-tight leading-tight
                            ${isFeatured ? 'text-2xl sm:text-3xl lg:text-4xl mb-4' : 'text-xl sm:text-2xl mb-3'}
                            line-clamp-2
                          `}>
                            {project.title}
                          </h3>

                          <p className={`
                            dark:text-white/40 text-morandi-stone/70 leading-relaxed
                            ${isFeatured ? 'text-sm sm:text-base mb-6' : 'text-[13px] mb-5'}
                            line-clamp-2
                          `}>
                            {project.description}
                          </p>

                          {/* ── Footer ────────────────────── */}
                          <div className="flex items-center justify-between pt-4 border-t dark:border-white/[0.04] border-black/[0.06]">
                            <span className="text-[8px] font-black dark:text-white/15 text-morandi-stone/30 uppercase tracking-[0.3em] dark:group-hover:text-white/30 group-hover:text-morandi-slate/60 transition-colors">
                              <span className="hidden sm:inline">View Case Study</span>
                              <span className="sm:hidden">Details</span>
                            </span>
                            <div className="flex items-center gap-2 dark:text-white/15 text-morandi-stone/30 group-hover:text-emerald-500 transition-all group-hover:translate-x-1.5">
                              <span className="text-[8px] font-black tracking-[0.15em] hidden sm:inline">→</span>
                              <ArrowRight size={16} strokeWidth={1.5} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* ── Footer counter ────────────────────────────────── */}
      {!error && filteredProjects.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 sm:mt-28 text-center"
        >
          <div className="w-px h-16 bg-gradient-to-b from-emerald-500/50 to-transparent mx-auto mb-6" />
          <p className="text-[9px] sm:text-[10px] font-mono dark:text-white/10 text-morandi-stone/20 tracking-[0.4em] uppercase">
            {filteredProjects.length} / {projects.length} 專案存檔
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PortfolioPage;
