import { useState, useEffect, useRef } from 'react';
import { SEOMeta, BreadcrumbSchema } from '../lib/seo';
import { ArrowRight, ArrowUpRight, Server, Shield, Database, Globe, Terminal, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ConfigAPI } from '../services/apiClient';

/* ================================================================== */
/*  Editorial infrastructure portfolio — magazine-grade, atmospheric    */
/*  Large serif display, technical grid, asymmetric editorial blocks.  */
/*  Pure CSS motion — no JS animation libraries.                       */
/* ================================================================== */

/* ---------- Scroll reveal ---------- */
function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.15) {
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

/* ---------- Reveal wrapper ---------- */
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, shown } = useReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[opacity,transform] ${className}`}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : 'translateY(36px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ---------- Tech marquee strip ---------- */
function TechMarquee() {
  const items = [
    'VMware vSphere', 'Fortinet HA', 'HPE MSA 2050', 'iSCSI Multipath', 'Ubuntu 24.04',
    'Ansible', 'Cloudflare R2', 'D1 SQLite', 'VLAN Segmentation', 'VPN Gateway',
    'BGP Routing', 'Nginx Reverse Proxy', 'Docker', 'GitLab CI/CD', 'Prometheus',
    'Grafana', 'Zabbix', 'Restic Backup', 'WireGuard', 'NetFlow',
  ];
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-white/[0.06] py-5 bg-white/[0.008]">
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="mx-8 inline-flex items-center gap-3 text-[11px] font-mono-tech uppercase tracking-[0.2em] text-white/25">
            {item}
            <span className="w-1 h-1 rounded-full bg-amber-400/30" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Stat block (editorial, no card) ---------- */
function StatBlock({ label, value, desc, index }: { label: string; value: string; desc: string; index: number }) {
  return (
    <Reveal delay={index * 80}>
      <div className="group py-8 border-t border-white/[0.06] hover:border-amber-400/20 transition-colors duration-700">
        <div className="flex items-baseline justify-between mb-4">
          <span className="text-[10px] font-mono-tech uppercase tracking-[0.3em] text-white/20">{label}</span>
          <span className="text-[10px] font-mono-tech text-white/10">0{index + 1}</span>
        </div>
        <p className="font-serif-editorial text-4xl sm:text-5xl lg:text-6xl text-white/90 leading-none mb-3 group-hover:text-amber-100/90 transition-colors duration-700">
          {value}
        </p>
        <p className="text-xs text-slate-500 font-light leading-relaxed max-w-[16rem]">{desc}</p>
      </div>
    </Reveal>
  );
}

/* ---------- Process step (editorial) ---------- */
function ProcessStep({ num, title, desc, index }: { num: string; title: string; desc: string; index: number }) {
  return (
    <Reveal delay={index * 120}>
      <div className="group flex gap-8 sm:gap-12 py-10 border-t border-white/[0.06] hover:border-amber-400/15 transition-colors duration-700">
        <span className="font-mono-tech text-sm text-amber-400/40 tracking-widest pt-1 select-none">{num}</span>
        <div className="flex-1">
          <h3 className="font-serif-editorial text-2xl sm:text-3xl text-white/90 mb-3 leading-tight group-hover:text-amber-100/90 transition-colors duration-500">{title}</h3>
          <p className="text-sm text-slate-500 font-light leading-relaxed max-w-md">{desc}</p>
        </div>
        <ArrowUpRight size={18} className="text-white/10 group-hover:text-amber-400/50 group-hover:rotate-45 transition-all duration-500 pt-1" />
      </div>
    </Reveal>
  );
}

/* ---------- Competency row (editorial list, not grid cards) ---------- */
function CompetencyRow({ icon, title, desc, tags, index }: { icon: React.ReactNode; title: string; desc: string; tags: string[]; index: number }) {
  return (
    <Reveal delay={index * 100}>
      <div className="group grid grid-cols-12 gap-4 sm:gap-8 py-10 border-t border-white/[0.06] hover:border-amber-400/15 transition-colors duration-700 cursor-default">
        <div className="col-span-2 sm:col-span-1 flex items-start pt-1">
          <div className="w-9 h-9 rounded-lg border border-white/[0.08] flex items-center justify-center text-white/30 group-hover:border-amber-400/25 group-hover:text-amber-300/70 transition-all duration-500">
            {icon}
          </div>
        </div>
        <div className="col-span-10 sm:col-span-4">
          <h3 className="font-serif-editorial text-xl sm:text-2xl text-white/90 group-hover:text-amber-100/90 transition-colors duration-500">{title}</h3>
        </div>
        <div className="col-span-12 sm:col-span-5">
          <p className="text-sm text-slate-500 font-light leading-relaxed">{desc}</p>
        </div>
        <div className="col-span-12 sm:col-span-2 flex sm:flex-col flex-wrap gap-1.5 pt-1">
          {tags.map((t) => (
            <span key={t} className="text-[9px] font-mono-tech uppercase tracking-[0.15em] text-white/20 border border-white/[0.06] px-2 py-1 rounded">{t}</span>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

/* ================================================================== */
/*  HomePage                                                           */
/* ================================================================== */
const HomePage: React.FC = () => {
  const [configs, setConfigs] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const data = await ConfigAPI.all();
        setConfigs(data);
      } catch (err) {
        console.error('Fetch configs error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfigs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-[#08090c]">
        <div className="w-4 h-4 rounded-full border border-white/[0.08] border-t-amber-400/50 animate-spin mb-4" />
        <span className="text-[9px] font-mono-tech uppercase tracking-[0.5em] text-white/15">Loading</span>
      </div>
    );
  }

  const heroTitle = configs.hero_title || 'Woody Wu';
  const heroIntro = configs.hero_intro || '專注基礎架構、自動化部署與雲端維運，把複雜系統整理成可靠、可擴充的服務。';
  const statVm = configs.stat_vm || '151+';
  const statDefense = configs.stat_defense || 'Forti HA';

  return (
    <>
      <SEOMeta
        title="首頁"
        description="Woody Wu - 網管與資安維運實踐。151+ VM 叢集管理、Fortinet HA 部署、HPE 儲存架構調校、Ubuntu 24.04 自動化運維。"
        path="/"
        keywords="網管,資安,維運,Linux,VMware,Fortinet,HPE,Ubuntu"
      />
      <BreadcrumbSchema items={[{ name: '首頁', path: '/' }]} />

      <div className="relative overflow-x-hidden bg-[#08090c] text-white">

        {/* ===== Fixed atmospheric background ===== */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-grid" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_0%,rgba(245,158,11,0.06)_0%,transparent_45%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_90%,rgba(56,189,248,0.03)_0%,transparent_45%)]" />
          <div className="absolute inset-0 bg-noise opacity-[0.015] mix-blend-overlay" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.5)_100%)]" />
        </div>

        {/* ===== HERO ===== */}
        <section className="relative z-10 min-h-[100dvh] flex flex-col justify-between pt-28 pb-12 px-6 sm:px-12 lg:px-20">

          <Reveal>
            <div className="flex items-center justify-between text-[10px] font-mono-tech uppercase tracking-[0.3em] text-white/20">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 animate-pulse" />
                System Operational
              </span>
              <span className="hidden sm:block">N 24.0° / E 121.5°</span>
              <span>v2.0</span>
            </div>
          </Reveal>

          <div className="flex-1 flex flex-col justify-center max-w-6xl">
            <Reveal delay={100}>
              <p className="text-[10px] font-mono-tech uppercase tracking-[0.4em] text-amber-400/50 mb-8">
                Infrastructure · Security · Operations
              </p>
            </Reveal>
            <Reveal delay={200}>
              <h1 className="font-serif-editorial text-[clamp(3rem,11vw,9rem)] leading-[0.92] tracking-[-0.02em] text-white/95 mb-2">
                {heroTitle}
              </h1>
            </Reveal>
            <Reveal delay={300}>
              <h2 className="font-serif-editorial italic text-[clamp(1.5rem,5vw,3.5rem)] leading-[1] tracking-[-0.01em] text-white/30 mb-10">
                Architecture of Reliability
              </h2>
            </Reveal>
            <Reveal delay={400}>
              <p className="text-sm sm:text-base text-slate-400/80 leading-relaxed max-w-xl font-light mb-12">
                {heroIntro}
              </p>
            </Reveal>
            <Reveal delay={500}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/portfolio"
                  className="group inline-flex items-center gap-3 bg-white text-[#08090c] px-8 py-4 text-sm font-semibold tracking-wide hover:bg-amber-50 transition-all duration-300 active:scale-[0.97]"
                >
                  查看維運實績
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link
                  to="/blog"
                  className="group inline-flex items-center gap-3 border border-white/[0.1] text-white/70 px-8 py-4 text-sm font-semibold tracking-wide hover:border-amber-400/30 hover:text-white hover:bg-white/[0.02] transition-all duration-300 active:scale-[0.97]"
                >
                  <Terminal size={15} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                  閱讀技術筆記
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={600}>
            <div className="flex items-end justify-between">
              <div className="flex items-center gap-3 text-[10px] font-mono-tech uppercase tracking-[0.3em] text-white/15">
                <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                Scroll
              </div>
              <div className="hidden sm:flex items-center gap-8 text-[10px] font-mono-tech uppercase tracking-[0.2em] text-white/15">
                <span>UPTIME <span className="text-emerald-400/60">{configs.stat_uptime || '99.9%'}</span></span>
                <span>VMs <span className="text-amber-400/60">{statVm}</span></span>
                <span>MONITORING <span className="text-emerald-400/60">24/7</span></span>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ===== TECH MARQUEE ===== */}
        <div className="relative z-10">
          <TechMarquee />
        </div>

        {/* ===== STATS ===== */}
        <section className="relative z-10 px-6 sm:px-12 lg:px-20 py-24 sm:py-32">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="flex items-baseline justify-between mb-16">
                <p className="text-[10px] font-mono-tech uppercase tracking-[0.4em] text-amber-400/40">
                  § 01 — Operational Metrics
                </p>
                <p className="text-[10px] font-mono-tech text-white/15 hidden sm:block">Live Data</p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="font-serif-editorial text-[clamp(2rem,6vw,4rem)] leading-[1] text-white/90 mb-16 max-w-3xl">
                Numbers from the<br />
                <span className="italic text-white/30">operations floor.</span>
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12">
              <StatBlock index={0} label="Virtual Machines" value={statVm} desc="Active virtual clusters managed across multiple hypervisors and datacenters." />
              <StatBlock index={1} label="Storage Array" value="HPE 2050" desc="Multipath iSCSI SAN with redundant fabric topology." />
              <StatBlock index={2} label="Network Edge" value={statDefense} desc="High-availability Fortinet security cluster." />
              <StatBlock index={3} label="Measured SLA" value={configs.stat_uptime || '99.9%'} desc="Uptime across all managed infrastructure." />
              <StatBlock index={4} label="Incident Response" value="24/7" desc="Continuous monitoring with automated alerting and escalation." />
              <StatBlock index={5} label="Years in Production" value="8+" desc="Hands-on infrastructure engineering across enterprise environments." />
            </div>
          </div>
        </section>

        {/* ===== APPROACH + PROCESS ===== */}
        <section className="relative z-10 px-6 sm:px-12 lg:px-20 py-24 sm:py-32 border-t border-white/[0.04]">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
              <div className="lg:col-span-5">
                <Reveal>
                  <p className="text-[10px] font-mono-tech uppercase tracking-[0.4em] text-amber-400/40 mb-8">
                    § 02 — Approach
                  </p>
                  <h2 className="font-serif-editorial text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] text-white/90 mb-8">
                    From the<br />
                    <span className="italic text-white/30">operations floor.</span>
                  </h2>
                  <div className="w-16 h-px bg-amber-400/30 mb-8" />
                  <p className="text-sm sm:text-base text-slate-400/80 leading-relaxed font-light max-w-md mb-8">
                    把網路、虛擬化、儲存與安全整合成清楚的流程，讓日常維運更快、更穩，也更容易交接。
                    每個節點、每條規則、每份備份，都經過實際部署驗證，不是紙上談兵的架構。
                  </p>
                  <Link
                    to="/about"
                    className="group inline-flex items-center gap-2 text-amber-400/70 text-sm font-semibold tracking-wide hover:text-amber-300 transition-colors duration-300"
                  >
                    了解更多
                    <ArrowUpRight size={14} className="group-hover:rotate-45 transition-transform duration-300" />
                  </Link>
                </Reveal>
              </div>

              <div className="lg:col-span-7">
                <ProcessStep index={0} num="01" title="基礎架構設計與部署" desc="從實體網路拓樸到虛擬化叢集，規劃可擴充、高可用的基礎設施，並導入自動化部署工具。" />
                <ProcessStep index={1} num="02" title="資安防護與監控" desc="建構多層次安全防禦，涵蓋防火牆規則調校、VPN 閘道管理、入侵偵測與即時告警。" />
                <ProcessStep index={2} num="03" title="持續優化與維運" desc="定期效能評估、備份演練、版本升級，確保系統在演化過程中保持穩定與安全。" />
                <div className="border-t border-white/[0.06]" />
              </div>
            </div>
          </div>
        </section>

        {/* ===== COMPETENCIES ===== */}
        <section className="relative z-10 px-6 sm:px-12 lg:px-20 py-24 sm:py-32 border-t border-white/[0.04]">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="flex items-baseline justify-between mb-16">
                <p className="text-[10px] font-mono-tech uppercase tracking-[0.4em] text-amber-400/40">
                  § 03 — Core Competencies
                </p>
                <p className="text-[10px] font-mono-tech text-white/15 hidden sm:block">04 Disciplines</p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="font-serif-editorial text-[clamp(2rem,6vw,4rem)] leading-[1] text-white/90 mb-4">
                Four disciplines.<br />
                <span className="italic text-white/30">One engineering ethos.</span>
              </h2>
            </Reveal>
            <div className="mt-12">
              <CompetencyRow index={0} icon={<Server size={18} />} title="Virtualization" desc="VMware vSphere cluster management, VM lifecycle automation, resource optimisation across 151+ nodes." tags={['vSphere', 'HA', 'DRS']} />
              <CompetencyRow index={1} icon={<Shield size={18} />} title="Network Security" desc="Fortinet HA pair deployment, VLAN segmentation, firewall policy auditing, VPN gateway operations." tags={['FortiOS', 'IPSec', 'IDS']} />
              <CompetencyRow index={2} icon={<Database size={18} />} title="Storage" desc="HPE MSA 2050 SAN architecture, multipath iSCSI configuration, backup strategy and disaster recovery." tags={['iSCSI', 'SAN', 'Restic']} />
              <CompetencyRow index={3} icon={<Globe size={18} />} title="Cloud & DevOps" desc="Cloudflare Pages, R2, D1; automated CI/CD pipelines; Ubuntu 24.04 provisioning with Ansible." tags={['CF R2', 'Ansible', 'CI/CD']} />
              <div className="border-t border-white/[0.06]" />
            </div>
          </div>
        </section>

        {/* ===== PULL QUOTE ===== */}
        <section className="relative z-10 px-6 sm:px-12 lg:px-20 py-32 sm:py-40 border-t border-white/[0.04]">
          <div className="max-w-4xl mx-auto text-center">
            <Reveal>
              <Cpu size={28} className="mx-auto text-amber-400/30 mb-10" />
              <blockquote className="font-serif-editorial text-[clamp(1.5rem,4.5vw,3rem)] leading-[1.2] text-white/80 italic">
                "可靠不是運氣，是每一次部署、每一條規則、每一份備份累積出來的紀律。"
              </blockquote>
              <p className="mt-10 text-[10px] font-mono-tech uppercase tracking-[0.4em] text-white/20">
                — Engineering Manifesto
              </p>
            </Reveal>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="relative z-10 px-6 sm:px-12 lg:px-20 py-24 sm:py-32 border-t border-white/[0.04]">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12">
                <div>
                  <p className="text-[10px] font-mono-tech uppercase tracking-[0.4em] text-amber-400/40 mb-6">
                    § 04 — Explore
                  </p>
                  <h2 className="font-serif-editorial text-[clamp(2rem,6vw,4.5rem)] leading-[1] text-white/90 mb-6">
                    See the<br />
                    <span className="italic text-white/30">infrastructure in action.</span>
                  </h2>
                  <p className="text-sm text-slate-400/70 max-w-md font-light leading-relaxed">
                    Browse real deployment cases, network topology diagrams, and the full technology stack powering this environment.
                  </p>
                </div>
                <Link
                  to="/portfolio"
                  className="group inline-flex items-center gap-3 bg-white text-[#08090c] px-10 py-5 text-sm font-semibold tracking-wide hover:bg-amber-50 transition-all duration-300 active:scale-[0.97] whitespace-nowrap"
                >
                  瀏覽維運實績
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="relative z-10 px-6 sm:px-12 lg:px-20 py-16 border-t border-white/[0.04]">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/50 animate-pulse" />
              <p className="text-[10px] font-mono-tech uppercase tracking-[0.3em] text-white/15">
                Infrastructure Managed with Precision
              </p>
            </div>
            <div className="flex items-center gap-6 text-[10px] font-mono-tech uppercase tracking-[0.2em] text-white/15">
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

