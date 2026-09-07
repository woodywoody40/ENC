import { useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight, Github, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BreadcrumbSchema, SEOMeta } from '../lib/seo';
import { BlogAPI, ConfigAPI, ProjectsAPI } from '../services/apiClient';
import type { BlogPost, Project } from '../types';

const fallbackProjects: Project[] = [
  {
    id: 'vm-backup',
    title: 'VM 備份與異地備援',
    description: '為大型虛擬化環境建立可追蹤、可驗證的備份流程，讓復原能力成為日常維運的一部分。',
    details: '', image: '', tags: ['VMware', 'Linux', 'Backup'], link: '',
  },
  {
    id: 'tanet-operations',
    title: 'TANet 網路維運',
    description: '監控教育網路骨幹、分析流量與處理連線事件，讓複雜的網路狀態保持清楚可控。',
    details: '', image: '', tags: ['TANet', 'Fortinet', 'Monitoring'], link: '',
  },
  {
    id: 'security-operations',
    title: '資安事件與交付流程',
    description: '把問題重現、風險判斷、負責人與驗證結果串成一條可被團隊共同理解的處理路徑。',
    details: '', image: '', tags: ['Security', 'QA', 'SOP'], link: '',
  },
];

const capabilityRows = [
  { number: '01', title: 'Infrastructure', text: 'VMware、Linux、HPE Storage 與備份架構，從日常維護到異常復原。' },
  { number: '02', title: 'Network & Security', text: 'TANet 骨幹、Fortinet 防火牆、流量分析與安全監控。' },
  { number: '03', title: 'Automation', text: '用腳本、SOP 與觀測機制，把重複工作變成穩定流程。' },
];

function ProjectDiagram({ index }: { index: number }) {
  return (
    <div className={`enc-diagram enc-diagram--${index + 1}`} aria-hidden="true">
      <div className="enc-diagram-bar">
        <span>system view / 0{index + 1}</span>
        <span className="enc-diagram-live"><i /> operational</span>
      </div>
      <div className="enc-diagram-stage">
        <span className="enc-diagram-node enc-diagram-node--a">source</span>
        <span className="enc-diagram-path"><i /></span>
        <span className="enc-diagram-node enc-diagram-node--b">process</span>
        <span className="enc-diagram-path"><i /></span>
        <span className="enc-diagram-node enc-diagram-node--c">verified</span>
      </div>
      <div className="enc-diagram-foot">
        <span>Clear ownership</span>
        <strong>All checks passed</strong>
      </div>
    </div>
  );
}

