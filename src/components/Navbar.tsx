import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, ArrowUpRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const navItems = [
  { name: '作品集', path: '/portfolio' },
  { name: '技術筆記', path: '/blog' },
  { name: '關於', path: '/about' },
  { name: '履歷', path: '/resume' },
];

const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleTheme }) => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'auto';
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen((open) => {
      document.body.style.overflow = open ? 'auto' : 'hidden';
      return !open;
    });
  };

  return (
    <>
      <nav className="navbar-wrapper fixed top-4 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-16">
        {/* Logo — liquid glass circle */}
        <Link
          to="/"
          className="liquid-glass flex h-12 w-12 items-center justify-center rounded-full transition hover:scale-105"
          aria-label="首頁"
        >
          <span className="font-heading italic text-2xl text-white">W</span>
        </Link>

        {/* Center pill nav */}
        <div
          className={`
            hidden md:flex items-center
            liquid-glass rounded-full px-1.5 py-1.5
            transition-all duration-500
            ${isScrolled ? 'shadow-[0_8px_32px_rgba(0,0,0,0.45)]' : ''}
          `}
        >
          {navItems.map((item) => {
            const active =
              location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  rounded-full px-3 py-2 font-body text-sm font-medium transition-colors
                  ${active ? 'bg-white/10 text-white' : 'text-white/90 hover:text-white'}
                `}
              >
                {item.name}
              </Link>
            );
          })}
          <Link
            to="/portfolio"
            className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 font-body text-sm font-medium text-black transition hover:bg-white/90"
          >
            Start <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Right controls */}
        <div className="flex h-12 w-12 items-center justify-end gap-1 md:w-auto md:gap-2">
          <button
            onClick={toggleTheme}
            aria-label={isDarkMode ? '切換淺色模式' : '切換深色模式'}
            className="liquid-glass hidden h-10 w-10 items-center justify-center rounded-full text-white/50 transition hover:text-white md:flex"
            title={isDarkMode ? '切換為淺色模式' : '切換為深色模式'}
          >
            <div className="relative flex h-4 w-4 items-center justify-center">
              <Sun
                size={14}
                className={`absolute transition-all duration-500 ${
                  isDarkMode ? 'scale-100 rotate-0 opacity-100' : 'scale-75 rotate-90 opacity-0'
                }`}
              />
              <Moon
                size={14}
                className={`absolute transition-all duration-500 ${
                  !isDarkMode ? 'scale-100 rotate-0 opacity-100' : 'scale-75 -rotate-90 opacity-0'
                }`}
              />
            </div>
          </button>
          <Link
            to="/admin"
            className="liquid-glass hidden rounded-full px-3 py-2 font-body text-[11px] font-medium text-white/50 transition hover:text-white/80 md:inline-flex"
          >
            Admin
          </Link>
          <button
            onClick={toggleMenu}
            aria-label="選單"
            className="liquid-glass flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition hover:text-white md:hidden"
          >
            {isMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {isMenuOpen && (
        <div
          className="navbar-mobile-overlay fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/95 px-8 backdrop-blur-2xl md:hidden"
          style={{ animation: 'fade-in-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
        >
          <div className="flex w-full max-w-sm flex-col items-center gap-3">
            {navItems.map((item, i) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => {
                    document.body.style.overflow = 'auto';
                  }}
                  className={`
                    liquid-glass w-full rounded-full py-3.5 text-center font-heading italic text-2xl tracking-tight transition
                    ${isActive ? 'text-white' : 'text-white/50 hover:text-white/80'}
                  `}
                  style={{
                    animation: `fade-in-up 0.3s ${i * 0.06}s cubic-bezier(0.16, 1, 0.3, 1) both`,
                  }}
                >
                  {item.name}
                </Link>
              );
            })}
            <div className="my-3 h-px w-12 bg-white/10" />
            <button
              onClick={() => {
                toggleTheme();
                document.body.style.overflow = 'auto';
              }}
              className="liquid-glass flex items-center gap-3 rounded-full px-5 py-2.5 font-body text-sm text-white/50"
            >
              {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
              {isDarkMode ? '淺色模式' : '深色模式'}
            </button>
            <Link
              to="/admin"
              onClick={() => {
                document.body.style.overflow = 'auto';
              }}
              className="mt-2 font-body text-sm text-white/30 transition hover:text-white/50"
            >
              管理後台
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
