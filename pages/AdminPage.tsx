
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, Briefcase, Plus, Trash2, Edit3,
  Activity, LogOut, Loader2, X, Save,
  Lock, Image as ImageIcon, CheckCircle2,
  Upload, Settings, PlusCircle,
  Bold, Heading2, Heading3, List, Code, Link as LinkIcon, Minus, Type, Info,
  Zap, Sparkles, Search, ChevronDown,
  Globe, Mail, MapPin, User, AtSign, AlertCircle, Eye, AlertTriangle,
  FileText, GraduationCap
} from 'lucide-react';
import { Card } from '@astryxdesign/core/Card';
import { Section } from '@astryxdesign/core/Section';
import { HStack, VStack, StackItem } from '@astryxdesign/core/Stack';
import { Text, Heading } from '@astryxdesign/core/Text';
import { ProjectsAPI, BlogAPI, ConfigAPI, AuthAPI, uploadFile } from '../services/apiClient';
import { SEOMeta } from '../lib/seo';
import ResumeEditor from '../components/ResumeEditor';
import { generateContentFromPrompt, rewriteTechnicalContent } from '../services/geminiService';

/*
 * AdminPage — 管理後台 (UX/UI Redesign v2)
 * Top-navigation layout, accordion-style config, toast feedback,
 * search filtering, dirty tracking, and cleaner modal editor.
 */

