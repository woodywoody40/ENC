import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEOMeta } from '../lib/seo';
import { PublicFooter } from '../components/EditorialLayout';

export default function NotFoundPage() {
  return (
    <>
      <SEOMeta title="頁面不存在" description="你尋找的頁面不存在。" path={window.location.pathname} noindex />
      <main id="main-content" tabIndex={-1} className="enc-page enc-404">
        <div className="enc-shell">
          <p className="enc-eyebrow"><i />Error / 404</p>
          <div><span>404</span><h1>這條路由，<em>沒有部署。</em></h1><p>頁面可能已經移動、退役，或網址輸入有誤。</p><div><Link className="enc-solid-link" to="/">返回首頁 <ArrowRight size={16} /></Link><button type="button" className="enc-text-button" onClick={() => window.history.back()}><ArrowLeft size={16} />回上一頁</button></div></div>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
