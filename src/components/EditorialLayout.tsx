import type { ReactNode } from 'react';
import { ArrowUpRight, LoaderCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PageIntro = ({
  eyebrow,
  title,
  description,
  aside,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  aside?: ReactNode;
}) => (
  <header className="enc-page-intro enc-reveal">
    <p className="enc-eyebrow"><i />{eyebrow}</p>
    <div className="enc-page-intro-grid">
      <h1>{title}</h1>
      <div className="enc-page-intro-copy">
        <p>{description}</p>
        {aside}
      </div>
    </div>
  </header>
);

export const LoadingState = ({ label = '正在讀取內容' }: { label?: string }) => (
  <main id="main-content" tabIndex={-1} className="enc-page enc-state-page">
    <LoaderCircle aria-hidden="true" className="enc-state-spinner" size={24} />
    <p>{label}</p>
  </main>
);

export const EmptyState = ({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) => (
  <div className="enc-empty-state">
    <span aria-hidden="true">—</span>
    <h2>{title}</h2>
    <p>{description}</p>
    {action}
  </div>
);

export const PublicFooter = () => (
  <footer className="enc-page-footer">
    <div className="enc-shell">
      <p className="enc-eyebrow"><i />Open to thoughtful collaborations</p>
      <a className="enc-page-footer-link" href="mailto:hello@xn--hrrs16bo6z.com">
        Let&rsquo;s talk<span>.</span><ArrowUpRight aria-hidden="true" />
      </a>
      <div className="enc-page-footer-row">
        <span>© {new Date().getFullYear()} Woody Wu</span>
        <nav aria-label="頁尾導覽">
          <Link to="/portfolio">作品集</Link>
          <Link to="/blog">技術筆記</Link>
          <Link to="/about">關於</Link>
        </nav>
        <a href="#main-content">回到頂端 ↑</a>
      </div>
    </div>
  </footer>
);