// ─── Types ────────────────────────────────────────────
type TabKey = 'dashboard' | 'projects' | 'blog' | 'site_config' | 'resume_editor';
type SaveStatusExt = 'idle' | 'saving' | 'success';
interface Toast { id: number; type: 'success' | 'error' | 'info'; message: string; }

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authChecking, setAuthChecking] = useState(true);

  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatusExt>('idle');
  const [isUploading, setIsUploading] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  const [projects, setProjects] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [siteConfigs, setSiteConfigs] = useState<any[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'project' | 'blog' | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('split');

  // ─── New state for redesign ──────────────────────────
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [configSections, setConfigSections] = useState({
    homepage: false, resume_basic: false, resume_content: false, resume_data: false,
  });
  const [configDirty, setConfigDirty] = useState<Record<string, string>>({});
  const toastId = useRef(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // ─── Toast system ────────────────────────────────────
  const addToast = useCallback((type: Toast['type'], message: string) => {
    const id = ++toastId.current;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  useEffect(() => {
    AuthAPI.me()
      .then((r) => {
        setIsAuthenticated(true);
        setAuthEmail(r.email || '');
        return fetchAllData();
      })
      .catch(() => setIsAuthenticated(false))
      .finally(() => setAuthChecking(false));

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (isModalOpen) handleSaveItem();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [projData, blogData, configMap] = await Promise.all([
        ProjectsAPI.list(),
        BlogAPI.list(),
        ConfigAPI.all(),
      ]);
      setProjects(projData || []);
      setPosts(blogData || []);
      if (configMap) setSiteConfigs(Object.entries(configMap).map(([key, value]) => ({ key, value })));
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    // Cloudflare Access 會攔截 /admin 並自動轉址至 team login portal
    window.location.reload();
  };

  const insertMarkdown = (prefix: string, suffix: string = '') => {
    if (!textareaRef.current) return;
    const { selectionStart, selectionEnd, value } = textareaRef.current;
    const selectedText = value.substring(selectionStart, selectionEnd);
    const before = value.substring(0, selectionStart);
    const after = value.substring(selectionEnd);
    const newValue = `${before}${prefix}${selectedText}${suffix}${after}`;
    
    const field = modalType === 'project' ? 'details' : 'content';
    setEditingItem({ ...editingItem, [field]: newValue });
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(
          selectionStart + prefix.length,
          selectionStart + prefix.length + selectedText.length
        );
      }
    }, 0);
  };

  const handleAiRewrite = async () => {
    const field = modalType === 'project' ? 'details' : 'content';
    const currentContent = editingItem[field];
    if (!currentContent) return;

    setIsAiProcessing(true);
    try {
      const rewritten = await rewriteTechnicalContent(currentContent);
      setEditingItem({ ...editingItem, [field]: rewritten });
      addToast('success', 'AI 改寫完成');
    } catch (err) {
      addToast('error', 'AI 改寫暫時無法連線');
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'cover' | number = 'cover') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const publicUrl = await uploadFile(file);
      if (target === 'cover') {
        setEditingItem({ ...editingItem, image: publicUrl });
        addToast('success', '圖片上傳成功');
      } else {
        const newMedia = [...(editingItem.media || [])];
        newMedia[target] = { ...newMedia[target], url: publicUrl };
        setEditingItem({ ...editingItem, media: newMedia });
      }
    } catch (err: any) {
      addToast('error', err?.message || '上傳失敗');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveItem = async () => {
    if (saveStatus === 'saving') return;
    setSaveStatus('saving');
    try {
      const { created_at, tagsString, ...payload } = editingItem;
      if (modalType === 'project' && tagsString !== undefined) {
        payload.tags = tagsString.split(',').map((t: string) => t.trim()).filter(Boolean);
      }
      const api = modalType === 'project' ? ProjectsAPI : BlogAPI;
      if (editingItem.id) {
        await api.update(editingItem.id, payload);
        addToast('success', '內容已更新');
      } else {
        await api.create(payload);
        addToast('success', '新內容已發佈');
      }

      setSaveStatus('success');
      setTimeout(() => {
        setSaveStatus('idle');
        setIsModalOpen(false);
        fetchAllData();
      }, 1500);
    } catch (err: any) {
      setSaveStatus('idle');
      addToast('error', `儲存失敗: ${err?.message || err}`);
    }
  };

  // ─── Config: dirty tracking + batch save ─────────────
  const handleConfigChange = (key: string, value: string) => {
    setConfigDirty(prev => ({ ...prev, [key]: value }));
  };

  const getConfig = (key: string): string => {
    if (configDirty[key] !== undefined) return configDirty[key];
    return siteConfigs.find(c => c.key === key)?.value || '';
  };

  const handleSaveAllConfig = async () => {
    if (Object.keys(configDirty).length === 0) return;
    setSaveStatus('saving');
    try {
      for (const [key, value] of Object.entries(configDirty)) {
        await ConfigAPI.set(key, value);
        setSiteConfigs(prev => prev.map(c => c.key === key ? { ...c, value } : c));
      }
      setConfigDirty({});
      setSaveStatus('success');
      addToast('success', '所有設定已儲存');
      setTimeout(() => setSaveStatus('idle'), 1500);
    } catch (err: any) {
      setSaveStatus('idle');
      addToast('error', `設定儲存失敗: ${err?.message || err}`);
    }
  };

  const toggleConfigSection = (section: keyof typeof configSections) => {
    setConfigSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleDeleteItem = async (type: 'project' | 'blog', id: string, title: string) => {
    const confirmed = window.confirm(`確定要刪除「${title}」？\n此操作無法復原。`);
    if (!confirmed) return;
    try {
      const api = type === 'project' ? ProjectsAPI : BlogAPI;
      await api.remove(id);
      addToast('success', `已刪除「${title}」`);
      fetchAllData();
    } catch (err: any) {
      addToast('error', `刪除失敗: ${err?.message || err}`);
    }
  };

  const openEditor = (type: 'project' | 'blog', item: any = null) => {
    setModalType(type);
    setSaveStatus('idle');
    let initialItem = item ? { ...item } : (type === 'project' ? { title: '', description: '', image: '', tags: [], details: '', media: [], link: '', type: '1' } : { title: '', content: '', excerpt: '', date: new Date().toISOString().split('T')[0], category: '', image: '' });
    if (type === 'project') {
      initialItem.tagsString = initialItem.tags?.join(', ') || '';
    }
    setEditingItem(initialItem);
    setIsModalOpen(true);
  };

  const addMediaItem = () => {
    const newMedia = [...(editingItem.media || []), { url: '', type: 'image', frame: 'none' }];
    setEditingItem({ ...editingItem, media: newMedia });
  };

  const removeMediaItem = (idx: number) => {
    const newMedia = editingItem.media.filter((_: any, i: number) => i !== idx);
    setEditingItem({ ...editingItem, media: newMedia });
  };

  const renderPreview = (content: string) => {
    if (!content) return <div className="text-white/20 italic p-10">預覽區域...</div>;
    
    return content.split('\n').map((line, i) => {
      const trimmed = line.trim();
      if (trimmed === '') return <div key={i} className="h-6" />;
      
      if (trimmed.startsWith('## ')) {
        return (
          <div key={i} className="flex items-center gap-4 mt-12 mb-8">
            <div className="w-2 h-10 bg-gradient-to-b from-emerald-500 to-emerald-800 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">{trimmed.replace('## ', '')}</h2>
          </div>
        );
      }
      if (trimmed.startsWith('### ')) {
        return (
          <div key={i} className="flex items-center gap-3 mt-10 mb-6">
            <Zap size={20} className="text-emerald-500" />
            <h3 className="text-xl font-black text-white/90 uppercase tracking-widest">{trimmed.replace('### ', '')}</h3>
          </div>
        );
      }
      if (trimmed.startsWith('- ')) {
        return (
          <div key={i} className="flex items-start gap-5 mb-5 pl-4 group">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40 mt-2.5 group-hover:bg-emerald-500 transition-all shrink-0" />
            <p className="text-slate-400 text-lg leading-relaxed font-light">
              {trimmed.replace('- ', '').split(/(\*\*.*?\*\*)/g).map((s, idx) => 
                s.startsWith('**') ? <strong key={idx} className="text-white font-black">{s.slice(2, -2)}</strong> : s
              )}
            </p>
          </div>
        );
      }
      if (trimmed.startsWith('```')) {
        return (
          <div key={i} className="my-10 rounded-3xl overflow-hidden border border-white/5 bg-[#0d1117] shadow-2xl">
            <div className="bg-[#161b22] px-8 py-4 border-b border-white/5 flex items-center justify-between">
               <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                 <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                 <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
               </div>
               <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Code Preview</span>
            </div>
            <div className="p-8 font-mono text-sm text-emerald-400/80 italic leading-loose">
              # Code block content hidden in preview for performance
            </div>
          </div>
        );
      }

      return (
        <p key={i} className="text-slate-400 text-lg leading-loose mb-8 font-light tracking-wide">
          {trimmed.split(/(\*\*.*?\*\*)/g).map((s, idx) => 
            s.startsWith('**') ? <strong key={idx} className="text-white font-black">{s.slice(2, -2)}</strong> : s
          )}
        </p>
      );
    });
  };

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (viewMode !== 'split' || !textareaRef.current || !previewRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = textareaRef.current;
    const ratio = scrollTop / (scrollHeight - clientHeight);
    previewRef.current.scrollTop = ratio * (previewRef.current.scrollHeight - previewRef.current.clientHeight);
  };

  // ─── Filtered lists ───────────────────────────────────
  const filteredProjects = projects.filter(p =>
    !searchQuery || p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tags?.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const filteredPosts = posts.filter(p =>
    !searchQuery || p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ─── Auth gate ────────────────────────────────────────
  if (authChecking) {
    return (
      <>
      <SEOMeta title="管理後台" description="Woody 維運實踐．管理主控台" path="/admin" noindex />
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#050608]">
        <Loader2 className="animate-spin text-white/30" size={48} strokeWidth={1} />
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/50">驗證階段...</span>
      </div>
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
      <SEOMeta title="管理後台 — 認證" description="請登入管理後台。" path="/admin" noindex />
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#050608]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          <div className="bg-black/70 border border-white/15 rounded-3xl p-12 shadow-2xl backdrop-blur-xl">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/15">
              <Lock size={28} className="text-white/60" />
            </div>
            <h2 className="text-2xl font-black text-white mb-4 tracking-tight">管理主控台</h2>
            <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-8 leading-relaxed">
              本區域受 Cloudflare Access 保護<br/>請透過組織 SSO 登入
            </p>
            <button
              onClick={handleLoginRedirect}
              className="w-full bg-white text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
            >
              啟動認證
            </button>
          </div>
        </motion.div>
      </div>
      </>
    );
  }

  // ─── Main render ──────────────────────────────────────
  return (
    <>
    <SEOMeta title="管理後台" description="Woody 維運實踐．網站內容管理系統" path="/admin" noindex />

    {/* Toast Container */}
    <div className="fixed top-6 right-6 z-[999] flex flex-col gap-2.5 pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className={`pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-2xl border text-[11px] font-semibold tracking-wide backdrop-blur-2xl ${
              t.type === 'success' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' :
              t.type === 'error' ? 'bg-rose-500/15 border-rose-500/30 text-rose-300' :
              'bg-blue-500/15 border-blue-500/30 text-blue-300'
            }`}
          >
            <span className={`flex items-center justify-center w-5 h-5 rounded-full ${
              t.type === 'success' ? 'bg-emerald-500/20' : t.type === 'error' ? 'bg-rose-500/20' : 'bg-blue-500/20'
            }`}>
              {t.type === 'success' ? <CheckCircle2 size={12} /> : t.type === 'error' ? <AlertCircle size={12} /> : <Info size={12} />}
            </span>
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>

    <div className="min-h-screen bg-[#050608] relative">
      {/* Subtle background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-blue-500/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-violet-500/[0.03] rounded-full blur-[100px]" />
      </div>
      {/* ===== Top Navigation Bar ===== */}
      <header className="sticky top-0 z-50 bg-[#050608]/95 backdrop-blur-3xl border-b border-white/10 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset]">
        <div className="max-w-[1700px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center shrink-0 border border-white/15">
              <span className="text-[10px] font-black text-white/80">W</span>
            </div>
            <span className="text-sm font-bold text-white tracking-tight whitespace-nowrap">管理後台</span>
            <div className="hidden sm:flex items-center gap-2 ml-2">
              <span className="w-1 h-1 rounded-full bg-emerald-400" />
              <span className="text-[9px] font-semibold text-white/50 uppercase tracking-wider truncate max-w-[140px]">
                {authEmail}
              </span>
            </div>
          </div>

          <nav className="flex items-center bg-white/10 rounded-2xl p-0.5 border border-white/15 shrink-0 relative">
            {([
              { key: 'dashboard' as TabKey, icon: <LayoutDashboard size={14} />, label: '概覽' },
              { key: 'projects' as TabKey, icon: <Briefcase size={14} />, label: '作品' },
              { key: 'blog' as TabKey, icon: <BookOpen size={14} />, label: '文章' },
              { key: 'site_config' as TabKey, icon: <Settings size={14} />, label: '設定' },
            { key: 'resume_editor' as TabKey, icon: <FileText size={14} />, label: '履歷' },
            ]).map(t => (
              <button
                key={t.key}
                onClick={() => { setActiveTab(t.key); setSearchQuery(''); }}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeTab === t.key
                    ? 'text-black'
                    : 'text-white/70 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {activeTab === t.key && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-white rounded-xl shadow-lg shadow-white/20"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {t.icon}
                  <span className="hidden sm:inline">{t.label}</span>
                </span>
              </button>
            ))}
          </nav>

          <button
            onClick={() => { setIsAuthenticated(false); setAuthEmail(''); }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-semibold uppercase text-rose-400/70 hover:text-rose-300 hover:bg-rose-500/15 transition-all shrink-0"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">登出</span>
          </button>
        </div>
      </header>

      {/* ===== Main Content ===== */}
      <main className="max-w-[1700px] mx-auto px-6 py-8">

        {/* ─── DASHBOARD ──────────────────────────────────── */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {([
                { icon: <Briefcase size={20} />, label: '部署專案', value: projects.length, gradient: 'from-blue-500/30 via-blue-500/8', border: 'hover:border-blue-500/50', iconBg: 'group-hover:bg-blue-500/20 group-hover:border-blue-500/40 group-hover:text-blue-200', tab: 'projects' as TabKey },
                { icon: <BookOpen size={20} />, label: '技術文章', value: posts.length, gradient: 'from-violet-500/30 via-violet-500/8', border: 'hover:border-violet-500/50', iconBg: 'group-hover:bg-violet-500/20 group-hover:border-violet-500/40 group-hover:text-violet-200', tab: 'blog' as TabKey },
                { icon: <Activity size={20} />, label: '核心狀態', value: '連線中', gradient: 'from-emerald-500/15 via-emerald-500/5', border: 'border-emerald-500/20', iconBg: 'text-emerald-300', tab: null },
              ]).map((stat, i) => (
                <button
                  key={i}
                  onClick={() => stat.tab && setActiveTab(stat.tab!)}
                  disabled={!stat.tab}
                  className={`relative bg-gradient-to-b ${stat.gradient} to-transparent border rounded-2xl p-7 text-center group transition-all duration-300 overflow-hidden ${
                    stat.tab
                      ? `${stat.border} cursor-pointer border-white/10 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.10)] hover:-translate-y-0.5`
                      : 'cursor-default border-white/10'
                  }`}
                >
                  {stat.tab && (
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  )}
                  <div className={`w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-3.5 border border-white/10 transition-all duration-300 ${
                    stat.tab
                      ? `${stat.iconBg} group-hover:scale-110 group-hover:shadow-lg`
                      : 'text-emerald-300'
                  }`}>
                    <span className={stat.tab ? 'text-white/70 group-hover:text-white transition-colors' : ''}>{stat.icon}</span>
                  </div>
                  <div className={`text-[28px] font-bold tracking-tight mb-1.5 ${stat.tab ? 'text-white' : 'text-white/80'}`}>{stat.value}</div>
                  <div className={`text-[9px] font-semibold uppercase tracking-[0.2em] ${stat.tab ? 'text-white/70' : 'text-white/50'}`}>{stat.label}</div>
                  {stat.tab && (
                    <div className="mt-3 text-[8px] font-semibold text-white/30 uppercase tracking-[0.15em] transition-all duration-200 group-hover:text-white/60">
                      點擊管理 →
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-5 space-y-4">
                <h3 className="text-[9px] font-semibold text-white/70 uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-blue-500/15 flex items-center justify-center"><Zap size={11} className="text-blue-400" /></span>
                  快速操作
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <QuickBtn icon={<Plus size={13} />} label="新增專案" color="text-blue-400" onClick={() => openEditor('project')} />
                  <QuickBtn icon={<Plus size={13} />} label="新增文章" color="text-violet-400" onClick={() => openEditor('blog')} />
                  <QuickBtn icon={<Settings size={13} />} label="站台設定" color="text-emerald-400" onClick={() => setActiveTab('site_config')} />
                  <QuickBtn icon={<Eye size={13} />} label="檢視履歷" color="text-amber-400" onClick={() => window.open('/resume', '_blank')} />
                </div>
              </div>
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 space-y-4 hover:border-white/15 transition-all">
                <h3 className="text-[9px] font-semibold text-white/70 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Activity size={12} className="text-emerald-400" /> 系統資訊
                </h3>
                <div className="space-y-2 text-xs">
                  {[
                    ['驗證方式', 'Cloudflare Access'],
                    ['管理員', authEmail || '—'],
                    ['執行框架', 'React 19 + Vite 5'],
                    ['部署平台', 'Cloudflare Pages'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                      <span className="text-white/60 text-[10px] font-medium uppercase tracking-wider">{label}</span>
                      <span className="text-white/75 text-[10px] font-semibold truncate ml-4">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── PROJECTS / BLOG CONTENT LIST ──────────────── */}
        {(activeTab === 'projects' || activeTab === 'blog') && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 group">
                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none group-focus-within:text-white/50 transition-colors" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={`搜尋${activeTab === 'projects' ? '專案' : '文章'}...`}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all placeholder:text-white/25"
                />
              </div>
              <button
                onClick={() => openEditor(activeTab === 'projects' ? 'project' : 'blog')}
                className="flex items-center gap-2.5 bg-white text-black px-5 py-3 rounded-xl font-semibold text-[11px] uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0 shadow-lg shadow-white/10"
              >
                <Plus size={15} /> 新增
              </button>
            </div>

            <div className="space-y-1.5">
              {(activeTab === 'projects' ? filteredProjects : filteredPosts).length === 0 && (
                <div className="text-center py-20 text-white/30 text-xs font-semibold uppercase tracking-[0.2em]">
                  {searchQuery ? '找不到符合的內容' : '尚無內容，點擊「新增」開始'}
                </div>
              )}
              {(activeTab === 'projects' ? filteredProjects : filteredPosts).map((item, idx) => (
                <div
                  key={item.id}
                  className="group relative bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 flex items-center gap-4 hover:bg-white/[0.05] hover:border-white/20 hover:shadow-[0_0_20px_-8px_rgba(255,255,255,0.05)] transition-all duration-200 cursor-default"
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-black border border-white/10 shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-bold text-white group-hover:text-white transition-colors truncate">{item.title}</span>
                      <span className="w-[3px] h-[3px] rounded-full bg-white/20 shrink-0" />
                      <span className="text-[8px] font-semibold text-white/45 uppercase tracking-wider whitespace-nowrap shrink-0">
                        #{idx + 1}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[9px] font-semibold text-white/55 uppercase tracking-wider truncate">
                        {activeTab === 'projects'
                          ? (item.tags?.join(' · ') || '')
                          : `${item.category || ''}${item.category && item.date ? ' · ' : ''}${item.date || ''}`
                        }
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditor(activeTab === 'projects' ? 'project' : 'blog', item)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 text-white/60 hover:text-blue-400 hover:bg-blue-500/20 transition-all"
                      title="編輯"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(activeTab === 'projects' ? 'project' : 'blog', item.id, item.title)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-500/10 text-rose-400/60 hover:text-rose-300 hover:bg-rose-500/25 transition-all"
                      title="刪除"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── SITE CONFIG ──────────────────────────────────── */}
        {activeTab === 'site_config' && (
          <div className="max-w-4xl mx-auto space-y-4">

            {/* Save All Toolbar */}
            <div className={`sticky top-24 z-40 rounded-2xl px-5 py-3.5 flex items-center justify-between transition-all duration-300 ${
              Object.keys(configDirty).length > 0
                ? 'bg-gradient-to-r from-amber-500/20 via-amber-500/8 to-transparent border border-amber-500/30 shadow-[0_0_30px_-8px_rgba(251,191,36,0.2)]'
                : 'bg-white/[0.05] border border-white/10'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  Object.keys(configDirty).length > 0 ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]' : 'bg-white/20'
                }`} />
                <div>
                  <h2 className="text-sm font-semibold text-white tracking-tight">站台設定</h2>
                  <p className="text-[9px] font-semibold text-white/45 tracking-wider mt-0.5">
                    {Object.keys(configDirty).length > 0
                      ? `${Object.keys(configDirty).length} 個未儲存的變更`
                      : '所有設定已儲存'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleSaveAllConfig}
                disabled={Object.keys(configDirty).length === 0 || saveStatus === 'saving'}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-[11px] font-semibold uppercase tracking-wider transition-all duration-200 ${
                  Object.keys(configDirty).length === 0
                    ? 'bg-white/[0.05] text-white/30 cursor-not-allowed'
                    : saveStatus === 'saving'
                    ? 'bg-blue-500/20 text-blue-300'
                    : 'bg-white text-black hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/10'
                }`}
              >
                {saveStatus === 'saving' ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                {saveStatus === 'saving' ? '儲存中...' : '儲存全部'}
              </button>
            </div>

            {/* ── 首頁設定 ── */}
            <AccordionSection
              title="首頁設定"
              icon={<Sparkles size={15} className="text-emerald-400" />}
              accent="border-l-emerald-500/30"
              isOpen={configSections.homepage}
              onToggle={() => toggleConfigSection('homepage')}
              dirty={configDirty}
              keys={['hero_title', 'hero_intro', 'stat_vm', 'stat_uptime', 'stat_defense']}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['hero_title', 'hero_intro', 'stat_vm', 'stat_uptime', 'stat_defense'].map(key => (
                  <ConfigField
                    key={key}
                    label={key.replace(/_/g, ' ')}
                    value={getConfig(key)}
                    onChange={v => handleConfigChange(key, v)}
                    placeholder={`輸入 ${key}...`}
                    large={key === 'hero_intro'}
                  />
                ))}
              </div>
            </AccordionSection>

            {/* ── 基本資訊 ── */}
            <AccordionSection
              title="基本資訊"
              icon={<User size={15} className="text-blue-400" />}
              accent="border-l-blue-500/30"
              isOpen={configSections.resume_basic}
              onToggle={() => toggleConfigSection('resume_basic')}
              dirty={configDirty}
              keys={['resume_name', 'resume_title', 'resume_email', 'resume_location', 'resume_github', 'resume_linkedin']}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {([
                  { key: 'resume_name', icon: <AtSign size={13} />, placeholder: '姓名' },
                  { key: 'resume_title', icon: <Briefcase size={13} />, placeholder: '職稱' },
                  { key: 'resume_email', icon: <Mail size={13} />, placeholder: 'Email' },
                  { key: 'resume_location', icon: <MapPin size={13} />, placeholder: '所在地' },
                  { key: 'resume_github', icon: <Globe size={13} />, placeholder: 'GitHub' },
                  { key: 'resume_linkedin', icon: <LinkIcon size={13} />, placeholder: 'LinkedIn' },
                ]).map(({ key, icon, placeholder }) => (
                  <div key={key} className="bg-white/[0.03] border border-white/10 rounded-xl p-3.5 space-y-2 hover:border-white/20 transition-all">
                    <div className="flex items-center gap-2">
                      <span className="text-white/60">{icon}</span>
                      <span className="text-[8px] font-semibold text-white/80 uppercase tracking-[0.15em]">
                        {key.replace('resume_', '').replace(/_/g, ' ')}
                      </span>
                    </div>
                    <input
                      value={getConfig(key)}
                      onChange={e => handleConfigChange(key, e.target.value)}
                      placeholder={`輸入 ${placeholder}...`}
                      className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500/40 focus:bg-black/80 transition-all placeholder:text-white/20"
                    />
                  </div>
                ))}
              </div>
            </AccordionSection>

            {/* ── 專業內容 ── */}
            <AccordionSection
              title="專業內容"
              icon={<Zap size={15} className="text-amber-400" />}
              accent="border-l-amber-500/30"
              isOpen={configSections.resume_content}
              onToggle={() => toggleConfigSection('resume_content')}
              dirty={configDirty}
              keys={['resume_summary', 'resume_experience', 'resume_skills']}
            >
              <div className="space-y-4">
                <ConfigField
                  label="專業總結"
                  value={getConfig('resume_summary')}
                  onChange={v => handleConfigChange('resume_summary', v)}
                  placeholder="輸入專業總結..."
                  large
                />
                <ConfigField
                  label="工作經歷（Markdown）"
                  value={getConfig('resume_experience')}
                  onChange={v => handleConfigChange('resume_experience', v)}
                  placeholder="### 職稱 | 公司\n日期\n- 項目符號..."
                  large
                  mono
                  hint="### 職稱 | 公司 / 日期 / - 項目符號"
                />
                <ConfigField
                  label="核心技能"
                  value={getConfig('resume_skills')}
                  onChange={v => handleConfigChange('resume_skills', v)}
                  placeholder="技能名稱:等級, 用逗號分隔"
                  hint="等級: Expert / Advanced / Certified"
                />
              </div>
            </AccordionSection>

            {/* ── 結構化資料 ── */}
            <AccordionSection
              title="結構化資料 (JSON)"
              icon={<Code size={15} className="text-violet-400" />}
              accent="border-l-violet-500/30"
              isOpen={configSections.resume_data}
              onToggle={() => toggleConfigSection('resume_data')}
              dirty={configDirty}
              keys={['resume_education_list', 'resume_extra_links']}
            >
              <div className="space-y-4">
                <ConfigField
                  label="學歷經歷 (JSON)"
                  value={getConfig('resume_education_list')}
                  onChange={v => handleConfigChange('resume_education_list', v)}
                  placeholder='[{"school":"...","year":"...","degree":"..."}]'
                  mono
                  hint='格式: [{"school":"學校名","year":"年份","degree":"學位"}]'
                />
                <ConfigField
                  label="額外連結 (JSON)"
                  value={getConfig('resume_extra_links')}
                  onChange={v => handleConfigChange('resume_extra_links', v)}
                  placeholder='[{"label":"...","url":"https://..."}]'
                  mono
                  hint='格式: [{"label":"顯示名稱","url":"https://..."}]'
                />
              </div>
            </AccordionSection>

          </div>
        )}

        {/* ─── RESUME EDITOR ────────────────────────────────── */}
        {activeTab === 'resume_editor' && (
          <ResumeEditor
            siteConfigs={siteConfigs}
            addToast={addToast}
            onSaved={fetchAllData}
          />
        )}
      </main>

      {/* ===== Modal Editor ===== */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className="w-full max-w-[1400px] h-[90vh] flex flex-col bg-[#0a0b10] border border-white/[0.04] rounded-3xl shadow-[0_0_100px_-20px_rgba(0,0,0,0.9)] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-8 py-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-b from-white/[0.04] to-transparent shrink-0">
                <div className="flex items-center gap-6">
                  <div>
                    <h2 className="text-base font-semibold text-white tracking-tight">
                      {editingItem?.id ? '編輯內容' : '新增內容'}
                    </h2>
                    <p className="text-[8px] font-semibold text-white/40 uppercase tracking-wider mt-0.5">
                      {modalType === 'project' ? '專案編輯' : '文章編輯'} · Ctrl+S 快速儲存
                    </p>
                  </div>
                  <div className="flex bg-white/[0.05] rounded-lg p-0.5 border border-white/10">
                    {[
                      { key: 'edit', label: '編輯' },
                      { key: 'split', label: '雙欄', hide: 'lg' },
                      { key: 'preview', label: '預覽' },
                    ].map(({ key, label, hide }) => (
                      <button
                        key={key}
                        onClick={() => setViewMode(key as any)}
                        className={`px-4 py-2 rounded-md text-[9px] font-semibold uppercase tracking-wider transition-all ${hide === 'lg' ? 'hidden lg:block' : ''} ${viewMode === key ? 'bg-white text-black shadow-sm' : 'text-white/50 hover:text-white/80'}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex items-center gap-2 text-white/40 hover:text-white/80 transition-all text-[10px] font-semibold uppercase tracking-wider"
                  >
                    <X size={15} /> 取消
                  </button>
                  <button
                    onClick={handleSaveItem}
                    className={`px-6 py-2.5 rounded-xl font-semibold text-[10px] uppercase tracking-wider flex items-center gap-2.5 transition-all duration-200 ${
                      saveStatus === 'success'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-white text-black hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/10'
                    }`}
                  >
                    {saveStatus === 'saving' ? <Loader2 className="animate-spin" size={15} /> : saveStatus === 'success' ? <CheckCircle2 size={15} /> : <Save size={15} />}
                    {saveStatus === 'saving' ? '儲存中...' : saveStatus === 'success' ? '已儲存' : '儲存'}
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex-1 flex overflow-hidden">
                {/* Sidebar Metadata */}
                <div className="w-[340px] shrink-0 border-r border-white/10 p-5 overflow-y-auto space-y-6 bg-white/[0.02]">
                  <Inp label="標題" value={editingItem.title} onChange={(v: string) => setEditingItem({...editingItem, title: v})} />
                  <Inp
                    label={modalType === 'project' ? '標籤 (逗號分隔)' : '分類'}
                    value={modalType === 'project' ? editingItem.tagsString : editingItem.category}
                    onChange={(v: string) => modalType === 'project' ? setEditingItem({...editingItem, tagsString: v}) : setEditingItem({...editingItem, category: v})}
                  />

                  {/* Cover Image */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[8px] font-semibold text-white/80 uppercase tracking-[0.15em]">封面圖片</label>
                      {editingItem.image && (
                        <span className="text-[7px] font-semibold text-white/40 uppercase tracking-wider">可點擊更換</span>
                      )}
                    </div>
                    <div className="aspect-[16/9] bg-white/[0.03] rounded-xl border border-white/10 overflow-hidden relative group">
                      {editingItem.image ? (
                        <img src={editingItem.image} alt="封面" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><ImageIcon size={32} className="text-white/20" /></div>
                      )}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 cursor-pointer backdrop-blur-sm"
                      >
                        <Upload size={18} className="text-white" />
                        <span className="text-[8px] font-semibold text-white tracking-wider uppercase">{isUploading ? '上傳中...' : '更換圖片'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Media Gallery (projects only) */}
                  {modalType === 'project' && (
                    <div className="space-y-2.5">
                      <label className="text-[8px] font-semibold text-white/80 uppercase tracking-[0.15em]">多媒體資產</label>
                      <div className="space-y-1.5">
                        {(editingItem.media || []).map((m: any, idx: number) => (
                          <div key={idx} className="bg-white/[0.03] rounded-lg p-2.5 border border-white/10 flex items-center gap-2.5 group/media hover:border-white/20 transition-all">
                            <img src={m.url} alt={m.type} className="w-8 h-8 rounded-md object-cover bg-black shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-[8px] font-semibold text-white/50 uppercase tracking-wider truncate">{m.type || 'image'}</p>
                            </div>
                            <button onClick={() => removeMediaItem(idx)} className="text-white/30 hover:text-rose-400 p-1 transition-all"><Trash2 size={12} /></button>
                          </div>
                        ))}
                        <button onClick={addMediaItem} className="w-full py-2.5 border border-dashed border-white/10 rounded-lg text-white/30 hover:text-white/60 hover:border-white/20 transition-all text-[8px] font-semibold uppercase tracking-wider flex items-center justify-center gap-2">
                          <PlusCircle size={12} /> 新增媒體
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Editor + Preview */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Toolbar */}
                  <div className="px-5 py-2.5 border-b border-white/10 bg-white/[0.02] flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-0.5">
                      <ToolBtn onClick={() => insertMarkdown('## ')} icon={<Heading2 size={13} />} title="標題 H2" />
                      <ToolBtn onClick={() => insertMarkdown('### ')} icon={<Heading3 size={13} />} title="標題 H3" />
                    </div>
                    <div className="w-px h-4 bg-white/10" />
                    <div className="flex items-center gap-0.5">
                      <ToolBtn onClick={() => insertMarkdown('**', '**')} icon={<Bold size={13} />} title="粗體" />
                      <ToolBtn onClick={() => insertMarkdown('- ')} icon={<List size={13} />} title="清單" />
                    </div>
                    <div className="w-px h-4 bg-white/10" />
                    <div className="flex items-center gap-0.5">
                      <ToolBtn onClick={() => insertMarkdown('```\n', '\n```')} icon={<Code size={13} />} title="Code" />
                      <ToolBtn onClick={() => insertMarkdown('[', '](url)')} icon={<LinkIcon size={13} />} title="Link" />
                    </div>
                    <div className="w-px h-4 bg-white/10" />
                    <button
                      onClick={handleAiRewrite}
                      disabled={isAiProcessing}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[8px] font-semibold uppercase tracking-wider transition-all border ${
                        isAiProcessing
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'text-emerald-500/50 hover:text-emerald-400 border-transparent hover:border-emerald-500/20'
                      }`}
                    >
                      {isAiProcessing ? <Loader2 size={11} className="animate-spin" /> : <Sparkles size={11} />}
                      AI
                    </button>
                    <div className="flex-1" />
                    <span className="text-[7px] font-semibold text-white/20 uppercase tracking-wider hidden sm:inline">Markdown</span>
                  </div>

                  {/* Textarea + Preview */}
                  <div className="flex-1 flex overflow-hidden">
                    {(viewMode === 'edit' || viewMode === 'split') && (
                      <textarea
                        ref={textareaRef}
                        value={modalType === 'project' ? editingItem.details : editingItem.content}
                        onScroll={handleScroll}
                        onChange={e => setEditingItem({...editingItem, [modalType === 'project' ? 'details' : 'content']: e.target.value})}
                        className="flex-1 bg-transparent p-8 text-slate-200 font-mono text-sm leading-relaxed outline-none resize-none no-scrollbar selection:bg-emerald-500/30 placeholder:text-white/15"
                        placeholder="開始撰寫..."
                      />
                    )}
                    {viewMode === 'split' && <div className="w-px bg-white/10" />}
                    {(viewMode === 'preview' || viewMode === 'split') && (
                      <div ref={previewRef} className="flex-1 p-8 overflow-y-auto no-scrollbar bg-black/20">
                        <div className="max-w-3xl mx-auto">
                          {renderPreview(modalType === 'project' ? editingItem.details : editingItem.content)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
    </div>
    </>
  );
};

/* ============================================================
   Sub-components
   ============================================================ */

// ─── Accordion Section ─────────────────────────────────
const AccordionSection = ({ title, icon, isOpen, onToggle, children, dirty, keys, accent }: {
  title: string; icon: React.ReactNode; isOpen: boolean; onToggle: () => void;
  children: React.ReactNode; dirty?: Record<string, string>; keys?: string[]; accent?: string;
}) => {
  const hasDirty = keys?.some(k => dirty?.[k] !== undefined);
  return (
    <div className={`bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden transition-all duration-200 hover:border-white/20 ${
      isOpen ? 'border-white/15' : ''
    }`}>
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-5 py-3.5 transition-all duration-150 cursor-pointer ${
          isOpen ? 'bg-white/[0.03]' : 'hover:bg-white/[0.04]'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center shrink-0 transition-all duration-200 ${
            isOpen ? 'bg-white/15 border-white/20' : ''
          }`}>
            {icon}
          </div>
          <span className="text-sm font-semibold text-white/85 tracking-tight">{title}</span>
          {hasDirty && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-2 h-2 rounded-full bg-amber-400 shrink-0 shadow-[0_0_6px_rgba(251,191,36,0.6)]"
              title="有未儲存的變更"
            />
          )}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-white/30 shrink-0"
        >
          <ChevronDown size={16} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-white/[0.02]">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Config Field ──────────────────────────────────────
const ConfigField = ({ label, value, onChange, placeholder, large, mono, hint }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; large?: boolean; mono?: boolean; hint?: string;
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <label className="text-[8px] font-semibold text-white/80 uppercase tracking-[0.15em]">{label}</label>
      {hint && <span className="text-[7px] text-white/25 tracking-wider font-medium">{hint}</span>}
    </div>
    {large ? (
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-sm text-white outline-none focus:border-white/30 focus:bg-black/60 transition-all placeholder:text-white/20 leading-relaxed resize-y ${
          mono ? 'font-mono text-xs' : ''
        } h-[140px]`}
      />
    ) : (
      mono ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-xs text-white outline-none focus:border-white/30 focus:bg-black/60 transition-all font-mono placeholder:text-white/20 h-[100px] resize-y"
        />
      ) : (
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-white/30 focus:bg-black/60 transition-all placeholder:text-white/20"
        />
      )
    )}
  </div>
);

// ─── Tool Button ───────────────────────────────────────
const ToolBtn = ({ onClick, icon, title }: any) => (
  <button
    onClick={onClick}
    title={title}
    className="w-7 h-7 flex items-center justify-center rounded-md text-white/50 hover:text-white/80 hover:bg-white/10 transition-all"
  >
    {icon}
  </button>
);

// ─── Input ─────────────────────────────────────────────
const Inp = ({ label, value, onChange }: any) => (
  <div className="space-y-2">
    <label className="block text-[8px] font-semibold text-white/80 uppercase tracking-[0.15em]">{label}</label>
    <input
      type="text"
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-white/30 focus:bg-black/60 transition-all placeholder:text-white/20"
    />
  </div>
);

// ─── Quick Button ──────────────────────────────────────
const QuickBtn = ({ icon, label, color, onClick }: {
  icon: React.ReactNode; label: string; color: string; onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 bg-white/[0.06] hover:bg-white/[0.12] rounded-xl px-3.5 py-3 transition-all duration-200 text-left border border-white/10 hover:border-white/20 group cursor-pointer"
  >
    <span className={`w-7 h-7 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center ${color} group-hover:scale-110 group-hover:bg-white/20 transition-all duration-200 shrink-0`}>{icon}</span>
    <span className="text-[11px] font-medium text-white/70 group-hover:text-white transition-colors">{label}</span>
  </button>
);

export default AdminPage;
