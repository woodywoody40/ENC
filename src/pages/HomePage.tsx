import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SEOMeta, BreadcrumbSchema } from '../lib/seo';
import {
  ArrowUpRight, Server, Shield, Briefcase, BookOpen, FileText,
  MapPin, Mail, Github, Globe, Terminal, Play,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ConfigAPI, ProjectsAPI, BlogAPI } from '../services/apiClient';
import BlurText from '../components/BlurText';
import FadingVideo from '../components/FadingVideo';
import { HERO_VIDEO, CAP_VIDEO } from '../constants';

const blurIn = {
  initial: { filter: 'blur(10px)', opacity: 0, y: 20 },
  animate: { filter: 'blur(0px)', opacity: 1, y: 0 },
};

const easeOut = { duration: 0.8, ease: 'easeOut' as const };

function parseSkills(str: string): { name: string; level: string }[] {
  if (!str) return [];
  return str
    .split(',')
    .map((s) => {
      const [name, level] = s.split(':');
      return { name: name?.trim() || '', level: level?.trim() || 'Advanced' };
    })
    .filter((s) => s.name);
}

function parseExperience(md: string): { title: string; date: string; bullets: string[] }[] {
  const items: { title: string; date: string; bullets: string[] }[] = [];
  if (!md) return items;
  const lines = md.split('\n').map((l) => l.trim()).filter(Boolean);
  let cur: { title: string; date: string; bullets: string[] } | null = null;
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

const CAPABILITIES = [
  {
    title: 'Infrastructure',
    icon: Server,
    tags: ['VMware', 'vSphere', 'Linux', 'Storage'],
    body: '虛擬化叢集、儲存調度與標準化部署流程 — 從機房到雲端的可重現基礎架構。',
  },
  {
    title: 'Security',
    icon: Shield,
    tags: ['TANet', 'CEH', 'Firewall', 'Hardening'],
    body: '學術網路資安監控、弱點掃描與事件應處 — 把防禦寫進日常維運節奏。',
  },
  {
    title: 'Automation',
    icon: Terminal,
    tags: ['Backup', 'SOP', 'Scripting', 'Observability'],
    body: '備份策略、修補 SOP 與可觀測性 — 讓系統在半夜也能自己站穩。',
  },
];

const HomePage: React.FC = () => {
  const [configs, setConfigs] = useState<Record<string, string>>({});
  const [projects, setProjects] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingSecondary, setLoadingSecondary] = useState(true);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 120]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.35]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const cfg = await ConfigAPI.all();
        if (!cancelled) setConfigs(cfg || {});
      } catch (err) {
        console.error('HomePage config fetch error:', err);
      }
    })();
    (async () => {
      try {
        const [proj, blog] = await Promise.all([ProjectsAPI.list(), BlogAPI.list()]);
        if (!cancelled) {
          setProjects(proj || []);
          setPosts(blog || []);
        }
      } catch (err) {
        console.error('HomePage list fetch error:', err);
      } finally {
        if (!cancelled) setLoadingSecondary(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const name = configs.resume_name || 'Woody Wu';
  const heroTitle = configs.hero_title || name;
  const jobTitle = configs.resume_title || '系統維運工程師';
  const heroIntro =
    configs.hero_intro ||
    '專注基礎架構、自動化部署與雲端維運，把複雜系統整理成可靠、可擴充的服務。';
  const summary = configs.resume_summary || '';
  const location = configs.resume_location || '';
  const email = configs.resume_email || '';
  const github = configs.resume_github || '';
  const linkedin = configs.resume_linkedin || '';
  const extraLinks: { label: string; url: string }[] = (() => {
    try {
      return JSON.parse(configs.resume_extra_links || '[]');
    } catch {
      return [];
    }
  })();
  const skills = parseSkills(configs.resume_skills || '');
  const experiences = parseExperience(configs.resume_experience || '');
  const statVm = configs.stat_vm || '151+';
  const statDefense = configs.stat_defense || '';
  const statUptime = configs.stat_uptime || '99.9%';

  const capabilities = [
    {
      title: configs.about_skill1_title || 'Infrastructure',
      icon: Server,
      tags: ['VMware', 'vSphere', 'Linux', 'Storage'],
      body: configs.about_skill1_desc || '虛擬化叢集、儲存調度與標準化部署流程 — 從機房到雲端的可重現基礎架構。',
    },
    {
      title: configs.about_skill2_title || 'Security',
      icon: Shield,
      tags: ['TANet', 'CEH', 'Firewall', 'Hardening'],
      body: configs.about_skill2_desc || '學術網路資安監控、弱點掃描與事件應處 — 把防禦寫進日常維運節奏。',
    },
    {
      title: configs.about_skill3_title || 'Automation',
      icon: Terminal,
      tags: ['Backup', 'SOP', 'Scripting', 'Observability'],
      body: configs.about_skill3_desc || '備份策略、修補 SOP 與可觀測性 — 讓系統在半夜也能自己站穩。',
    },
  ];

  return (
    <>
      <SEOMeta
        title="首頁"
        description={`${name} — ${jobTitle}。${heroIntro}`}
        path="/"
        keywords="網管,資安,維運,Linux,VMware,Fortinet,Ubuntu"
      />
      <BreadcrumbSchema items={[{ name: '首頁', path: '/' }]} />

      <div className="blog-cinematic relative overflow-x-hidden bg-black text-white">
        {/* ════════════════════════════════ HERO ════════════════════════════════ */}
        <section className="relative h-screen overflow-hidden bg-black">
          <motion.div className="absolute inset-0 z-0" style={{ y: heroY, opacity: heroOpacity }}>
            <FadingVideo
              src={HERO_VIDEO}
              className="absolute left-1/2 top-0 -translate-x-1/2 object-cover object-top"
              style={{ width: '120%', height: '120%' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.55)_100%)]" />
          </motion.div>

          <div className="relative z-10 flex h-full flex-col">
            {/* Main hero content */}
            <div className="flex flex-1 flex-col items-center justify-center px-4 pt-24 text-center">
              <motion.div
                {...blurIn}
                transition={{ ...easeOut, delay: 0.35 }}
                className="liquid-glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2"
              >
                <span className="rounded-full bg-white px-2.5 py-0.5 font-body text-[10px] font-semibold uppercase tracking-wider text-black">
                  Live
                </span>
                <span className="font-body text-sm font-light text-white/90">
                  Infrastructure · Security · Automation
                </span>
              </motion.div>

              <div className="mt-2 max-w-4xl">
                <BlurText
                  text={heroTitle}
                  className="font-heading italic text-6xl leading-[0.8] tracking-[-3px] text-white md:text-7xl md:tracking-[-4px] lg:text-[5.5rem]"
                  delay={0.2}
                />
              </div>

              <motion.p
                {...blurIn}
                transition={{ ...easeOut, delay: 0.7 }}
                className="mt-3 font-heading italic text-xl tracking-tight text-white/70 md:text-2xl"
              >
                {jobTitle}
              </motion.p>

              <motion.p
                {...blurIn}
                transition={{ ...easeOut, delay: 0.85 }}
                className="mt-4 max-w-2xl font-body text-sm font-light leading-tight text-white md:text-base"
              >
                {heroIntro}
              </motion.p>

              <motion.div
                {...blurIn}
                transition={{ ...easeOut, delay: 1.05 }}
                className="mt-6 flex flex-wrap items-center justify-center gap-4 md:gap-6"
              >
                <Link
                  to="/portfolio"
                  className="liquid-glass-strong inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-body text-sm font-medium text-white transition hover:scale-[1.02] active:scale-[0.98]"
                >
                  維運實績 <ArrowUpRight size={16} />
                </Link>
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 font-body text-sm font-medium text-white/80 transition hover:text-white"
                >
                  <Play size={14} className="fill-white/80" /> 技術筆記
                </Link>
                <Link
                  to="/resume"
                  className="inline-flex items-center gap-2 font-body text-sm font-medium text-white/80 transition hover:text-white"
                >
                  <FileText size={14} /> 技術履歷
                </Link>
              </motion.div>

              {/* Contact chips */}
              <motion.div
                {...blurIn}
                transition={{ ...easeOut, delay: 1.15 }}
                className="mt-6 flex flex-wrap items-center justify-center gap-3"
              >
                {location && (
                  <span className="liquid-glass inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-body text-[11px] font-light text-white/70">
                    <MapPin size={12} /> {location}
                  </span>
                )}
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="liquid-glass inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-body text-[11px] font-light text-white/70 transition hover:text-white"
                  >
                    <Mail size={12} /> {email}
                  </a>
                )}
                {github && (
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="liquid-glass inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-body text-[11px] font-light text-white/70 transition hover:text-white"
                  >
                    <Github size={12} /> GitHub
                  </a>
                )}
                {linkedin && (
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="liquid-glass inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-body text-[11px] font-light text-white/70 transition hover:text-white"
                  >
                    <Globe size={12} /> LinkedIn
                  </a>
                )}
                {extraLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="liquid-glass inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-body text-[11px] font-light text-white/70 transition hover:text-white"
                  >
                    <Globe size={12} /> {link.label}
                  </a>
                ))}
              </motion.div>

              {/* Stats */}
              <motion.div
                {...blurIn}
                transition={{ ...easeOut, delay: 1.25 }}
                className="mt-8 flex flex-wrap justify-center gap-4"
              >
                <div className="liquid-glass w-[200px] rounded-[1.25rem] p-5 text-left sm:w-[220px]">
                  <Server size={18} className="text-white/60" />
                  <p className="mt-4 font-heading italic text-4xl leading-none tracking-[-1px] text-white">
                    {statVm}
                  </p>
                  <p className="mt-2 font-body text-[11px] font-light leading-snug text-white/70">
                    Virtual Machines Managed
                  </p>
                </div>
                <div className="liquid-glass w-[200px] rounded-[1.25rem] p-5 text-left sm:w-[220px]">
                  <Shield size={18} className="text-white/60" />
                  <p className="mt-4 font-heading italic text-4xl leading-none tracking-[-1px] text-white">
                    {statUptime}
                  </p>
                  <p className="mt-2 font-body text-[11px] font-light leading-snug text-white/70">
                    Service Availability{statDefense ? ` · ${statDefense}` : ''}
                  </p>
                </div>
                <div className="liquid-glass w-[200px] rounded-[1.25rem] p-5 text-left sm:w-[220px]">
                  <Briefcase size={18} className="text-white/60" />
                  <p className="mt-4 font-heading italic text-4xl leading-none tracking-[-1px] text-white">
                    {loadingSecondary && projects.length === 0 ? '—' : projects.length || '—'}
                  </p>
                  <p className="mt-2 font-body text-[11px] font-light leading-snug text-white/70">
                    Deployments Shipped
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Trust bar */}
            <motion.div
              {...blurIn}
              transition={{ ...easeOut, delay: 1.4 }}
              className="flex flex-col items-center gap-4 pb-8"
            >
              <div className="liquid-glass rounded-full px-5 py-2 font-body text-sm font-light text-white/80">
                Trusted by schools, operators, and infrastructure teams
              </div>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
                {['VMware', 'Fortinet', 'HPE', 'TANet', 'Linux'].map((brand) => (
                  <span
                    key={brand}
                    className="font-heading italic text-2xl tracking-tight text-white/35 md:text-3xl"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════ CAPABILITIES ════════════════════════════ */}
        <section className="relative min-h-screen overflow-hidden bg-black">
          <div className="absolute inset-0 z-0">
            <FadingVideo
              src={CAP_VIDEO}
              className="absolute inset-0 h-full w-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-black/70" />
          </div>

          <div className="relative z-10 flex min-h-screen flex-col px-8 pb-10 pt-24 md:px-16 lg:px-20">
            <div className="mb-auto">
              <p className="mb-6 font-body text-sm text-white/80">// Capabilities</p>
              <h2 className="max-w-3xl font-heading italic text-6xl leading-[0.9] tracking-[-3px] text-white md:text-7xl lg:text-[6rem]">
                Studio craft,
                <br />
                end to end
              </h2>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
              {capabilities.map((cap, i) => {
                const Icon = cap.icon;
                return (
                  <motion.div
                    key={cap.title}
                    initial={{ filter: 'blur(10px)', opacity: 0, y: 30 }}
                    whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, delay: i * 0.12, ease: 'easeOut' }}
                    className="liquid-glass flex min-h-[360px] flex-col rounded-[1.25rem] p-6"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="liquid-glass flex h-11 w-11 items-center justify-center rounded-[0.75rem]">
                        <Icon size={20} className="text-white/80" />
                      </div>
                      <div className="flex flex-wrap justify-end gap-1.5">
                        {cap.tags.map((t) => (
                          <span
                            key={t}
                            className="liquid-glass whitespace-nowrap rounded-full px-3 py-1 font-body text-[11px] text-white/90"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex-1" />
                    <h3 className="font-heading italic text-3xl leading-none tracking-[-1px] text-white md:text-4xl">
                      {cap.title}
                    </h3>
                    <p className="mt-3 max-w-[32ch] font-body text-sm font-light leading-snug text-white/90">
                      {cap.body}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ════════════════════════════ SKILLS ════════════════════════════ */}
        {skills.length > 0 && (
          <section className="relative z-10 bg-black px-6 py-24 md:px-16 lg:px-20">
            <div className="mx-auto max-w-7xl">
              <p className="mb-4 font-body text-sm text-white/60">// Core Skills</p>
              <h2 className="mb-12 font-heading italic text-5xl tracking-[-2px] text-white md:text-6xl">
                Stack that scales
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {skills.map((skill, i) => (
                  <motion.div
                    key={`${skill.name}-${i}`}
                    initial={{ filter: 'blur(8px)', opacity: 0, y: 16 }}
                    whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.04 }}
                    className="liquid-glass rounded-[1rem] p-4"
                  >
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="font-body text-sm font-medium text-white/90">{skill.name}</span>
                      <span className="liquid-glass rounded-full px-2 py-0.5 font-body text-[9px] font-medium uppercase tracking-wider text-white/60">
                        {skill.level}
                      </span>
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-white/40"
                        style={{
                          width:
                            skill.level === 'Expert'
                              ? '90%'
                              : skill.level === 'Advanced'
                                ? '70%'
                                : '55%',
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ════════════════════════════ EXPERIENCE ════════════════════════════ */}
        {experiences.length > 0 && (
          <section className="relative z-10 bg-black px-6 py-24 md:px-16 lg:px-20">
            <div className="mx-auto max-w-7xl">
              <p className="mb-4 font-body text-sm text-white/60">// Experience</p>
              <h2 className="mb-12 font-heading italic text-5xl tracking-[-2px] text-white md:text-6xl">
                Field notes
              </h2>
              <div className="space-y-6">
                {experiences.map((exp, i) => (
                  <motion.div
                    key={i}
                    initial={{ filter: 'blur(8px)', opacity: 0, y: 20 }}
                    whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.08 }}
                    className="liquid-glass rounded-[1.25rem] p-6 md:p-8"
                  >
                    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                      <h3 className="font-heading italic text-2xl tracking-tight text-white md:text-3xl">
                        {exp.title}
                      </h3>
                      <span className="font-body text-xs font-medium uppercase tracking-[0.14em] text-white/40">
                        {exp.date}
                      </span>
                    </div>
                    {exp.bullets.length > 0 && (
                      <ul className="space-y-2">
                        {exp.bullets.map((b, bi) => (
                          <li
                            key={bi}
                            className="flex items-start gap-3 font-body text-sm font-light leading-relaxed text-white/70"
                          >
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white/40" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ════════════════════════════ LATEST ════════════════════════════ */}
        <section className="relative z-10 bg-black px-6 py-24 md:px-16 lg:px-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex items-end justify-between gap-4">
              <div>
                <p className="mb-4 font-body text-sm text-white/60">// Latest</p>
                <h2 className="font-heading italic text-5xl tracking-[-2px] text-white md:text-6xl">
                  Signal feed
                </h2>
              </div>
              <Link
                to="/portfolio"
                className="liquid-glass hidden items-center gap-2 rounded-full px-4 py-2 font-body text-sm font-medium text-white/80 transition hover:text-white sm:inline-flex"
              >
                View all <ArrowUpRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Projects */}
              <div>
                <p className="mb-4 flex items-center gap-2 font-body text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
                  <Briefcase size={12} /> Projects
                </p>
                <div className="space-y-3">
                  {loadingSecondary && projects.length === 0 &&
                    [0, 1, 2].map((i) => (
                      <div key={i} className="liquid-glass h-[84px] animate-pulse rounded-[1rem]" />
                    ))}
                  {projects.slice(0, 3).map((proj) => (
                    <Link
                      key={proj.id}
                      to={`/portfolio/${proj.id}`}
                      className="liquid-glass group flex items-center gap-4 rounded-[1rem] p-4 transition hover:-translate-y-0.5"
                    >
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-[0.75rem] bg-black">
                        {proj.image ? (
                          <img
                            src={proj.image}
                            alt={proj.title}
                            className="h-full w-full object-cover opacity-70 transition group-hover:opacity-90"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Briefcase size={16} className="text-white/20" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-heading italic text-lg tracking-tight text-white">
                          {proj.title}
                        </p>
                        <p className="mt-0.5 truncate font-body text-[11px] font-light text-white/40">
                          {Array.isArray(proj.tags) ? proj.tags.slice(0, 3).join(' · ') : ''}
                        </p>
                      </div>
                      <ArrowUpRight
                        size={16}
                        className="shrink-0 text-white/30 transition group-hover:text-white"
                      />
                    </Link>
                  ))}
                  {!loadingSecondary && projects.length === 0 && (
                    <p className="py-8 text-center font-body text-sm text-white/30">尚無專案</p>
                  )}
                </div>
              </div>

              {/* Posts */}
              <div>
                <p className="mb-4 flex items-center gap-2 font-body text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
                  <BookOpen size={12} /> Notes
                </p>
                <div className="space-y-3">
                  {loadingSecondary && posts.length === 0 &&
                    [0, 1, 2].map((i) => (
                      <div key={i} className="liquid-glass h-[84px] animate-pulse rounded-[1rem]" />
                    ))}
                  {posts.slice(0, 3).map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.id}`}
                      className="liquid-glass group flex items-center gap-4 rounded-[1rem] p-4 transition hover:-translate-y-0.5"
                    >
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-[0.75rem] bg-black">
                        {post.image ? (
                          <img
                            src={post.image}
                            alt={post.title}
                            className="h-full w-full object-cover opacity-70 transition group-hover:opacity-90"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <BookOpen size={16} className="text-white/20" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-heading italic text-lg tracking-tight text-white">
                          {post.title}
                        </p>
                        <p className="mt-0.5 truncate font-body text-[11px] font-light text-white/40">
                          {post.category}
                          {post.category && post.date ? ' · ' : ''}
                          {post.date}
                        </p>
                      </div>
                      <ArrowUpRight
                        size={16}
                        className="shrink-0 text-white/30 transition group-hover:text-white"
                      />
                    </Link>
                  ))}
                  {!loadingSecondary && posts.length === 0 && (
                    <p className="py-8 text-center font-body text-sm text-white/30">尚無文章</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════ ABOUT ════════════════════════════ */}
        {summary && (
          <section className="relative z-10 bg-black px-6 py-20 md:px-16 lg:px-20">
            <div className="mx-auto max-w-7xl">
              <motion.div
                initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
                whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="liquid-glass rounded-[1.5rem] p-8 md:p-12"
              >
                <div className="mb-6 flex items-center gap-3">
                  <div className="liquid-glass flex h-11 w-11 items-center justify-center rounded-[0.75rem]">
                    <Terminal size={18} className="text-white/70" />
                  </div>
                  <h2 className="font-heading italic text-3xl tracking-tight text-white md:text-4xl">
                    關於我
                  </h2>
                </div>
                <p className="max-w-3xl whitespace-pre-line font-body text-sm font-light leading-relaxed text-white/75 md:text-base">
                  {summary}
                </p>
              </motion.div>
            </div>
          </section>
        )}

        {/* ════════════════════════════ CTA ════════════════════════════ */}
        <section className="relative z-10 overflow-hidden bg-black px-6 py-28 md:px-16">
          <div className="pointer-events-none absolute inset-0 opacity-30">
            <div className="absolute left-1/2 top-1/2 h-[60vh] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.04] blur-[100px]" />
          </div>
          <div className="relative mx-auto max-w-4xl text-center">
            <h2 className="mb-6 font-heading italic text-4xl leading-[0.95] tracking-[-2px] text-white md:text-6xl lg:text-7xl">
              需要基礎架構協助？
              <br />
              <span className="text-white/35">Let&apos;s talk infrastructure.</span>
            </h2>
            <p className="mx-auto mb-10 max-w-md font-body text-sm font-light leading-relaxed text-white/50">
              無論是虛擬化規劃、資安架構調整，或是自動化部署導入，歡迎交流討論。
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/resume"
                className="liquid-glass-strong inline-flex items-center gap-2 rounded-full px-6 py-3 font-body text-sm font-medium text-white"
              >
                <FileText size={15} /> 查看完整履歷
              </Link>
              <a
                href={`mailto:${email || 'woody@enc.moe'}`}
                className="liquid-glass inline-flex items-center gap-2 rounded-full px-6 py-3 font-body text-sm font-medium text-white/80 transition hover:text-white"
              >
                <Mail size={15} /> 來信討論
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/10 px-6 py-12 md:px-16">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="font-heading italic text-xl text-white/30">
              {name}
              <span className="ml-2 font-body text-[11px] font-light not-italic tracking-[0.2em] uppercase text-white/20">
                {jobTitle}
              </span>
            </p>
            <div className="flex items-center gap-6 font-body text-[11px] font-medium uppercase tracking-[0.15em] text-white/30">
              <Link to="/portfolio" className="transition hover:text-white/70">
                Portfolio
              </Link>
              <Link to="/blog" className="transition hover:text-white/70">
                Notes
              </Link>
              <Link to="/resume" className="transition hover:text-white/70">
                Resume
              </Link>
              <Link to="/about" className="transition hover:text-white/70">
                About
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;
