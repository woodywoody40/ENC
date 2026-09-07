import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ProjectsAPI } from '../services/apiClient';
import type { Project } from '../types';
import { BreadcrumbSchema, SEOMeta } from '../lib/seo';
import MarkdownArticle from '../components/MarkdownArticle';
import { EmptyState, LoadingState, PublicFooter } from '../components/EditorialLayout';

export default function ProjectDetailPage() {
  const { id = '' } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    ProjectsAPI.get(id).then((data) => setProject(data || null)).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingState label="正在讀取案例內容" />;
  if (!project) return <main id="main-content" tabIndex={-1} className="enc-page enc-state-page"><EmptyState title="找不到這個案例" description="它可能已經移動，或尚未公開。" action={<Link className="enc-text-button" to="/portfolio"><ArrowLeft size={15} />返回作品集</Link>} /></main>;

  const year = project.created_at?.slice(0, 4) || '2026';
  return (
    <>
      <SEOMeta title={project.title} description={project.description} path={`/portfolio/${project.id}`} ogImage={project.image} tags={project.tags} />
      <BreadcrumbSchema items={[{ name: '首頁', path: '/' }, { name: '作品集', path: '/portfolio' }, { name: project.title, path: `/portfolio/${project.id}` }]} />
      <main id="main-content" tabIndex={-1} className="enc-page enc-detail-page">
        <div className="enc-shell">
          <Link className="enc-back-link" to="/portfolio"><ArrowLeft size={15} />作品集</Link>
          <header className="enc-detail-hero">
            <div className="enc-detail-kicker"><span>{project.type || 'Case study'}</span><span>{year}</span></div>
            <h1>{project.title}</h1>
            <div className="enc-detail-summary"><p>{project.description}</p><div>{project.tags?.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
            {project.link && <a className="enc-solid-link" href={project.link} target="_blank" rel="noreferrer">開啟專案 <ArrowUpRight size={16} /></a>}
          </header>

          {project.image && <figure className="enc-detail-cover"><img src={project.image} alt={`${project.title} 專案畫面`} width={1600} height={1000} fetchPriority="high" /><figcaption><span>{project.title}</span><span>{year} / 案例畫面</span></figcaption></figure>}

          <div className="enc-article-layout">
            <aside aria-label="案例資訊"><dl><div><dt>類型</dt><dd>{project.type || '專案案例'}</dd></div><div><dt>年份</dt><dd>{year}</dd></div><div><dt>技術</dt><dd>{project.tags?.slice(0, 4).join(' · ')}</dd></div></dl></aside>
            <article>{project.details ? <MarkdownArticle content={project.details} /> : <p className="enc-lead-copy">這個案例的完整紀錄正在整理中。</p>}</article>
          </div>

          {!!project.media?.length && <section className="enc-media-section"><div className="enc-section-title"><p className="enc-eyebrow"><i />Project media</p><h2>更多畫面</h2></div><div className="enc-media-grid">{project.media.map((media, index) => <figure key={`${media.url}-${index}`}>{media.type === 'video' ? <video controls preload="none" width={1280} height={720}><source src={media.url} /></video> : <img src={media.url} alt={`${project.title} 專案畫面 ${index + 1}`} width={1280} height={800} loading="lazy" />}<figcaption>{String(index + 1).padStart(2, '0')} / {media.frame || 'media'}</figcaption></figure>)}</div></section>}

          <nav className="enc-next-nav" aria-label="案例頁面導覽"><p>看完這個案例了？</p><Link to="/portfolio">回到完整作品集 <ArrowUpRight size={22} /></Link></nav>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
