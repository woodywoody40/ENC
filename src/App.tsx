
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
  <div className="blog-cinematic flex min-h-screen items-center justify-center bg-black">
    <div className="flex flex-col items-center gap-6">
      <div className="liquid-glass flex h-14 w-14 items-center justify-center rounded-full">
        <div className="relative h-6 w-6">
          <div className="absolute inset-0 rounded-full border border-white/10" />
          <div className="absolute inset-0 animate-spin rounded-full border border-transparent border-t-white/60" />
        </div>
      </div>
      <span className="font-body text-[11px] font-light tracking-[0.3em] uppercase text-white/30">
        Loading
      </span>
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
        <div className="blog-cinematic flex min-h-screen items-center justify-center bg-black p-8">
          <div className="liquid-glass w-full max-w-lg rounded-[1.25rem] p-10 text-center">
            <div className="liquid-glass mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-[0.85rem]">
              <span className="text-xl text-white/70">!</span>
            </div>
            <h2 className="mb-2 font-heading italic text-2xl tracking-tight text-white">
              系統發生未預期錯誤
            </h2>
            <p className="mb-2 font-body text-sm font-light text-white/50">請稍後再試，或重新載入頁面</p>
            {this.state.error?.message && (
              <div className="liquid-glass mb-6 rounded-[0.75rem] px-4 py-3">
                <p className="break-all font-mono text-[11px] leading-relaxed text-white/30">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleRetry}
                className="liquid-glass-strong rounded-full px-6 py-3 font-body text-sm font-medium text-white transition active:scale-95"
              >
                重試
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="liquid-glass rounded-full px-6 py-3 font-body text-sm font-medium text-white/70 transition hover:text-white active:scale-95"
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
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
      if (metaThemeColor) metaThemeColor.setAttribute('content', '#000000');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      if (metaThemeColor) metaThemeColor.setAttribute('content', '#f6f4f0');
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
      <div className="relative min-h-screen bg-[var(--bg-base)] text-[var(--text-main)] transition-colors duration-500">
        {/* Canvas — adaptive base background */}
        <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden bg-[var(--bg-base)] transition-colors duration-500" />

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
