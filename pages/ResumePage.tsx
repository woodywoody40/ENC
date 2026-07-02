
import React, { useState, useEffect } from 'react';
import { SEOMeta, BreadcrumbSchema } from '../lib/seo';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Github, Linkedin, MapPin, 
  Briefcase, GraduationCap, Award, 
  Terminal, Server, ShieldCheck, Loader2, FileText, Globe,
  X, ChevronLeft, ChevronRight
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

  const handlePrintResume = () => {
    const name = configs.resume_name || '吳東謙';
    const title = configs.resume_title || '系統維運工程師';
    const email = configs.resume_email || '';
    const location = configs.resume_location || '';
    const github = configs.resume_github || '';
    const linkedin = configs.resume_linkedin || '';
    const summary = configs.resume_summary || '現任基隆市教育網路中心系統維運工程師，負責 TANet 學術網路資安監控及全市教育網路服務維運。主導建置自動化 VM 備份系統與異地備援架構，管理 150+ 虛擬主機之儲存與資料保護。持有 CEH 與 MTCNA 國際認證。公關實習背景培養了跨部門協作與技術需求溝通能力，能有效橋接技術與業務兩端。';
    const experience = configs.resume_experience || '### 系統維運工程師 | 基隆市教育網路中心\n2022 - Present\n- 監控 TANet 學術網路異常流量，執行資安事件通報與應處，保障全市教育網路穩定運行\n- 主導設計並建置自動化 VM 備份機制，整合 HPE Storage 與 QNAP NAS，實現異地備援\n- 管理超過 150 台 VMware 虛擬主機，制定標準化部署流程與系統弱掃修補 SOP\n- 兼任 Google Workspace 後台管理，處理全校網域帳號與權限控管\n\n### 公關實習生\n2021 - 2022\n- 負責客戶溝通與專案協調，歷練跨部門需求整合與利害關係人管理\n- 獨立撰寫新聞稿與媒體簡報，累積商業文案與品牌敘事能力';
    const skills = parseSkills(configs.resume_skills);
    const education = educationList.length > 0 ? educationList : [];

    // 解析經歷文字 → 結構化物件
    const expItems: { title: string; date: string; bullets: string[] }[] = [];
    const expLines = experience.split('\n').filter((l: string) => l.trim());
    let cur: any = null;
    expLines.forEach((line: string) => {
      if (line.startsWith('### ')) {
        if (cur) expItems.push(cur);
        cur = { title: line.replace('### ', '').trim(), date: '', bullets: [] };
      } else if (line.startsWith('- ')) {
        if (cur) cur.bullets.push(line.replace('- ', '').trim());
      } else if (line.trim() && cur && !cur.date) {
        cur.date = line.trim();
      }
    });
    if (cur) expItems.push(cur);

    const expHTML = expItems.map(item => `
    <div class="exp-card">
      <div class="exp-head">
        <div class="exp-left">
          <div class="exp-dot"></div>
          <div>
            <div class="exp-title">${item.title}</div>
            <div class="exp-date">${item.date}</div>
          </div>
        </div>
      </div>
      ${item.bullets.length ? '<ul class="exp-bullets">' + item.bullets.map(b => '<li>' + b + '</li>').join('') + '</ul>' : ''}
    </div>`).join('');

    const skillsHTML = skills.map(s =>
      `<div class="sk-item"><span class="sk-name">${s.name}</span><span class="sk-bar"><span class="sk-fill" style="width:${s.level === 'Expert' ? '90' : s.level === 'Advanced' ? '70' : '50'}%"></span></span><span class="sk-lvl">${s.level}</span></div>`
    ).join('');

    const eduHTML = education.length > 0
      ? education.map((e: any) => `
    <div class="edu-card">
      <div class="edu-icon">\uE601</div>
      <div class="edu-body">
        <div class="edu-name">${e.school}</div>
        <div class="edu-meta"><span class="edu-badge">${e.year}</span><span class="edu-deg">${e.degree}</span></div>
      </div>
    </div>`).join('')
      : '<p style="font-size:9.5pt;color:#555;margin-bottom:4pt;"><strong>國立臺灣海洋大學</strong> — 資工系碩士專班 (2024 - Present)</p>';

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${name} · 專業履歷</title>
<style>
  @page { margin: 0; size: A4; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Noto Sans TC', 'Inter', 'Segoe UI', system-ui, sans-serif;
    color: #1e1e1e; background: #f5f7fa; line-height: 1.5;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  .page { width: 210mm; min-height: 297mm; margin: 0 auto; background: #fff; padding: 0; position: relative; }

  /* ===== TOP BANNER ===== */
  .banner {
    background: linear-gradient(135deg, #1a2a3a 0%, #2d4a6b 100%);
    padding: 32pt 36pt 24pt; color: #fff;
  }
  .banner h1 { font-size: 26pt; font-weight: 900; letter-spacing: 2pt; margin-bottom: 2pt; }
  .banner .sub { font-size: 10pt; color: #a0c0e0; letter-spacing: 2.5pt; font-weight: 500; margin-bottom: 10pt; }
  .banner .contact { display: flex; flex-wrap: wrap; gap: 6pt 18pt; font-size: 8pt; color: #c0d8ec; }
  .banner .contact span { opacity: 0.85; }

  /* ===== CONTENT ===== */
  .content { padding: 22pt 36pt 20pt; }

  .sec { margin-bottom: 16pt; }
  .sec-header {
    display: flex; align-items: center; gap: 8pt; margin-bottom: 8pt;
  }
  .sec-header .sec-icon {
    width: 20pt; height: 20pt; border-radius: 50%; background: #1a2a3a;
    color: #fff; font-size: 9pt; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .sec-header .sec-label {
    font-size: 11pt; font-weight: 800; letter-spacing: 2pt; color: #1a2a3a; text-transform: uppercase;
  }
  .sec-header .sec-line { flex: 1; height: 1px; background: linear-gradient(to right, #d0d8e0, transparent); }

  /* ===== SUMMARY ===== */
  .summary-text { font-size: 9pt; line-height: 1.7; color: #333; text-align: justify; padding-left: 28pt; }

  /* ===== EXPERIENCE ===== */
  .exp-card { position: relative; padding-left: 28pt; margin-bottom: 10pt; page-break-inside: avoid; }
  .exp-card::before {
    content: ''; position: absolute; left: 7pt; top: 10pt; bottom: -6pt;
    width: 1px; background: #dce3ea;
  }
  .exp-card:last-child::before { display: none; }
  .exp-head { margin-bottom: 2pt; }
  .exp-left { display: flex; align-items: flex-start; gap: 8pt; }
  .exp-dot {
    position: absolute; left: 2.5pt; top: 5pt; width: 10pt; height: 10pt;
    border-radius: 50%; background: #1a2a3a; border: 2px solid #fff;
    box-shadow: 0 0 0 1px #dce3ea; flex-shrink: 0;
  }
  .exp-title { font-size: 10.5pt; font-weight: 700; color: #1a2a3a; }
  .exp-date { font-size: 8pt; color: #7a8a9a; font-weight: 500; margin-top: 1pt; }
  .exp-bullets { list-style: none; padding: 0; margin-top: 3pt; }
  .exp-bullets li {
    font-size: 8.5pt; color: #444; line-height: 1.55; padding-left: 12pt;
    position: relative; margin-bottom: .5pt;
  }
  .exp-bullets li::before { content: ''; position: absolute; left: 0; top: 6.5pt; width: 4pt; height: 4pt; border-radius: 50%; background: #7a9abb; }

  /* ===== SKILLS ===== */
  .skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4pt 16pt; padding-left: 28pt; }
  .sk-item { display: flex; align-items: center; gap: 6pt; }
  .sk-name { font-size: 8.5pt; font-weight: 600; color: #1a2a3a; min-width: 90pt; }
  .sk-bar { flex: 1; height: 5pt; background: #eef2f6; border-radius: 3pt; overflow: hidden; }
  .sk-fill { display: block; height: 100%; border-radius: 3pt; background: linear-gradient(90deg, #2d4a6b, #4a7a9a); }
  .sk-lvl { font-size: 7pt; color: #888; min-width: 36pt; text-align: right; letter-spacing: .5pt; }

  /* ===== EDUCATION ===== */
  .edu-card { display: flex; align-items: flex-start; gap: 10pt; padding-left: 28pt; margin-bottom: 6pt; page-break-inside: avoid; }
  .edu-icon { width: 18pt; height: 18pt; border-radius: 50%; background: #eef2f6; flex-shrink: 0; margin-top: 1pt; }
  .edu-name { font-size: 10pt; font-weight: 700; color: #1a2a3a; }
  .edu-meta { display: flex; align-items: center; gap: 8pt; margin-top: 1pt; }
  .edu-badge { display: inline-block; font-size: 7.5pt; background: #1a2a3a; color: #fff; padding: 1pt 7pt; border-radius: 3pt; font-weight: 600; }
  .edu-deg { font-size: 8.5pt; color: #555; }

  .footer { text-align: center; font-size: 7pt; color: #bbb; padding: 6pt 36pt 14pt; border-top: 1px solid #eee; margin-top: 4pt; }
</style></head>
<body>
<div class="page">
  <div class="banner">
    <h1>${name}</h1>
    <div class="sub">${title}</div>
    <div class="contact">
      ${email ? '<span>\u2709 ' + email + '</span>' : ''}
      ${location ? '<span>\u25CB ' + location + '</span>' : ''}
      ${github ? '<span>\u25C6 ' + github.replace('https://', '') + '</span>' : ''}
      ${linkedin ? '<span>\u25A3 ' + linkedin.replace('https://', '') + '</span>' : ''}
    </div>
  </div>

  <div class="content">

  ${summary ? '<div class="sec"><div class="sec-header"><div class="sec-icon">\u25A0</div><div class="sec-label">\u5C08\u696D\u7E3D\u7D50</div><div class="sec-line"></div></div><div class="summary-text">' + summary.replace(/\n/g, '<br>') + '</div></div>' : ''}

  ${expItems.length ? '<div class="sec"><div class="sec-header"><div class="sec-icon">\u25A0</div><div class="sec-label">\u5DE5\u4F5C\u7D93\u6B77</div><div class="sec-line"></div></div>' + expHTML + '</div>' : ''}

  <div class="sec">
    <div class="sec-header"><div class="sec-icon">\u25A0</div><div class="sec-label">\u6838\u5FC3\u6280\u80FD</div><div class="sec-line"></div></div>
    <div class="skills-grid">${skillsHTML}</div>
  </div>

  <div class="sec">
    <div class="sec-header"><div class="sec-icon">\u25A0</div><div class="sec-label">\u5B78\u6B77\u7D93\u6B77</div><div class="sec-line"></div></div>
    ${eduHTML}
  </div>

  </div>

  <div class="footer">enc.moe22.com \u00B7 ${new Date().toLocaleDateString('zh-TW')}</div>
</div>
</body></html>`;

    // 第一優先：Blob URL 方式（最可靠，無快顯封鎖問題）
    const blob = new Blob([html], { type: 'text/html' });
    const blobUrl = URL.createObjectURL(blob);
    const printWindow = window.open(blobUrl, '_blank');
    if (printWindow) {
      // 視窗載入完成後自動觸發列印
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };
      // 列印完成後自動關閉視窗
      printWindow.onafterprint = () => {
        URL.revokeObjectURL(blobUrl);
        printWindow.close();
      };
    } else {
      // 若快顯被封鎖，降級為當前頁面 print
      window.print();
    }
  };

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
          className="inline-block px-5 py-2 dark:border-white/10 border-black/10 dark:bg-white/[0.07] bg-white/60 mb-8 rounded-[40px] shadow-xl backdrop-blur-[40px] border"
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
                  <div key={idx} className="p-6 rounded-[40px] dark:border-white/5 border-black/10 hover:border-morandi-slate transition-all dark:bg-white/5 bg-white/60 shadow-xl backdrop-blur-[40px] border">
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

          <div className="pt-10">
            <button
              onClick={handlePrintResume}
              className="w-full py-5 bg-morandi-slate dark:bg-white text-white dark:text-black rounded-[40px] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all duration-500 shadow-xl border border-white/15"
            >
              <FileText size={18} /> 下載 PDF 履歷
            </button>
          </div>
        </div>
      </div>

      {/* 專業證照 — 全寬圖片牆 */}
      <section className="mt-32">
        <SectionHeader icon={<Award size={20} />} title="專業證照" />
        <div className="flex flex-wrap gap-5 md:gap-8 justify-center">
          {CERTIFICATE_IMAGES.map((cert, idx) => (
            <motion.button
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              onClick={() => setLightboxIndex(idx)}
              className="flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 shadow-sm hover:shadow-lg cursor-pointer w-[calc(50%-0.625rem)] sm:w-[calc(33.333%-1.333rem)] md:w-[calc(25%-1.5rem)] hover:-translate-y-1 transition-all duration-500"
            >
              {/* 圖片區 */}
              <div className="relative aspect-[4/3] flex items-center justify-center bg-neutral-50 dark:bg-neutral-800 p-2 overflow-hidden">
                <motion.img
                  src={cert.file}
                  alt={cert.name}
                  loading="lazy"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              {/* 文字區 */}
              <div className="px-4 py-3 text-left border-t border-neutral-100 dark:border-neutral-800">
                <h3 className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-white leading-snug">
                  {cert.name}
                </h3>
                <p className="text-[11px] font-medium uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mt-1">
                  {cert.issuer}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

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
  <div className="p-5 rounded-[40px] dark:border-white/5 border-black/10 flex justify-between items-center group hover:bg-morandi-slate hover:text-white dark:hover:bg-white dark:hover:text-black transition-all dark:bg-white/5 bg-white/60 shadow-xl backdrop-blur-[40px] border">
    <span className="text-xs font-black dark:text-white text-morandi-slate group-hover:text-white dark:group-hover:text-black uppercase tracking-widest">{name}</span>
    <span className="text-[8px] font-black dark:text-slate-500 text-morandi-stone group-hover:text-white/80 dark:group-hover:text-black uppercase tracking-widest dark:bg-white/5 bg-black/5 px-2 py-1 rounded-md">{level}</span>
  </div>
);

export default ResumePage;
