import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Download, Github, Linkedin, Mail, MapPin, X } from 'lucide-react';
import { ConfigAPI } from '../services/apiClient';
import { BreadcrumbSchema, SEOMeta } from '../lib/seo';
import { LoadingState, PageIntro, PublicFooter } from '../components/EditorialLayout';

const certificates = [
  { file: '/media/certs/ceh-certified-ethical-hacker.webp', name: 'Certified Ethical Hacker', issuer: 'EC-Council' },
  { file: '/media/certs/mikrotik-mtcna.webp', name: 'MTCNA', issuer: 'MikroTik' },
  { file: '/media/certs/erp-software-applications.webp', name: 'ERP 軟體應用師', issuer: '中華企業資源規劃學會' },
  { file: '/media/certs/adobe-photoshop-certified.webp', name: 'Photoshop Certified', issuer: 'Adobe' },
  { file: '/media/certs/google-ads-measurement.webp', name: 'Google Ads Measurement', issuer: 'Google' },
  { file: '/media/certs/google-it-support.webp', name: 'IT Support Professional', issuer: 'Google' },
  { file: '/media/certs/ibm-program-manager.webp', name: 'Program Manager', issuer: 'IBM' },
];

type Experience = { title: string; date: string; bullets: string[] };
type Education = { school: string; degree: string; year: string };

const defaultExperience = '### 系統維運工程師 | 基隆市教育網路中心\n2022 - Present\n- 監控 TANet 學術網路異常流量，執行資安事件通報與應處\n- 建置自動化 VM 備份機制，整合 HPE Storage 與 QNAP NAS\n- 管理超過 150 台 VMware 虛擬主機，建立部署與弱掃修補 SOP\n- 管理 Google Workspace 網域帳號與權限\n\n### 公關實習生\n2021 - 2022\n- 負責客戶溝通與跨部門專案協調\n- 撰寫新聞稿與媒體簡報，累積商業敘事能力';

const parseExperience = (value: string): Experience[] => {
  const result: Experience[] = [];
  let current: Experience | null = null;
  value.split('\n').map((line) => line.trim()).filter(Boolean).forEach((line) => {
    if (line.startsWith('### ')) {
      if (current) result.push(current);
      current = { title: line.slice(4), date: '', bullets: [] };
    } else if (line.startsWith('- ')) current?.bullets.push(line.slice(2));
    else if (current && !current.date) current.date = line;
  });
  if (current) result.push(current);
  return result;
};

const parseJson = <T,>(value: string | undefined, fallback: T): T => {
  if (!value) return fallback;
  try { return JSON.parse(value) as T; } catch { return fallback; }
};

