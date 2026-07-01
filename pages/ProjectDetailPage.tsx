
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ProjectsAPI } from '../services/apiClient';
import { ArrowLeft, ExternalLink, Calendar, Briefcase, Loader2, Eye, Terminal, ChevronRight, Smartphone, Monitor, Command, Share2, Cpu, Check, Copy, Hash, Zap, Info } from 'lucide-react';

const PhoneFrame: React.FC<{ src: string, type: 'image' | 'video' }> = ({ src, type }) => (
  <div className="relative mx-auto w-full max-w-[280px] aspect-[9/19.5] group select-none perspective-1000">
    <motion.div 
      whileHover={{ rotateY: 5, rotateX: 2, scale: 1.02 }}
      className="absolute inset-0 rounded-[3.5rem] bg-[#090a0f] border-[6px] sm:border-[8px] border-[#1f2128] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-5 sm:h-7 bg-black rounded-b-2xl z-30" />
      <div className="absolute inset-x-0 bottom-0 top-0 z-10 bg-black overflow-hidden rounded-[2.5rem] sm:rounded-[2.8rem]">
        {type === 'video' ? (
          <video src={src} className="w-full h-full object-cover" autoPlay muted loop playsInline />
        ) : (
          <img src={src} className="w-full h-full object-cover" alt="Phone preview" />
        )}
      </div>
    </motion.div>
    <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center text-white/40 shadow-2xl">
      <Smartphone size={20} />
    </div>
  </div>
);

