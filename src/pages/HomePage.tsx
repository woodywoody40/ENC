import { useState, useEffect, useRef } from 'react';
import { SEOMeta, BreadcrumbSchema } from '../lib/seo';
import {
  ArrowRight, Server, Shield,
  Briefcase, BookOpen, FileText, MapPin, Mail,
  Github, Globe, Loader2, ExternalLink, Terminal
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ConfigAPI, ProjectsAPI, BlogAPI } from '../services/apiClient';

/* ================================================================== */
/*  HomePage — 真實資料驅動的首頁                                        */
/*  不再硬寫假數字，所有內容來自後端 API                                    */
/* ================================================================== */

/* ---------- Scroll reveal ---------- */
function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.12) {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, shown };
}

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, shown } = useReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[opacity,transform] ${className}`}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : 'translateY(28px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ---------- Resume data parsers ---------- */
function parseSkills(str: string): { name: string; level: string }[] {
  if (!str) return [];
  return str.split(',').map(s => {
    const [name, level] = s.split(':');
    return { name: name?.trim() || '', level: level?.trim() || 'Advanced' };
  }).filter(s => s.name);
}

function parseExperience(md: string): { title: string; date: string; bullets: string[] }[] {
  const items: { title: string; date: string; bullets: string[] }[] = [];
  if (!md) return items;
  const lines = md.split('\n').map(l => l.trim()).filter(Boolean);
  let cur: any = null;
  for (const line of lines) {
    if (line.startsWith('### ')) {
      if (cur) items.push(cur);
      cur = { title: line.replace('### ', '').trim(), date: '', bullets: [] };
    } else if (line.startsWith('- ') && cur) {
      cur.bullets.push(line.replace('- ', '').trim());
    } else if (cur && !cur.date) {
      cur.date = line.trim();
    }
  }
  if (cur) items.push(cur);
  return items;
}

/* ================================================================== */
/*  HomePage                                                           */
/* ================================================================== */
const HomePage: React.FC = () => {
  const [configs, setConfigs] = useState<any>({});
  const [projects, setProjects] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [cfg, proj, blog] = await Promise.all([
          ConfigAPI.all(),
          ProjectsAPI.list(),
          BlogAPI.list(),
        ]);
        setConfigs(cfg || {});
        setProjects(proj || []);
        setPosts(blog || []);
      } catch (err) {
        console.error('HomePage fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="homepage-wrapper min-h-[100dvh] flex flex-col items-center justify-center bg-[#08090c]">
        <div className="w-4 h-4 rounded-full border border-white/[0.08] border-t-amber-400/50 animate-spin mb-4" />
        <span className="text-[9px] font-semibold uppercase tracking-[0.4em] text-white/15">Loading</span>
      </div>
    );
  }

  /* ─── Real data from backend ─── */
  const name = configs.resume_name || 'Woody Wu';
  const jobTitle = configs.resume_title || '系統維運工程師';
  const heroIntro = configs.hero_intro || '專注基礎架構、自動化部署與雲端維運，把複雜系統整理成可靠、可擴充的服務。';
  const summary = configs.resume_summary || '';
  const location = configs.resume_location || '';
  const email = configs.resume_email || '';
  const github = configs.resume_github || '';
  const linkedin = configs.resume_linkedin || '';
  const skills = parseSkills(configs.resume_skills);
  const experiences = parseExperience(configs.resume_experience);
  const statVm = configs.stat_vm || '';
  const statDefense = configs.stat_defense || '';
  const statUptime = configs.stat_uptime || '';

  return (
    <>
      <SEOMeta
        title="首頁"
        description={`${name} — ${jobTitle}。${heroIntro}`}
        path="/"
        keywords="網管,資安,維運,Linux,VMware,Fortinet,Ubuntu"
      />
      <BreadcrumbSchema items={[{ name: '首頁', path: '/' }]} />

      <div className="homepage-wrapper relative overflow-x-hidden bg-[#08090c] text-white">

        {/* ===== Atmospheric background ===== */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_0%,rgba(245,158,11,0.04)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_90%,rgba(56,189,248,0.03)_0%,transparent_50%)]" />
        </div>

        {/* ===== HERO ===== */}
        <section className="relative min-h-[85dvh] flex items-center pt-24 pb-12 z-10">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div
              className="absolute inset-0 opacity-20"
              style={{ background: 'linear-gradient(270deg, rgba(245,158,11,0.10) 0%, rgba(56,189,248,0.03) 25%, transparent 45%)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-[1]" />
          </div>

          <div className="relative w-full max-w-7xl mx-auto px-6 md:px-8 z-10">
            <Reveal delay={100}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.04] mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-semibold text-white/60 uppercase tracking-[0.12em]">Available for infrastructure consulting</span>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] text-white mb-6 text-balance">
                {name}
              </h1>
            </Reveal>

            <Reveal delay={250}>
              <p className="text-lg md:text-xl text-white/50 font-light mb-4 tracking-tight">
                {jobTitle}
              </p>
            </Reveal>

            <Reveal delay={300}>
              <p className="text-sm md:text-base text-white/55 leading-relaxed max-w-[48ch] mb-10 font-light">
                {heroIntro}
              </p>
            </Reveal>

            {/* Contact row */}
            <Reveal delay={350}>
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs text-white/40 mb-12">
                {location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-white/30" /> {location}
                  </span>
                )}
                {email && (
                  <span className="flex items-center gap-1.5">
                    <Mail size={13} className="text-white/30" /> {email}
                  </span>
                )}
                {github && (
                  <a href={github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white/70 transition-colors">
                    <Github size={13} className="text-white/30" /> GitHub
                  </a>
                )}
                {linkedin && (
                  <a href={linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white/70 transition-colors">
                    <Globe size={13} className="text-white/30" /> LinkedIn
                  </a>
                )}
              </div>
            </Reveal>

            <Reveal delay={400}>
              <div className="flex flex-wrap items-center gap-3">
                <Link to="/portfolio" className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full text-sm font-semibold hover:bg-white/90 active:scale-[0.97] transition-all">
                  <Briefcase size={15} /> 維運實績
                </Link>
                <Link to="/resume" className="inline-flex items-center gap-2 border border-white/15 text-white/70 px-6 py-3 rounded-full text-sm font-semibold hover:bg-white/[0.06] hover:text-white active:scale-[0.97] transition-all">
                  <FileText size={15} /> 技術履歷
                </Link>
                <Link to="/blog" className="inline-flex items-center gap-2 border border-white/15 text-white/70 px-6 py-3 rounded-full text-sm font-semibold hover:bg-white/[0.06] hover:text-white active:scale-[0.97] transition-all">
                  <BookOpen size={15} /> 技術筆記
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ===== LIVE DASHBOARD ===== */}
        <section className="relative z-10 px-6 md:px-8 py-20">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-10">
                即時概覽 <span className="text-white/25 font-normal">Live Dashboard</span>
              </h2>
            </Reveal>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <Reveal delay={60}>
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 md:p-6 hover:border-amber-500/20 transition-all duration-500 group">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Briefcase size={16} className="text-amber-400" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{projects.length}</div>
                  <div className="text-[10px] font-semibold text-white/40 uppercase tracking-[0.15em]">部署專案</div>
                  {projects.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/[0.04] text-[9px] text-white/25 font-medium truncate">
                      最近: {projects[0]?.title}
                    </div>
                  )}
                </div>
              </Reveal>

              <Reveal delay={120}>
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 md:p-6 hover:border-violet-500/20 transition-all duration-500 group">
                  <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <BookOpen size={16} className="text-violet-400" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{posts.length}</div>
                  <div className="text-[10px] font-semibold text-white/40 uppercase tracking-[0.15em]">技術文章</div>
                  {posts.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/[0.04] text-[9px] text-white/25 font-medium truncate">
                      最新: {posts[0]?.title}
                    </div>
                  )}
                </div>
              </Reveal>

              <Reveal delay={180}>
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 md:p-6 hover:border-emerald-500/20 transition-all duration-500 group">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Server size={16} className="text-emerald-400" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{statVm || '—'}</div>
                  <div className="text-[10px] font-semibold text-white/40 uppercase tracking-[0.15em]">虛擬主機</div>
                  {statDefense && (
                    <div className="mt-3 pt-3 border-t border-white/[0.04] text-[9px] text-white/25 font-medium">
                      {statDefense}
                    </div>
                  )}
                </div>
              </Reveal>

              <Reveal delay={240}>
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 md:p-6 hover:border-sky-500/20 transition-all duration-500 group">
                  <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Shield size={16} className="text-sky-400" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{statUptime || '—'}</div>
                  <div className="text-[10px] font-semibold text-white/40 uppercase tracking-[0.15em]">服務可用性</div>
                  <div className="mt-3 pt-3 border-t border-white/[0.04] text-[9px] text-white/25 font-medium">
                    全叢集監控中
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ===== SKILLS OVERVIEW ===== */}
        {skills.length > 0 && (
          <section className="relative z-10 px-6 md:px-8 py-20">
            <div className="max-w-7xl mx-auto">
              <Reveal>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-10">
                  核心技能 <span className="text-white/25 font-normal">Core Skills</span>
                </h2>
              </Reveal>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {skills.map((skill, i) => (
                  <Reveal key={`${skill.name}-${i}`} delay={i * 50}>
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 hover:border-white/15 transition-all duration-300 group">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-white/85">{skill.name}</span>
                        <span className={`text-[8px] font-semibold uppercase tracking-[0.12em] px-2 py-0.5 rounded-full ${
                          skill.level === 'Expert' ? 'bg-amber-500/10 text-amber-400/80 border border-amber-500/20' :
                          skill.level === 'Advanced' ? 'bg-sky-500/10 text-sky-400/80 border border-sky-500/20' :
                          'bg-emerald-500/10 text-emerald-400/80 border border-emerald-500/20'
                        }`}>
                          {skill.level}
                        </span>
                      </div>
                      <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            skill.level === 'Expert' ? 'bg-gradient-to-r from-amber-500/60 to-amber-400 w-[90%]' :
                            skill.level === 'Advanced' ? 'bg-gradient-to-r from-sky-500/60 to-sky-400 w-[70%]' :
                            'bg-gradient-to-r from-emerald-500/60 to-emerald-400 w-[60%]'
                          }`}
                        />
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===== EXPERIENCE TIMELINE ===== */}
        {experiences.length > 0 && (
          <section className="relative z-10 px-6 md:px-8 py-20">
            <div className="max-w-7xl mx-auto">
              <Reveal>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-10">
                  工作經歷 <span className="text-white/25 font-normal">Experience</span>
                </h2>
              </Reveal>

              <div className="relative pl-8 border-l border-white/[0.06] space-y-10">
                {experiences.map((exp, i) => (
                  <Reveal key={i} delay={i * 100}>
                    <div className="relative group">
                      <div className="absolute -left-[calc(2rem+5px)] top-1 w-2.5 h-2.5 rounded-full bg-amber-400/40 border-2 border-[#08090c] group-hover:bg-amber-400 group-hover:shadow-[0_0_10px_rgba(245,158,11,0.4)] transition-all duration-300" />

                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-3">
                        <h3 className="text-lg font-bold text-white/90">{exp.title}</h3>
                        <span className="text-xs font-semibold text-white/30 uppercase tracking-[0.1em] whitespace-nowrap">{exp.date}</span>
                      </div>

                      {exp.bullets.length > 0 && (
                        <ul className="space-y-2">
                          {exp.bullets.map((b, bi) => (
                            <li key={bi} className="flex items-start gap-3 text-sm text-white/45 font-light leading-relaxed">
                              <span className="w-1 h-1 rounded-full bg-white/15 mt-2 shrink-0" />
                              {b}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===== LATEST WORK ===== */}
        <section className="relative z-10 px-6 md:px-8 py-20">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <div className="flex items-end justify-between mb-10">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                  最新動態 <span className="text-white/25 font-normal">Latest</span>
                </h2>
                <Link to="/portfolio" className="text-xs font-semibold text-white/35 hover:text-amber-400/70 transition-colors uppercase tracking-[0.12em] flex items-center gap-1.5">
                  全部 <ArrowRight size={13} />
                </Link>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Recent Projects */}
              <div className="space-y-2">
                <Reveal delay={50}>
                  <h3 className="text-[9px] font-semibold text-white/30 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Briefcase size={11} /> 最近專案
                  </h3>
                </Reveal>
                {projects.slice(0, 3).map((proj, i) => (
                  <Reveal key={proj.id} delay={80 + i * 60}>
                    <Link
                      to={`/project/${proj.id}`}
                      className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-200 group"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/40 border border-white/[0.06] shrink-0">
                        {proj.image ? (
                          <img src={proj.image} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Briefcase size={16} className="text-white/10" /></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors truncate">{proj.title}</div>
                        <div className="text-[9px] font-medium text-white/30 mt-1 uppercase tracking-wider truncate">
                          {Array.isArray(proj.tags) ? proj.tags.slice(0, 3).join(' · ') : ''}
                        </div>
                      </div>
                      <ExternalLink size={12} className="text-white/10 group-hover:text-amber-400/60 transition-colors shrink-0" />
                    </Link>
                  </Reveal>
                ))}
                {projects.length === 0 && (
                  <div className="text-center py-8 text-white/15 text-xs font-medium">尚無專案</div>
                )}
              </div>

              {/* Recent Posts */}
              <div className="space-y-2">
                <Reveal delay={50}>
                  <h3 className="text-[9px] font-semibold text-white/30 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <BookOpen size={11} /> 最近文章
                  </h3>
                </Reveal>
                {posts.slice(0, 3).map((post, i) => (
                  <Reveal key={post.id} delay={80 + i * 60}>
                    <Link
                      to={`/blog/${post.id}`}
                      className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-200 group"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/40 border border-white/[0.06] shrink-0">
                        {post.image ? (
                          <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><BookOpen size={16} className="text-white/10" /></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors truncate">{post.title}</div>
                        <div className="text-[9px] font-medium text-white/30 mt-1 uppercase tracking-wider">
                          {post.category}{post.category && post.date ? ' · ' : ''}{post.date}
                        </div>
                      </div>
                      <ExternalLink size={12} className="text-white/10 group-hover:text-amber-400/60 transition-colors shrink-0" />
                    </Link>
                  </Reveal>
                ))}
                {posts.length === 0 && (
                  <div className="text-center py-8 text-white/15 text-xs font-medium">尚無文章</div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ===== ABOUT / SUMMARY ===== */}
        {summary && (
          <section className="relative z-10 px-6 md:px-8 py-20">
            <div className="max-w-7xl mx-auto">
              <Reveal>
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 md:p-12 hover:border-white/10 transition-all duration-500">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                      <Terminal size={16} className="text-amber-400/60" />
                    </div>
                    <h2 className="text-lg font-bold text-white tracking-tight">關於我</h2>
                  </div>
                  <p className="text-sm md:text-base text-white/50 leading-relaxed font-light max-w-3xl whitespace-pre-line">
                    {summary}
                  </p>
                </div>
              </Reveal>
            </div>
          </section>
        )}

        {/* ===== CTA ===== */}
        <section className="relative z-10 px-6 md:px-8 py-24">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <div className="text-center">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-white mb-6">
                  需要基礎架構協助？<br />
                  <span className="text-white/20 font-normal">Let's talk infrastructure.</span>
                </h2>
                <p className="text-sm text-white/35 mb-10 max-w-md mx-auto font-light leading-relaxed">
                  無論是虛擬化規劃、資安架構調整，或是自動化部署導入，歡迎交流討論。
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link
                    to="/resume"
                    className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full text-sm font-semibold hover:bg-white/90 active:scale-[0.97] transition-all"
                  >
                    <FileText size={15} /> 查看完整履歷
                  </Link>
                  <a
                    href={`mailto:${email || 'woody@enc.moe'}`}
                    className="inline-flex items-center gap-2 border border-white/15 text-white/70 px-6 py-3 rounded-full text-sm font-semibold hover:bg-white/[0.06] hover:text-white active:scale-[0.97] transition-all"
                  >
                    <Mail size={15} /> 來信討論
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="relative z-10 px-6 md:px-8 py-12 border-t border-white/[0.04]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/15">
              {name} · {jobTitle}
            </p>
            <div className="flex items-center gap-6 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/15">
              <Link to="/portfolio" className="hover:text-amber-400/50 transition-colors">Portfolio</Link>
              <Link to="/blog" className="hover:text-amber-400/50 transition-colors">Notes</Link>
              <Link to="/resume" className="hover:text-amber-400/50 transition-colors">Resume</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;

