import React, { useState, useEffect } from 'react';
import { SEOMeta, BreadcrumbSchema } from '../lib/seo';
import { motion } from 'framer-motion';
import { SOCIAL_LINKS } from '../constants';
import {
  HardDrive, Server, Terminal, ShieldCheck, Activity, Loader2,
} from 'lucide-react';
import { ConfigAPI } from '../services/apiClient';
import BlurText from '../components/BlurText';
import FadingVideo from '../components/FadingVideo';

const CAP_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_093722_ccfc7ebf-182f-419f-8a62-2dc02db7dd9d.mp4';

const blurIn = {
  initial: { filter: 'blur(10px)', opacity: 0, y: 20 },
  animate: { filter: 'blur(0px)', opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: 'easeOut' as const },
};

const AboutPage: React.FC = () => {
  const [configs, setConfigs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const data = await ConfigAPI.all();
        setConfigs(data || {});
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
      <div className="blog-cinematic flex min-h-screen items-center justify-center bg-black">
        <div className="liquid-glass flex h-16 w-16 items-center justify-center rounded-full">
          <Loader2 className="animate-spin text-white/50" size={24} />
        </div>
      </div>
    );
  }

  const skills = [
    {
      icon: <HardDrive size={22} />,
      title: configs.about_skill1_title || '儲存 & 備份',
      desc:
        configs.about_skill1_desc ||
        '規劃異地備援架構，設計自動化 VM 備份策略，管理 HPE Storage 與 QNAP NAS 儲存集群。',
      tags: ['HPE', 'QNAP', 'Backup'],
    },
    {
      icon: <ShieldCheck size={22} />,
      title: configs.about_skill2_title || '資安 & 弱掃',
      desc:
        configs.about_skill2_desc ||
        '執行系統弱點掃描與漏洞修補，監控 TANet 異常流量，持有 CEH 國際資安認證。',
      tags: ['CEH', 'TANet', 'Hardening'],
    },
    {
      icon: <Server size={22} />,
      title: configs.about_skill3_title || 'VM & 雲端管理',
      desc:
        configs.about_skill3_desc ||
        '維運 VMware vSphere 集群（150+ VM），制定標準化部署流程，管理 Google Workspace 網域。',
      tags: ['vSphere', 'SOP', 'Workspace'],
    },
  ];

  return (
    <>
      <SEOMeta
        title="關於"
        description="吳東謙 — 系統維運工程師。專注於 TANet 資安監控、VMware 虛擬化管理、Storage 備份架構，現就讀國立臺灣海洋大學資工系碩專班。"
        path="/about"
        keywords="關於吳東謙,系統維運,資安工程師,Storage,VMware,CEH"
      />
      <BreadcrumbSchema items={[{ name: '首頁', path: '/' }, { name: '關於', path: '/about' }]} />

      <div className="blog-cinematic relative min-h-screen overflow-hidden bg-black">
        <div className="pointer-events-none absolute inset-0 z-0 opacity-30">
          <FadingVideo src={CAP_VIDEO} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/80 to-black" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-5 pb-32 pt-[120px] sm:px-8 sm:pt-[140px] lg:px-16">
          <header className="mb-16 text-center sm:mb-24">
            <motion.div
              {...blurIn}
              className="liquid-glass mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2"
            >
              <span className="rounded-full bg-white px-2.5 py-0.5 font-body text-[10px] font-semibold uppercase tracking-wider text-black">
                Studio
              </span>
              <span className="font-body text-sm font-light text-white/90">
                {configs.about_hero_subtitle || '系統維運 · 資安監控 · 基隆在地'}
              </span>
            </motion.div>

            <BlurText
              text={`${configs.about_hero_title_left || '關於'} ${configs.about_hero_title_right || '東謙'}`}
              className="font-heading italic text-6xl leading-[0.85] tracking-[-3px] text-white md:text-7xl lg:text-[5.5rem]"
              delay={0.15}
            />
          </header>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <motion.div
              {...blurIn}
              transition={{ ...blurIn.transition, delay: 0.3 }}
              className="lg:col-span-8"
            >
              <div className="liquid-glass relative h-full overflow-hidden rounded-[1.25rem] p-8 md:p-12">
                <div className="pointer-events-none absolute top-6 right-6 opacity-[0.06]">
                  <Terminal size={200} strokeWidth={0.5} />
                </div>
                <div className="relative">
                  <div className="mb-8 flex items-center gap-3">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-white/70" />
                    <span className="font-body text-[11px] font-medium uppercase tracking-[0.25em] text-white/50">
                      Identity Verified
                    </span>
                  </div>

                  <h3 className="mb-8 whitespace-pre-line font-heading italic text-3xl leading-[1.05] tracking-[-1px] text-white md:text-4xl">
                    {configs.about_bio_heading || '從基隆出發，\n守護教育數位基礎。'}
                  </h3>

                  <div className="max-w-[48ch] space-y-6 border-l border-white/15 pl-6 font-body text-base font-light leading-relaxed text-white/80 md:pl-10 md:text-lg">
                    {(
                      configs.about_content ||
                      '我是吳東謙，現就讀國立臺灣海洋大學資訊工程碩士專班，同時任職於基隆市教育網路中心。學術與實戰並行的雙軌節奏，讓我能將理論帶進機房，也把第一線維運經驗反芻為研究深度。\n\n在教網中心，我負責 TANet 學術網路的資安監控與流量分析，確保全市教育網路服務穩定運行。從零建置的自動化 VM 備份系統與異地備援架構，結合 HPE Storage 與 QNAP NAS 的整合調度，為超過 150 台虛擬主機提供了可驗證的資料韌性。\n\n除技術實務外，公關產業的實習背景給了我另一種視野——跨部門溝通、需求轉譯、利害關係人協調，讓我在技術團隊中不只是執行者，更是連結者。'
                    )
                      .split('\n\n')
                      .map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                  </div>

                  <div className="mt-12 flex flex-wrap gap-3">
                    {SOCIAL_LINKS.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        className="liquid-glass inline-flex items-center gap-3 rounded-full px-5 py-3 font-body text-[11px] font-medium uppercase tracking-[0.2em] text-white/70 transition hover:text-white"
                        aria-label={social.label}
                      >
                        {social.icon}
                        {social.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="flex flex-col gap-6 lg:col-span-4">
              <motion.div
                {...blurIn}
                transition={{ ...blurIn.transition, delay: 0.4 }}
                className="liquid-glass flex flex-1 flex-col items-center justify-center gap-6 rounded-[1.25rem] p-10 text-center"
              >
                <div className="liquid-glass flex h-16 w-16 items-center justify-center rounded-[1rem]">
                  <Activity size={28} className="text-white/80" />
                </div>
                <div>
                  <p className="font-heading italic text-5xl tracking-[-1px] text-white">
                    {configs.stat_uptime || '99.9%'}
                  </p>
                  <p className="mt-3 font-body text-[11px] font-medium uppercase tracking-[0.25em] text-white/40">
                    System Reliability
                  </p>
                </div>
              </motion.div>

              <motion.div
                {...blurIn}
                transition={{ ...blurIn.transition, delay: 0.5 }}
                className="liquid-glass flex flex-1 flex-col items-center justify-center gap-6 rounded-[1.25rem] p-10 text-center"
              >
                <div className="liquid-glass flex h-16 w-16 items-center justify-center rounded-[1rem]">
                  <ShieldCheck size={28} className="text-white/80" />
                </div>
                <div>
                  <p className="font-heading italic text-5xl tracking-[-1px] text-white">
                    {configs.stat_vm || '151+'}
                  </p>
                  <p className="mt-3 font-body text-[11px] font-medium uppercase tracking-[0.25em] text-white/40">
                    Secure Nodes Managed
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {skills.map((skill, i) => (
              <motion.div
                key={skill.title}
                initial={{ filter: 'blur(10px)', opacity: 0, y: 24 }}
                whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="liquid-glass flex min-h-[320px] flex-col rounded-[1.25rem] p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="liquid-glass flex h-11 w-11 items-center justify-center rounded-[0.75rem] text-white/80">
                    {skill.icon}
                  </div>
                  <div className="flex flex-wrap justify-end gap-1.5">
                    {skill.tags.map((t) => (
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
                <h4 className="font-heading italic text-3xl leading-none tracking-[-1px] text-white">
                  {skill.title}
                </h4>
                <p className="mt-3 max-w-[32ch] font-body text-sm font-light leading-snug text-white/80">
                  {skill.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
