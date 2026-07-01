import React, { useState, useEffect } from 'react';
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
        <div className="inline-block px-6 py-2 glass-panel dark:border-white/10 border-slate-900/10 dark:bg-white/5 bg-white/40 mb-8">
          <p className="dark:text-white text-morandi-slate font-black text-[10px] tracking-[0.8em] uppercase">
            {configs.about_hero_subtitle || "The Infrastructure Guardian"}
          </p>
        </div>
        <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tighter heading-gradient leading-none text-glow uppercase">
          {configs.about_hero_title_left || "關於"}<span className="opacity-30 italic font-light">{configs.about_hero_title_right || "Woody"}</span>
        </h2>
        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-morandi-slate/40 to-transparent mx-auto mt-12" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        <motion.div variants={itemVariants} className="lg:col-span-8">
          <div className="glass-panel p-10 md:p-20 h-full dark:border-white/10 border-slate-900/10 relative overflow-hidden group dark:bg-black/40 bg-white/40 shadow-xl">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] select-none pointer-events-none group-hover:opacity-[0.07] transition-opacity duration-1000">
              <Terminal size={300} strokeWidth={0.5} className="dark:text-white text-morandi-slate" />
            </div>
            
            <div className="relative">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                <span className="text-[10px] font-black dark:text-slate-500 text-morandi-stone uppercase tracking-[0.5em]">Identity Verified</span>
              </div>

              <h3 className="text-2xl md:text-4xl font-black dark:text-white text-morandi-slate mb-12 leading-tight tracking-tighter">
                {configs.about_bio_heading || "在數位動脈中，\n維護絕對的穩定性。"}
              </h3>
              
              <div className="space-y-10 dark:text-slate-300 text-morandi-slate text-base md:text-lg leading-relaxed font-light tracking-wide whitespace-pre-line border-l dark:border-white/10 border-slate-900/10 pl-10 md:pl-16">
                {configs.about_content || "從底層的 HPE 儲存調優到核心防火牆策略，每一行指令都是為了追求極致穩定。"}
              </div>

              <div className="flex flex-wrap gap-5 pt-20">
                {SOCIAL_LINKS.map((social) => (
                  <a 
                    key={social.label}
                    href={social.href}
                    className="px-8 py-5 glass-panel rounded-2xl flex items-center gap-4 dark:text-slate-400 text-morandi-slate dark:border-white/5 border-slate-900/5 hover:border-morandi-slate transition-all hover:scale-105 active:scale-95 bg-white/20"
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
          <div className="glass-panel p-12 dark:border-white/10 border-slate-900/10 flex flex-col items-center justify-center text-center gap-10 group dark:bg-black/40 bg-white/40 overflow-hidden relative">
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

          <div className="glass-panel p-12 dark:border-white/10 border-slate-900/10 flex flex-col items-center justify-center text-center gap-10 group dark:bg-black/40 bg-white/40 overflow-hidden relative">
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
          icon={<Server size={32} />} 
          title={configs.about_skill1_title || "OS & Virtualization"}
          desc={configs.about_skill1_desc || "Ubuntu 24.04 LTS 專家, vSphere 8.0 管理, 151+ VM 叢集調度。"}
          accentColor="rgba(52, 211, 153, 0.2)"
        />
        <SkillCard 
          icon={<Network size={32} />} 
          title={configs.about_skill2_title || "Security Edge"}
          desc={configs.about_skill2_desc || `${configs.stat_defense || "Fortinet HA"} 部署, VDOM 隔離實踐, TANet 維運。`}
          accentColor="rgba(56, 189, 248, 0.2)"
        />
        <SkillCard 
          icon={<HardDrive size={32} />} 
          title={configs.about_skill3_title || "Storage Logic"}
          desc={configs.about_skill3_desc || "HPE MSA 2050 混合儲存, QNAP NAS 備援, iSCSI Multipath。"}
          accentColor="rgba(168, 85, 247, 0.2)"
        />
      </div>
    </motion.div>
  );
};

const SkillCard: React.FC<{ icon: React.ReactNode, title: string, desc: string, accentColor: string }> = ({ icon, title, desc, accentColor }) => (
  <motion.div 
    variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } } as any}
    className="glass-panel p-12 dark:border-white/5 border-slate-900/5 group hover:bg-white/40 dark:hover:bg-white/5 bg-white/20 dark:bg-black/20 transition-all duration-700 relative overflow-hidden shadow-sm"
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