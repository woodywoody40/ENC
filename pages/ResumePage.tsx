
import React, { useState, useEffect } from 'react';
import { SEOMeta, BreadcrumbSchema } from '../lib/seo';
import { motion } from 'framer-motion';
import { 
  Mail, Github, Linkedin, MapPin, 
  Briefcase, GraduationCap, Award, 
  Terminal, Server, ShieldCheck, Loader2, FileText, Globe, Link as LinkIcon, ExternalLink
} from 'lucide-react';
import { ConfigAPI } from '../services/apiClient';

const ResumePage: React.FC = () => {
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

  const getParsedArray = (key: string) => {
    try {
      const val = configs[key];
      return val ? JSON.parse(val) : [];
    } catch {
      return [];
    }
  };

  const renderMarkdownText = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      const trimmed = line.trim();
      if (trimmed === '') return <div key={i} className="h-4" />;
      if (trimmed.startsWith('### ')) return <h3 key={i} className="text-xl font-black dark:text-white text-morandi-slate mt-10 mb-4 uppercase tracking-tight">{trimmed.replace('### ', '')}</h3>;
      if (trimmed.startsWith('#### ')) return <h4 key={i} className="text-sm font-black dark:text-white/60 text-morandi-stone mb-2 uppercase tracking-widest">{trimmed.replace('#### ', '')}</h4>;
      if (trimmed.startsWith('- ')) return <li key={i} className="ml-4 mb-2 dark:text-slate-400 text-morandi-stone list-disc font-light">{trimmed.replace('- ', '')}</li>;
      return <p key={i} className="mb-3 dark:text-slate-400 text-morandi-stone font-light leading-relaxed">{trimmed}</p>;
    });
  };

  const parseSkills = (skillsStr: string) => {
    if (!skillsStr) return [
      { name: "Linux System", level: "Expert" },
      { name: "Network Security", level: "Expert" },
      { name: "Cloud Storage", level: "Advanced" }
    ];
    return skillsStr.split(',').map(s => {
      const [name, level] = s.split(':');
      return { name: name?.trim(), level: level?.trim() || 'Advanced' };
    });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin dark:text-white text-morandi-slate" size={40} />
    </div>
  );

  const extraLinks = getParsedArray('resume_extra_links');
  const educationList = getParsedArray('resume_education_list');
  const certsList = getParsedArray('resume_certs_list');

  return (
    <>
      <SEOMeta
        title="技術履歷"
        description="Woody Wu 的技術履歷 — 資深基礎架構與資安工程師。Linux 系統加固、VMware vSphere、Fortinet 網路安全。"
        path="/resume"
        keywords="履歷,技術履歷,Woody Wu,基礎架構工程師,資安"
      />
      <BreadcrumbSchema items={[{ name: '首頁', path: '/' }, { name: '技術履歷', path: '/resume' }]} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen pt-[160px] pb-32 px-6 max-w-5xl mx-auto relative overflow-x-hidden"
      >
      <section className="mb-24 text-center">
        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          className="inline-block px-5 py-2 glass-panel dark:border-white/10 border-black/10 dark:bg-white/5 bg-white/40 mb-8"
        >
          <span className="dark:text-white text-morandi-slate font-black text-[9px] tracking-[0.8em] uppercase">技術履歷 - Curriculum Vitae</span>
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter heading-gradient text-glow uppercase">
          {configs.resume_name || "Woody Wu"}
        </h1>
        <p className="text-base md:text-lg dark:text-slate-400 text-morandi-stone font-light tracking-[0.1em] mb-12">
          {configs.resume_title || "資深基礎架構與資安工程師"}
        </p>
        
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 dark:text-slate-500 text-morandi-stone">
          <ContactItem icon={<Mail size={16} />} text={configs.resume_email || "example@mail.com"} />
          <ContactItem icon={<MapPin size={16} />} text={configs.resume_location || "Taiwan"} />
          {configs.resume_github && <ContactItem icon={<Github size={16} />} text="GitHub" href={configs.resume_github} />}
          {configs.resume_linkedin && <ContactItem icon={<Linkedin size={16} />} text="LinkedIn" href={configs.resume_linkedin} />}
          {extraLinks.map((link: any, idx: number) => (
            <ContactItem key={idx} icon={<Globe size={16} />} text={link.label} href={link.url} />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-24">
          <section>
            <SectionHeader icon={<Terminal size={20} />} title="專業總結" />
            <div className="text-base dark:text-slate-300 text-morandi-stone font-light leading-relaxed whitespace-pre-line border-l dark:border-white/10 border-black/10 pl-10">
              {configs.resume_summary || "於教育體系維運核心基礎設施，專注於 Linux 系統加固、高效能儲存架構與資安通報應處。"}
            </div>
          </section>

          <section>
            <SectionHeader icon={<Briefcase size={20} />} title="工作經歷" />
            <div className="space-y-12 border-l dark:border-white/5 border-black/10 ml-4 pl-10 relative">
              {renderMarkdownText(configs.resume_experience || "### 資深工程師 | 基隆市教網中心\n2020 - Present\n- 管理 151+ 台伺服器\n- 導入自動化備份體系")}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-20">
          <section>
            <SectionHeader icon={<ShieldCheck size={20} />} title="核心技能" />
            <div className="grid grid-cols-1 gap-4">
              {parseSkills(configs.resume_skills).map((skill, i) => (
                <SkillTag key={i} name={skill.name} level={skill.level} />
              ))}
            </div>
          </section>

          <section>
            <SectionHeader icon={<GraduationCap size={20} />} title="學歷經歷" />
            <div className="space-y-6">
              {educationList.length > 0 ? (
                educationList.map((edu: any, idx: number) => (
                  <div key={idx} className="glass-panel p-6 dark:border-white/5 border-black/10 hover:border-morandi-slate transition-all dark:bg-white/5 bg-white/60">
                    <p className="text-xs font-black dark:text-white/40 text-morandi-stone uppercase tracking-widest mb-2">{edu.year}</p>
                    <h4 className="text-lg font-black dark:text-white text-morandi-slate mb-1 tracking-tight">{edu.school}</h4>
                    <p className="text-sm dark:text-slate-400 text-morandi-stone font-medium">{edu.degree}</p>
                  </div>
                ))
              ) : (
                <div className="dark:text-slate-400 text-morandi-stone">
                  {renderMarkdownText(configs.resume_education)}
                </div>
              )}
            </div>
          </section>

          <section>
            <SectionHeader icon={<Award size={20} />} title="專業證照" />
            <div className="space-y-4">
              {certsList.length > 0 ? (
                certsList.map((cert: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-4 group">
                    <div className="w-2 h-2 rounded-full dark:bg-white/20 bg-morandi-slate group-hover:bg-morandi-rose transition-colors" />
                    <div className="flex-1">
                      <p className="text-sm font-black dark:text-white text-morandi-slate uppercase tracking-tighter">{cert.name}</p>
                      <p className="text-[10px] dark:text-slate-500 text-morandi-stone font-bold uppercase tracking-widest">{cert.issuer}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="dark:text-slate-400 text-morandi-stone">
                  {renderMarkdownText(configs.resume_certs)}
                </div>
              )}
            </div>
          </section>

          <div className="pt-10">
            <button className="w-full py-5 glass-panel dark:bg-white dark:text-black bg-morandi-slate text-white font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-xl">
              <FileText size={18} /> 索取完整 PDF 履歷
            </button>
          </div>
        </div>
      </div>
    </motion.div>
    </>
  );
};

const SectionHeader: React.FC<{ icon: React.ReactNode, title: string }> = ({ icon, title }) => (
  <div className="flex items-center gap-4 mb-10">
    <div className="w-10 h-10 rounded-xl dark:bg-white/5 bg-morandi-slate/10 border dark:border-white/10 border-black/5 flex items-center justify-center dark:text-white text-morandi-slate">
      {icon}
    </div>
    <h2 className="text-xl font-[900] dark:text-white text-morandi-slate uppercase tracking-[0.2em]">{title}</h2>
  </div>
);

const ContactItem: React.FC<{ icon: React.ReactNode, text: string, href?: string }> = ({ icon, text, href }) => (
  <a 
    href={href || '#'} 
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-3 dark:hover:text-white hover:text-morandi-slate transition-colors group"
  >
    <div className="dark:text-slate-500 text-morandi-stone group-hover:text-morandi-slate transition-colors">{icon}</div>
    <span className="text-[11px] font-bold uppercase tracking-widest">{text}</span>
  </a>
);

const SkillTag: React.FC<{ name: string, level: string }> = ({ name, level }) => (
  <div className="glass-panel p-5 dark:border-white/5 border-black/10 flex justify-between items-center group hover:bg-morandi-slate hover:text-white dark:hover:bg-white dark:hover:text-black transition-all dark:bg-white/5 bg-white/60">
    <span className="text-xs font-black dark:text-white text-morandi-slate group-hover:text-white dark:group-hover:text-black uppercase tracking-widest">{name}</span>
    <span className="text-[8px] font-black dark:text-slate-500 text-morandi-stone group-hover:text-white/80 uppercase tracking-widest dark:bg-white/5 bg-black/5 px-2 py-1 rounded-md">{level}</span>
  </div>
);

export default ResumePage;
