import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ProjectsAPI } from '../services/apiClient';
import { SEOMeta, BreadcrumbSchema } from '../lib/seo';
import BlurText from '../components/BlurText';
import {
  ArrowLeft, ExternalLink, Briefcase, Loader2, Smartphone, Monitor, Check, Copy, Zap,
} from 'lucide-react';

const blurIn = {
  initial: { filter: 'blur(10px)', opacity: 0, y: 20 },
  animate: { filter: 'blur(0px)', opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: 'easeOut' as const },
};

const PhoneFrame: React.FC<{ src: string; type: 'image' | 'video'; alt: string }> = ({
  src,
  type,
  alt,
}) => (
  <div className="perspective-1000 group relative mx-auto aspect-[9/19.5] w-full max-w-[280px] select-none">
    <motion.div
      whileHover={{ rotateY: 5, rotateX: 2, scale: 1.02 }}
      className="liquid-glass absolute inset-0 overflow-hidden rounded-[3.5rem] border-[6px] border-white/10 bg-black sm:border-[8px]"
    >
      <div className="absolute top-0 left-1/2 z-30 h-5 w-20 -translate-x-1/2 rounded-b-2xl bg-black sm:h-7 sm:w-24" />
      <div className="absolute inset-0 z-10 overflow-hidden rounded-[2.5rem] bg-black sm:rounded-[2.8rem]">
        {type === 'video' ? (
          <video src={src} className="h-full w-full object-cover" autoPlay muted loop playsInline />
        ) : (
          <img src={src} className="h-full w-full object-cover" alt={alt} loading="lazy" />
        )}
      </div>
    </motion.div>
    <div className="liquid-glass absolute -right-4 -bottom-4 flex h-12 w-12 items-center justify-center rounded-2xl text-white/50">
      <Smartphone size={20} />
    </div>
  </div>
);

