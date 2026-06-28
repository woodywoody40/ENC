import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, LayoutGrid, Menu, X, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const navItems = [
  { name: '首頁', path: '/' },
  { name: '作品集', path: '/portfolio' },
  { name: '技術筆記', path: '/blog' },
  { name: '個人履歷', path: '/resume' },
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
      <nav className="fixed top-4 sm:top-8 left-0 right-0 z-[100] px-4 sm:px-6 flex justify-center">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`flex items-center justify-between px-4 sm:px-8 lg:px-10 py-3 sm:py-4 w-full max-w-5xl transition-all duration-500 border rounded-full shadow-2xl ${
            isDarkMode
              ? 'bg-black/45 border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]'
              : 'bg-white/75 border-black/10 shadow-[0_20px_40px_-15px_rgba(45,52,54,0.1)]'
          } ${isScrolled || isMenuOpen ? 'scale-[0.98]' : 'scale-100'}`}
          style={{
            backdropFilter: 'blur(26px) saturate(160%)',
            WebkitBackdropFilter: 'blur(26px) saturate(160%)',
          }}
        >
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center font-black transition-transform group-hover:rotate-12 ${isDarkMode ? 'bg-white text-black' : 'bg-morandi-slate text-white'}`}>
              <LayoutGrid size={16} />
            </div>
            <span className={`text-sm sm:text-lg font-black uppercase ${isDarkMode ? 'text-white' : 'text-morandi-slate'}`}>
              Woody
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 lg:gap-10">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative text-[10px] lg:text-[11px] font-black tracking-[0.16em] transition-all group ${
                  location.pathname === item.path
                    ? (isDarkMode ? 'text-white' : 'text-morandi-slate')
                    : (isDarkMode ? 'text-white/45 hover:text-white' : 'text-morandi-stone hover:text-morandi-slate')
                }`}
              >
                {item.name}
              </Link>
            ))}

            <div className={`w-px h-4 ${isDarkMode ? 'bg-white/20' : 'bg-black/10'}`} />

            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                aria-label="切換明暗模式"
                className={`p-2 rounded-xl transition-all active:scale-90 ${isDarkMode ? 'text-white/45 hover:text-white' : 'text-morandi-stone hover:text-morandi-slate'}`}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <Link
                to="/admin"
                aria-label="管理主控台"
                className={`transition-all hover:rotate-90 p-2 ${isDarkMode ? 'text-white/25 hover:text-white' : 'text-morandi-stone hover:text-morandi-slate'}`}
              >
                <Settings size={18} strokeWidth={2.5} />
              </Link>
            </div>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="切換明暗模式"
              className={`p-2 rounded-xl active:scale-90 ${isDarkMode ? 'text-white/45' : 'text-morandi-stone'}`}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={toggleMenu}
              aria-label="開啟選單"
              className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-colors ${isDarkMode ? 'text-white bg-white/5 border-white/10' : 'text-morandi-slate bg-black/5 border-black/10'}`}
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </motion.div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[90] md:hidden flex flex-col items-center justify-center px-8 py-24 ${isDarkMode ? 'bg-black/95' : 'bg-slate-50/95'}`}
            style={{
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
            }}
          >
            <div className="flex flex-col items-center gap-5 w-full">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="w-full text-center"
                >
                  <Link
                    to={item.path}
                    onClick={() => { document.body.style.overflow = 'auto'; }}
                    className={`text-3xl font-black tracking-normal transition-all block py-2 ${
                      location.pathname === item.path
                        ? (isDarkMode ? 'text-white' : 'text-morandi-slate')
                        : (isDarkMode ? 'text-white/25' : 'text-morandi-stone/40')
                    }`}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="w-full pt-8 border-t border-white/5">
                <Link
                  to="/admin"
                  onClick={() => { document.body.style.overflow = 'auto'; }}
                  className={`flex items-center justify-center gap-3 text-lg font-black tracking-normal transition-all ${isDarkMode ? 'text-white/25' : 'text-morandi-stone/40'}`}
                >
                  <Settings size={20} /> 管理主控台
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
