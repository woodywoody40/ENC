
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ProjectsAPI } from '../services/apiClient';
import {
  ArrowRight, Loader2, Boxes, AlertCircle,
  Server, Shield, HardDrive, Network, Cloud,
  Terminal, Activity, Cpu,
  Code2, Database, Globe, Smartphone, Zap,
  Palette, LayoutDashboard, Users, Sparkles,
  Gamepad2, Video, MessageCircle, FileText,
  Map, Image, Calculator, Cog, Monitor,
  TrendingUp, Code, MapPin, Crosshair
} from 'lucide-react';

// ─── Tag visuals ─────────────────────────────────────────────
const tagVisuals: Record<string, { icon: React.ReactNode; accent: string; dot: string }> = {
  // Infrastructure
  VMware:       { icon: <Server size={11} />,      accent: 'from-amber-500/40',  dot: 'bg-amber-400' },
  Linux:        { icon: <Terminal size={11} />,     accent: 'from-sky-500/40',    dot: 'bg-sky-400' },
  Ubuntu:       { icon: <Terminal size={11} />,     accent: 'from-orange-500/40', dot: 'bg-orange-400' },
  'Ubuntu 24.04':{ icon: <Terminal size={11} />,    accent: 'from-orange-500/40', dot: 'bg-orange-400' },
  Fortinet:     { icon: <Shield size={11} />,       accent: 'from-red-500/40',    dot: 'bg-red-400' },
  HPE:          { icon: <HardDrive size={11} />,    accent: 'from-blue-500/40',   dot: 'bg-blue-400' },
  Networking:   { icon: <Network size={11} />,      accent: 'from-purple-500/40', dot: 'bg-purple-400' },
  Cloud:        { icon: <Cloud size={11} />,        accent: 'from-cyan-500/40',   dot: 'bg-cyan-400' },
  Security:     { icon: <Shield size={11} />,       accent: 'from-rose-500/40',   dot: 'bg-rose-400' },
  Storage:      { icon: <HardDrive size={11} />,    accent: 'from-indigo-500/40', dot: 'bg-indigo-400' },
  DevOps:       { icon: <Activity size={11} />,     accent: 'from-emerald-500/40',dot: 'bg-emerald-400' },
  vSphere:      { icon: <Monitor size={11} />,      accent: 'from-blue-500/40',   dot: 'bg-blue-400' },
  Automation:   { icon: <Cog size={11} />,          accent: 'from-zinc-500/40',   dot: 'bg-zinc-400' },
  // Frontend & Frameworks
  React:        { icon: <Code2 size={11} />,        accent: 'from-sky-500/40',    dot: 'bg-sky-400' },
  'Next.js':    { icon: <FileText size={11} />,     accent: 'from-white/30',      dot: 'bg-white/50' },
  TypeScript:   { icon: <Code size={11} />,         accent: 'from-blue-500/40',   dot: 'bg-blue-400' },
  'Tailwind CSS':{ icon: <Palette size={11} />,     accent: 'from-cyan-500/40',   dot: 'bg-cyan-400' },
  Vite:         { icon: <Zap size={11} />,          accent: 'from-yellow-500/40', dot: 'bg-yellow-400' },
  Canvas:       { icon: <Code2 size={11} />,        accent: 'from-purple-500/40', dot: 'bg-purple-400' },
  HTML5:        { icon: <Globe size={11} />,        accent: 'from-orange-500/40', dot: 'bg-orange-400' },
  Game:         { icon: <Gamepad2 size={11} />,     accent: 'from-rose-500/40',   dot: 'bg-rose-400' },
  Recharts:     { icon: <TrendingUp size={11} />,   accent: 'from-emerald-500/40',dot: 'bg-emerald-400' },
  // Cloud / Platform
  'Cloudflare D1':{ icon: <Database size={11} />,   accent: 'from-orange-500/40', dot: 'bg-orange-400' },
  'Cloudflare Pages':{icon: <Globe size={11} />,    accent: 'from-orange-500/40', dot: 'bg-orange-400' },
  PWA:          { icon: <Smartphone size={11} />,   accent: 'from-indigo-500/40', dot: 'bg-indigo-400' },
  WebAssembly:  { icon: <Cpu size={11} />,          accent: 'from-purple-500/40', dot: 'bg-purple-400' },
  HLS:          { icon: <Video size={11} />,        accent: 'from-green-500/40',  dot: 'bg-green-400' },
  // APIs & Services
  'YouTube API':{ icon: <Video size={11} />,        accent: 'from-red-500/40',    dot: 'bg-red-400' },
  'Twitch API': { icon: <MessageCircle size={11} />,accent: 'from-purple-500/40', dot: 'bg-purple-400' },
  'LINE API':   { icon: <MessageCircle size={11} />,accent: 'from-green-500/40',  dot: 'bg-green-400' },
  'Gemini API': { icon: <Sparkles size={11} />,     accent: 'from-blue-500/40',   dot: 'bg-blue-400' },
  'Google Maps API':{icon: <MapPin size={11} />,    accent: 'from-green-500/40',  dot: 'bg-green-400' },
  'Exchange Rate API':{icon: <TrendingUp size={11} />,accent:'from-yellow-500/40',dot:'bg-yellow-400'},
  TWSE:         { icon: <TrendingUp size={11} />,   accent: 'from-green-500/40',  dot: 'bg-green-400' },
  Leaflet:      { icon: <Map size={11} />,          accent: 'from-amber-500/40',  dot: 'bg-amber-400' },
  Geolocation:  { icon: <Crosshair size={11} />,    accent: 'from-cyan-500/40',   dot: 'bg-cyan-400' },
  // Applications & Features
  Dashboard:    { icon: <LayoutDashboard size={11} />,accent:'from-blue-500/40',  dot:'bg-blue-400' },
  CRM:          { icon: <Users size={11} />,        accent: 'from-violet-500/40', dot: 'bg-violet-400' },
  AI:           { icon: <Sparkles size={11} />,     accent: 'from-rose-500/40',   dot: 'bg-rose-400' },
  'Image Processing':{ icon: <Image size={11} />,   accent:'from-pink-500/40',   dot:'bg-pink-400' },
  OCR:          { icon: <FileText size={11} />,     accent: 'from-sky-500/40',    dot: 'bg-sky-400' },
  Calculator:   { icon: <Calculator size={11} />,   accent:'from-zinc-500/40',   dot:'bg-zinc-400' },
  'PDF.js':     { icon: <FileText size={11} />,     accent: 'from-red-500/40',    dot: 'bg-red-400' },
};