const HomePage: React.FC = () => {
  const [configs, setConfigs] = useState<Record<string, string>>({});
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([ConfigAPI.all(), ProjectsAPI.list(), BlogAPI.list()]).then((results) => {
      if (cancelled) return;
      const [configResult, projectResult, postResult] = results;
      if (configResult.status === 'fulfilled') setConfigs(configResult.value || {});
      if (projectResult.status === 'fulfilled') setProjects(projectResult.value || []);
      if (postResult.status === 'fulfilled') setPosts(postResult.value || []);
    });
    return () => { cancelled = true; };
  }, []);

  const name = configs.resume_name || 'Woody Wu';
  const role = configs.resume_title || 'Network & System Engineer';
  const intro = configs.hero_intro || '深耕教育體系網際網路、系統平台與資安維運，把複雜基礎架構整理成穩定、清楚、可持續的服務。';
  const location = configs.resume_location || 'Keelung, Taiwan';
  const email = configs.resume_email || 'woodywoody40814@gmail.com';
  const github = configs.resume_github || 'https://github.com/woodywoody40';
  const summary = configs.resume_summary || '我的工作位在基礎架構、資安與團隊協作的交界。除了處理技術細節，也重視讓問題、決策與下一步都能被清楚理解。';
  const displayProjects = projects.length > 0 ? projects.slice(0, 3) : fallbackProjects;
  const stats = [
    [configs.stat_vm || '151+', 'Virtual machines managed'],
    [configs.stat_uptime || '99.9%', 'Service availability'],
    [configs.stat_defense || '8', 'Deployments shipped'],
  ];

  return (
    <>
      <SEOMeta title="首頁" description={`${name} — ${role}。${intro}`} path="/" keywords="Woody Wu, 網路工程師, 系統工程師, VMware, Fortinet, Linux, TANet" />
      <BreadcrumbSchema items={[{ name: '首頁', path: '/' }]} />

      <main className="enc-home" id="top">
        <section className="enc-hero" aria-labelledby="enc-hero-title">
          <div className="enc-shell enc-hero-inner">
            <div className="enc-hero-meta enc-reveal">
              <span>Portfolio / 2026</span><span>{location}</span>
            </div>
            <div className="enc-hero-main">
              <p className="enc-eyebrow enc-reveal enc-delay-1"><i /> {role}</p>
              <h1 id="enc-hero-title" className="enc-reveal enc-delay-2">Reliable systems.<br /><em>Clear thinking.</em></h1>
            </div>
            <div className="enc-hero-bottom enc-reveal enc-delay-3">
              <span className="enc-availability"><i /> Available for opportunities</span>
              <p>{intro}</p>
              <Link to="/portfolio" className="enc-arrow-link">查看作品 <ArrowRight size={17} /></Link>
            </div>
          </div>
        </section>

        <section className="enc-proof" aria-label="Professional highlights">
          <div className="enc-shell enc-proof-grid">
            <div className="enc-proof-intro">
              <p className="enc-eyebrow"><i /> Operational scope</p>
              <p>把可靠性做成可以被看見、驗證與交接的系統。</p>
            </div>
            {stats.map(([value, label], index) => (
              <div className="enc-stat" key={label}>
                <span>0{index + 1}</span><strong>{value}</strong><p>{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="enc-work enc-shell" id="selected-work">
          <header className="enc-section-heading">
            <p className="enc-eyebrow"><i /> Selected work</p>
            <h2>Infrastructure,<br />made understandable.</h2>
            <p>從需求、維運到驗證，三個面向呈現我如何處理可靠性與交付。</p>
          </header>

          <div className="enc-project-list">
            {displayProjects.map((project, index) => (
              <article className="enc-project" key={project.id}>
                <div className="enc-project-copy">
                  <div className="enc-project-meta"><span>0{index + 1}</span><span>{project.type || project.tags?.[0] || 'Infrastructure'}</span></div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="enc-tag-list" aria-label="Technologies">
                    {project.tags?.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                  <Link to={`/portfolio/${project.id}`} className="enc-arrow-link">View case study <ArrowUpRight size={17} /></Link>
                </div>

                {project.image ? (
                  <Link to={`/portfolio/${project.id}`} className="enc-project-image" aria-label={`查看 ${project.title}`}>
                    <img src={project.image} alt="" width="1200" height="800" loading="lazy" />
                    <span>Open project <ArrowUpRight size={16} /></span>
                  </Link>
                ) : <ProjectDiagram index={index} />}
              </article>
            ))}
          </div>

          <div className="enc-section-action"><Link to="/portfolio" className="enc-outline-link">查看所有作品 <ArrowRight size={17} /></Link></div>
        </section>

        <section className="enc-capabilities">
          <div className="enc-shell enc-capability-grid">
            <header><p className="enc-eyebrow"><i /> Expertise</p><h2>Useful depth,<br />without the noise.</h2></header>
            <div className="enc-capability-list">
              {capabilityRows.map((item, index) => (
                <details key={item.number} open={index === 0}>
                  <summary><span>{item.number}</span><strong>{item.title}</strong><i aria-hidden="true" /></summary>
                  <div><p>{item.text}</p></div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="enc-about enc-shell">
          <header><p className="enc-eyebrow"><i /> About Woody</p><h2>讓系統在複雜時刻，<em>仍然保持冷靜。</em></h2></header>
          <div className="enc-about-grid">
            <p>{summary}</p>
            <dl>
              {[
                ['Based in', location],
                ['Core practice', 'Network & system operations'],
                ['Certification', 'EC-Council CEH'],
                ['Also building', 'Clear digital experiences'],
              ].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            </dl>
          </div>
        </section>

        {posts.length > 0 && (
          <section className="enc-notes enc-shell">
            <header className="enc-notes-heading"><p className="enc-eyebrow"><i /> Technical notes</p><Link to="/blog" className="enc-arrow-link">查看全部 <ArrowRight size={17} /></Link></header>
            <div className="enc-note-list">
              {posts.slice(0, 3).map((post, index) => (
                <Link to={`/blog/${post.id}`} key={post.id}><span>0{index + 1}</span><strong>{post.title}</strong><small>{post.category || post.date}</small><ArrowUpRight size={18} /></Link>
              ))}
            </div>
          </section>
        )}

        <footer className="enc-contact">
          <div className="enc-shell">
            <p className="enc-eyebrow"><i /> Have a role or project in mind?</p>
            <a className="enc-contact-link" href={`mailto:${email}`}>Let&apos;s talk<span>.</span><ArrowUpRight aria-hidden="true" /></a>
            <div className="enc-footer-row">
              <span>© {new Date().getFullYear()} {name}</span>
              <div>
                <a href={github} target="_blank" rel="noreferrer"><Github size={14} /> GitHub</a>
                <a href={`mailto:${email}`}><Mail size={14} /> Email</a>
                <span><MapPin size={14} /> {location}</span>
              </div>
              <a href="#top">Back to top ↑</a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
};

export default HomePage;
