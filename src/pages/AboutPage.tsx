import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ConfigAPI } from '../services/apiClient';
import { SOCIAL_LINKS } from '../constants';
import { BreadcrumbSchema, SEOMeta } from '../lib/seo';
import { LoadingState, PageIntro, PublicFooter } from '../components/EditorialLayout';

export default function AboutPage() {
  const [configs, setConfigs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ConfigAPI.all().then((data) => setConfigs(data || {})).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState label="正在讀取個人資料" />;

  const paragraphs = (configs.about_content || '我是吳東謙，現就讀國立臺灣海洋大學資訊工程碩士專班，同時任職於基隆市教育網路中心。學術與實戰並行，讓我能將理論帶進機房，也把第一線維運經驗帶回研究。\n\n我負責 TANet 學術網路的資安監控與流量分析，並規劃自動化 VM 備份、異地備援與儲存架構，為教育現場建立穩定、可驗證的數位服務。\n\n公關產業的實習背景，讓我習慣把複雜技術翻成不同角色都能理解的語言。對我而言，可靠不只是一個 uptime 數字，也包含清楚的溝通與可持續的流程。').split('\n\n');
  const skills = [
    { number: '01', title: configs.about_skill1_title || '儲存與備援', description: configs.about_skill1_desc || '規劃異地備援與自動化 VM 備份，整合 HPE Storage 與 QNAP NAS。', tags: 'HPE / QNAP / Backup' },
    { number: '02', title: configs.about_skill2_title || '資安與監控', description: configs.about_skill2_desc || '執行弱點掃描、漏洞修補與 TANet 異常流量監控。', tags: 'CEH / TANet / Hardening' },
    { number: '03', title: configs.about_skill3_title || '虛擬化與平台', description: configs.about_skill3_desc || '維運 VMware vSphere 集群並建立標準化部署與權限流程。', tags: 'vSphere / SOP / Workspace' },
  ];

  return (
    <>
      <SEOMeta title="關於" description="吳東謙，專注網路、系統、資安維運與跨團隊技術溝通。" path="/about" />
      <BreadcrumbSchema items={[{ name: '首頁', path: '/' }, { name: '關於', path: '/about' }]} />
      <main id="main-content" tabIndex={-1} className="enc-page">
        <div className="enc-shell">
          <PageIntro eyebrow="About / Woody Wu" title={<>技術要可靠，<em>合作也要。</em></>} description="我把複雜的基礎架構整理成清楚、可維護、能被團隊信任的服務。" />
          <section className="enc-about-story">
            <aside><span>Based in</span><strong>Keelung, Taiwan</strong><span>Current role</span><strong>Network & System Engineer</strong></aside>
            <div>{paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
          </section>
          <section className="enc-about-numbers" aria-label="工作成果"><div><span>01</span><strong>{configs.stat_vm || '151+'}</strong><p>管理中的虛擬節點</p></div><div><span>02</span><strong>{configs.stat_uptime || '99.9%'}</strong><p>服務可用性目標</p></div><div><span>03</span><strong>{configs.stat_defense || '8'}</strong><p>完成的部署專案</p></div></section>
          <section className="enc-expertise-section">
            <div className="enc-section-title"><p className="enc-eyebrow"><i />Core practice</p><h2>擅長的，不只是一張技術清單。</h2></div>
            <ol>{skills.map((skill) => <li key={skill.number}><span>{skill.number}</span><h3>{skill.title}</h3><p>{skill.description}</p><small>{skill.tags}</small></li>)}</ol>
          </section>
          <section className="enc-social-section"><p>更多工作紀錄與聯絡方式</p><div>{SOCIAL_LINKS.map((social) => <a key={social.label} href={social.href} target={social.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{social.label}<ArrowUpRight size={15} /></a>)}</div></section>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
