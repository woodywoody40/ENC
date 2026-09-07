import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProjectsAPI } from '../services/apiClient';
import type { Project } from '../types';
import { BreadcrumbSchema, SEOMeta } from '../lib/seo';
import { EmptyState, LoadingState, PageIntro, PublicFooter } from '../components/EditorialLayout';

const filters = [
  { id: 'all', label: '全部', tags: [] },
  { id: 'product', label: '產品與前端', tags: ['React', 'TypeScript', 'Next.js', 'Vite', 'PWA', 'Canvas'] },
  { id: 'infra', label: '基礎架構', tags: ['VMware', 'Linux', 'Fortinet', 'HPE', 'Networking', 'Security', 'Storage'] },
  { id: 'platform', label: '平台與 API', tags: ['Cloudflare Pages', 'Cloudflare D1', 'Gemini API', 'YouTube API', 'WebAssembly'] },
];

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [active, setActive] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    ProjectsAPI.list()
      .then((data) => setProjects(data || []))
      .catch((reason) => setError(reason instanceof Error ? reason.message : '作品資料暫時無法讀取'))
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(() => {
    const filter = filters.find((item) => item.id === active);
    if (!filter || filter.tags.length === 0) return projects;
    return projects.filter((project) => project.tags?.some((tag) => filter.tags.includes(tag)));
  }, [active, projects]);

  if (loading) return <LoadingState label="正在整理作品檔案" />;

  return (
    <>
      <SEOMeta title="作品集" description="Woody 的產品開發、基礎架構與系統部署案例。" path="/portfolio" />
      <BreadcrumbSchema items={[{ name: '首頁', path: '/' }, { name: '作品集', path: '/portfolio' }]} />
      <main id="main-content" tabIndex={-1} className="enc-page">
        <div className="enc-shell">
          <PageIntro
            eyebrow="Selected work / Archive"
            title={<>做得穩，<em>也說得清楚。</em></>}
            description="從日常工具、內容平台到教育網路基礎架構；每個案例都記錄問題、取捨與實際成果。"
            aside={<span className="enc-count">{String(visible.length).padStart(2, '0')} projects</span>}
          />

          <div className="enc-filter-bar" aria-label="作品分類">
            {filters.map((filter) => (
              <button key={filter.id} type="button" aria-pressed={active === filter.id} onClick={() => setActive(filter.id)}>{filter.label}</button>
            ))}
          </div>

          {error ? (
            <EmptyState title="作品資料暫時離線" description={error} action={<button className="enc-text-button" type="button" onClick={() => window.location.reload()}><RotateCcw size={14} />重新讀取</button>} />
          ) : visible.length === 0 ? (
            <EmptyState title="此分類目前沒有作品" description="可以切換其他分類，查看完整作品檔案。" />
          ) : (
            <ol className="enc-archive-list">
              {visible.map((project, index) => (
                <li key={project.id} className="enc-archive-item">
                  <article>
                    <div className="enc-archive-index">{String(index + 1).padStart(2, '0')}</div>
                    <div className="enc-archive-copy">
                      <div className="enc-archive-meta"><span>{project.type || 'Case study'}</span><span>{project.created_at?.slice(0, 4) || '2026'}</span></div>
                      <h2><Link to={`/portfolio/${project.id}`}>{project.title}</Link></h2>
                      <p>{project.description}</p>
                      <div className="enc-tag-list" aria-label="使用技術">{project.tags?.slice(0, 6).map((tag) => <span key={tag}>{tag}</span>)}</div>
                      <Link className="enc-arrow-link" to={`/portfolio/${project.id}`}>閱讀案例 <ArrowRight aria-hidden="true" size={16} /></Link>
                    </div>
                    <Link className="enc-archive-media" to={`/portfolio/${project.id}`} aria-label={`查看 ${project.title}`}>
                      {project.image ? <img src={project.image} alt="" width={1200} height={800} loading="lazy" /> : <div className="enc-media-placeholder"><span>{project.tags?.[0] || 'SYSTEM'}</span><i /></div>}
                    </Link>
                  </article>
                </li>
              ))}
            </ol>
          )}
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
