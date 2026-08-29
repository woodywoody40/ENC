import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ProjectsAPI } from '../services/apiClient';
import { SEOMeta, BreadcrumbSchema } from '../lib/seo';
import BlurText from '../components/BlurText';
import FadingVideo from '../components/FadingVideo';
import {
  ArrowUpRight, Loader2, Boxes, AlertCircle,
  Server, Shield, HardDrive, Network, Cloud,
  Terminal, Activity, Cpu,
  Code2, Database, Globe, Smartphone, Zap,
  Palette, LayoutDashboard, Users, Sparkles,
  Gamepad2, Video, MessageCircle, FileText,
  Map, Image, Calculator, Cog, Monitor,
  TrendingUp, Code, MapPin, Crosshair,
} from 'lucide-react';
import { HERO_VIDEO } from '../constants';

const tagVisuals: Record<string, { icon: React.ReactNode }> = {
  VMware: { icon: <Server size={11} /> },
  Linux: { icon: <Terminal size={11} /> },
  Ubuntu: { icon: <Terminal size={11} /> },
  'Ubuntu 24.04': { icon: <Terminal size={11} /> },
  Fortinet: { icon: <Shield size={11} /> },
  HPE: { icon: <HardDrive size={11} /> },
  Networking: { icon: <Network size={11} /> },
  Cloud: { icon: <Cloud size={11} /> },
  Security: { icon: <Shield size={11} /> },
  Storage: { icon: <HardDrive size={11} /> },
  DevOps: { icon: <Activity size={11} /> },
  vSphere: { icon: <Monitor size={11} /> },
  Automation: { icon: <Cog size={11} /> },
  React: { icon: <Code2 size={11} /> },
  'Next.js': { icon: <FileText size={11} /> },
  TypeScript: { icon: <Code size={11} /> },
  'Tailwind CSS': { icon: <Palette size={11} /> },
  Vite: { icon: <Zap size={11} /> },
  Canvas: { icon: <Code2 size={11} /> },
  HTML5: { icon: <Globe size={11} /> },
  Game: { icon: <Gamepad2 size={11} /> },
  Recharts: { icon: <TrendingUp size={11} /> },
  'Cloudflare D1': { icon: <Database size={11} /> },
  'Cloudflare Pages': { icon: <Globe size={11} /> },
  PWA: { icon: <Smartphone size={11} /> },
  WebAssembly: { icon: <Cpu size={11} /> },
  HLS: { icon: <Video size={11} /> },
  'YouTube API': { icon: <Video size={11} /> },
  'Twitch API': { icon: <MessageCircle size={11} /> },
  'LINE API': { icon: <MessageCircle size={11} /> },
  'Gemini API': { icon: <Sparkles size={11} /> },
  'Google Maps API': { icon: <MapPin size={11} /> },
  'Exchange Rate API': { icon: <TrendingUp size={11} /> },
  TWSE: { icon: <TrendingUp size={11} /> },
  Leaflet: { icon: <Map size={11} /> },
  Geolocation: { icon: <Crosshair size={11} /> },
  Dashboard: { icon: <LayoutDashboard size={11} /> },
  CRM: { icon: <Users size={11} /> },
  AI: { icon: <Sparkles size={11} /> },
  'Image Processing': { icon: <Image size={11} /> },
  OCR: { icon: <FileText size={11} /> },
  Calculator: { icon: <Calculator size={11} /> },
  'PDF.js': { icon: <FileText size={11} /> },
};

const getVis = (tag: string) => tagVisuals[tag] ?? { icon: null };

const TAG_CATEGORIES = [
  { id: '全部', label: 'ALL' },
  { id: 'frontend', label: 'FRONTEND' },
  { id: 'infra', label: 'INFRASTRUCTURE' },
  { id: 'apis', label: 'APIS' },
  { id: 'platform', label: 'PLATFORM' },
] as const;