const DesktopFrame: React.FC<{ src: string, type: 'image' | 'video' }> = ({ src, type }) => (
  <div className="relative mx-auto w-full max-w-[1000px] flex flex-col items-center group mb-16 md:mb-24 perspective-1000 px-2 sm:px-4">
    <motion.div 
      whileHover={{ rotateX: 1, scale: 1.01 }}
      className="relative w-full aspect-[16/10] rounded-[1.5rem] sm:rounded-[2.5rem] bg-[#12141a] border-[6px] sm:border-[12px] border-[#22252e] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.9)] overflow-hidden"
    >
      <div className="absolute top-0 inset-x-0 h-6 sm:h-8 bg-black/40 backdrop-blur-md flex items-center px-4 sm:px-6 gap-2 z-20">
         <div className="flex gap-1">
           <div className="w-2 h-2 rounded-full bg-[#ff5f56]" />
           <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
           <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
         </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 top-0 z-10 bg-black overflow-hidden">
        {type === 'video' ? (
          <video src={src} className="w-full h-full object-cover object-top" autoPlay muted loop playsInline />
        ) : (
          <img src={src} className="w-full h-full object-cover object-top" alt="Desktop preview" />
        )}
      </div>
    </motion.div>
    <div className="w-32 sm:w-48 h-8 sm:h-12 bg-gradient-to-b from-[#22252e] to-[#12141a] -mt-1 rounded-b-[1.5rem] sm:rounded-b-[2rem] border-t border-white/5" />
    <div className="absolute -top-4 -right-4 w-12 h-12 sm:w-16 sm:h-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl flex items-center justify-center text-white/40 shadow-2xl">
      <Monitor size={24} />
    </div>
  </div>
);

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await ProjectsAPI.get(id as string);
        if (data) setProject(data);
      } catch (err) {
        console.error('Fetch project error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
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
        <div key={idx} className="flex gap-4 sm:gap-6 group/line py-0.5">
          <span className="w-8 sm:w-10 text-right text-white/10 select-none font-mono text-[10px] sm:text-xs pt-1.5">{idx + 1}</span>
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

  const processText = (text: string) => {
    if (!text) return '';
    const cleanText = text.startsWith('# ') ? text.replace('# ', '') : text;
    const parts = cleanText.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-white font-black">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const renderMarkdown = (content: string) => {
    if (!content) return null;
    const rawParts = content.split(/(```[\s\S]*?```)/g);
    
    return rawParts.map((part, i) => {
      if (part.startsWith('```')) {
        const match = part.match(/```(\w+)?\n?([\s\S]*?)```/);
        const lang = match?.[1] || 'bash';
        const code = match?.[2] || '';
        return (
          <div key={i} className="my-12 sm:my-16 glass-panel p-0 rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden border-white/10 bg-[#0d1117] shadow-2xl">
            <div className="bg-[#161b22]/80 px-6 sm:px-8 py-4 sm:py-5 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-4">
                 <div className="flex gap-2">
                   <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                   <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                   <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                 </div>
                 <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white/30 hidden sm:block">WOODY@DEPLOYMENT</span>
              </div>
              <button 
                onClick={() => handleCopy(code)}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all flex items-center gap-2 border border-white/5"
              >
                {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                <span className="text-[9px] font-black uppercase tracking-widest">{copied ? 'Done' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-6 sm:p-10 overflow-x-auto font-mono text-xs sm:text-[0.95rem] leading-loose text-slate-300 custom-scrollbar">
              {highlightCode(code, lang)}
            </div>
          </div>
        );
      }

      return part.split('\n').map((line, j) => {
        let trimmed = line.trim();
        if (trimmed === '') return <div key={`${i}-${j}`} className="h-6 sm:h-8" />;
        
        if (trimmed.match(/^##\s+/)) {
          return (
            <h2 key={`${i}-${j}`} className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mt-24 mb-10 tracking-tighter flex items-center gap-6">
              <div className="w-2 h-10 sm:h-12 bg-gradient-to-b from-emerald-500 to-emerald-800 rounded-full" />
              {processText(trimmed.replace(/^##\s+/, ''))}
            </h2>
          );
        }
        if (trimmed.match(/^###\s+/)) {
          return (
            <h3 key={`${i}-${j}`} className="text-xl sm:text-2xl font-black text-white/90 mt-16 mb-8 uppercase tracking-widest flex items-center gap-4">
              <Zap size={20} className="text-emerald-500" />
              {processText(trimmed.replace(/^###\s+/, ''))}
            </h3>
          );
        }
        
        if (trimmed.match(/^[>*+-]\s+/)) {
          return (
            <div key={`${i}-${j}`} className="flex items-start gap-4 sm:gap-6 mb-6 pl-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500/40 mt-2.5 shrink-0" /> 
              <p className="text-slate-400 text-base sm:text-xl leading-relaxed font-light">
                {processText(trimmed.replace(/^[>*+-]\s+/, ''))}
              </p>
            </div>
          );
        }

        return <p key={`${i}-${j}`} className="text-slate-400 text-base sm:text-xl leading-relaxed font-light mb-8">{processText(trimmed)}</p>;
      });
    });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0b10]">
      <div className="flex flex-col items-center gap-6">
        <Loader2 className="animate-spin text-white/10" size={60} strokeWidth={1} />
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Syncing Node...</span>
      </div>
    </div>
  );

  if (!project) return (
    <div className="min-h-screen flex items-center justify-center px-6 text-center bg-[#0a0b10]">
      <div>
        <h2 className="text-3xl font-black text-white mb-8 tracking-tighter uppercase">Project Offline</h2>
        <Link to="/portfolio" className="text-white/40 hover:text-white transition-all font-black uppercase tracking-widest text-[10px] border border-white/10 px-8 py-4 rounded-xl">← 返回主目錄</Link>
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#0a0b10] selection:bg-white selection:text-black overflow-x-hidden">
      <section className="relative h-[60vh] sm:h-[75vh] w-full overflow-hidden flex flex-col justify-end">
        <motion.img 
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          src={project.image} 
          className="absolute inset-0 w-full h-full object-cover opacity-50" 
          alt={project.title} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b10] via-transparent to-transparent" />
        
        <Link to="/portfolio" className="fixed top-28 left-6 sm:left-10 z-[110] glass-panel px-6 py-4 flex items-center gap-3 text-white hover:bg-white hover:text-black transition-all font-black uppercase tracking-widest text-[10px] border-white/10 shadow-2xl">
          <ArrowLeft size={16} /> 返回
        </Link>

        <div className="relative px-6 pb-16 max-w-7xl mx-auto w-full z-10">
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter uppercase text-glow leading-[0.95] max-w-5xl">
              {project.title}
            </h1>
            <div className="flex flex-wrap gap-2.5">
              {project.tags?.map((tag: string) => (
                <span key={tag} className="px-4 py-1.5 glass-panel text-white text-[9px] font-black uppercase tracking-widest bg-white/5 border-white/10">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32 grid grid-cols-1 lg:grid-cols-12 gap-16 relative">
        <div className="lg:col-span-8">
          <article className="space-y-16">
            <div className="text-white/40 text-xl sm:text-2xl font-light italic leading-relaxed border-l-2 border-white/10 pl-8 mb-16">
              {project.description}
            </div>
            <div className="max-w-none prose-invert">
              {renderMarkdown(project.details || project.description || "暫無細節資料。")}
            </div>
          </article>

          {project.media && project.media.length > 0 && (
            <section className="mt-32 space-y-24">
              <div className="flex items-center gap-5">
                 <div className="w-2 h-10 bg-emerald-500 rounded-full" />
                 <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-widest">實錄資產</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-20 items-start">
                {project.media.map((m: any, idx: number) => (
                  <div key={idx} className={`${m.frame === 'desktop' ? 'md:col-span-2 xl:col-span-3' : 'col-span-1'}`}>
                    {m.frame === 'phone' ? (
                      <PhoneFrame src={m.url} type={m.type} />
                    ) : m.frame === 'desktop' ? (
                      <DesktopFrame src={m.url} type={m.type} />
                    ) : (
                      <div className="aspect-video glass-panel overflow-hidden border-white/5 bg-black rounded-[2rem] relative shadow-2xl">
                        {m.type === 'video' ? (
                          <video src={m.url} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                        ) : (
                          <img src={m.url} className="w-full h-full object-cover" alt="System" />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="lg:col-span-4 h-fit lg:sticky lg:top-48 space-y-8">
          <div className="glass-panel p-10 flex flex-col items-center text-center gap-8 bg-white/[0.02] border-white/10 shadow-2xl rounded-[2.5rem]">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/20">
              <Briefcase size={32} />
            </div>
            <div>
              <p className="text-white font-black text-3xl mb-3 tracking-tighter uppercase">{project.tags?.[0] || 'Deployment'}</p>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Core Technology Zone</p>
            </div>
          </div>
          
          <a 
            href={project.link || '#'} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-full bg-white text-black py-6 rounded-2xl font-black text-[12px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
          >
            訪問實體資源 <ExternalLink size={18} />
          </a>
        </aside>
      </div>
      
      <footer className="py-20 text-center opacity-20 border-t border-white/5">
        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white">End of Project File</p>
      </footer>
    </motion.div>
  );
};

export default ProjectDetailPage;
