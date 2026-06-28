import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { BlogAPI } from '../services/apiClient';
import { BLOG_POSTS } from '../constants';
import { ArrowLeft, Terminal, Copy, Loader2, Calendar, Hash, Check, Cpu, Eye, Share2, Zap, Info } from 'lucide-react';

const BlogDetailPage: React.FC = () => {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const fetchPost = async () => {
      const staticPost = BLOG_POSTS.find((p) => p.id === id);
      if (staticPost) {
        setPost(staticPost);
        setLoading(false);
        return;
      }

      try {
        const data = await BlogAPI.get(id as string);
        setPost(data);
      } catch (err) {
        console.error('Fetch blog post error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const highlightCode = (code: string) => {
    const lines = code.trim().split('\n');

    return lines.map((line, idx) => {
      const tokens = [
        { regex: /#.*$|\/\/.*$/g, cls: 'text-slate-500 italic' },
        { regex: /(['"])(?:(?!\1|\\).|\\.)*\1/g, cls: 'text-emerald-400' },
        { regex: /\b(sudo|apt|install|systemctl|mkdir|cd|rm|cp|mv|echo|grep|sed|awk|export|ssh|ip|ls|cat|nano|vi|vim|docker|git|pve|qm|pct|ufw|netplan|nmcli|ping|curl|wget)\b/g, cls: 'text-rose-400 font-bold' },
        { regex: /\b-{1,2}[a-zA-Z0-9-]+\b/g, cls: 'text-slate-400' },
        { regex: /\$[A-Z_a-z0-9]+/g, cls: 'text-sky-400' },
        { regex: /\b\d+\b/g, cls: 'text-amber-400' },
        { regex: /[|&><!]+/g, cls: 'text-white/30' },
      ];

      let pos = 0;
      let highlighted = '';

      while (pos < line.length) {
        let nearestMatch: RegExpExecArray | null = null;
        let nearestToken: any = null;

        for (const token of tokens) {
          token.regex.lastIndex = pos;
          const match = token.regex.exec(line);
          if (match && (nearestMatch === null || match.index < nearestMatch.index)) {
            nearestMatch = match;
            nearestToken = token;
          }
        }

        if (nearestMatch && nearestMatch.index === pos) {
          highlighted += `<span class="${nearestToken.cls}">${nearestMatch[0]}</span>`;
          pos += nearestMatch[0].length;
        } else {
          highlighted += line[pos];
          pos++;
        }
      }

      return (
        <div key={idx} className="flex gap-4 sm:gap-5 group/line py-0.5">
          <span className="w-8 sm:w-10 text-right text-white/10 select-none font-mono text-[10px] sm:text-xs pt-1.5 shrink-0">{idx + 1}</span>
          <span className="flex-1 transition-colors group-hover/line:text-white/90 font-mono whitespace-pre" dangerouslySetInnerHTML={{ __html: highlighted || line }} />
        </div>
      );
    });
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderContent = (content: string) => {
    if (!content) return null;
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, i) => {
      if (part.startsWith('```')) {
        const match = part.match(/```(\w+)?\n?([\s\S]*?)```/);
        const lang = match?.[1] || 'bash';
        const code = match?.[2] || '';

        return (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            key={i}
            className="my-10 sm:my-14 relative group"
          >
            <div className="glass-panel p-0 rounded-3xl sm:rounded-[2rem] overflow-hidden border-white/10 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.9)] bg-[#0d1117] backdrop-blur-3xl transition-all duration-500 group-hover:border-white/20">
              <div className="bg-[#161b22]/80 px-4 sm:px-6 py-4 flex items-center justify-between border-b border-white/5 gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex gap-2 shrink-0">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27c93f]" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/35 flex items-center gap-2 truncate">
                    <Terminal size={13} className="text-white/25 shrink-0" /> {lang}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(code)}
                  className="px-3 sm:px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/45 hover:text-white transition-all flex items-center gap-2 border border-white/5 shrink-0"
                >
                  {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  <span className="hidden xs:inline text-[10px] font-black uppercase tracking-widest">{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-4 sm:p-6 md:p-8 overflow-x-auto custom-scrollbar font-mono text-xs sm:text-sm md:text-[0.95rem] leading-[1.9] text-slate-300">
                {highlightCode(code)}
              </div>
            </div>
          </motion.div>
        );
      }

      return part.split('\n').map((line, j) => {
        const trimmed = line.trim();
        if (trimmed === '') return <div key={`${i}-${j}`} className="h-4 sm:h-6" />;

        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={`${i}-${j}`} className="text-2xl sm:text-3xl md:text-5xl font-[900] text-white mt-16 sm:mt-24 mb-8 sm:mb-10 tracking-normal flex items-start gap-4 sm:gap-6 group leading-tight">
              <div className="w-1.5 sm:w-2 h-9 sm:h-12 bg-gradient-to-b from-emerald-400 to-emerald-800 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.35)] shrink-0 mt-1" />
              <span className="group-hover:text-glow transition-all">{trimmed.replace('## ', '')}</span>
            </h2>
          );
        }

        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={`${i}-${j}`} className="text-xl sm:text-2xl md:text-3xl font-[900] text-white/90 mt-12 sm:mt-16 mb-6 sm:mb-8 tracking-normal flex items-center gap-3">
              <Zap size={20} className="text-emerald-500 shrink-0" />
              {trimmed.replace('### ', '')}
            </h3>
          );
        }

        if (trimmed.startsWith('- ')) {
          return (
            <li key={`${i}-${j}`} className="ml-0 mb-5 sm:mb-6 text-slate-400 text-base sm:text-lg font-light flex items-start gap-4 group list-none">
              <div className="w-2 h-2 rounded-full bg-emerald-500/50 mt-3 group-hover:bg-emerald-500 transition-all shrink-0" />
              <span className="group-hover:text-slate-200 transition-colors leading-[1.85]">
                {trimmed.replace('- ', '').split(/(\*\*.*?\*\*)/g).map((s, idx) => (
                  s.startsWith('**') ? <strong key={idx} className="text-white font-black">{s.slice(2, -2)}</strong> : s
                ))}
              </span>
            </li>
          );
        }

        const cleanLine = trimmed.startsWith('# ') ? trimmed.replace('# ', '') : trimmed;

        return (
          <p key={`${i}-${j}`} className="mb-6 sm:mb-8 text-slate-400 text-base sm:text-lg md:text-xl leading-[1.9] font-light tracking-normal">
            {cleanLine.split(/(\*\*.*?\*\*)/g).map((s, idx) => (
              s.startsWith('**') ? <strong key={idx} className="text-white font-black">{s.slice(2, -2)}</strong> : s
            ))}
          </p>
        );
      });
    });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0b10]">
      <div className="flex flex-col items-center gap-6">
        <Loader2 className="animate-spin text-white/10" size={56} strokeWidth={1} />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Accessing Node...</span>
      </div>
    </div>
  );

  if (!post) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0b10] px-6 text-center">
      <div>
        <h2 className="text-3xl sm:text-5xl font-black text-white mb-8 tracking-normal">找不到文章</h2>
        <Link to="/blog" className="inline-flex items-center gap-3 px-8 py-4 glass-panel border-white/10 text-white font-black tracking-widest text-[10px]">
          <ArrowLeft size={16} /> 返回筆記
        </Link>
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#0a0b10] selection:bg-white selection:text-black">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-white z-[200] origin-left shadow-[0_0_15px_rgba(255,255,255,0.3)]"
        style={{ scaleX }}
      />

      <section className="relative min-h-[620px] h-[68svh] md:h-[78vh] w-full overflow-hidden flex flex-col justify-end">
        <motion.img
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.2, ease: 'easeOut' }}
          src={post.image}
          className="absolute inset-0 w-full h-full object-cover opacity-45"
          alt={post.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b10] via-[#0a0b10]/55 to-[#0a0b10]/45" />

        <div className="relative px-5 sm:px-8 pb-12 sm:pb-16 max-w-7xl mx-auto w-full z-10">
          <Link to="/blog" className="mb-10 sm:mb-12 inline-flex items-center gap-3 glass-panel px-4 py-3 text-white hover:bg-white hover:text-black transition-all font-black tracking-widest text-[10px] border-white/10 bg-black/35 rounded-2xl">
            <ArrowLeft size={15} /> 返回筆記
          </Link>

          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-wrap items-center gap-3 sm:gap-5 mb-5 sm:mb-7">
              <span className="bg-white text-black px-4 py-1.5 font-black tracking-widest text-[10px] sm:text-[11px] rounded-sm">
                {post.category}
              </span>
              <span className="text-white/45 font-black text-[10px] sm:text-[11px] tracking-widest">{post.date}</span>
            </div>
            <h1 className="text-[clamp(2.35rem,11vw,4.5rem)] md:text-[clamp(4.5rem,6.5vw,5.75rem)] font-[900] text-white leading-[1.12] tracking-normal max-w-6xl text-glow break-words">
              {post.title}
            </h1>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-16 md:py-20 relative">
        <div className="absolute top-0 right-0 p-24 opacity-[0.02] pointer-events-none -z-10 hidden md:block">
          <Hash size={400} strokeWidth={1} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <article className="lg:col-span-8 min-w-0">
            <div className="text-white/45 text-lg sm:text-xl md:text-2xl font-light mb-14 sm:mb-20 italic leading-relaxed border-l border-white/10 pl-5 sm:pl-8 flex flex-col gap-4">
              <div className="flex items-center gap-3 not-italic">
                <Info size={18} className="text-emerald-500/60" />
                <span className="text-[10px] font-black uppercase tracking-[0.28em] text-white/25">Summary Protocol</span>
              </div>
              {post.excerpt?.replace(/^# /, '')}
            </div>

            <div className="content-rendered">
              {renderContent(post.content)}
            </div>
          </article>

          <aside className="lg:col-span-4 lg:sticky lg:top-40 h-fit space-y-6 sm:space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-panel p-6 sm:p-8 md:p-10 bg-white/[0.03] border-white/10 rounded-3xl space-y-8 shadow-3xl"
            >
              <div className="flex items-center gap-3 text-white/35 border-b border-white/5 pb-6">
                <Terminal size={17} />
                <span className="text-[11px] font-black uppercase tracking-[0.22em]">筆記資訊</span>
              </div>

              <div className="space-y-6">
                <SideInfo icon={<Calendar size={17} />} label="發布時間" value={post.date} />
                <SideInfo icon={<Cpu size={17} />} label="技術難度" value="EXPERT" color="text-emerald-500" />
                <SideInfo icon={<Eye size={17} />} label="閱讀時間" value="約 5 分鐘" />
              </div>

              <div className="pt-6 border-t border-white/5">
                <button className="w-full py-4 bg-white text-black font-black tracking-[0.18em] text-[11px] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_50px_-10px_rgba(255,255,255,0.2)] rounded-2xl">
                  <Share2 size={17} /> 分享此文件
                </button>
              </div>
            </motion.div>

            <div className="glass-panel p-6 sm:p-8 bg-emerald-500/5 border-emerald-500/20 flex items-center sm:flex-col sm:text-center gap-5 rounded-3xl">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)] shrink-0">
                <Terminal size={22} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-500/70 leading-relaxed">
                Environment Verified on <br className="hidden sm:block" />Ubuntu 24.04 LTS
              </p>
            </div>
          </aside>
        </div>
      </div>

      <footer className="py-20 sm:py-28 text-center opacity-20 border-t border-white/5 px-5">
        <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.5em] sm:tracking-[0.8em] text-white">Knowledge Core v3.1</p>
      </footer>
    </motion.div>
  );
};

const SideInfo: React.FC<{ icon: React.ReactNode; label: string; value: string; color?: string }> = ({ icon, label, value, color = 'text-white' }) => (
  <div className="flex items-center justify-between gap-5 group">
    <div className="flex items-center gap-4 text-white/25 group-hover:text-emerald-500 transition-colors min-w-0">
      <div className="opacity-70 shrink-0">{icon}</div>
      <span className="text-[10px] font-black tracking-[0.18em] truncate">{label}</span>
    </div>
    <span className={`text-[12px] font-black tracking-tight text-right shrink-0 ${color}`}>{value}</span>
  </div>
);

export default BlogDetailPage;