const DesktopFrame: React.FC<{ src: string; type: 'image' | 'video'; alt: string }> = ({
  src,
  type,
  alt,
}) => (
  <div className="perspective-1000 group relative mx-auto mb-16 flex w-full max-w-[1000px] flex-col items-center px-2 sm:mb-24 sm:px-4">
    <motion.div
      whileHover={{ rotateX: 1, scale: 1.01 }}
      className="liquid-glass relative aspect-[16/10] w-full overflow-hidden rounded-[1.5rem] border-[6px] border-white/10 bg-black sm:rounded-[2.5rem] sm:border-[12px]"
    >
      <div className="absolute inset-x-0 top-0 z-20 flex h-6 items-center gap-2 bg-black/50 px-4 backdrop-blur-md sm:h-8 sm:px-6">
        <div className="flex gap-1">
          <div className="h-2 w-2 rounded-full bg-[#ff5f56]" />
          <div className="h-2 w-2 rounded-full bg-[#ffbd2e]" />
          <div className="h-2 w-2 rounded-full bg-[#27c93f]" />
        </div>
      </div>
      <div className="absolute inset-0 z-10 overflow-hidden bg-black">
        {type === 'video' ? (
          <video
            src={src}
            className="h-full w-full object-cover object-top"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <img
            src={src}
            className="h-full w-full object-cover object-top"
            alt={alt}
            loading="lazy"
          />
        )}
      </div>
    </motion.div>
    <div className="h-8 w-32 rounded-b-[1.5rem] border-t border-white/5 bg-gradient-to-b from-white/10 to-black -mt-1 sm:h-12 sm:w-48 sm:rounded-b-[2rem]" />
    <div className="liquid-glass absolute -top-4 -right-4 flex h-12 w-12 items-center justify-center rounded-2xl text-white/50 sm:h-16 sm:w-16 sm:rounded-3xl">
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

  const highlightCode = (code: string) => {
    const lines = code.trim().split('\n');
    return lines.map((line, idx) => {
      const tokens = [
        { regex: /#.*$|\/\/.*$/g, cls: 'text-white/35 italic' },
        { regex: /(['"])(?:(?!\1|\\).|\\.)*\1/g, cls: 'text-emerald-300/90' },
        {
          regex:
            /\b(sudo|apt|install|systemctl|mkdir|cd|rm|cp|mv|echo|grep|sed|awk|export|ssh|ip|ls|cat|nano|vi|vim|docker|git|pve|qm|pct|ufw|netplan|nmcli|ping|curl|wget)\b/g,
          cls: 'text-rose-300/90 font-medium',
        },
        { regex: /\b-{1,2}[a-zA-Z0-9-]+\b/g, cls: 'text-white/70' },
        { regex: /\$[A-Z_a-z0-9]+/g, cls: 'text-sky-300/90' },
        { regex: /\b\d+\b/g, cls: 'text-amber-300/90' },
        { regex: /[|&><!]+/g, cls: 'text-white/30' },
      ];

      let pos = 0;
      let highlighted = '';
      while (pos < line.length) {
        let nearestMatch: RegExpExecArray | null = null;
        let nearestToken: (typeof tokens)[number] | null = null;
        for (const token of tokens) {
          token.regex.lastIndex = pos;
          const match = token.regex.exec(line);
          if (match && (nearestMatch === null || match.index < nearestMatch.index)) {
            nearestMatch = match;
            nearestToken = token;
          }
        }
        if (nearestMatch && nearestMatch.index === pos && nearestToken) {
          highlighted += `<span class="${nearestToken.cls}">${nearestMatch[0]}</span>`;
          pos += nearestMatch[0].length;
        } else {
          highlighted += line[pos];
          pos++;
        }
      }

      return (
        <div key={idx} className="group/line flex gap-4 py-0.5 sm:gap-6">
          <span className="w-8 select-none pt-1.5 text-right font-mono text-[10px] text-white/20 sm:w-10 sm:text-xs">
            {idx + 1}
          </span>
          <span
            className="flex-1 font-mono whitespace-pre transition-colors group-hover/line:text-white/90"
            dangerouslySetInnerHTML={{ __html: highlighted || line }}
          />
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
        return (
          <strong key={i} className="font-medium text-white">
            {part.slice(2, -2)}
          </strong>
        );
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
          <div key={i} className="liquid-glass-strong my-12 overflow-hidden rounded-[1.25rem] sm:my-16">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 sm:px-8 sm:py-5">
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
                </div>
                <span className="hidden font-body text-[10px] font-medium uppercase tracking-widest text-white/40 sm:block">
                  {lang}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(code)}
                className="liquid-glass flex items-center gap-2 rounded-full px-4 py-2 font-body text-[10px] font-medium uppercase tracking-widest text-white/60 transition hover:text-white"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Done' : 'Copy'}
              </button>
            </div>
            <div className="custom-scrollbar overflow-x-auto p-6 font-mono text-xs leading-loose text-white/80 sm:p-10 sm:text-[0.95rem]">
              {highlightCode(code)}
            </div>
          </div>
        );
      }

      return part.split('\n').map((line, j) => {
        const trimmed = line.trim();
        if (trimmed === '') return <div key={`${i}-${j}`} className="h-6 sm:h-8" />;

        if (trimmed.match(/^!\[.*\]\(.*\)/)) {
          const match = trimmed.match(/^!\[(.*)\]\((.*?)(?:\s+"(.*)")?\)/);
          if (match) {
            const alt = match[1] || '';
            const src = match[2] || '';
            const caption = match[3] || alt;
            return (
              <figure key={`${i}-${j}`} className="my-12 sm:my-16">
                <div className="liquid-glass overflow-hidden rounded-[1.25rem]">
                  <img src={src} alt={alt} className="w-full object-cover" loading="lazy" />
                </div>
                {caption && (
                  <figcaption className="mt-4 text-center font-body text-sm font-light text-white/50">
                    {caption}
                  </figcaption>
                )}
              </figure>
            );
          }
        }

        if (trimmed.match(/^##\s+/)) {
          return (
            <h2
              key={`${i}-${j}`}
              className="mt-20 mb-8 font-heading italic text-3xl tracking-[-1px] text-white sm:text-4xl"
            >
              {processText(trimmed.replace(/^##\s+/, ''))}
            </h2>
          );
        }
        if (trimmed.match(/^###\s+/)) {
          return (
            <h3
              key={`${i}-${j}`}
              className="mt-12 mb-6 flex items-center gap-3 font-heading italic text-xl tracking-tight text-white sm:text-2xl"
            >
              <Zap size={18} className="text-white/50" />
              {processText(trimmed.replace(/^###\s+/, ''))}
            </h3>
          );
        }

        if (trimmed.match(/^[>*+-]\s+/)) {
          return (
            <div key={`${i}-${j}`} className="mb-5 flex items-start gap-4 pl-2 sm:gap-6">
              <div className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/40" />
              <p className="font-body text-base font-light leading-relaxed text-white/75 sm:text-lg">
                {processText(trimmed.replace(/^[>*+-]\s+/, ''))}
              </p>
            </div>
          );
        }

        return (
          <p
            key={`${i}-${j}`}
            className="mb-6 font-body text-base font-light leading-relaxed text-white/75 sm:text-lg"
          >
            {processText(trimmed)}
          </p>
        );
      });
    });
  };

  if (loading) {
    return (
      <>
        <SEOMeta title="載入中⋯" description="正在讀取專案內容⋯" path={`/portfolio/${id}`} />
        <div className="blog-cinematic flex min-h-screen items-center justify-center bg-black">
          <div className="flex flex-col items-center gap-6">
            <div className="liquid-glass flex h-16 w-16 items-center justify-center rounded-full">
              <Loader2 className="animate-spin text-white/50" size={24} />
            </div>
            <span className="font-body text-sm font-light text-white/40">Syncing node…</span>
          </div>
        </div>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <SEOMeta title="專案不存在" description="該維運專案不存在或已被移除。" path={`/portfolio/${id}`} noindex />
        <div className="blog-cinematic flex min-h-screen items-center justify-center bg-black px-6 text-center">
          <div className="liquid-glass max-w-md rounded-[1.25rem] p-10">
            <h2 className="mb-6 font-heading italic text-3xl text-white">Project Offline</h2>
            <Link
              to="/portfolio"
              className="liquid-glass-strong inline-flex items-center gap-2 rounded-full px-6 py-3 font-body text-sm font-medium text-white"
            >
              <ArrowLeft size={16} /> 返回主目錄
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOMeta
        title={project.title}
        description={project.description}
        path={`/portfolio/${id}`}
        ogImage={project.image}
        keywords={project.tags?.join(', ')}
      />
      <BreadcrumbSchema
        items={[
          { name: '首頁', path: '/' },
          { name: '維運實績', path: '/portfolio' },
          { name: project.title, path: `/portfolio/${id}` },
        ]}
      />

      <div className="blog-cinematic project-detail-wrapper min-h-screen overflow-x-hidden bg-black selection:bg-white selection:text-black">
        <section className="relative flex h-[60vh] w-full flex-col justify-end overflow-hidden sm:h-[75vh]">
          <motion.img
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.55 }}
            transition={{ duration: 1.4 }}
            src={project.image}
            className="absolute inset-0 h-full w-full object-cover"
            alt={project.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />

          <Link
            to="/portfolio"
            className="liquid-glass fixed top-28 left-6 z-[110] flex items-center gap-2 rounded-full px-5 py-3 font-body text-[12px] font-medium text-white transition hover:text-white sm:left-10"
          >
            <ArrowLeft size={16} /> 返回
          </Link>

          <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-14 lg:px-16">
            <motion.div {...blurIn} transition={{ ...blurIn.transition, delay: 0.2 }}>
              <div className="mb-4 max-w-5xl">
                <BlurText
                  text={project.title}
                  align="start"
                  className="font-heading italic text-[clamp(1.75rem,5.5vw,3.75rem)] leading-[0.95] tracking-[-2px] text-white"
                  delay={0.15}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {project.tags?.map((tag: string) => (
                  <span
                    key={tag}
                    className="liquid-glass rounded-full px-3 py-1.5 font-body text-[11px] font-medium text-white/90"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-16 lg:grid-cols-12 lg:gap-16 lg:px-16 lg:py-24">
          <div className="lg:col-span-8">
            <article>
              <p className="mb-12 max-w-3xl border-l border-white/20 pl-6 font-body text-lg font-light leading-relaxed text-white/80 italic sm:text-xl">
                {project.description}
              </p>
              <div>{renderMarkdown(project.details || project.description || '暫無細節資料。')}</div>
            </article>

            {project.media && project.media.length > 0 && (
              <section className="mt-24 space-y-16">
                <div>
                  <p className="mb-3 font-body text-sm text-white/50">// Capture</p>
                  <h3 className="font-heading italic text-3xl tracking-[-1px] text-white sm:text-4xl">
                    實錄資產
                  </h3>
                </div>
                <div className="grid grid-cols-1 items-start gap-y-16 md:grid-cols-2 xl:grid-cols-3">
                  {project.media.map((m: any, idx: number) => (
                    <div
                      key={idx}
                      className={m.frame === 'desktop' ? 'md:col-span-2 xl:col-span-3' : 'col-span-1'}
                    >
                      {m.frame === 'phone' ? (
                        <PhoneFrame
                          src={m.url}
                          type={m.type}
                          alt={`${project.title} 手機畫面截圖 ${idx + 1}`}
                        />
                      ) : m.frame === 'desktop' ? (
                        <DesktopFrame
                          src={m.url}
                          type={m.type}
                          alt={`${project.title} 桌面畫面截圖 ${idx + 1}`}
                        />
                      ) : (
                        <div className="liquid-glass relative aspect-video overflow-hidden rounded-[1.25rem] bg-black">
                          {m.type === 'video' ? (
                            <video
                              src={m.url}
                              className="h-full w-full object-cover"
                              autoPlay
                              muted
                              loop
                              playsInline
                            />
                          ) : (
                            <img
                              src={m.url}
                              className="h-full w-full object-cover"
                              alt={`${project.title} 系統截圖 ${idx + 1}`}
                              loading="lazy"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="h-fit space-y-5 lg:sticky lg:top-32 lg:col-span-4">
            <div className="liquid-glass flex flex-col items-center gap-6 rounded-[1.25rem] p-8 text-center">
              <div className="liquid-glass flex h-14 w-14 items-center justify-center rounded-[0.85rem] text-white/50">
                <Briefcase size={26} />
              </div>
              <div>
                <p className="font-heading italic text-3xl tracking-tight text-white">
                  {project.tags?.[0] || 'Deployment'}
                </p>
                <p className="mt-2 font-body text-[11px] font-medium uppercase tracking-[0.25em] text-white/40">
                  Core Technology
                </p>
              </div>
            </div>

            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="liquid-glass-strong flex w-full items-center justify-center gap-3 rounded-full py-4 font-body text-sm font-medium text-white transition hover:scale-[1.01] active:scale-[0.98]"
              >
                訪問實體資源 <ExternalLink size={16} />
              </a>
            )}
          </aside>
        </div>

        <footer className="border-t border-white/10 py-16 text-center">
          <p className="font-heading italic text-xl text-white/30">End of Project File</p>
        </footer>
      </div>
    </>
  );
};

export default ProjectDetailPage;
