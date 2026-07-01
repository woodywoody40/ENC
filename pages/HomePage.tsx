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

  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.15], [1, 0.98]);

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
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0, filter: 'blur(5px)' },
    visible: {
      y: 0, opacity: 1, filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent">
      <Loader2 className="animate-spin dark:text-white/10 text-morandi-slate/20 mb-4" size={32} strokeWidth={1} />
      <Text type="supporting" className="dark:text-white/20 text-morandi-stone/40">初始化中...</Text>
    </div>
  );

  return (
    <div className="relative overflow-x-hidden">
      {/* ===== HERO ===== */}
      <Section variant="transparent" padding={0}>
        <motion.section
          style={{ opacity, scale }}
          className="min-h-[100dvh] flex flex-col items-center justify-center px-6 sm:px-12 text-center pt-[100px] pb-[80px] relative"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-6xl mx-auto flex flex-col items-center"
          >
            {/* Status badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel dark:border-white/10 border-black/5 dark:bg-white/5 bg-white/40 mb-6 sm:mb-8 shadow-lg"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse" />
              <Text type="label" className="dark:text-white/80 text-morandi-slate">SYSTEM ONLINE &middot; WOODY_CORE_V4</Text>
            </motion.div>

            {/* Main heading — 大幅縮小字體 */}
            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 tracking-tight leading-[1.05] uppercase heading-gradient text-glow w-full max-w-5xl selection:bg-white selection:text-black whitespace-pre-line"
            >
              {configs.hero_title || "Woody Wu\nInfrastructure"}
            </motion.h1>

            {/* Subtitle */}
            <motion.div variants={itemVariants} className="mb-10 sm:mb-12 max-w-3xl">
              <p className="dark:text-slate-400 text-morandi-stone text-sm sm:text-base md:text-lg leading-relaxed font-light tracking-normal">
                {configs.hero_intro || "專注基礎架構、自動化部署與雲端維運，把複雜系統整理成可靠、可擴充的服務。"}
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 w-full max-w-[300px] sm:max-w-none"
            >
              <Link
                to="/portfolio"
                className="group dark:bg-white dark:text-black bg-morandi-slate text-white px-8 py-4 rounded-2xl font-bold text-sm tracking-wider flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl"
              >
                查看作品 <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/blog"
                className="glass-panel px-8 py-4 dark:text-white text-morandi-slate font-bold text-sm tracking-wider flex items-center justify-center gap-3 dark:border-white/10 border-black/5 hover:bg-white/5 transition-all rounded-2xl"
              >
                閱讀筆記 <Terminal size={16} />
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="absolute bottom-8 flex flex-col items-center gap-2 opacity-20"
          >
            <Text type="supporting">SCROLL</Text>
            <ChevronDown size={14} />
          </motion.div>
        </motion.section>
      </Section>

      {/* ===== DIVIDER ===== */}
      <Divider variant="strong" />

      {/* ===== STATS ===== */}
      <Section variant="transparent" padding={10}>
        <VStack gap={8}>
          <Text type="label" className="text-center dark:text-white/30 text-morandi-stone/50">
            INFRASTRUCTURE AT A GLANCE
          </Text>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto w-full">
            <StatsCard
              icon={<Cpu size={20} />}
              title="Operational Scale"
              desc={configs.stat_vm || '151+ Nodes'}
              detail="Active Virtual Clusters"
            />
            <StatsCard
              icon={<Database size={20} />}
              title="Storage Core"
              desc="HPE 2050"
              detail="Multipath iSCSI SAN"
            />
            <StatsCard
              icon={<Shield size={20} />}
              title="Defense Mesh"
              desc={configs.stat_defense || 'Forti HA'}
              detail="Network Edge Security"
            />
          </div>
        </VStack>
      </Section>

      {/* ===== DIVIDER ===== */}
      <Divider variant="subtle" />

      {/* ===== ABOUT ===== */}
      <Section variant="transparent" padding={10}>
        <VStack gap={8} align="center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8 }}
            className="glass-panel p-8 sm:p-12 lg:p-16 relative overflow-hidden group dark:bg-white/[0.02] bg-white/40 shadow-2xl dark:border-white/5 border-black/5 rounded-3xl max-w-4xl w-full"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <VStack gap={8} align="center">
              <Sparkles className="text-emerald-500/40 shrink-0" size={28} />

              <VStack gap={4} align="center">
                <Heading level={2} className="text-2xl sm:text-3xl md:text-4xl font-black dark:text-white text-morandi-slate tracking-tight leading-[1.15] text-center">
                  從維運現場出發<br /><span className="opacity-40 italic font-bold">打造穩定的基礎架構</span>
                </Heading>
                <Text className="dark:text-slate-400 text-morandi-stone text-sm sm:text-base leading-relaxed max-w-xl text-center font-light">
                  把網路、虛擬化、儲存與安全整合成清楚的流程，讓日常維運更快、更穩，也更容易交接。
                </Text>
              </VStack>

              <div className="flex items-center justify-center gap-8 sm:gap-16 pt-2">
                <VStack gap={2} align="center">
                  <Text type="display-1" className="dark:text-white text-morandi-slate !text-3xl sm:!text-4xl font-black tracking-tight">
                    {configs.stat_uptime || '99.9%'}
                  </Text>
                  <Text type="label" className="dark:text-white/30 text-morandi-stone/50">Uptime</Text>
                </VStack>
                <div className="w-px h-12 dark:bg-white/10 bg-black/10" />
                <VStack gap={2} align="center">
                  <Text type="display-1" className="dark:text-white text-morandi-slate !text-3xl sm:!text-4xl font-black tracking-tight">24/7</Text>
                  <Text type="label" className="dark:text-white/30 text-morandi-stone/50">Response</Text>
                </VStack>
              </div>
            </VStack>
          </motion.div>
        </VStack>
      </Section>

      <footer className="py-16 text-center border-t dark:border-white/5 border-black/5">
        <Text type="supporting" className="dark:text-white/30 text-morandi-stone/40">
          Infrastructure Managed with Precision &middot; 2025
        </Text>
      </footer>
    </div>
  );
};

const StatsCard: React.FC<{ icon: React.ReactNode; title: string; desc: string; detail: string; className?: string }> = ({ icon, title, desc, detail, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={className}
  >
    <Card className="flex flex-col items-center text-center group glass-panel dark:bg-white/[0.03] bg-white/60 shadow-lg rounded-2xl p-6">
      <div className="w-12 h-12 rounded-xl dark:bg-white dark:text-black bg-morandi-slate text-white flex items-center justify-center mb-5 group-hover:rotate-[360deg] transition-all duration-700 shadow-lg">
        {icon}
      </div>
      <Text type="label" className="dark:text-slate-400 text-morandi-stone mb-3">
        {title}
      </Text>
      <Text type="display-1" className="dark:text-white text-morandi-slate !text-2xl sm:!text-3xl font-black mb-2 tracking-tight">
        {desc}
      </Text>
      <Text type="supporting" className="dark:text-slate-500 text-morandi-stone/50">
        {detail}
      </Text>
    </Card>
  </motion.div>
);

export default HomePage;
