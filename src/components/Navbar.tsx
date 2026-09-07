import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { name: '作品集', path: '/portfolio' },
  { name: '技術筆記', path: '/blog' },
  { name: '關於', path: '/about' },
  { name: '履歷', path: '/resume' },
];

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isHome = location.pathname === '/';

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isMenuOpen]);

  return (
    <>
      <nav className={`enc-site-nav ${isHome ? 'enc-site-nav--home' : 'enc-site-nav--dark'}`} aria-label="主要導覽">
        <Link to="/" className="enc-nav-brand" aria-label="Woody Wu 首頁">
          <span>W.</span><strong>Woody Wu</strong>
        </Link>

        <div className="enc-nav-links">
          {navItems.map((item) => {
            const active = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
            return <Link key={item.path} to={item.path} aria-current={active ? 'page' : undefined}>{item.name}</Link>;
          })}
        </div>

        <div className="enc-nav-actions">
          <Link to="/admin" className="enc-nav-admin">Admin</Link>
          <Link to="/resume" className="enc-nav-cta">查看履歷 <ArrowUpRight size={14} /></Link>
          <button
            type="button"
            className="enc-nav-menu"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="enc-mobile-menu"
            aria-label={isMenuOpen ? '關閉選單' : '開啟選單'}
          >
            {isMenuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div id="enc-mobile-menu" className={`enc-mobile-menu ${isHome ? 'enc-mobile-menu--home' : ''}`}>
          <div>
            {navItems.map((item, index) => (
              <Link key={item.path} to={item.path}>
                <span>0{index + 1}</span><strong>{item.name}</strong><ArrowUpRight size={20} />
              </Link>
            ))}
            <Link to="/admin" className="enc-mobile-admin">Admin</Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
