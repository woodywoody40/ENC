import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, Save, Loader2, CheckCircle2,
  Briefcase, GraduationCap, Globe, AtSign, Mail, MapPin,
  User, Link as LinkIcon, ChevronUp, ChevronDown,
  Sparkles, AlertCircle, FileText
} from 'lucide-react';
import { ConfigAPI } from '../services/apiClient';

/* ============================================================
   Types
   ============================================================ */

interface ExperienceItem {
  title: string;
  date: string;
  bullets: string[];
}

interface SkillItem {
  name: string;
  level: string;
}

interface EduItem {
  school: string;
  year: string;
  degree: string;
}

interface LinkItem {
  label: string;
  url: string;
}

interface ResumeData {
  basic: Record<string, string>;
  summary: string;
  experience: ExperienceItem[];
  skills: SkillItem[];
  education: EduItem[];
  extraLinks: LinkItem[];
}

type SaveStatus = 'idle' | 'saving' | 'success';

/* ============================================================
   Parsers / Serializers
   ============================================================ */

function parseExperience(markdown: string): ExperienceItem[] {
  const items: ExperienceItem[] = [];
  const lines = markdown.split('\n').map(l => l.trim()).filter(Boolean);
  let cur: ExperienceItem | null = null;
  for (const line of lines) {
    if (line.startsWith('### ')) {
      if (cur) items.push(cur);
      cur = { title: line.replace('### ', '').trim(), date: '', bullets: [] };
    } else if (line.startsWith('- ') && cur) {
      cur.bullets.push(line.replace('- ', '').trim());
    } else if (cur && !cur.date) {
      cur.date = line.trim();
    }
  }
  if (cur) items.push(cur);
  return items;
}

function serializeExperience(items: ExperienceItem[]): string {
  return items.map(item => {
    const header = `### ${item.title}`;
    const date = item.date;
    const bullets = item.bullets.map(b => `- ${b}`).join('\n');
    return [header, date, bullets].filter(Boolean).join('\n');
  }).join('\n\n');
}

function parseSkills(str: string): SkillItem[] {
  if (!str) return [];
  return str.split(',').map(s => {
    const [name, level] = s.split(':');
    return { name: name?.trim() || '', level: level?.trim() || 'Advanced' };
  }).filter(s => s.name);
}

function serializeSkills(items: SkillItem[]): string {
  return items.map(s => `${s.name}:${s.level}`).join(', ');
}

function parseJSONArray<T>(str: string): T[] {
  if (!str) return [];
  try { return JSON.parse(str); } catch { return []; }
}

function serializeJSONArray(items: any[]): string {
  return JSON.stringify(items);
}

/* ============================================================
   Skill Level Options
   ============================================================ */

const SKILL_LEVELS = ['Expert', 'Advanced', 'Certified'];

/* ============================================================
   ResumeEditor Component
   ============================================================ */

interface ResumeEditorProps {
  siteConfigs: { key: string; value: string }[];
  addToast: (type: 'success' | 'error' | 'info', message: string) => void;
  onSaved: () => void;
}

