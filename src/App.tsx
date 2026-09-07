
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
const PageLoader: React.FC<{ dark?: boolean }> = ({ dark = false }) => (
  <main id="main-content" tabIndex={-1} className={`enc-route-loader ${dark ? 'enc-route-loader--dark' : ''}`}>
    <span aria-hidden="true" />
    <p>Loading</p>
  </main>
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
        <main id="main-content" tabIndex={-1} className="enc-error-page">
          <div>
            <span aria-hidden="true">!</span>
            <h1>系統發生未預期錯誤</h1>
            <p>請稍後再試，或重新載入頁面。</p>
            {this.state.error?.message && (
              <div className="enc-error-detail">
                <p>
                  {this.state.error.message}
                </p>
              </div>
            )}
            <div className="enc-error-actions">
              <button
                type="button"
                onClick={this.handleRetry}
                className="enc-solid-link"
              >
                重試
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="enc-text-button"
              >
                重新載入
              </button>
            </div>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}

const App: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <ErrorBoundary>
      <HelmetProvider>
      <AstryxProvider>
      {/* Global SEO — 全站統一中繼資料與結構化實體 */}
      <SEOMeta title="首頁" description={DEFAULT_DESC} path="/" />
      <PersonSchema />
      <OrganizationSchema />
      <WebSiteSchema />
      <div className={`relative min-h-screen ${isAdmin ? 'bg-black text-white' : 'enc-app--public'}`}>
        {/* Cinematic black canvas */}
        {isAdmin && <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden bg-black" />}

        <Navbar />

        <Suspense fallback={<PageLoader dark={isAdmin} />}>
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