export default function ResumePage() {
  const [configs, setConfigs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [activeCertificate, setActiveCertificate] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    ConfigAPI.all().then((data) => setConfigs(data || {})).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (activeCertificate !== null && dialog && !dialog.open) dialog.showModal();
  }, [activeCertificate]);

  const experiences = useMemo(() => parseExperience(configs.resume_experience || defaultExperience), [configs.resume_experience]);
  const skills = useMemo(() => (configs.resume_skills || 'VMware 虛擬化:Expert,儲存與備援架構:Expert,TANet 資安監控:Expert,系統弱掃與修補:Advanced,Google Workspace:Advanced,CEH & MTCNA:Certified').split(',').map((item) => { const [name, level = 'Advanced'] = item.split(':'); return { name: name.trim(), level: level.trim() }; }), [configs.resume_skills]);
  const education = parseJson<Education[]>(configs.resume_education_list, [{ school: '國立臺灣海洋大學', degree: '資訊工程碩士專班', year: '2024 — Present' }]);
  const extraLinks = parseJson<{ label: string; url: string }[]>(configs.resume_extra_links, []);

  if (loading) return <LoadingState label="正在讀取履歷" />;

  const closeDialog = () => dialogRef.current?.close();
  const moveCertificate = (direction: -1 | 1) => setActiveCertificate((index) => index === null ? 0 : (index + direction + certificates.length) % certificates.length);

  return (
    <>
      <SEOMeta title="技術履歷" description="吳東謙的系統維運、網路資安與基礎架構技術履歷。" path="/resume" />
      <BreadcrumbSchema items={[{ name: '首頁', path: '/' }, { name: '技術履歷', path: '/resume' }]} />
      <main id="main-content" tabIndex={-1} className="enc-page enc-resume-page">
        <div className="enc-shell">
          <PageIntro eyebrow="Curriculum vitae / 2026" title={<>{configs.resume_name || '吳東謙'}<em>{configs.resume_title || '系統維運工程師'}</em></>} description="網路、虛擬化、儲存與資安維運；把關鍵服務做穩，也把複雜協作說清楚。" aside={<button type="button" className="enc-solid-link enc-print-button" onClick={() => window.print()}><Download size={15} />列印 / 儲存 PDF</button>} />

          <address className="enc-contact-row">
            <a href={`mailto:${configs.resume_email || 'hello@xn--hrrs16bo6z.com'}`}><Mail size={14} />{configs.resume_email || 'hello@東謙.com'}</a>
            <span><MapPin size={14} />{configs.resume_location || '基隆，Taiwan'}</span>
            {configs.resume_github && <a href={configs.resume_github} target="_blank" rel="noreferrer"><Github size={14} />GitHub</a>}
            {configs.resume_linkedin && <a href={configs.resume_linkedin} target="_blank" rel="noreferrer"><Linkedin size={14} />LinkedIn</a>}
            {extraLinks.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label}<ArrowUpRight size={13} /></a>)}
          </address>

          <section className="enc-resume-summary"><p className="enc-eyebrow"><i />Profile</p><p>{configs.resume_summary || '現任基隆市教育網路中心系統維運工程師，負責 TANet 學術網路資安監控與全市教育網路服務。主導自動化 VM 備份及異地備援，管理 150+ 虛擬主機。公關實習背景也讓我能有效橋接技術、需求與協作。'}</p></section>

          <div className="enc-resume-grid">
            <section className="enc-resume-experience"><div className="enc-section-title"><p className="enc-eyebrow"><i />Experience</p><h2>工作經歷</h2></div><ol>{experiences.map((item, index) => <li key={`${item.title}-${index}`}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{item.title}</h3><time>{item.date}</time><ul>{item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul></div></li>)}</ol></section>
            <aside className="enc-resume-side">
              <section><p className="enc-eyebrow"><i />Expertise</p><h2>核心技能</h2><ul className="enc-skill-list">{skills.map((skill) => <li key={skill.name}><span>{skill.name}</span><small>{skill.level}</small></li>)}</ul></section>
              <section><p className="enc-eyebrow"><i />Education</p><h2>學歷</h2><ul className="enc-education-list">{education.map((item) => <li key={`${item.school}-${item.year}`}><time>{item.year}</time><strong>{item.school}</strong><span>{item.degree}</span></li>)}</ul></section>
            </aside>
          </div>

          <section className="enc-certificates"><div className="enc-section-title"><p className="enc-eyebrow"><i />Credentials</p><h2>專業證照</h2></div><ol>{certificates.map((certificate, index) => <li key={certificate.file}><button type="button" onClick={() => setActiveCertificate(index)}><span>{String(index + 1).padStart(2, '0')}</span><img src={certificate.file} alt="" width={640} height={480} loading="lazy" /><strong>{certificate.name}</strong><small>{certificate.issuer}</small></button></li>)}</ol></section>
        </div>
      </main>
      <PublicFooter />

      <dialog ref={dialogRef} className="enc-certificate-dialog" onClose={() => setActiveCertificate(null)} aria-labelledby="certificate-title">
        {activeCertificate !== null && <div><button type="button" className="enc-dialog-close" onClick={closeDialog} aria-label="關閉證照預覽"><X size={20} /></button><button type="button" className="enc-dialog-prev" onClick={() => moveCertificate(-1)} aria-label="上一張證照"><ChevronLeft size={22} /></button><figure><img src={certificates[activeCertificate].file} alt={certificates[activeCertificate].name} /><figcaption><strong id="certificate-title">{certificates[activeCertificate].name}</strong><span>{certificates[activeCertificate].issuer} · {activeCertificate + 1} / {certificates.length}</span></figcaption></figure><button type="button" className="enc-dialog-next" onClick={() => moveCertificate(1)} aria-label="下一張證照"><ChevronRight size={22} /></button></div>}
      </dialog>
    </>
  );
}
