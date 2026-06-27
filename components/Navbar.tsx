
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, LayoutGrid, Menu, X, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

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
    if (isMenuOpen) {
      document.body.style.overflow = 'auto';
    }
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = !isMenuOpen ? 'hidden' : 'auto';
  };

  const navItems = [
    { name: '首頁', path: '/' },
    { name: '作品實績', path: '/portfolio' },
    { name: '技術筆記', path: '/blog' },
    { name: '個人履歷', path: '/resume' },
  ];

  return (
    <>
      <nav className="fixed top-6 sm:top-8 left-0 right-0 z-[100] px-4 sm:px-6 flex justify-center">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`flex items-center justify-between px-6 sm:px-10 py-4 sm:py-5 w-full max-w-5xl transition-all duration-500 border rounded-full shadow-2xl ${
            isDarkMode 
              ? 'bg-black/40 border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]' 
              : 'bg-white/70 border-black/10 shadow-[0_20px_40px_-15px_rgba(45,52,54,0.1)]'
          } ${isScrolled || isMenuOpen ? 'scale-[0.98]' : 'scale-100'}`}
          style={{ 
            backdropFilter: 'blur(30px) saturate(160%)', 
            WebkitBackdropFilter: 'blur(30px) saturate(160%)' 
          }}
        >
          <Link to="/" className="flex items-center gap-3 group">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center font-black transition-transform group-hover:rotate-12 ${isDarkMode ? 'bg-white text-black' : 'bg-morandi-slate text-white'}`}>
              <LayoutGrid size={16} />
            </div>
            <span className={`text-base sm:text-lg font-black tracking-tighter uppercase ${isDarkMode ? 'text-white' : 'text-morandi-slate'}`}>
              Woody
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                to={item.path}
                className={`relative text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em] transition-all group ${
                  location.pathname === item.path 
                    ? (isDarkMode ? 'text-white' : 'text-morandi-slate') 
                    : (isDarkMode ? 'text-white/40 hover:text-white' : 'text-morandi-stone hover:text-morandi-slate')
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            <div className={`w-[1px] h-4 ${isDarkMode ? 'bg-white/20' : 'bg-black/10'}`} />
            
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleTheme}
                className={`p-2 rounded-xl transition-all active:scale-90 ${isDarkMode ? 'text-white/40 hover:text-white' : 'text-morandi-stone hover:text-morandi-slate'}`}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              
              <Link 
                to="/admin" 
                className={`transition-all hover:rotate-90 p-2 ${isDarkMode ? 'text-white/20 hover:text-white' : 'text-morandi-stone hover:text-morandi-slate'}`}
              >
                <Settings size={18} strokeWidth={2.5} />
              </Link>
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className="flex md:hidden items-center gap-3">
             <button 
                onClick={toggleTheme}
                className={`p-2 rounded-xl active:scale-90 ${isDarkMode ? 'text-white/40' : 'text-morandi-stone'}`}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            <button 
              onClick={toggleMenu}
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
            className={`fixed inset-0 z-[90] md:hidden flex flex-col items-center justify-center p-8 ${isDarkMode ? 'bg-black/95' : 'bg-slate-50/95'}`}
            style={{ 
              backdropFilter: 'blur(40px)', 
              WebkitBackdropFilter: 'blur(40px)' 
            }}
          >
            <div className="flex flex-col items-center gap-8 w-full">
              {navItems.map((item, i) => (
                <motion.div 
                  key={item.name} 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: i * 0.05 }}
                  className="w-full text-center"
                >
                  <Link to={item.path} onClick={() => { document.body.style.overflow = 'auto'; }} className={`text-4xl xs:text-5xl font-black tracking-tighter transition-all block py-2 ${
                    location.pathname === item.path 
                      ? (isDarkMode ? 'text-white' : 'text-morandi-slate') 
                      : (isDarkMode ? 'text-white/20' : 'text-morandi-stone/30')
                  }`}>
                    {item.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="w-full pt-8 border-t border-white/5">
                <Link to="/admin" onClick={() => { document.body.style.overflow = 'auto'; }} className={`flex items-center justify-center gap-4 text-2xl font-black tracking-tighter transition-all ${isDarkMode ? 'text-white/20' : 'text-morandi-stone/30'}`}>
                  <Settings size={24} /> 管理後台
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
