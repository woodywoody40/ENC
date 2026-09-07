import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { BlogAPI } from '../services/apiClient';
import type { BlogPost } from '../types';
import { BreadcrumbSchema, SEOMeta } from '../lib/seo';
import { EmptyState, LoadingState, PageIntro, PublicFooter } from '../components/EditorialLayout';

const ALL = '全部';
const formatDate = (value: string) => value ? new Intl.DateTimeFormat('zh-TW', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(value)) : '未標日期';

export default function BlogPage() {
  const [params, setParams] = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState(params.get('q') || '');
  const urlQuery = params.get('q') || '';
  const category = params.get('category') || ALL;

  useEffect(() => setQuery(urlQuery), [urlQuery]);

  useEffect(() => {
    BlogAPI.list()
      .then((data) => setPosts(data || []))
      .catch((reason) => setError(reason instanceof Error ? reason.message : '文章資料暫時無法讀取'))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => [ALL, ...Array.from(new Set(posts.map((post) => post.category || '未分類')))], [posts]);
  const visible = useMemo(() => posts.filter((post) => {
    const categoryMatch = category === ALL || post.category === category;
    const term = query.trim().toLowerCase();
    const queryMatch = !term || `${post.title} ${post.excerpt} ${post.category}`.toLowerCase().includes(term);
    return categoryMatch && queryMatch;
  }), [category, posts, query]);

  const updateCategory = (next: string) => {
    const copy = new URLSearchParams(params);
    next === ALL ? copy.delete('category') : copy.set('category', next);
    setParams(copy, { replace: true });
  };

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    const copy = new URLSearchParams(params);
    query.trim() ? copy.set('q', query.trim()) : copy.delete('q');
    setParams(copy, { replace: true });
  };

  const clearSearch = () => {
    setQuery('');
    const copy = new URLSearchParams(params);
    copy.delete('q');
    setParams(copy, { replace: true });
  };

  if (loading) return <LoadingState label="正在整理技術筆記" />;
  const featured = category === ALL && !query && visible[0];
  const remaining = featured ? visible.slice(1) : visible;

  return (
    <>
      <SEOMeta title="技術筆記" description="系統維運、開發工具、AI 與開源專案的實作筆記。" path="/blog" />
      <BreadcrumbSchema items={[{ name: '首頁', path: '/' }, { name: '技術筆記', path: '/blog' }]} />
      <main id="main-content" tabIndex={-1} className="enc-page">
        <div className="enc-shell">
          <PageIntro eyebrow="Technical notes / Field log" title={<>把踩過的坑，<em>整理成路。</em></>} description="寫給下一次遇到同樣問題的自己，也寫給正在找答案的人。" aside={<span className="enc-count">{String(visible.length).padStart(2, '0')} notes</span>} />

          <search className="enc-search">
            <form onSubmit={submitSearch}>
              <label htmlFor="blog-search">搜尋技術筆記</label>
              <div><Search aria-hidden="true" size={18} /><input id="blog-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="輸入主題、技術或關鍵字" />{query && <button type="button" onClick={clearSearch} aria-label="清除搜尋"><X size={17} /></button>}<button type="submit">搜尋</button></div>
            </form>
          </search>

          <div className="enc-category-strip" aria-label="文章分類">{categories.map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => updateCategory(item)}>{item}</button>)}</div>

          {error ? <EmptyState title="筆記資料暫時離線" description={error} /> : visible.length === 0 ? <EmptyState title="找不到符合的筆記" description="換個關鍵字，或切回全部分類再試一次。" /> : (
            <>
              {featured && <article className="enc-featured-note">
                <Link className="enc-featured-note-media" to={`/blog/${featured.id}`} aria-label={`閱讀 ${featured.title}`}><img src={featured.image} alt="" width={1400} height={800} /></Link>
                <div><p className="enc-eyebrow"><i />Featured note</p><div className="enc-note-meta"><span>{featured.category}</span><time dateTime={featured.date}>{formatDate(featured.date)}</time></div><h2><Link to={`/blog/${featured.id}`}>{featured.title}</Link></h2><p>{featured.excerpt}</p><Link className="enc-arrow-link" to={`/blog/${featured.id}`}>開始閱讀 <ArrowRight size={16} /></Link></div>
              </article>}
              <ol className="enc-note-archive">{remaining.map((post, index) => <li key={post.id}><article><span>{String(index + (featured ? 2 : 1)).padStart(2, '0')}</span><div><div className="enc-note-meta"><span>{post.category}</span><time dateTime={post.date}>{formatDate(post.date)}</time></div><h2><Link to={`/blog/${post.id}`}>{post.title}</Link></h2><p>{post.excerpt}</p></div><Link to={`/blog/${post.id}`} aria-label={`閱讀 ${post.title}`}><ArrowRight size={18} /></Link></article></li>)}</ol>
            </>
          )}
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
