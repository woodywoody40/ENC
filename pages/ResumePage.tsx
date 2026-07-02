
import React, { useState, useEffect } from 'react';
import { SEOMeta, BreadcrumbSchema } from '../lib/seo';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Github, Linkedin, MapPin, 
  Briefcase, GraduationCap, Award, 
  Terminal, Server, ShieldCheck, Loader2, FileText, Globe, Link as LinkIcon, ExternalLink,
  X, ChevronLeft, ChevronRight, Image
} from 'lucide-react';
import { ConfigAPI } from '../services/apiClient';

// 證照圖片清單（位於 /media/certs/ 靜態目錄）
const CERTIFICATE_IMAGES: { file: string; name: string; issuer: string }[] = [
  { file: '/media/certs/ceh-certified-ethical-hacker.png',     name: 'Certified Ethical Hacker',        issuer: 'EC-Council' },
  { file: '/media/certs/mikrotik-mtcna.png',                   name: 'MTCNA',                           issuer: 'MikroTik' },
  { file: '/media/certs/erp-software-applications.png',        name: 'ERP 軟體應用師',                 issuer: '中華企業資源規劃學會' },
  { file: '/media/certs/adobe-photoshop-certified.png',        name: 'Photoshop Certified',             issuer: 'Adobe' },
  { file: '/media/certs/google-ads-measurement.png',           name: 'Google Ads Measurement',          issuer: 'Google' },
  { file: '/media/certs/google-it-support.png',                name: 'IT Support Professional',         issuer: 'Google' },
  { file: '/media/certs/ibm-program-manager.png',              name: 'Program Manager',                 issuer: 'IBM' },
];

const ResumePage: React.FC = () => {
  const [configs, setConfigs] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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
      { name: "VMware 虛擬化", level: "Expert" },
      { name: "儲存與備援架構", level: "Expert" },
      { name: "TANet 資安監控", level: "Expert" },
      { name: "系統弱掃與修補", level: "Advanced" },
      { name: "Google Workspace", level: "Advanced" },
      { name: "CEH & MTCNA", level: "Certified" }
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
        description="吳東謙的技術履歷 — 系統維運工程師。TANet 資安監控、VMware 虛擬化管理、自動化備份架構，CEH / MTCNA 雙認證。"
        path="/resume"
        keywords="履歷,技術履歷,吳東謙,系統維運,Storage,VMware,CEH,MTCNA"
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
        <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter dark:text-white text-morandi-slate uppercase">
          {configs.resume_name || "吳東謙"}
        </h1>
        <p className="text-base md:text-lg dark:text-slate-400 text-morandi-stone font-light tracking-[0.1em] mb-12">
          {configs.resume_title || "系統維運工程師"}
        </p>
        
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 dark:text-slate-500 text-morandi-stone">
          <ContactItem icon={<Mail size={16} />} text={configs.resume_email || "example@mail.com"} />
          <ContactItem icon={<MapPin size={16} />} text={configs.resume_location || "基隆, Taiwan"} />
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
              {configs.resume_summary || "現任基隆市教育網路中心系統維運工程師，負責 TANet 學術網路資安監控及全市教育網路服務維運。主導建置自動化 VM 備份系統與異地備援架構，管理 150+ 虛擬主機之儲存與資料保護。持有 CEH 與 MTCNA 國際認證。公關實習背景培養了跨部門協作與技術需求溝通能力，能有效橋接技術與業務兩端。"}
            </div>
          </section>

          <section>
            <SectionHeader icon={<Briefcase size={20} />} title="工作經歷" />
            <div className="space-y-12 border-l dark:border-white/5 border-black/10 ml-4 pl-10 relative">
              {renderMarkdownText(configs.resume_experience || "### 系統維運工程師 | 基隆市教育網路中心\n2022 - Present\n- 監控 TANet 學術網路異常流量，執行資安事件通報與應處，保障全市教育網路穩定運行\n- 主導設計並建置自動化 VM 備份機制，整合 HPE Storage 與 QNAP NAS，實現異地備援\n- 管理超過 150 台 VMware 虛擬主機，制定標準化部署流程與系統弱掃修補 SOP\n- 兼任 Google Workspace 後台管理，處理全校網域帳號與權限控管\n\n### 公關實習生\n2021 - 2022\n- 負責客戶溝通與專案協調，歷練跨部門需求整合與利害關係人管理\n- 獨立撰寫新聞稿與媒體簡報，累積商業文案與品牌敘事能力")}
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
                  {renderMarkdownText(configs.resume_education || "### 國立臺灣海洋大學\n2024 - Present\n資工系碩士專班")}
                </div>
              )}
            </div>
          </section>

          <section>
            <SectionHeader icon={<Award size={20} />} title="專業證照" />
            
            {/* 證照圖片牆 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {CERTIFICATE_IMAGES.map((cert, idx) => (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setLightboxIndex(idx)}
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden border dark:border-white/10 border-black/10 bg-white/20 dark:bg-black/30 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300"
                >
                  <img
                    src={cert.file}
                    alt={cert.name}
                    loading="lazy"
                    className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-6 pb-2 px-2.5">
                    <p className="text-[10px] font-black text-white uppercase tracking-tight leading-tight truncate">{cert.name}</p>
                    <p className="text-[8px] text-white/60 font-bold uppercase tracking-widest truncate">{cert.issuer}</p>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* 證照文字列表（來自 config） */}
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
                  {renderMarkdownText(configs.resume_certs || "### EC-Council\nCEH (Certified Ethical Hacker)\n\n### MikroTik\nMTCNA 網路工程師認證\n\n### Google\nIT Support Professional Certificate")}
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

      {/* 證照 Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
              className="absolute top-5 right-5 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
            >
              <X size={22} />
            </button>

            {lightboxIndex > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex - 1); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
              >
                <ChevronLeft size={22} />
              </button>
            )}

            <motion.img
              key={lightboxIndex}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              src={CERTIFICATE_IMAGES[lightboxIndex].file}
              alt={CERTIFICATE_IMAGES[lightboxIndex].name}
              className="max-h-[85vh] max-w-full object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {lightboxIndex < CERTIFICATE_IMAGES.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex + 1); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
              >
                <ChevronRight size={22} />
              </button>
            )}

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
              <p className="text-white font-black text-sm tracking-tight">
                {CERTIFICATE_IMAGES[lightboxIndex].name}
              </p>
              <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mt-1">
                {CERTIFICATE_IMAGES[lightboxIndex].issuer} · {lightboxIndex + 1} / {CERTIFICATE_IMAGES.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
