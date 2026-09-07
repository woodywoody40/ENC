import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Share2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { BlogAPI } from '../services/apiClient';
import type { BlogPost } from '../types';
import { BlogPostSchema, BreadcrumbSchema, SEOMeta } from '../lib/seo';
import MarkdownArticle from '../components/MarkdownArticle';
import { EmptyState, LoadingState, PublicFooter } from '../components/EditorialLayout';

const formatDate = (value: string) => value ? new Intl.DateTimeFormat('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(value)) : '未標日期';
const readingTime = (content = '') => {
  const chinese = content.match(/[\u4e00-\u9fff]/g)?.length || 0;
  const words = content.match(/[A-Za-z0-9_]+/g)?.length || 0;
  return Math.max(2, Math.ceil((chinese + words) / 420));
};

export default function BlogDetailPage() {
  const { id = '' } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    setLoading(true);
    BlogAPI.get(id).then((data) => setPost(data || null)).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!post) return;
    BlogAPI.list().then((items) => {
      const sorted = (items || []).filter((item) => item.id !== post.id).sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category));
      setRelated(sorted.slice(0, 3));
    }).catch(console.error);
  }, [post]);

  const minutes = useMemo(() => readingTime(post?.content || post?.excerpt), [post]);
  const share = async () => {
    const data = { title: post?.title || document.title, url: window.location.href };
    if (navigator.share) await navigator.share(data).catch(() => undefined);
    else await navigator.clipboard.writeText(window.location.href);
    setShared(true);
    window.setTimeout(() => setShared(false), 1600);
  };

  if (loading) return <LoadingState label="正在讀取文章" />;
  if (!post) return <main id="main-content" tabIndex={-1} className="enc-page enc-state-page"><EmptyState title="找不到這篇文章" description="文章可能已移動，或尚未公開。" action={<Link className="enc-text-button" to="/blog"><ArrowLeft size={15} />返回技術筆記</Link>} /></main>;

  return (
    <>
      <SEOMeta title={post.title} description={post.excerpt} path={`/blog/${post.id}`} ogImage={post.image} ogType="article" publishedTime={post.date} />
      <BlogPostSchema title={post.title} description={post.excerpt} path={`/blog/${post.id}`} image={post.image} datePublished={post.date} tags={[post.category]} />
      <BreadcrumbSchema items={[{ name: '首頁', path: '/' }, { name: '技術筆記', path: '/blog' }, { name: post.title, path: `/blog/${post.id}` }]} />
      <main id="main-content" tabIndex={-1} className="enc-page enc-detail-page">
        <div className="enc-shell">
          <Link className="enc-back-link" to="/blog"><ArrowLeft size={15} />技術筆記</Link>
          <header className="enc-article-hero">
            <div className="enc-detail-kicker"><span>{post.category || '技術筆記'}</span><time dateTime={post.date}>{formatDate(post.date)}</time><span>{minutes} 分鐘閱讀</span></div>
            <h1>{post.title}</h1>
            <div className="enc-article-deck"><p>{post.excerpt}</p><button className="enc-text-button" type="button" onClick={share}>{shared ? <Check size={15} /> : <Share2 size={15} />}{shared ? '已複製連結' : '分享文章'}</button></div>
          </header>

          {post.image && <figure className="enc-detail-cover enc-detail-cover--article"><img src={post.image} alt="" width={1600} height={900} fetchPriority="high" /><figcaption>{post.category} / {formatDate(post.date)}</figcaption></figure>}

          <div className="enc-article-layout enc-article-layout--post">
            <aside aria-label="文章資訊"><dl><div><dt>作者</dt><dd>Woody Wu</dd></div><div><dt>分類</dt><dd>{post.category}</dd></div><div><dt>閱讀</dt><dd>約 {minutes} 分鐘</dd></div><div><dt>日期</dt><dd>{formatDate(post.date)}</dd></div></dl></aside>
            <article>{post.content ? <MarkdownArticle content={post.content} skipImageSrc={post.image} /> : <p className="enc-lead-copy">{post.excerpt}</p>}</article>
          </div>

          {!!related.length && <section className="enc-related-section"><div className="enc-section-title"><p className="enc-eyebrow"><i />Keep reading</p><h2>接著閱讀</h2></div><ol>{related.map((item, index) => <li key={item.id}><span>{String(index + 1).padStart(2, '0')}</span><div><small>{item.category}</small><h3><Link to={`/blog/${item.id}`}>{item.title}</Link></h3></div><Link to={`/blog/${item.id}`} aria-label={`閱讀 ${item.title}`}><ArrowRight size={18} /></Link></li>)}</ol></section>}
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
