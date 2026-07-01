import { useState, useEffect, useCallback } from 'react';
import { SEOMeta, BreadcrumbSchema } from '../lib/seo';
import { ArrowRight, Shield, Database, Server, Globe, Terminal, ChevronRight, CircuitBoard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ConfigAPI } from '../services/apiClient';
import { Section } from '@astryxdesign/core/Section';
import { Divider } from '@astryxdesign/core/Divider';

/* ------------------------------------------------------------------ */
/*  Premium infrastructure portfolio — amber/warm tone, editorial,     */
/*  atmospheric. Inspired by high-end brand sites.                     */
/*  CSS transitions only — no JS animation libraries.                  */
/* ------------------------------------------------------------------ */

/* ---------- Scroll-reveal hook ---------- */
function useScrollReveal<T extends HTMLElement>(threshold = 0.12): [React.RefCallback<T>, boolean] {
  const [revealed, setRevealed] = useState(false);
  const ref = useCallback(
    (node: T | null) => {
      if (!node || revealed) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
          }
        },
        { threshold }
      );
      observer.observe(node);
    },
    [threshold, revealed]
  );
  return [ref, revealed];
}

/* ---------- Floating accent — amber glow + orbital rings ---------- */
function FloatingAccent() {
  return (
    <div className="relative w-[360px] h-[360px] xl:w-[460px] xl:h-[460px]">
      {/* Large ambient amber glow */}
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.10)_0%,rgba(245,158,11,0.03)_35%,transparent_65%)] animate-pulse-slow" />

      {/* Outer ring */}
      <div className="absolute inset-[5%] rounded-full border border-amber-500/10 animate-float" />

      {/* Mid ring */}
      <div className="absolute inset-[22%] rounded-full border border-amber-400/6 animate-float" style={{ animationDelay: '-1.5s' }} />

      {/* Inner ring */}
      <div className="absolute inset-[40%] rounded-full border border-amber-300/5 animate-float" style={{ animationDelay: '-3s' }} />

      {/* Core amber dot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-amber-400/60 animate-pulse-slow shadow-[0_0_20px_rgba(245,158,11,0.3)]" />

      {/* Orbital amber dots */}
      <div className="absolute top-[12%] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-400/30 animate-float shadow-[0_0_8px_rgba(245,158,11,0.2)]" style={{ animationDelay: '-0.5s' }} />
      <div className="absolute bottom-[12%] right-[12%] w-1.5 h-1.5 rounded-full bg-amber-300/25 animate-float" style={{ animationDelay: '-2.5s' }} />
      <div className="absolute top-[30%] right-[8%] w-1.5 h-1.5 rounded-full bg-white/[0.10] animate-float" style={{ animationDelay: '-4s' }} />
      <div className="absolute bottom-[35%] left-[8%] w-1 h-1 rounded-full bg-amber-400/20 animate-float" style={{ animationDelay: '-1s' }} />
    </div>
  );
}

/* ---------- Process step ---------- */
function ProcessStep({ num, title, desc }: { num: string; title: string; desc: string }) {
  const [ref, revealed] = useScrollReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`flex gap-6 sm:gap-8 transition-all duration-[1000ms] ease-out will-change-[opacity,transform] ${
        revealed ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'
      }`}
    >
      <span className="text-5xl sm:text-6xl font-[200] text-amber-400/15 leading-none tracking-tight select-none">
        {num}
      </span>
      <div className="pt-2 border-t border-amber-400/10">
        <h3 className="text-base sm:text-lg font-semibold text-white/90 tracking-tight mb-2 mt-3">{title}</h3>
        <p className="text-sm text-slate-500 font-light leading-relaxed max-w-sm">{desc}</p>
      </div>
    </div>
  );
}

