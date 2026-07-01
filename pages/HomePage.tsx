import React, { useState, useEffect } from 'react';
import { SEOMeta, BreadcrumbSchema } from '../lib/seo';
import { ArrowRight, Cpu, Shield, Database, Server, Globe, Terminal, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ConfigAPI } from '../services/apiClient';
import { Section } from '@astryxdesign/core/Section';
import { Divider } from '@astryxdesign/core/Divider';
import { VStack } from '@astryxdesign/core/VStack';
import { Text, Heading } from '@astryxdesign/core/Text';

/* ------------------------------------------------------------------ */
/*  Design Read: developer portfolio for technical hiring managers,    */
/*  with a dark-tech / infrastructure language, leaning toward         */
/*  Tailwind utilities + Astryx + restrained motion.                   */
/*  Dials: VARIANCE=6, MOTION=5, DENSITY=4                            */
/* ------------------------------------------------------------------ */

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
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-[#0a0b10]">
        <div className="w-6 h-6 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin mb-4" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Loading</span>
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

        {/* ===== HERO - Split-Screen ===== */}
        <Section variant="transparent" padding={0}>
          <section className="min-h-[100dvh] grid grid-cols-1 lg:grid-cols-2 pt-24 relative">
            {/* Left: text content */}
            <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-16 pb-16 lg:pb-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                System Online
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-6 tracking-tight leading-[1.05] uppercase">
                {heroTitle}
              </h1>

              <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-lg mb-12 font-light">
                Infrastructure &amp; DevOps Engineer - {heroIntro}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/portfolio"
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#0a0b10] px-7 py-3.5 rounded-xl font-bold text-sm tracking-wider hover:bg-zinc-200 transition-all active:scale-[0.98]"
                >
                  查看作品 <ArrowRight size={15} />
                </Link>
                <Link
                  to="/blog"
                  className="inline-flex items-center justify-center gap-2 border border-white/10 text-white px-7 py-3.5 rounded-xl font-bold text-sm tracking-wider hover:bg-white/5 transition-all active:scale-[0.98]"
                >
                  閱讀筆記 <Terminal size={15} />
                </Link>
              </div>
            </div>

            {/* Right: topology visual */}
            <div className="hidden lg:flex items-center justify-center relative">
              <div className="relative w-[340px] h-[340px] xl:w-[420px] xl:h-[420px]">
                <div className="absolute inset-[8%] rounded-full border border-white/[0.06]" />
                <div className="absolute inset-[28%] rounded-full border border-white/[0.04]" />
                <div className="absolute inset-[48%] rounded-full border border-white/[0.03]" />
              </div>
            </div>
          </section>
        </Section>

        {/* ===== DIVIDER ===== */}
        <Divider variant="subtle" />

        {/* ===== STATS - Asymmetric Grid ===== */}
        <Section variant="transparent" padding={10}>
          <div className="max-w-6xl mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Hero stat - spans 2 cols on desktop */}
              <div className="md:col-span-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 sm:p-10 relative">
                <VStack gap={3}>
                  <Text type="label" className="text-white/30 uppercase tracking-widest text-[10px]">
                    Virtual Machines
                  </Text>
                  <Text type="display-1" className="!text-4xl sm:!text-5xl lg:!text-6xl font-black text-white tracking-tight">
                    {statVm}
                  </Text>
                  <Text className="text-slate-500 text-sm font-light">
                    Active virtual clusters under management across multiple hypervisors and datacenters.
                  </Text>
                </VStack>
              </div>

              {/* Storage stat */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 sm:p-10 relative">
                <VStack gap={3}>
                  <Text type="label" className="text-white/30 uppercase tracking-widest text-[10px]">
                    Storage
                  </Text>
                  <Text type="display-1" className="!text-3xl sm:!text-4xl font-black text-white tracking-tight">
                    HPE 2050
                  </Text>
                  <Text className="text-slate-500 text-sm font-light">
                    Multipath iSCSI SAN with redundant fabric topology.
                  </Text>
                </VStack>
              </div>

              {/* Defense stat */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 sm:p-10 relative">
                <VStack gap={3}>
                  <Text type="label" className="text-white/30 uppercase tracking-widest text-[10px]">
                    Defense
                  </Text>
                  <Text type="display-1" className="!text-3xl sm:!text-4xl font-black text-white tracking-tight">
                    {statDefense}
                  </Text>
                  <Text className="text-slate-500 text-sm font-light">
                    High-availability network edge security cluster.
                  </Text>
                </VStack>
              </div>

              {/* Uptime stat */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 sm:p-10 relative">
                <VStack gap={3}>
                  <Text type="label" className="text-white/30 uppercase tracking-widest text-[10px]">
                    Uptime
                  </Text>
                  <Text type="display-1" className="!text-3xl sm:!text-4xl font-black text-white tracking-tight">
                    {configs.stat_uptime || '99.9%'}
                  </Text>
                  <Text className="text-slate-500 text-sm font-light">
                    Measured SLA across all managed infrastructure.
                  </Text>
                </VStack>
              </div>

              {/* Response stat */}
              <div className="md:col-span-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 sm:p-10 relative">
                <VStack gap={3}>
                  <Text type="label" className="text-white/30 uppercase tracking-widest text-[10px]">
                    Response
                  </Text>
                  <Text type="display-1" className="!text-4xl sm:!text-5xl lg:!text-6xl font-black text-white tracking-tight">
                    24/7
                  </Text>
                  <Text className="text-slate-500 text-sm font-light">
                    Continuous monitoring and incident response coverage with automated alerting and escalation.
                  </Text>
                </VStack>
              </div>
            </div>
          </div>
        </Section>

        {/* ===== DIVIDER ===== */}
        <Divider variant="subtle" />

        {/* ===== PHILOSOPHY - Full-width editorial ===== */}
        <Section variant="transparent" padding={10}>
          <div className="max-w-4xl mx-auto"
          >
            <VStack gap={8}>
              <div className="w-10 h-1 rounded-full bg-emerald-500/40" />
              <Heading level={2} className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-[1.15]">
                從維運現場出發<br />
                <span className="text-slate-400 font-light italic">打造穩定的基礎架構</span>
              </Heading>
              <div className="w-16 h-0.5 bg-emerald-500/30" />
              <Text className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl font-light">
                把網路、虛擬化、儲存與安全整合成清楚的流程，讓日常維運更快、更穩，也更容易交接。
                每個節點、每條規則、每份備份，都經過實際部署驗證，不是紙上談兵的架構。
              </Text>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-emerald-400 text-sm font-bold tracking-wide hover:text-emerald-300 transition-colors group"
              >
                了解更多 <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </VStack>
          </div>
        </Section>

        {/* ===== DIVIDER ===== */}
        <Divider variant="subtle" />

        {/* ===== TECH DOMAINS - 2x2 Asymmetric ===== */}
        <Section variant="transparent" padding={10}>
          <div className="max-w-5xl mx-auto w-full">
            <Text type="label" className="block text-center text-white/20 uppercase tracking-[0.3em] text-[10px] mb-12">
              Core Competencies
            </Text>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: <Server size={22} />,
                  title: 'Virtualization',
                  desc: 'VMware vSphere cluster management, VM lifecycle automation, resource optimisation across 151+ nodes.',
                  gradient: 'from-emerald-500/[0.04]',
                  border: 'border-emerald-500/10',
                },
                {
                  icon: <Shield size={22} />,
                  title: 'Network Security',
                  desc: 'Fortinet HA pair deployment, VLAN segmentation, firewall policy auditing, VPN gateway operations.',
                  gradient: 'from-emerald-500/[0.04]',
                  border: 'border-emerald-500/10',
                },
                {
                  icon: <Database size={22} />,
                  title: 'Storage',
                  desc: 'HPE 2050 SAN architecture, multipath iSCSI configuration, backup strategy and disaster recovery planning.',
                  gradient: 'from-emerald-500/[0.04]',
                  border: 'border-emerald-500/10',
                },
                {
                  icon: <Globe size={22} />,
                  title: 'Cloud & DevOps',
                  desc: 'Cloudflare Pages, R2, D1; automated CI/CD pipelines; Ubuntu 24.04 server provisioning with Ansible.',
                  gradient: 'from-emerald-500/[0.04]',
                  border: 'border-emerald-500/10',
                },
              ].map((item, i) => (
                <div
                  key={item.title}
                  className="rounded-2xl border bg-white/[0.02] p-7 sm:p-9 relative hover:border-white/20 transition-colors"
                  style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <VStack gap={4}>
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
                      {item.icon}
                    </div>
                    <Heading level={3} className="text-lg font-bold text-white tracking-tight">
                      {item.title}
                    </Heading>
                    <Text className="text-sm text-slate-500 leading-relaxed font-light">
                      {item.desc}
                    </Text>
                  </VStack>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ===== DIVIDER ===== */}
        <Divider variant="subtle" />

        {/* ===== CTA ===== */}
        <Section variant="transparent" padding={10}>
          <div className="max-w-2xl mx-auto text-center"
          >
            <VStack gap={8} align="center">
              <div className="w-12 h-12 rounded-full border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-center">
                <Cpu size={20} className="text-emerald-400" />
              </div>
              <VStack gap={4} align="center">
                <Heading level={2} className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Want to see the infrastructure in action?
                </Heading>
                <Text className="text-sm sm:text-base text-slate-400 max-w-md font-light leading-relaxed">
                  Browse real deployment cases, network topology diagrams, and the full technology stack powering this environment.
                </Text>
              </VStack>
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2 bg-white text-[#0a0b10] px-8 py-4 rounded-xl font-bold text-sm tracking-wider hover:bg-zinc-200 transition-all active:scale-[0.98]"
              >
                瀏覽維運實績 <ArrowRight size={16} />
              </Link>
            </VStack>
          </div>
        </Section>

        {/* ===== FOOTER ===== */}
        <footer className="py-12 text-center border-t border-white/[0.04]">
          <Text type="supporting" className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">
            Infrastructure Managed with Precision
          </Text>
        </footer>
      </div>
    </>
  );
};

export default HomePage;
