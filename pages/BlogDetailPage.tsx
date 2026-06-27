
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { BlogAPI } from '../services/apiClient';
import { BLOG_POSTS } from '../constants';
import { ArrowLeft, Terminal, Copy, Loader2, Calendar, ChevronRight, Command, Hash, Check, Cpu, Eye, Share2, Zap, Info } from 'lucide-react';

const BlogDetailPage: React.FC = () => {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const fetchPost = async () => {
      const staticPost = BLOG_POSTS.find(p => p.id === id);
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

  const highlightCode = (code: string, lang: string) => {
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
        <div key={idx} className="flex gap-6 group/line py-0.5">
          <span className="w-10 text-right text-white/10 select-none font-mono text-xs pt-1.5">{idx + 1}</span>
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0b10]">
      <div className="flex flex-col items-center gap-6">
        <Loader2 className="animate-spin text-white/10" size={60} strokeWidth={1} />
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Accessing Node...</span>
      </div>
    </div>
  );

  if (!post) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0b10] px-6 text-center">
      <div>
        <h2 className="text-5xl font-black text-white mb-8 tracking-tighter uppercase">Protocol Not Found</h2>
        <Link to="/blog" className="inline-block px-10 py-4 glass-panel border-white/10 text-white font-black uppercase tracking-widest text-[10px]">← 返回列表</Link>
      </div>
    </div>
  );

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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            key={i} 
            className="my-16 relative group"
          >
            <div className="glass-panel p-0 rounded-[2.5rem] overflow-hidden border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.9)] bg-[#0d1117] backdrop-blur-3xl transition-all duration-500 group-hover:border-white/20">
              <div className="bg-[#161b22]/80 px-8 py-5 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-6">
                   <div className="flex gap-2.5">
                     <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] shadow-[0_0_10px_rgba(255,95,86,0.3)]" />
                     <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] shadow-[0_0_10px_rgba(255,189,46,0.3)]" />
                     <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f] shadow-[0_0_10px_rgba(39,201,63,0.3)]" />
                   </div>
                   <div className="flex items-center gap-3">
                     <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-2">
                       <Terminal size={14} className="text-white/20" /> BASH — WOODY@DEPLOYMENT
                     </span>
                   </div>
                </div>
                <button 
                  onClick={() => handleCopy(code)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all flex items-center gap-3 border border-white/5"
                >
                  {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  <span className="text-[10px] font-black uppercase tracking-widest">{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-8 md:p-12 overflow-x-auto custom-scrollbar font-mono text-sm md:text-[1.05rem] leading-[2] text-slate-300">
                {highlightCode(code, lang)}
              </div>
            </div>
            <div className="absolute -inset-8 bg-emerald-500/5 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
          </motion.div>
        );
      }

      return part.split('\n').map((line, j) => {
        const trimmed = line.trim();
        if (trimmed === '') return <div key={`${i}-${j}`} className="h-10" />;
        
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={`${i}-${j}`} className="text-4xl md:text-6xl font-[900] text-white mt-32 mb-14 tracking-tighter flex items-center gap-8 group">
              <div className="w-2.5 h-14 bg-gradient-to-b from-emerald-500 to-emerald-800 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)]" />
              <span className="group-hover:text-glow transition-all">{trimmed.replace('## ', '')}</span>
            </h2>
          );
        }
        
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={`${i}-${j}`} className="text-2xl md:text-3xl font-[900] text-white/90 mt-20 mb-10 uppercase tracking-widest flex items-center gap-5">
              <Zap size={24} className="text-emerald-500" />
              {trimmed.replace('### ', '')}
            </h3>
          );
        }
        
        if (trimmed.startsWith('- ')) {
           return (
             <li key={`${i}-${j}`} className="ml-6 mb-8 text-slate-400 text-lg md:text-xl font-light flex items-start gap-6 group">
               <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40 mt-3 group-hover:bg-emerald-500 transition-all shrink-0" /> 
               <span className="group-hover:text-slate-200 transition-colors leading-[1.8]">
                 {trimmed.replace('- ', '').split(/(\*\*.*?\*\*)/g).map((s, idx) => 
                   s.startsWith('**') ? <strong key={idx} className="text-white font-black">{s.slice(2, -2)}</strong> : s
                 )}
               </span>
             </li>
           );
        }

        // 移除行首可能殘留的單一 '#' 字號
        const cleanLine = trimmed.startsWith('# ') ? trimmed.replace('# ', '') : trimmed;

        return (
          <p key={`${i}-${j}`} className="mb-10 text-slate-400 text-lg md:text-2xl leading-[2] font-light tracking-wide">
            {cleanLine.split(/(\*\*.*?\*\*)/g).map((s, idx) => 
              s.startsWith('**') ? <strong key={idx} className="text-white font-black">{s.slice(2, -2)}</strong> : s
            )}
          </p>
        );
      });
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#0a0b10] selection:bg-white selection:text-black">
      {/* 閱讀進度條 */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-white z-[200] origin-left shadow-[0_0_15px_rgba(255,255,255,0.3)]"
        style={{ scaleX }}
      />

      {/* Hero 區塊 */}
      <section className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden flex flex-col justify-end">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          src={post.image} 
          className="absolute inset-0 w-full h-full object-cover opacity-50" 
          alt={post.title} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b10] via-transparent to-[#0a0b10]/40" />
        
        <Link to="/blog" className="fixed top-32 left-8 z-[110] glass-panel px-6 py-4 flex items-center gap-4 text-white hover:bg-white hover:text-black transition-all font-black uppercase tracking-widest text-[10px] border-white/5 bg-black/40">
          <ArrowLeft size={16} /> 返回筆記
        </Link>

        <div className="relative px-8 pb-12 max-w-7xl mx-auto w-full z-10">
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-6 mb-8">
              <span className="bg-white text-black px-5 py-1.5 font-black uppercase tracking-widest text-[11px] rounded-sm">
                {post.category}
              </span>
              <span className="text-white/40 font-black text-[11px] tracking-widest">{post.date}</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-[900] text-white leading-[1.1] tracking-tighter uppercase whitespace-pre-line max-w-6xl text-glow">
              {post.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* 內容與資訊卡區塊 */}
      <div className="max-w-7xl mx-auto px-8 py-20 relative">
        <div className="absolute top-0 right-0 p-24 opacity-[0.02] pointer-events-none -z-10">
          <Hash size={400} strokeWidth={1} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
          <article className="lg:col-span-8">
            <div className="dark:text-white/40 text-morandi-stone/40 text-2xl md:text-3xl font-light mb-24 italic leading-relaxed border-l-2 border-white/10 pl-10 flex flex-col gap-4">
              <div className="flex items-center gap-3 not-italic">
                <Info size={20} className="text-emerald-500/50" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Summary Protocol</span>
              </div>
              {post.excerpt?.replace(/^# /, '')}
            </div>
            
            <div className="content-rendered">
              {renderContent(post.content)}
            </div>
          </article>

          {/* 右下方資訊卡 */}
          <aside className="lg:col-span-4 lg:sticky lg:top-48 h-fit space-y-12">
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="glass-panel p-10 md:p-14 bg-white/[0.03] border-white/10 rounded-[3rem] space-y-12 shadow-3xl"
             >
                <div className="flex items-center gap-4 text-white/30 border-b border-white/5 pb-8">
                  <Terminal size={18} />
                  <span className="text-[11px] font-black uppercase tracking-[0.3em]">關於本筆記</span>
                </div>
                
                <div className="space-y-8">
                  <SideInfo icon={<Calendar size={18} />} label="部署時間" value={post.date} />
                  <SideInfo icon={<Cpu size={18} />} label="技術複雜度" value="EXPERT" color="text-emerald-500" />
                  <SideInfo icon={<Eye size={18} />} label="閱讀時間" value="約 5 分鐘" />
                </div>

                <div className="pt-10 border-t border-white/5">
                   <button className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-5 hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_-10px_rgba(255,255,255,0.2)] rounded-3xl">
                     <Share2 size={18} /> 分享此文件
                   </button>
                </div>
             </motion.div>

             <div className="glass-panel p-10 bg-emerald-500/5 border-emerald-500/20 flex flex-col items-center text-center gap-6 rounded-[2.5rem]">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <Terminal size={24} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/60 leading-relaxed">
                  Environment Verified on <br/>Ubuntu 24.04 LTS
                </p>
             </div>
          </aside>
        </div>
      </div>
      
      <footer className="py-32 text-center opacity-20 border-t border-white/5">
        <p className="text-[11px] font-black uppercase tracking-[1em] text-white">Knowledge Core v3.1</p>
      </footer>
    </motion.div>
  );
};

const SideInfo: React.FC<{ icon: React.ReactNode, label: string, value: string, color?: string }> = ({ icon, label, value, color="text-white" }) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center gap-5 text-white/20 group-hover:text-emerald-500 transition-colors">
      <div className="opacity-60">{icon}</div>
      <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
    </div>
    <span className={`text-[12px] font-black uppercase tracking-tight ${color}`}>{value}</span>
  </div>
);

export default BlogDetailPage;
