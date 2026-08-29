
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
  { file: '/media/certs/ceh-certified-ethical-hacker.webp',     name: 'Certified Ethical Hacker',        issuer: 'EC-Council' },
  { file: '/media/certs/mikrotik-mtcna.webp',                   name: 'MTCNA',                           issuer: 'MikroTik' },
  { file: '/media/certs/erp-software-applications.webp',        name: 'ERP 軟體應用師',                 issuer: '中華企業資源規劃學會' },
  { file: '/media/certs/adobe-photoshop-certified.webp',        name: 'Photoshop Certified',             issuer: 'Adobe' },
  { file: '/media/certs/google-ads-measurement.webp',           name: 'Google Ads Measurement',          issuer: 'Google' },
  { file: '/media/certs/google-it-support.webp',                name: 'IT Support Professional',         issuer: 'Google' },
  { file: '/media/certs/ibm-program-manager.webp',              name: 'Program Manager',                 issuer: 'IBM' },
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
      if (trimmed.startsWith('### ')) return <h3 key={i} className="font-heading italic text-2xl tracking-tight text-white mt-10 mb-4">{trimmed.replace('### ', '')}</h3>;
      if (trimmed.startsWith('#### ')) return <h4 key={i} className="font-body text-sm font-medium text-white/50 mb-2 uppercase tracking-widest">{trimmed.replace('#### ', '')}</h4>;
      if (trimmed.startsWith('- ')) return <li key={i} className="ml-4 mb-2 font-body text-sm font-light text-white/70 list-disc">{trimmed.replace('- ', '')}</li>;
      return <p key={i} className="mb-3 font-body text-sm font-light leading-relaxed text-white/70">{trimmed}</p>;
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
    <div className="blog-cinematic flex min-h-screen items-center justify-center bg-black">
      <div className="liquid-glass flex h-16 w-16 items-center justify-center rounded-full">
        <Loader2 className="animate-spin text-white/50" size={24} />
      </div>
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

  <div class="footer">${window.location.host || '東謙.com'} \u00B7 ${new Date().toLocaleDateString('zh-TW')}</div>
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
        className="blog-cinematic relative min-h-screen overflow-x-hidden bg-black pt-[120px] pb-32 px-5 sm:px-8 sm:pt-[140px] lg:px-16"
      >
      <div className="mx-auto max-w-5xl">
      <section className="mb-16 text-center sm:mb-20">
        <motion.div
          initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
          animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="liquid-glass mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2"
        >
          <span className="rounded-full bg-white px-2.5 py-0.5 font-body text-[10px] font-semibold uppercase tracking-wider text-black">
            CV
          </span>
          <span className="font-body text-sm font-light text-white/90">技術履歷 · Curriculum Vitae</span>
        </motion.div>
        <h1 className="mb-4 font-heading italic text-5xl tracking-[-2px] text-white md:text-6xl lg:text-7xl">
          {configs.resume_name || '吳東謙'}
        </h1>
        <p className="mb-10 font-heading italic text-xl tracking-tight text-white/60 md:text-2xl">
          {configs.resume_title || '系統維運工程師'}
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <ContactItem icon={<Mail size={14} />} text={configs.resume_email || 'example@mail.com'} />
          <ContactItem icon={<MapPin size={14} />} text={configs.resume_location || '基隆, Taiwan'} />
          {configs.resume_github && <ContactItem icon={<Github size={14} />} text="GitHub" href={configs.resume_github} />}
          {configs.resume_linkedin && <ContactItem icon={<Linkedin size={14} />} text="LinkedIn" href={configs.resume_linkedin} />}
          {extraLinks.map((link: any, idx: number) => (
            <ContactItem key={idx} icon={<Globe size={14} />} text={link.label} href={link.url} />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="space-y-8 lg:col-span-8">
          <section className="liquid-glass rounded-[1.25rem] p-6 md:p-8">
            <SectionHeader icon={<Terminal size={18} />} title="專業總結" />
            <div className="border-l border-white/15 pl-6 font-body text-base font-light leading-relaxed whitespace-pre-line text-white/80">
              {configs.resume_summary ||
                '現任基隆市教育網路中心系統維運工程師，負責 TANet 學術網路資安監控及全市教育網路服務維運。主導建置自動化 VM 備份系統與異地備援架構，管理 150+ 虛擬主機之儲存與資料保護。持有 CEH 與 MTCNA 國際認證。公關實習背景培養了跨部門協作與技術需求溝通能力，能有效橋接技術與業務兩端。'}
            </div>
          </section>

          <section className="liquid-glass rounded-[1.25rem] p-6 md:p-8">
            <SectionHeader icon={<Briefcase size={18} />} title="工作經歷" />
            <div className="relative space-y-6 border-l border-white/10 pl-8">
              {renderMarkdownText(
                configs.resume_experience ||
                  '### 系統維運工程師 | 基隆市教育網路中心\n2022 - Present\n- 監控 TANet 學術網路異常流量，執行資安事件通報與應處，保障全市教育網路穩定運行\n- 主導設計並建置自動化 VM 備份機制，整合 HPE Storage 與 QNAP NAS，實現異地備援\n- 管理超過 150 台 VMware 虛擬主機，制定標準化部署流程與系統弱掃修補 SOP\n- 兼任 Google Workspace 後台管理，處理全校網域帳號與權限控管\n\n### 公關實習生\n2021 - 2022\n- 負責客戶溝通與專案協調，歷練跨部門需求整合與利害關係人管理\n- 獨立撰寫新聞稿與媒體簡報，累積商業文案與品牌敘事能力'
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <section className="liquid-glass rounded-[1.25rem] p-6">
            <SectionHeader icon={<ShieldCheck size={18} />} title="核心技能" />
            <div className="grid grid-cols-1 gap-3">
              {parseSkills(configs.resume_skills).map((skill, i) => (
                <SkillTag key={i} name={skill.name} level={skill.level} />
              ))}
            </div>
          </section>

          <section className="liquid-glass rounded-[1.25rem] p-6">
            <SectionHeader icon={<GraduationCap size={18} />} title="學歷經歷" />
            <div className="space-y-4">
              {educationList.length > 0 ? (
                educationList.map((edu: any, idx: number) => (
                  <div key={idx} className="liquid-glass rounded-[1rem] p-4">
                    <p className="mb-1 font-body text-[11px] font-medium uppercase tracking-widest text-white/40">
                      {edu.year}
                    </p>
                    <h4 className="font-heading italic text-xl tracking-tight text-white">{edu.school}</h4>
                    <p className="mt-1 font-body text-sm font-light text-white/60">{edu.degree}</p>
                  </div>
                ))
              ) : (
                <div>{renderMarkdownText(configs.resume_education || '### 國立臺灣海洋大學\n2024 - Present\n資工系碩士專班')}</div>
              )}
            </div>
          </section>

          <button
            type="button"
            onClick={handlePrintResume}
            className="liquid-glass-strong flex w-full items-center justify-center gap-3 rounded-full py-4 font-body text-sm font-medium text-white transition hover:scale-[1.01] active:scale-[0.98]"
          >
            <FileText size={16} /> 下載 PDF 履歷
          </button>
        </div>
      </div>

      <section className="mt-16 sm:mt-24">
        <SectionHeader icon={<Award size={18} />} title="專業證照" />
        <div className="flex flex-wrap justify-center gap-4 md:gap-5">
          {CERTIFICATE_IMAGES.map((cert, idx) => (
            <motion.button
              key={idx}
              type="button"
              initial={{ filter: 'blur(8px)', opacity: 0, y: 20 }}
              animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.5 }}
              onClick={() => setLightboxIndex(idx)}
              className="liquid-glass flex w-[calc(50%-0.5rem)] cursor-pointer flex-col overflow-hidden rounded-[1.25rem] transition duration-500 hover:-translate-y-1 sm:w-[calc(33.333%-0.875rem)] md:w-[calc(25%-1rem)]"
            >
              <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-black/40 p-3">
                <motion.img
                  src={cert.file}
                  alt={cert.name}
                  loading="lazy"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 1.2 }}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="border-t border-white/10 px-4 py-3 text-left">
                <h3 className="font-heading italic text-base leading-snug tracking-tight text-white">
                  {cert.name}
                </h3>
                <p className="mt-1 font-body text-[10px] font-medium uppercase tracking-widest text-white/40">
                  {cert.issuer}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </section>
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

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
  <div className="mb-6 flex items-center gap-3">
    <div className="liquid-glass flex h-10 w-10 items-center justify-center rounded-[0.75rem] text-white/70">
      {icon}
    </div>
    <h2 className="font-heading italic text-2xl tracking-tight text-white">{title}</h2>
  </div>
);

const ContactItem: React.FC<{ icon: React.ReactNode; text: string; href?: string }> = ({
  icon,
  text,
  href,
}) => (
  <a
    href={href || '#'}
    target={href ? '_blank' : undefined}
    rel={href ? 'noopener noreferrer' : undefined}
    className="liquid-glass inline-flex items-center gap-2 rounded-full px-3.5 py-2 font-body text-[11px] font-medium text-white/70 transition hover:text-white"
  >
    {icon}
    <span>{text}</span>
  </a>
);

const SkillTag: React.FC<{ name: string; level: string }> = ({ name, level }) => (
  <div className="liquid-glass flex items-center justify-between gap-3 rounded-full px-4 py-3">
    <span className="font-body text-xs font-medium text-white/90">{name}</span>
    <span className="font-body text-[9px] font-medium uppercase tracking-wider text-white/40">
      {level}
    </span>
  </div>
);

export default ResumePage;