/* ---------- Competency card ---------- */
function CompetencyCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  const [ref, revealed] = useScrollReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`group rounded-2xl border border-white/[0.06] bg-white/[0.015] p-7 sm:p-9 transition-all duration-[900ms] ease-out will-change-[opacity,transform] hover:border-amber-500/20 hover:bg-amber-500/[0.03] hover:shadow-[0_0_30px_rgba(245,158,11,0.05)] ${
        revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center text-amber-400/60 group-hover:bg-amber-500/12 group-hover:text-amber-300 transition-all duration-500 mb-5">
        {icon}
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-white/90 tracking-tight mb-2">{title}</h3>
      <p className="text-sm text-slate-500 font-light leading-relaxed">{desc}</p>
    </div>
  );
}

/* ---------- Stat card ---------- */
function StatCard({
  label,
  value,
  desc,
  span = false,
}: {
  label: string;
  value: string;
  desc: string;
  span?: boolean;
}) {
  const [ref, revealed] = useScrollReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`${span ? 'md:col-span-2' : ''} group rounded-2xl border border-white/[0.06] bg-white/[0.015] p-7 sm:p-9 transition-all duration-[1000ms] ease-out will-change-[opacity,transform] hover:border-amber-500/15 hover:bg-amber-500/[0.02] ${
        revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <p className="text-white/25 uppercase tracking-[0.25em] text-[10px] font-[300] mb-3 group-hover:text-amber-400/40 transition-colors duration-500">{label}</p>
      <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-white/95 tracking-tight mb-2 leading-none group-hover:text-amber-100/90 transition-colors duration-500">{value}</p>
      <p className="text-sm text-slate-500 font-light leading-relaxed">{desc}</p>
    </div>
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

  const [heroRef, heroRevealed] = useScrollReveal<HTMLDivElement>(0.05);

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-[#0a0b10]">
        <div className="w-5 h-5 rounded-full border border-white/[0.08] border-t-white/30 animate-spin mb-4" />
        <span className="text-[9px] font-[300] uppercase tracking-[0.5em] text-white/[0.12]">Loading</span>
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
      <div className="relative overflow-x-hidden bg-[#0a0b10]">

        {/* ----- Warm ambient background glow ----- */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_0%,rgba(245,158,11,0.04)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_100%,rgba(245,158,11,0.025)_0%,transparent_50%)]" />
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.02)_0%,transparent_60%)]" />
        </div>

        {/* ===== HERO ===== */}
        <Section variant="transparent" padding={0}>
          <section className="min-h-[100dvh] grid grid-cols-1 lg:grid-cols-2 pt-28 relative">
            {/* Left: text */}
            <div
              ref={heroRef}
              className="flex flex-col justify-center px-6 sm:px-12 lg:px-16 pb-16 lg:pb-0 transition-all duration-[1200ms] ease-out will-change-[opacity,transform]"
              style={{
                opacity: heroRevealed ? 1 : 0,
                transform: heroRevealed ? 'translateY(0)' : 'translateY(24px)',
              }}
            >
              {/* Badge - amber */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/[0.06] text-[9px] font-[300] uppercase tracking-[0.3em] text-amber-400/80 mb-10">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400/70" />
                Infrastructure &amp; Operations
              </div>

              {/* Heading */}
              <h1 className="text-[clamp(2.5rem,7vw,5.5rem)] font-black text-white/95 mb-5 tracking-tight leading-[1.05]">
                {heroTitle}
              </h1>

              {/* Tagline */}
              <p className="text-sm sm:text-base text-slate-400/90 leading-relaxed max-w-md mb-10 font-[300] tracking-wide">
                Infrastructure &amp; DevOps Engineer — {heroIntro}
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/portfolio"
                  className="group inline-flex items-center justify-center gap-2.5 bg-white text-[#0a0b10] px-7 py-3.5 rounded-xl text-sm font-semibold tracking-wide hover:bg-zinc-200 transition-all duration-300 active:scale-[0.97]"
                >
                  查看作品
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-300" />
                </Link>
                <Link
                  to="/blog"
                  className="group inline-flex items-center justify-center gap-2.5 border border-amber-500/15 text-white/80 px-7 py-3.5 rounded-xl text-sm font-semibold tracking-wide hover:bg-amber-500/[0.06] hover:border-amber-400/30 transition-all duration-300 active:scale-[0.97]"
                >
                  閱讀筆記
                  <Terminal size={14} className="opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </div>
            </div>

            {/* Right: floating amber accent */}
            <div className="hidden lg:flex items-center justify-center relative">
              <FloatingAccent />
            </div>
          </section>
        </Section>

        {/* ===== DIVIDER ===== */}
        <Divider variant="subtle" />

        {/* ===== STATS ===== */}
        <Section variant="transparent" padding={10}>
          <div className="max-w-6xl mx-auto w-full">
            <p className="text-white/15 uppercase tracking-[0.35em] text-[9px] font-[300] mb-10 sm:mb-14">
              Operational Metrics
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              <StatCard label="Virtual Machines" value={statVm} desc="Active virtual clusters managed across multiple hypervisors and datacenters." span />
              <StatCard label="Storage" value="HPE 2050" desc="Multipath iSCSI SAN with redundant fabric topology." />
              <StatCard label="Defense" value={statDefense} desc="High-availability network edge security cluster." />
              <StatCard label="Uptime" value={configs.stat_uptime || '99.9%'} desc="Measured SLA across all managed infrastructure." />
              <StatCard label="Response" value="24/7" desc="Continuous monitoring and incident response with automated alerting and escalation." span />
            </div>
          </div>
        </Section>

        {/* ===== DIVIDER ===== */}
        <Divider variant="subtle" />

        {/* ===== APPROACH + PROCESS ===== */}
        <Section variant="transparent" padding={10}>
          <div className="max-w-5xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Left: editorial */}
              <div>
                <p className="text-white/15 uppercase tracking-[0.35em] text-[9px] font-[300] mb-6">
                  Approach
                </p>
                <h2 className="text-2xl sm:text-3xl font-black text-white/95 tracking-tight leading-[1.15] mb-5">
                  從維運現場出發<br />
                  <span className="text-slate-400/70 font-[250] italic">打造穩定的基礎架構</span>
                </h2>
                <div className="w-12 h-px bg-amber-400/30 mb-5" />
                <p className="text-sm sm:text-base text-slate-400/80 leading-relaxed font-[300] max-w-md">
                  把網路、虛擬化、儲存與安全整合成清楚的流程，讓日常維運更快、更穩，也更容易交接。
                  每個節點、每條規則、每份備份，都經過實際部署驗證，不是紙上談兵的架構。
                </p>
                <div className="mt-8">
                  <Link
                    to="/about"
                    className="group inline-flex items-center gap-2 text-amber-400/70 text-sm font-semibold tracking-wide hover:text-amber-300 transition-colors duration-300"
                  >
                    了解更多
                    <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform duration-300" />
                  </Link>
                </div>
              </div>

              {/* Right: numbered process */}
              <div className="space-y-10 sm:space-y-12">
                <ProcessStep
                  num="01"
                  title="基礎架構設計與部署"
                  desc="從實體網路拓樸到虛擬化叢集，規劃可擴充、高可用的基礎設施，並導入自動化部署工具。"
                />
                <ProcessStep
                  num="02"
                  title="資安防護與監控"
                  desc="建構多層次安全防禦，涵蓋防火牆規則調校、VPN 閘道管理、入侵偵測與即時告警。"
                />
                <ProcessStep
                  num="03"
                  title="持續優化與維運"
                  desc="定期效能評估、備份演練、版本升級，確保系統在演化過程中保持穩定與安全。"
                />
              </div>
            </div>
          </div>
        </Section>

        {/* ===== DIVIDER ===== */}
        <Divider variant="subtle" />

        {/* ===== COMPETENCIES ===== */}
        <Section variant="transparent" padding={10}>
          <div className="max-w-5xl mx-auto w-full">
            <p className="text-white/15 uppercase tracking-[0.35em] text-[9px] font-[300] mb-3">
              Expertise
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-white/95 tracking-tight leading-[1.15] mb-10 sm:mb-14">
              Core Competencies
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CompetencyCard
                icon={<Server size={20} />}
                title="Virtualization"
                desc="VMware vSphere cluster management, VM lifecycle automation, resource optimisation across 151+ nodes."
              />
              <CompetencyCard
                icon={<Shield size={20} />}
                title="Network Security"
                desc="Fortinet HA pair deployment, VLAN segmentation, firewall policy auditing, VPN gateway operations."
              />
              <CompetencyCard
                icon={<Database size={20} />}
                title="Storage"
                desc="HPE 2050 SAN architecture, multipath iSCSI configuration, backup strategy and disaster recovery planning."
              />
              <CompetencyCard
                icon={<Globe size={20} />}
                title="Cloud & DevOps"
                desc="Cloudflare Pages, R2, D1; automated CI/CD pipelines; Ubuntu 24.04 server provisioning with Ansible."
              />
            </div>
          </div>
        </Section>

        {/* ===== DIVIDER ===== */}
        <Divider variant="subtle" />

        {/* ===== CTA ===== */}
        <Section variant="transparent" padding={10}>
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-14 h-14 mx-auto mb-8 rounded-full border border-amber-500/15 bg-amber-500/[0.05] flex items-center justify-center">
              <CircuitBoard size={20} className="text-amber-400/60" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white/95 tracking-tight mb-4">
              Want to see the infrastructure in action?
            </h2>
            <p className="text-sm sm:text-base text-slate-400/80 max-w-md mx-auto font-[300] leading-relaxed mb-10">
              Browse real deployment cases, network topology diagrams, and the full technology stack powering this environment.
            </p>
            <Link
              to="/portfolio"
              className="group inline-flex items-center gap-2.5 bg-white text-[#0a0b10] px-8 py-4 rounded-xl text-sm font-semibold tracking-wide hover:bg-zinc-200 transition-all duration-300 active:scale-[0.97]"
            >
              瀏覽維運實績
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform duration-300" />
            </Link>
          </div>
        </Section>

        {/* ===== FOOTER ===== */}
        <footer className="py-14 text-center">
          <p className="text-white/[0.07] text-[9px] font-[300] uppercase tracking-[0.5em]">
            Infrastructure Managed with Precision
          </p>
        </footer>
      </div>
    </>
  );
};

export default HomePage;

