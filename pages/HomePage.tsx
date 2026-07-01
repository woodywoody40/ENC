import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { ArrowRight, ChevronDown, Cpu, Shield, Database, Loader2, Sparkles, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ConfigAPI } from '../services/apiClient';
import { Section } from '@astryxdesign/core/Section';
import { Divider } from '@astryxdesign/core/Divider';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Card } from '@astryxdesign/core/Card';
import { Text, Heading } from '@astryxdesign/core/Text';

const HomePage: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const [configs, setConfigs] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.98]);

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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0, filter: 'blur(5px)' },
    visible: {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent">
      <Loader2 className="animate-spin dark:text-white/10 text-morandi-slate/20 mb-4" size={48} strokeWidth={1} />
      <span className="text-[10px] font-black uppercase tracking-[0.4em] dark:text-white/20 text-morandi-stone/40">Init Node...</span>
    </div>
  );

  return (
    <div className="relative overflow-x-hidden">
      {/* ===== HERO ===== */}
      <Section variant="transparent" padding={0}>
        <motion.section
          style={{ opacity, scale }}
          className="min-h-[100dvh] flex flex-col items-center justify-center px-5 sm:px-12 text-center pt-[108px] pb-[80px] relative"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-7xl mx-auto flex flex-col items-center"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2.5 px-4 py-2 glass-panel dark:border-white/10 border-black/5 dark:bg-white/5 bg-white/40 mb-8 sm:mb-10 shadow-xl"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse" />
              <span className="dark:text-white text-morandi-slate text-[9px] font-black tracking-[0.26em] sm:tracking-[0.3em] uppercase">SYSTEM ONLINE : WOODY_CORE_V4</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-[2.75rem] sm:text-[4.5rem] md:text-[7rem] lg:text-[9rem] xl:text-[11rem] font-[900] mb-8 tracking-tight sm:tracking-tighter leading-[0.95] sm:leading-[0.9] uppercase heading-gradient text-glow w-full selection:bg-white selection:text-black whitespace-pre-line break-words"
            >
              {configs.hero_title || "Woody Wu\nInfrastructure"}
            </motion.h1>

            <motion.div variants={itemVariants} className="relative mb-12 sm:mb-16 px-2 sm:px-4 max-w-4xl">
              <p className="dark:text-slate-300 text-morandi-stone text-base sm:text-xl md:text-2xl lg:text-3xl leading-relaxed sm:leading-snug font-light sm:font-extralight tracking-normal sm:tracking-tight">
                {configs.hero_intro || "專注基礎架構、自動化部署與雲端維運，把複雜系統整理成可靠、可擴充的服務。"}
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 sm:gap-4 w-full max-w-[280px] sm:max-w-none"
            >
              <Link
                to="/portfolio"
                className="group dark:bg-white dark:text-black bg-morandi-slate text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-black text-[11px] tracking-[0.18em] flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-2xl"
              >
                查看作品 <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link
                to="/blog"
                className="glass-panel px-8 sm:px-10 py-4 sm:py-5 dark:text-white text-morandi-slate font-black tracking-[0.18em] text-[11px] flex items-center justify-center gap-3 dark:border-white/10 border-black/5 hover:bg-white/5 transition-all rounded-2xl"
              >
                閱讀筆記 <Terminal size={18} />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="absolute bottom-8 flex flex-col items-center gap-2 opacity-20 cursor-pointer hover:opacity-100 transition-opacity"
            onClick={() => window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' })}
          >
            <span className="text-[9px] font-black uppercase tracking-[0.4em] dark:text-white text-morandi-slate">Scroll</span>
            <ChevronDown size={14} />
          </motion.div>
        </motion.section>
      </Section>

      {/* ===== DIVIDER ===== */}
      <Divider variant="strong" />

      {/* ===== STATS ===== */}
      <Section variant="transparent" padding={6}>
        <VStack gap={4}>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center dark:text-white/30 text-morandi-stone/50 font-black text-[10px] tracking-[0.5em] uppercase mb-2"
          >
            Infrastructure at a Glance
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 lg:gap-10 max-w-7xl mx-auto w-full">
            <StatsCard
              icon={<Cpu size={24} />}
              title="Operational Scale"
              desc={configs.stat_vm || '151+ Nodes'}
              detail="Active Virtual Clusters"
            />
            <StatsCard
              icon={<Database size={24} />}
              title="Storage Core"
              desc="HPE 2050"
              detail="Multipath iSCSI SAN"
            />
            <StatsCard
              icon={<Shield size={24} />}
              title="Defense Mesh"
              desc={configs.stat_defense || 'Forti HA'}
              detail="Network Edge Security"
            />
          </div>
        </VStack>
      </Section>

      {/* ===== DIVIDER ===== */}
      <Divider variant="subtle" />

      {/* ===== QUOTE / ABOUT ===== */}
      <Section variant="transparent" padding={6}>
        <VStack gap={6} align="center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8 }}
            className="glass-panel p-8 sm:p-16 md:p-24 relative overflow-hidden group dark:bg-white/[0.02] bg-white/40 shadow-3xl dark:border-white/5 border-black/5 rounded-3xl sm:rounded-[3rem] max-w-6xl w-full"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <HStack gap={4} align="center">
              <Sparkles className="text-emerald-500 opacity-40 shrink-0" size={36} />
            </HStack>

            <VStack gap={6} align="center">
              <h3 className="text-3xl sm:text-5xl md:text-6xl font-black dark:text-white text-morandi-slate tracking-tight sm:tracking-tighter leading-[1.12] text-glow selection:bg-white selection:text-black text-center">
                從維運現場出發<br /><span className="opacity-35 italic">打造穩定的基礎架構</span>
              </h3>

              <p className="dark:text-slate-400 text-morandi-stone text-base sm:text-xl md:text-2xl leading-relaxed max-w-2xl font-light tracking-normal sm:tracking-tight text-center">
                把網路、虛擬化、儲存與安全整合成清楚的流程，讓日常維運更快、更穩，也更容易交接。
              </p>

              <div className="flex items-center justify-center gap-8 sm:gap-20 pt-4">
                <div className="flex flex-col items-center">
                  <span className="text-3xl sm:text-5xl font-black dark:text-white text-morandi-slate">{configs.stat_uptime || '99.9%'}</span>
                  <span className="text-[9px] font-black uppercase tracking-[0.35em] sm:tracking-[0.4em] dark:text-white/20 text-morandi-stone mt-4">Uptime</span>
                </div>
                <div className="w-px h-14 sm:h-16 dark:bg-white/10 bg-black/5" />
                <div className="flex flex-col items-center">
                  <span className="text-3xl sm:text-5xl font-black dark:text-white text-morandi-slate">24/7</span>
                  <span className="text-[9px] font-black uppercase tracking-[0.35em] sm:tracking-[0.4em] dark:text-white/20 text-morandi-stone mt-4">Response</span>
                </div>
              </div>
            </VStack>
          </motion.div>
        </VStack>
      </Section>

      <footer className="py-20 text-center border-t dark:border-white/5 border-black/5 opacity-30">
        <p className="text-[10px] font-black uppercase tracking-[0.6em] sm:tracking-[0.8em] dark:text-white/40 text-morandi-stone px-4">
          Infrastructure Managed with Precision | 2025
        </p>
      </footer>
    </div>
  );
};