const CATEGORY_TAGS: Record<string, string[]> = {
  全部: [],
  frontend: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Canvas', 'HTML5', 'Vite', 'Recharts', 'Game'],
  infra: ['VMware', 'Linux', 'Ubuntu 24.04', 'vSphere', 'Automation', 'Fortinet', 'HPE', 'Networking', 'Cloud', 'Security', 'Storage', 'DevOps'],
  apis: ['YouTube API', 'Twitch API', 'LINE API', 'Gemini API', 'Google Maps API', 'Exchange Rate API', 'TWSE', 'Leaflet', 'Geolocation'],
  platform: ['Cloudflare D1', 'Cloudflare Pages', 'PWA', 'WebAssembly', 'HLS', 'Dashboard', 'CRM', 'AI', 'Image Processing', 'OCR', 'Calculator', 'PDF.js'],
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { filter: 'blur(10px)', opacity: 0, y: 28 },
  visible: {
    filter: 'blur(0px)',
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' as const },
  },
};

const blurIn = {
  initial: { filter: 'blur(10px)', opacity: 0, y: 20 },
  animate: { filter: 'blur(0px)', opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: 'easeOut' as const },
};

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

  const filteredProjects =
    activeCategory === '全部'
      ? projects
      : projects.filter((p) =>
          p.tags?.some((t: string) => (CATEGORY_TAGS[activeCategory] || []).includes(t))
        );

  if (loading) {
    return (
      <div className="blog-cinematic flex min-h-screen items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-6">
          <div className="liquid-glass flex h-16 w-16 items-center justify-center rounded-full">
            <Loader2 className="animate-spin text-white/50" size={24} strokeWidth={1.5} />
          </div>
          <p className="font-body text-sm font-light text-white/60">Syncing deployments…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOMeta
        title="維運實績"
        description="Woody 的基礎架構與系統部署專案案例 — VMware、Fortinet、HPE Storage、自動化備份。"
        path="/portfolio"
      />
      <BreadcrumbSchema items={[{ name: '首頁', path: '/' }, { name: '維運實績', path: '/portfolio' }]} />

      <div className="blog-cinematic relative min-h-screen overflow-hidden bg-black">
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-35">
          <FadingVideo
            src={HERO_VIDEO}
            className="absolute left-1/2 top-0 -translate-x-1/2 object-cover object-top"
            style={{ width: '120%', height: '70%', maxHeight: '640px' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/75 to-black" />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 mx-auto min-h-screen max-w-7xl px-5 pb-32 pt-[120px] sm:px-8 sm:pt-[140px] lg:px-16"
        >
          <header className="mb-14 text-center sm:mb-20">
            <motion.div
              {...blurIn}
              transition={{ ...blurIn.transition, delay: 0.2 }}
              className="liquid-glass mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2"
            >
              <span className="rounded-full bg-white px-2.5 py-0.5 font-body text-[10px] font-semibold uppercase tracking-wider text-black">
                Work
              </span>
              <span className="font-body text-sm font-light text-white/90">
                {filteredProjects.length} case studies · infrastructure archive
              </span>
            </motion.div>

            <BlurText
              text="維運實績"
              className="font-heading italic text-6xl leading-[0.85] tracking-[-3px] text-white md:text-7xl md:tracking-[-4px] lg:text-[5.5rem]"
              delay={0.15}
            />

            <motion.p
              {...blurIn}
              transition={{ ...blurIn.transition, delay: 0.55 }}
              className="mx-auto mt-4 max-w-2xl font-body text-sm font-light leading-tight text-white/90 md:text-base"
            >
              真實部署、可驗證架構 — 從虛擬化到資安、從備份到自動化。
            </motion.p>

            <motion.div
              {...blurIn}
              transition={{ ...blurIn.transition, delay: 0.75 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-2"
            >
              {TAG_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`
                    rounded-full px-4 py-1.5 font-body text-[11px] font-medium whitespace-nowrap transition-all
                    ${
                      activeCategory === cat.id
                        ? 'liquid-glass-strong text-white'
                        : 'liquid-glass text-white/70 hover:text-white'
                    }
                  `}
                >
                  {cat.label}
                </button>
              ))}
            </motion.div>
          </header>

          {error && (
            <div className="liquid-glass mx-auto mb-16 max-w-md rounded-[1.25rem] p-8 text-center">
              <AlertCircle className="mx-auto mb-4 text-white/50" size={36} strokeWidth={1.5} />
              <h4 className="mb-2 font-heading italic text-2xl text-white">資料鏈路異常</h4>
              <p className="mb-6 font-body text-sm font-light text-white/50">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="liquid-glass-strong rounded-full px-5 py-2.5 font-body text-sm font-medium text-white"
              >
                重新連線
              </button>
            </div>
          )}

          {!error && (
            <AnimatePresence mode="popLayout">
              {filteredProjects.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-28 text-center"
                >
                  <div className="liquid-glass mx-auto max-w-sm rounded-[1.25rem] p-10">
                    <Boxes className="mx-auto mb-6 text-white/20" size={48} strokeWidth={1} />
                    <p className="font-heading italic text-2xl text-white">目前叢集中尚無部署</p>
                    <p className="mt-2 font-body text-sm font-light text-white/40">
                      No active deployments in this category
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={activeCategory}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                  {filteredProjects.map((project, idx) => {
                    const primaryTag = project.tags?.[0] || '';
                    const isFeatured = idx === 0 && activeCategory === '全部';

                    return (
                      <motion.div
                        key={project.id}
                        variants={itemVariants}
                        layout
                        className={`group ${isFeatured ? 'md:col-span-2' : ''}`}
                      >
                        <Link to={`/portfolio/${project.id}`} className="block h-full">
                          <div className="liquid-glass relative flex h-full min-h-[340px] flex-col overflow-hidden rounded-[1.25rem] transition-transform duration-500 group-hover:-translate-y-1">
                            <div
                              className={`relative overflow-hidden bg-black ${
                                isFeatured ? 'aspect-[21/9] sm:aspect-[21/8]' : 'aspect-[16/10]'
                              }`}
                            >
                              <img
                                src={project.image}
                                alt={project.title}
                                className="h-full w-full object-cover opacity-45 transition-all duration-[1.2s] ease-out group-hover:scale-105 group-hover:opacity-70"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                                {project.tags?.slice(0, isFeatured ? 3 : 2).map((t: string) => {
                                  const tv = getVis(t);
                                  return (
                                    <span
                                      key={t}
                                      className="liquid-glass inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-body text-[10px] font-medium text-white/90"
                                    >
                                      {tv.icon} {t}
                                    </span>
                                  );
                                })}
                              </div>
                              {isFeatured && (
                                <div className="absolute bottom-3 left-4">
                                  <span className="liquid-glass-strong rounded-full px-3 py-1.5 font-body text-[10px] font-medium text-white">
                                    Featured Case Study
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className={`relative z-10 flex flex-1 flex-col p-6 ${isFeatured ? 'sm:p-8' : ''}`}>
                              <p className="mb-2 font-body text-[10px] font-medium uppercase tracking-[0.18em] text-white/40">
                                {primaryTag || 'INFRASTRUCTURE'}
                              </p>
                              <h3
                                className={`
                                  mb-3 line-clamp-2 font-heading italic leading-none tracking-[-1px] text-white
                                  ${isFeatured ? 'text-3xl sm:text-4xl' : 'text-2xl md:text-3xl'}
                                `}
                              >
                                {project.title}
                              </h3>
                              <p className="mb-5 line-clamp-2 flex-1 font-body text-sm font-light leading-snug text-white/75">
                                {project.description}
                              </p>
                              <div className="mt-auto flex items-center gap-2 font-body text-[12px] font-medium text-white/70 transition group-hover:text-white">
                                View Case Study
                                <ArrowUpRight
                                  size={14}
                                  className="ml-auto transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                />
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

          {!error && filteredProjects.length > 0 && (
            <motion.footer
              {...blurIn}
              transition={{ ...blurIn.transition, delay: 1 }}
              className="mt-20 flex justify-center sm:mt-28"
            >
              <div className="liquid-glass rounded-full px-5 py-2.5 font-body text-sm font-light text-white/70">
                {filteredProjects.length} / {projects.length} 專案存檔
              </div>
            </motion.footer>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default PortfolioPage;