const ResumeEditor: React.FC<ResumeEditorProps> = ({ siteConfigs, addToast, onSaved }) => {
  const [data, setData] = useState<ResumeData | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [dirty, setDirty] = useState(false);

  // ─── Init: parse configs into structured data ────────────
  useEffect(() => {
    const cfg = (key: string) => siteConfigs.find(c => c.key === key)?.value || '';
    setData({
      basic: {
        name: cfg('resume_name'),
        title: cfg('resume_title'),
        email: cfg('resume_email'),
        location: cfg('resume_location'),
        github: cfg('resume_github'),
        linkedin: cfg('resume_linkedin'),
      },
      summary: cfg('resume_summary'),
      experience: parseExperience(cfg('resume_experience')),
      skills: parseSkills(cfg('resume_skills')),
      education: parseJSONArray<EduItem>(cfg('resume_education_list')),
      extraLinks: parseJSONArray<LinkItem>(cfg('resume_extra_links')),
    });
    setDirty(false);
  }, [siteConfigs]);

  // ─── Mark dirty on any change ────────────────────────────
  const markDirty = useCallback(() => setDirty(true), []);

  // ─── Basic info updater ──────────────────────────────────
  const updateBasic = (field: string, value: string) => {
    setData(prev => prev ? { ...prev, basic: { ...prev.basic, [field]: value } } : prev);
    markDirty();
  };

  // ─── Summary ─────────────────────────────────────────────
  const updateSummary = (value: string) => {
    setData(prev => prev ? { ...prev, summary: value } : prev);
    markDirty();
  };

  // ─── Experience ──────────────────────────────────────────
  const addExperience = () => {
    setData(prev => prev ? {
      ...prev,
      experience: [...prev.experience, { title: '', date: '', bullets: [] }]
    } : prev);
    markDirty();
  };

  const updateExperience = (idx: number, field: string, value: string) => {
    setData(prev => {
      if (!prev) return prev;
      const exp = [...prev.experience];
      exp[idx] = { ...exp[idx], [field]: value };
      return { ...prev, experience: exp };
    });
    markDirty();
  };

  const removeExperience = (idx: number) => {
    setData(prev => prev ? {
      ...prev,
      experience: prev.experience.filter((_, i) => i !== idx)
    } : prev);
    markDirty();
  };

  const moveExperience = (idx: number, dir: -1 | 1) => {
    setData(prev => {
      if (!prev) return prev;
      const exp = [...prev.experience];
      const target = idx + dir;
      if (target < 0 || target >= exp.length) return prev;
      [exp[idx], exp[target]] = [exp[target], exp[idx]];
      return { ...prev, experience: exp };
    });
    setDirty(true);
  };

  // ─── Experience Bullets ──────────────────────────────────
  const addBullet = (expIdx: number) => {
    setData(prev => {
      if (!prev) return prev;
      const exp = [...prev.experience];
      exp[expIdx] = { ...exp[expIdx], bullets: [...exp[expIdx].bullets, ''] };
      return { ...prev, experience: exp };
    });
    markDirty();
  };

  const updateBullet = (expIdx: number, bIdx: number, value: string) => {
    setData(prev => {
      if (!prev) return prev;
      const exp = [...prev.experience];
      const bullets = [...exp[expIdx].bullets];
      bullets[bIdx] = value;
      exp[expIdx] = { ...exp[expIdx], bullets };
      return { ...prev, experience: exp };
    });
    markDirty();
  };

  const removeBullet = (expIdx: number, bIdx: number) => {
    setData(prev => {
      if (!prev) return prev;
      const exp = [...prev.experience];
      exp[expIdx] = {
        ...exp[expIdx],
        bullets: exp[expIdx].bullets.filter((_, i) => i !== bIdx)
      };
      return { ...prev, experience: exp };
    });
    markDirty();
  };

  // ─── Skills ──────────────────────────────────────────────
  const addSkill = () => {
    setData(prev => prev ? {
      ...prev,
      skills: [...prev.skills, { name: '', level: 'Advanced' }]
    } : prev);
    markDirty();
  };

  const updateSkill = (idx: number, field: string, value: string) => {
    setData(prev => {
      if (!prev) return prev;
      const skills = [...prev.skills];
      skills[idx] = { ...skills[idx], [field]: value };
      return { ...prev, skills };
    });
    markDirty();
  };

  const removeSkill = (idx: number) => {
    setData(prev => prev ? {
      ...prev,
      skills: prev.skills.filter((_, i) => i !== idx)
    } : prev);
    markDirty();
  };

  // ─── Education ───────────────────────────────────────────
  const addEducation = () => {
    setData(prev => prev ? {
      ...prev,
      education: [...prev.education, { school: '', year: '', degree: '' }]
    } : prev);
    markDirty();
  };

  const updateEducation = (idx: number, field: string, value: string) => {
    setData(prev => {
      if (!prev) return prev;
      const edu = [...prev.education];
      edu[idx] = { ...edu[idx], [field]: value };
      return { ...prev, education: edu };
    });
    markDirty();
  };

  const removeEducation = (idx: number) => {
    setData(prev => prev ? {
      ...prev,
      education: prev.education.filter((_, i) => i !== idx)
    } : prev);
    markDirty();
  };

  // ─── Extra Links ─────────────────────────────────────────
  const addLink = () => {
    setData(prev => prev ? {
      ...prev,
      extraLinks: [...prev.extraLinks, { label: '', url: '' }]
    } : prev);
    markDirty();
  };

  const updateLink = (idx: number, field: string, value: string) => {
    setData(prev => {
      if (!prev) return prev;
      const links = [...prev.extraLinks];
      links[idx] = { ...links[idx], [field]: value };
      return { ...prev, extraLinks: links };
    });
    markDirty();
  };

  const removeLink = (idx: number) => {
    setData(prev => prev ? {
      ...prev,
      extraLinks: prev.extraLinks.filter((_, i) => i !== idx)
    } : prev);
    markDirty();
  };

  // ─── Save All ────────────────────────────────────────────
  const handleSave = async () => {
    if (!data || saveStatus === 'saving') return;
    setSaveStatus('saving');
    try {
      const educationMarkdown = data.education
        .filter(e => e.school || e.degree)
        .map(e => `### ${e.school}\n${e.year}\n${e.degree}`)
        .join('\n\n');

      const updates: Record<string, string> = {
        resume_name: data.basic.name,
        resume_title: data.basic.title,
        resume_email: data.basic.email,
        resume_location: data.basic.location,
        resume_github: data.basic.github,
        resume_linkedin: data.basic.linkedin,
        resume_summary: data.summary,
        resume_experience: serializeExperience(data.experience),
        resume_skills: serializeSkills(data.skills),
        resume_education_list: serializeJSONArray(data.education),
        resume_education: educationMarkdown,
        resume_extra_links: serializeJSONArray(data.extraLinks),
      };
      for (const [key, value] of Object.entries(updates)) {
        await ConfigAPI.set(key, value);
      }
      setSaveStatus('success');
      setDirty(false);
      addToast('success', '履歷資料已全部儲存');
      setTimeout(() => { setSaveStatus('idle'); onSaved(); }, 1200);
    } catch (err: any) {
      setSaveStatus('idle');
      addToast('error', `儲存失敗: ${err?.message || err}`);
    }
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="animate-spin text-white/30" size={32} />
      </div>
    );
  }

  // ─── Reusable section wrapper ────────────────────────────
  const SectionCard = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all">
      <div className="px-5 py-3.5 border-b border-white/[0.04] flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <span className="text-sm font-semibold text-white/85 tracking-tight">{title}</span>
      </div>
      <div className="p-5 space-y-4">
        {children}
      </div>
    </div>
  );

  // ─── Reusable icon badge ─────────────────────────────────
  const IconBadge = ({ children, color }: { children: React.ReactNode; color?: string }) => (
    <span className={`text-${color || 'white/60'} shrink-0 flex items-center`}>{children}</span>
  );

  // ─── Small action button ─────────────────────────────────
  const SmBtn = ({ onClick, icon, title, danger }: { onClick: () => void; icon: React.ReactNode; title?: string; danger?: boolean }) => (
    <button
      onClick={onClick}
      title={title}
      className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all ${
        danger
          ? 'text-rose-400/50 hover:text-rose-300 hover:bg-rose-500/15'
          : 'text-white/40 hover:text-white/70 hover:bg-white/10'
      }`}
    >
      {icon}
    </button>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-4">

      {/* ── Sticky Save Toolbar ── */}
      <div className={`sticky top-24 z-40 rounded-2xl px-5 py-3.5 flex items-center justify-between transition-all duration-300 ${
        dirty
          ? 'bg-gradient-to-r from-amber-500/20 via-amber-500/8 to-transparent border border-amber-500/30 shadow-[0_0_30px_-8px_rgba(251,191,36,0.2)]'
          : 'bg-white/[0.05] border border-white/10'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
            dirty ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]' : 'bg-white/20'
          }`} />
          <div>
            <h2 className="text-sm font-semibold text-white tracking-tight">履歷編輯器</h2>
            <p className="text-[9px] font-semibold text-white/45 tracking-wider mt-0.5">
              {dirty ? '有未儲存的變更' : '所有資料已儲存'}
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={!dirty || saveStatus === 'saving'}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-[11px] font-semibold uppercase tracking-wider transition-all duration-200 ${
            !dirty
              ? 'bg-white/[0.05] text-white/30 cursor-not-allowed'
              : saveStatus === 'saving'
              ? 'bg-blue-500/20 text-blue-300'
              : 'bg-white text-black hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/10'
          }`}
        >
          {saveStatus === 'saving' ? <Loader2 size={15} className="animate-spin" /> : saveStatus === 'success' ? <CheckCircle2 size={15} /> : <Save size={15} />}
          {saveStatus === 'saving' ? '儲存中...' : saveStatus === 'success' ? '已儲存' : '儲存全部'}
        </button>
      </div>

      {/* ── Section: 基本資訊 ── */}
      <SectionCard title="基本資訊" icon={<User size={15} className="text-blue-400" />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { field: 'name', label: '姓名', icon: <AtSign size={13} />, placeholder: '你的姓名' },
            { field: 'title', label: '職稱', icon: <Briefcase size={13} />, placeholder: '系統維運工程師' },
            { field: 'email', label: 'Email', icon: <Mail size={13} />, placeholder: 'example@mail.com' },
            { field: 'location', label: '所在地', icon: <MapPin size={13} />, placeholder: '基隆, Taiwan' },
            { field: 'github', label: 'GitHub', icon: <Globe size={13} />, placeholder: 'https://github.com/...' },
            { field: 'linkedin', label: 'LinkedIn', icon: <LinkIcon size={13} />, placeholder: 'https://linkedin.com/...' },
          ].map(({ field, label, icon, placeholder }) => (
            <div key={field} className="bg-white/[0.03] border border-white/10 rounded-xl p-3.5 space-y-2 hover:border-white/20 transition-all">
              <div className="flex items-center gap-2">
                <span className="text-white/60">{icon}</span>
                <span className="text-[8px] font-semibold text-white/80 uppercase tracking-[0.15em]">{label}</span>
              </div>
              <input
                value={data.basic[field] || ''}
                onChange={e => updateBasic(field, e.target.value)}
                placeholder={placeholder}
                className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500/40 focus:bg-black/80 transition-all placeholder:text-white/20"
              />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ── Section: 專業總結 ── */}
      <SectionCard title="專業總結" icon={<Sparkles size={15} className="text-amber-400" />}>
        <textarea
          value={data.summary}
          onChange={e => updateSummary(e.target.value)}
          placeholder="請輸入專業總結..."
          className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-sm text-white outline-none focus:border-white/30 focus:bg-black/60 transition-all placeholder:text-white/20 leading-relaxed resize-y h-[120px]"
        />
        <p className="text-[9px] text-white/30 font-medium tracking-wider">
          一段簡潔的專業自我介紹，將會顯示在履歷頂部
        </p>
      </SectionCard>

      {/* ── Section: 工作經歷 ── */}
      <SectionCard title="工作經歷" icon={<Briefcase size={15} className="text-emerald-400" />}>
        <AnimatePresence mode="popLayout">
          {data.experience.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-white/30 text-[10px] font-semibold uppercase tracking-[0.2em]"
            >
              尚無經歷資料 — 點下方按鈕新增
            </motion.div>
          )}
          {data.experience.map((exp, idx) => (
            <motion.div
              key={`exp-${idx}`}
              layout
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="bg-white/[0.04] border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all space-y-3"
            >
              {/* Experience Header Row */}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Briefcase size={12} className="text-emerald-400" />
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    value={exp.title}
                    onChange={e => updateExperience(idx, 'title', e.target.value)}
                    placeholder="職稱 | 公司名"
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/40 transition-all placeholder:text-white/20"
                  />
                  <input
                    value={exp.date}
                    onChange={e => updateExperience(idx, 'date', e.target.value)}
                    placeholder="2022 - Present"
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/40 transition-all placeholder:text-white/20"
                  />
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                  <SmBtn onClick={() => moveExperience(idx, -1)} icon={<ChevronUp size={14} />} title="上移" />
                  <SmBtn onClick={() => moveExperience(idx, 1)} icon={<ChevronDown size={14} />} title="下移" />
                  <SmBtn onClick={() => removeExperience(idx)} icon={<Trash2 size={14} />} title="刪除此經歷" danger />
                </div>
              </div>

              {/* Bullets */}
              <div className="space-y-1.5 pl-9">
                {exp.bullets.map((bullet, bIdx) => (
                  <div key={`b-${idx}-${bIdx}`} className="flex items-center gap-2 group/bullet">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/40 shrink-0" />
                    <input
                      value={bullet}
                      onChange={e => updateBullet(idx, bIdx, e.target.value)}
                      placeholder="輸入工作內容..."
                      className="flex-1 bg-transparent border-b border-white/[0.06] px-2 py-1.5 text-sm text-white/80 outline-none focus:border-emerald-500/30 transition-all placeholder:text-white/20"
                    />
                    <SmBtn
                      onClick={() => removeBullet(idx, bIdx)}
                      icon={<Trash2 size={11} />}
                      danger
                    />
                  </div>
                ))}
                <button
                  onClick={() => addBullet(idx)}
                  className="flex items-center gap-2 text-[9px] font-semibold text-white/30 hover:text-emerald-400/70 uppercase tracking-wider transition-all py-1.5"
                >
                  <Plus size={11} /> 新增項目
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <button
          onClick={addExperience}
          className="w-full py-3 border border-dashed border-white/10 rounded-xl text-white/30 hover:text-emerald-400/70 hover:border-emerald-500/30 transition-all text-[10px] font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <Plus size={14} /> 新增經歷
        </button>
      </SectionCard>

      {/* ── Section: 核心技能 ── */}
      <SectionCard title="核心技能" icon={<FileText size={15} className="text-violet-400" />}>
        <AnimatePresence mode="popLayout">
          {data.skills.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-white/30 text-[10px] font-semibold uppercase tracking-[0.2em]"
            >
              尚無技能資料 — 點下方按鈕新增
            </motion.div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.skills.map((skill, idx) => (
              <motion.div
                key={`sk-${idx}`}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                className="bg-white/[0.04] border border-white/10 rounded-xl p-3.5 hover:border-white/20 transition-all"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[8px] font-semibold text-white/50 uppercase tracking-[0.15em]">#{idx + 1}</span>
                  <SmBtn onClick={() => removeSkill(idx)} icon={<Trash2 size={12} />} danger />
                </div>
                <div className="space-y-2">
                  <input
                    value={skill.name}
                    onChange={e => updateSkill(idx, 'name', e.target.value)}
                    placeholder="技能名稱"
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-violet-500/40 transition-all placeholder:text-white/20"
                  />
                  <select
                    value={skill.level}
                    onChange={e => updateSkill(idx, 'level', e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-violet-500/40 transition-all appearance-none cursor-pointer"
                  >
                    {SKILL_LEVELS.map(lvl => (
                      <option key={lvl} value={lvl} className="bg-[#0a0b10]">{lvl}</option>
                    ))}
                  </select>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
        <button
          onClick={addSkill}
          className="w-full py-3 border border-dashed border-white/10 rounded-xl text-white/30 hover:text-violet-400/70 hover:border-violet-500/30 transition-all text-[10px] font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <Plus size={14} /> 新增技能
        </button>
      </SectionCard>

      {/* ── Section: 學歷經歷 ── */}
      <SectionCard title="學歷經歷" icon={<GraduationCap size={15} className="text-sky-400" />}>
        <AnimatePresence mode="popLayout">
          {data.education.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-white/30 text-[10px] font-semibold uppercase tracking-[0.2em]"
            >
              尚無學歷資料 — 點下方按鈕新增
            </motion.div>
          )}
          {data.education.map((edu, idx) => (
            <motion.div
              key={`edu-${idx}`}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white/[0.04] border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                    <GraduationCap size={11} className="text-sky-400" />
                  </div>
                  <span className="text-[8px] font-semibold text-white/50 uppercase tracking-[0.15em]">#{idx + 1}</span>
                </div>
                <SmBtn onClick={() => removeEducation(idx)} icon={<Trash2 size={12} />} danger />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  value={edu.school}
                  onChange={e => updateEducation(idx, 'school', e.target.value)}
                  placeholder="學校名稱"
                  className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-sky-500/40 transition-all placeholder:text-white/20"
                />
                <input
                  value={edu.year}
                  onChange={e => updateEducation(idx, 'year', e.target.value)}
                  placeholder="2024 - Present"
                  className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-sky-500/40 transition-all placeholder:text-white/20"
                />
                <input
                  value={edu.degree}
                  onChange={e => updateEducation(idx, 'degree', e.target.value)}
                  placeholder="資工系碩士專班"
                  className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-sky-500/40 transition-all placeholder:text-white/20"
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <button
          onClick={addEducation}
          className="w-full py-3 border border-dashed border-white/10 rounded-xl text-white/30 hover:text-sky-400/70 hover:border-sky-500/30 transition-all text-[10px] font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <Plus size={14} /> 新增學歷
        </button>
      </SectionCard>

      {/* ── Section: 額外連結 ── */}
      <SectionCard title="額外連結" icon={<LinkIcon size={15} className="text-rose-400" />}>
        <AnimatePresence mode="popLayout">
          {data.extraLinks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-white/30 text-[10px] font-semibold uppercase tracking-[0.2em]"
            >
              尚無額外連結 — 點下方按鈕新增
            </motion.div>
          )}
          {data.extraLinks.map((link, idx) => (
            <motion.div
              key={`lnk-${idx}`}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white/[0.04] border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                    <Globe size={11} className="text-rose-400" />
                  </div>
                  <span className="text-[8px] font-semibold text-white/50 uppercase tracking-[0.15em]">#{idx + 1}</span>
                </div>
                <SmBtn onClick={() => removeLink(idx)} icon={<Trash2 size={12} />} danger />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  value={link.label}
                  onChange={e => updateLink(idx, 'label', e.target.value)}
                  placeholder="顯示名稱"
                  className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-rose-500/40 transition-all placeholder:text-white/20"
                />
                <input
                  value={link.url}
                  onChange={e => updateLink(idx, 'url', e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-rose-500/40 transition-all placeholder:text-white/20"
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <button
          onClick={addLink}
          className="w-full py-3 border border-dashed border-white/10 rounded-xl text-white/30 hover:text-rose-400/70 hover:border-rose-500/30 transition-all text-[10px] font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <Plus size={14} /> 新增連結
        </button>
      </SectionCard>

    </div>
  );
};

export default ResumeEditor;