const defaultVis = { icon: null as React.ReactNode | null, accent: 'from-white/20', dot: 'bg-white/30' };
const getVis = (tag: string) => tagVisuals[tag] ?? defaultVis;

// ─── Tag categories (editorial taxonomy) ───────────────────
const TAG_CATEGORIES = [
  { id: '全部',     label: 'ALL PROJECTS' },
  { id: 'frontend', label: 'FRONTEND' },
  { id: 'infra',    label: 'INFRASTRUCTURE' },
  { id: 'apis',     label: 'APIS & SERVICES' },
  { id: 'platform', label: 'PLATFORM & APPS' },
] as const;

const CATEGORY_TAGS: Record<string, string[]> = {
  '全部':      [],
  frontend:   ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Canvas', 'HTML5', 'Vite', 'Recharts', 'Game'],
  infra:      ['VMware', 'Linux', 'Ubuntu 24.04', 'vSphere', 'Automation', 'Fortinet', 'HPE', 'Networking', 'Cloud', 'Security', 'Storage', 'DevOps'],
  apis:       ['YouTube API', 'Twitch API', 'LINE API', 'Gemini API', 'Google Maps API', 'Exchange Rate API', 'TWSE', 'Leaflet', 'Geolocation'],
  platform:   ['Cloudflare D1', 'Cloudflare Pages', 'PWA', 'WebAssembly', 'HLS', 'Dashboard', 'CRM', 'AI', 'Image Processing', 'OCR', 'Calculator', 'PDF.js'],
};

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
  const [activeCategory, setActiveCategory] = useState('全部');
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

  const filteredProjects = activeCategory === '全部'
    ? projects
    : projects.filter(p => p.tags?.some((t: string) => (CATEGORY_TAGS[activeCategory] || []).includes(t)));

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

        {/* ── Eyeline ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 mb-8 sm:mb-12"
        >
          <span className="dark:text-emerald-400/60 text-emerald-600/80 text-[8px] sm:text-[9px] font-mono font-black tracking-[0.3em] uppercase">
            // OPERATIONAL ARCHIVE
          </span>
          <span className="w-px h-3 dark:bg-emerald-500/30 bg-emerald-500/50" />
          <span className="dark:text-emerald-400/30 text-emerald-600/30 text-[7px] font-mono tracking-widest">
            v1.0
          </span>
        </motion.div>

        {/* ── Main heading ─────────────────────────────── */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          className="text-[clamp(3rem,14vw,8rem)] md:text-[clamp(4.5rem,9vw,9rem)] font-black tracking-tight leading-[0.88] dark:text-white text-morandi-slate select-none mb-5 sm:mb-7"
        >
          維運實績
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
            {filteredProjects.length} PROJECTS
          </motion.span>
          <span className="w-px h-3 dark:bg-white/8 bg-black/8" />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-[9px] sm:text-[10px] font-mono tracking-[0.15em] dark:text-white/15 text-morandi-stone/30"
          >
            CASE STUDIES · INFRASTRUCTURE
          </motion.span>
        </div>

        {/* ── Category filter ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-5 sm:mt-6 flex flex-wrap items-center gap-x-2 gap-y-2"
        >
          {TAG_CATEGORIES.map((cat, i) => (
            <React.Fragment key={cat.id}>
              {i > 0 && (
                <span className="dark:text-white/8 text-morandi-stone/[0.07] mx-0.5 select-none text-xs font-extralight">/</span>
              )}
              <button
                onClick={() => setActiveCategory(cat.id)}
                className={`
                  text-[10px] sm:text-[11px] font-mono font-black tracking-[0.2em] uppercase
                  transition-all duration-300 py-1 relative
                  ${activeCategory === cat.id
                    ? 'dark:text-emerald-300 text-emerald-700'
                    : 'dark:text-white/15 text-morandi-stone/25 hover:dark:text-white/35 hover:text-morandi-slate/45'
                  }
                `}
              >
                {cat.label}
              </button>
            </React.Fragment>
          ))}
        </motion.div>
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
              key={activeCategory}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {filteredProjects.map((project, idx) => {
                const primaryTag = project.tags?.[0] || '';
                const vis = getVis(primaryTag);
                const isFeatured = idx === 0 && activeCategory === '全部' && !error;

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
                            group-hover:dark:text-white group-hover:text-morandi-slate transition-all tracking-tight leading-tight
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
