import React, { useState, useEffect } from 'react';
import { SEOMeta, BreadcrumbSchema } from '../lib/seo';
import { motion } from 'framer-motion';
import { SOCIAL_LINKS } from '../constants';
import { 
  Shield, HardDrive, Server, Terminal, Network, 
  ShieldCheck, Activity, Loader2, Cpu, Globe, Zap 
} from 'lucide-react';
import { ConfigAPI } from '../services/apiClient';

const AboutPage: React.FC = () => {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: any = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8 } }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin dark:text-white text-morandi-slate" size={40} />
    </div>
  );

  return (
    <>
      <SEOMeta
        title="關於"
        description="吳東謙 — 系統維運工程師。專注於 TANet 資安監控、VMware 虛擬化管理、Storage 備份架構，現就讀國立臺灣海洋大學資工系碩專班。"
        path="/about"
        keywords="關於吳東謙,系統維運,資安工程師,Storage,VMware,CEH"
      />
      <BreadcrumbSchema items={[{ name: '首頁', path: '/' }, { name: '關於', path: '/about' }]} />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen pt-[160px] pb-32 px-6 max-w-7xl mx-auto relative overflow-x-hidden"
      >
      <div className="fixed inset-0 pointer-events-none dark:opacity-[0.03] opacity-[0.05] overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#2D3436 1px, transparent 1px), linear-gradient(90deg, #2D3436 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <motion.div variants={itemVariants} className="text-center mb-32 relative z-10">
        <div className="inline-block px-6 py-2 dark:border-white/10 border-slate-900/10 dark:bg-white/5 bg-white/40 mb-8 rounded-[40px] shadow-xl backdrop-blur-[40px] border">
          <p className="dark:text-white text-morandi-slate font-black text-[10px] tracking-[0.8em] uppercase">
            {configs.about_hero_subtitle || "系統維運 · 資安監控 · 基隆在地"}
          </p>
        </div>
        <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tighter dark:text-white text-morandi-slate uppercase">
          {configs.about_hero_title_left || "關於"}<span className="opacity-30 italic font-light">{configs.about_hero_title_right || "東謙"}</span>
        </h2>
        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-morandi-slate/40 to-transparent mx-auto mt-12" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        <motion.div variants={itemVariants} className="lg:col-span-8">
          <div className="p-10 md:p-20 h-full dark:border-white/10 border-slate-900/10 relative overflow-hidden group dark:bg-black/40 bg-white/40 shadow-xl rounded-[40px] backdrop-blur-[40px] border">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] select-none pointer-events-none group-hover:opacity-[0.07] transition-opacity duration-1000">
              <Terminal size={300} strokeWidth={0.5} className="dark:text-white text-morandi-slate" />
            </div>
            
            <div className="relative">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                <span className="text-[10px] font-black dark:text-slate-500 text-morandi-stone uppercase tracking-[0.5em]">Identity Verified</span>
              </div>

              <h3 className="text-2xl md:text-4xl font-black dark:text-white text-morandi-slate mb-12 leading-tight tracking-tighter">
                {configs.about_bio_heading || "從基隆出發，\n守護教育數位基礎。"}
              </h3>
              
              <div className="space-y-10 dark:text-slate-300 text-morandi-slate text-base md:text-lg leading-relaxed font-light tracking-wide whitespace-pre-line border-l dark:border-white/10 border-slate-900/10 pl-10 md:pl-16">
                {configs.about_content || "我是吳東謙，現就讀國立臺灣海洋大學資訊工程碩士專班，同時任職於基隆市教育網路中心。學術與實戰並行的雙軌節奏，讓我能將理論帶進機房，也把第一線維運經驗反芻為研究深度。\n\n在教網中心，我負責 TANet 學術網路的資安監控與流量分析，確保全市教育網路服務穩定運行。從零建置的自動化 VM 備份系統與異地備援架構，結合 HPE Storage 與 QNAP NAS 的整合調度，為超過 150 台虛擬主機提供了可驗證的資料韌性。\n\n除技術實務外，公關產業的實習背景給了我另一種視野——跨部門溝通、需求轉譯、利害關係人協調，讓我在技術團隊中不只是執行者，更是連結者。"}
              </div>

              <div className="flex flex-wrap gap-5 pt-20">
                {SOCIAL_LINKS.map((social) => (
                  <a 
                    key={social.label}
                    href={social.href}
                    className="px-8 py-5 rounded-2xl flex items-center gap-4 dark:text-slate-400 text-morandi-slate dark:border-white/5 border-slate-900/5 hover:border-morandi-slate transition-all hover:scale-105 active:scale-95 bg-white/20 backdrop-blur-[40px] border"
                    aria-label={social.label}
                  >
                    {social.icon}
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">{social.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-4 space-y-10">
          <div className="p-12 dark:border-white/10 border-slate-900/10 flex flex-col items-center justify-center text-center gap-10 group dark:bg-black/40 bg-white/40 overflow-hidden relative rounded-[40px] backdrop-blur-[40px] border">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
            <div className="relative">
              <div className="absolute inset-0 dark:bg-white/10 bg-morandi-slate/5 blur-3xl rounded-full scale-150 group-hover:scale-125 transition-all duration-1000" />
              <div className="relative w-24 h-24 rounded-[2.5rem] dark:bg-white dark:text-black bg-morandi-slate text-white flex items-center justify-center shadow-xl">
                <Activity size={40} strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <p className="text-4xl font-black dark:text-white text-morandi-slate leading-none tracking-tighter">{configs.stat_uptime || "99.9%"}</p>
              <p className="text-[10px] dark:text-slate-500 text-morandi-stone font-black uppercase tracking-[0.5em] mt-6">System Reliability</p>
            </div>
          </div>

          <div className="p-12 dark:border-white/10 border-slate-900/10 flex flex-col items-center justify-center text-center gap-10 group dark:bg-black/40 bg-white/40 overflow-hidden relative rounded-[40px] backdrop-blur-[40px] border">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
            <div className="w-24 h-24 rounded-[2.5rem] dark:bg-white/5 bg-black/5 border dark:border-white/10 border-slate-900/10 dark:text-white text-morandi-slate flex items-center justify-center group-hover:border-morandi-slate transition-all">
              <ShieldCheck size={40} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-4xl font-black dark:text-white text-morandi-slate leading-none tracking-tighter">{configs.stat_vm || "151+"}</p>
              <p className="text-[10px] dark:text-slate-500 text-morandi-stone font-black uppercase tracking-[0.5em] mt-6">Secure Nodes Managed</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10 relative z-10">
        <SkillCard 
          icon={<HardDrive size={32} />} 
          title={configs.about_skill1_title || "儲存 & 備份"}
          desc={configs.about_skill1_desc || "規劃異地備援架構，設計自動化 VM 備份策略，管理 HPE Storage 與 QNAP NAS 儲存集群。"}
          accentColor="rgba(52, 211, 153, 0.2)"
        />
        <SkillCard 
          icon={<ShieldCheck size={32} />} 
          title={configs.about_skill2_title || "資安 & 弱掃"}
          desc={configs.about_skill2_desc || "執行系統弱點掃描與漏洞修補，監控 TANet 異常流量，持有 CEH 國際資安認證。"}
          accentColor="rgba(56, 189, 248, 0.2)"
        />
        <SkillCard 
          icon={<Server size={32} />} 
          title={configs.about_skill3_title || "VM & 雲端管理"}
          desc={configs.about_skill3_desc || "維運 VMware vSphere 集群（150+ VM），制定標準化部署流程，管理 Google Workspace 網域。"}
          accentColor="rgba(168, 85, 247, 0.2)"
        />
      </div>
    </motion.div>
    </>
  );
};

const SkillCard: React.FC<{ icon: React.ReactNode, title: string, desc: string, accentColor: string }> = ({ icon, title, desc, accentColor }) => (
  <motion.div 
    variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } } as any}
    className="p-12 dark:border-white/5 border-slate-900/5 group hover:bg-white/40 dark:hover:bg-white/5 bg-white/20 dark:bg-black/20 transition-all duration-700 relative overflow-hidden shadow-sm rounded-[40px] backdrop-blur-[40px] border"
  >
    <div className="absolute top-0 right-0 w-32 h-32 blur-[80px] rounded-full pointer-events-none transition-all duration-700 group-hover:scale-150" style={{ backgroundColor: accentColor }} />
    <div className="w-16 h-16 rounded-2xl dark:bg-white/5 bg-morandi-slate/5 flex items-center justify-center mb-10 dark:text-white text-morandi-slate group-hover:scale-110 group-hover:bg-morandi-slate dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-all duration-500 shadow-sm border border-slate-900/5 dark:border-white/5">
      {icon}
    </div>
    <h4 className="dark:text-white text-morandi-slate font-black text-2xl mb-6 uppercase tracking-tight">{title}</h4>
    <p className="dark:text-slate-400 text-morandi-stone text-base leading-relaxed font-normal">{desc}</p>
  </motion.div>
);

export default AboutPage;