import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { SEOMeta } from '../lib/seo';
import BlurText from '../components/BlurText';

const NotFoundPage: React.FC = () => {
  return (
    <>
      <SEOMeta
        title="頁面不存在"
        description="你尋找的路由不存在於目前的基礎架構中。"
        path={window.location.pathname}
        noindex
      />
      <div className="blog-cinematic flex min-h-screen items-center justify-center bg-black px-6">
        <motion.div
          initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
          animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="liquid-glass max-w-lg rounded-[1.5rem] p-10 text-center sm:p-14"
        >
          <BlurText
            text="404"
            className="font-heading italic text-[6rem] leading-none tracking-[-4px] text-white sm:text-[8rem]"
          />
          <h2 className="mt-4 font-heading italic text-2xl tracking-tight text-white sm:text-3xl">
            Page Not Found
          </h2>
          <p className="mt-4 font-body text-sm font-light leading-relaxed text-white/60">
            你尋找的路由不存在於目前的基礎架構中。
            <br />
            或許它已被遷移、退役，或從未被部署。
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/"
              className="liquid-glass-strong inline-flex items-center gap-2 rounded-full px-6 py-3 font-body text-sm font-medium text-white"
            >
              <Home size={16} /> 返回首頁
            </Link>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="liquid-glass inline-flex items-center gap-2 rounded-full px-6 py-3 font-body text-sm font-medium text-white/80 transition hover:text-white"
            >
              <ArrowLeft size={16} /> 回上一頁
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default NotFoundPage;
