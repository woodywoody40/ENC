import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Search } from 'lucide-react';
import { SEOMeta } from '../lib/seo';

const NotFoundPage: React.FC = () => {
  return (
    <>
      <SEOMeta title="頁面不存在" description="你尋找的路由不存在於目前的基礎架構中。" path={window.location.pathname} noindex />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center px-6"
      >
        <div className="text-center max-w-lg">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="text-[6rem] sm:text-[8rem] font-black heading-gradient leading-none mb-4 select-none">
              404
            </div>
            <div className="w-16 h-1 bg-white/10 mx-auto rounded-full mb-8" />
            <h2 className="text-xl sm:text-2xl font-black text-white/80 mb-4 tracking-tight">
              Page Not Found
            </h2>
            <p className="text-sm text-slate-500 font-light mb-12 leading-relaxed">
              你尋找的路由不存在於目前的基礎架構中。<br />
              或許它已被遷移、退役，或從未被部署。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/"
                className="group px-8 py-4 bg-white text-black rounded-2xl font-black text-[11px] tracking-[0.18em] flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-2xl"
              >
                <Home size={16} />
                返回首頁
              </Link>
              <button
                onClick={() => window.history.back()}
                className="group px-8 py-4 glass-panel text-white/80 rounded-2xl font-black text-[11px] tracking-[0.18em] flex items-center gap-3 transition-all hover:bg-white/5"
              >
                <ArrowLeft size={16} />
                回上一頁
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default NotFoundPage;
