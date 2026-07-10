
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';

import Navbar from './components/Navbar';
import { AstryxProvider } from './components/AstryxProvider';
import { SEOMeta, PersonSchema, OrganizationSchema, WebSiteSchema, DEFAULT_DESC } from './lib/seo';

// Lazy-loaded pages（改為懶載入，縮小首包體積）
const HomePage = lazy(() => import('./pages/HomePage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const ResumePage = lazy(() => import('./pages/ResumePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// 全域載入指示器（含進度條視覺效果）
const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center gap-6">
      {/* 旋轉圈 */}
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-white/5" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-amber-400/70 animate-spin" />
      </div>
      {/* 進度條 */}
      <div className="w-24 h-[2px] rounded-full bg-white/5 overflow-hidden">
        <div className="h-full w-1/3 rounded-full bg-amber-400/50 animate-pulse-slow" style={{ animation: 'shimmer 1.5s ease-in-out infinite' }} />
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Loading...</span>
    </div>
  </div>
);

// Error Boundary 元件（含重試機制）
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React Error Boundary caught:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-[#0a0b10]">
          <div className="glass-panel p-10 max-w-lg w-full text-center">
            {/* 圖示 */}
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6 ring-1 ring-red-500/20">
              <span className="text-xl">!</span>
            </div>
            {/* 標題 */}
            <h2 className="text-lg font-bold text-white mb-2">系統發生未預期錯誤</h2>
            <p className="text-xs text-white/40 mb-2">請稍後再試，或重新載入頁面</p>
            {/* 錯誤訊息 */}
            {this.state.error?.message && (
              <div className="mb-6 px-4 py-3 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[11px] text-white/30 font-mono break-all leading-relaxed">
                  {this.state.error.message}
                </p>
              </div>
            )}
            {/* 操作按鈕 */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={this.handleRetry}
                className="px-6 py-3 bg-white text-black rounded-2xl font-bold text-[11px] tracking-widest hover:scale-105 active:scale-95 transition-all"
              >
                重試
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-white/5 text-white/60 rounded-2xl font-bold text-[11px] tracking-widest hover:bg-white/10 hover:text-white/80 active:scale-95 transition-all"
              >
                重新載入
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });
  
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <ErrorBoundary>
      <HelmetProvider>
      <AstryxProvider>
      {/* Global SEO — 全站統一中繼資料與結構化實體 */}
      <SEOMeta title="首頁" description={DEFAULT_DESC} path="/" />
      <PersonSchema />
      <OrganizationSchema />
      <WebSiteSchema />
      <div className={`relative min-h-screen transition-colors duration-700 ${isDarkMode ? 'dark bg-[#0a0b10]' : 'light bg-[#f0eae6]'}`}>
        {/* 2D 莫蘭迪科技背景 */}
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
          {/* 動態柔和光暈 */}
          <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-10 transition-colors duration-1000 ${isDarkMode ? 'bg-white' : 'bg-morandi-sage'}`} />
          <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] opacity-5 transition-colors duration-1000 ${isDarkMode ? 'bg-slate-500' : 'bg-morandi-rose'}`} />
          
          {/* 精密點狀/線條網格 */}
          <div className={`absolute inset-0 opacity-[0.03] ${isDarkMode ? 'invert-0' : 'invert'}`} 
               style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

        <Suspense fallback={<PageLoader />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/portfolio/:id" element={<ProjectDetailPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:id" element={<BlogDetailPage />} />
              <Route path="/resume" element={<ResumePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </div>
      </AstryxProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;