const StatsCard: React.FC<{ icon: React.ReactNode; title: string; desc: string; detail: string; className?: string }> = ({ icon, title, desc, detail, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={className}
  >
    <Card className="flex flex-col items-center text-center group glass-panel dark:bg-white/[0.03] bg-white/60 shadow-xl rounded-3xl sm:rounded-[3rem]">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-[1.8rem] dark:bg-white dark:text-black bg-morandi-slate text-white flex items-center justify-center mb-8 sm:mb-10 group-hover:rotate-[360deg] transition-all duration-700 shadow-xl">
        {icon}
      </div>
      <Heading as="h4" variant="label" className="dark:text-slate-500 text-morandi-stone mb-6 sm:mb-8 !text-[10px] !tracking-[0.35em] sm:!tracking-[0.5em] uppercase">
        {title}
      </Heading>
      <Text variant="body" className="dark:text-white text-morandi-slate !text-3xl sm:!text-5xl lg:!text-6xl !font-[900] mb-4 !tracking-tight sm:!tracking-tighter group-hover:text-glow transition-all">
        {desc}
      </Text>
      <Text variant="supporting" className="dark:text-slate-400 text-morandi-stone/60 !text-[10px] !font-bold !tracking-[0.24em] sm:!tracking-[0.3em] uppercase">
        {detail}
      </Text>
    </Card>
  </motion.div>
);

export default HomePage;
