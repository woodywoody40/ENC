import React, { useState, useEffect } from 'react';
import { LayoutGrid, Menu, X, Sun, Moon } from 'lucide-react';
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
    window.addEventListener('scroll', handleScroll);
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
      <nav className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 md:px-8 py-4 md:py-6">
        <div
          className={`w-full max-w-7xl flex items-center justify-between rounded-full transition-all duration-700 px-2 md:px-1 py-1 md:py-1.5 ${
            isScrolled || isMenuOpen
              ? 'bg-black/50 border border-white/[0.06] shadow-2xl backdrop-blur-2xl'
              : 'bg-transparent border border-transparent'
          }`}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group cursor-pointer ml-3 md:ml-4">
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center transition-transform group-hover:scale-105">
              <LayoutGrid size={12} className="text-white/60" />
            </div>
            <span className="text-base md:text-lg font-bold tracking-tighter text-white">Woody.</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors duration-300 ${
                  location.pathname === item.path
                    ? 'text-white'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-1 md:gap-2 mr-2 md:mr-3">
            <button
              onClick={toggleTheme}
              aria-label="切換主題"
              className="hidden md:flex w-8 h-8 items-center justify-center rounded-full text-white/30 hover:text-white/60 hover:bg-white/5 transition-all"
            >
              {isDarkMode ? <Sun size={13} /> : <Moon size={13} />}
            </button>
            <Link
              to="/admin"
              className="hidden md:inline-flex relative items-center justify-center font-medium rounded-full transition-all duration-300 border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 px-4 py-1.5 text-[11px]"
            >
              管理後台
            </Link>
            <button
              onClick={toggleMenu}
              aria-label="選單"
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-full border border-white/10 text-white/40 hover:text-white hover:bg-white/5 transition-all"
            >
              {isMenuOpen ? <X size={14} /> : <Menu size={14} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center px-8">
          <div className="flex flex-col items-center gap-6 w-full">
            {navItems.map((item, i) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => { document.body.style.overflow = 'auto'; }}
                className={`text-2xl font-medium transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'text-white'
                    : 'text-white/25 hover:text-white/50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="w-8 h-px bg-white/10 my-4" />
            <button
              onClick={() => { toggleTheme(); document.body.style.overflow = 'auto'; }}
              className="text-sm text-white/30 hover:text-white/50 transition-colors flex items-center gap-2"
            >
              {isDarkMode ? <Sun size={13} /> : <Moon size={13} />}
              {isDarkMode ? '淺色模式' : '深色模式'}
            </button>
            <Link
              to="/admin"
              onClick={() => { document.body.style.overflow = 'auto'; }}
              className="text-sm text-white/20 hover:text-white/40 transition-colors"
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
