
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, BookOpen, Briefcase, Plus, Trash2, Edit3, 
  Activity, LogOut, Loader2, X, Save, 
  Lock, Image as ImageIcon, CheckCircle2,
  Upload, Settings, PlusCircle,
  Bold, Heading2, Heading3, List, Code, Link as LinkIcon, Minus, Type, Info,
  Zap, Sparkles
} from 'lucide-react';
import { Card } from '@astryxdesign/core/Card';
import { Section } from '@astryxdesign/core/Section';
import { HStack, VStack, StackItem } from '@astryxdesign/core/Stack';
import { Text, Heading } from '@astryxdesign/core/Text';
import { ProjectsAPI, BlogAPI, ConfigAPI, AuthAPI, uploadFile } from '../services/apiClient';
import { SEOMeta } from '../lib/seo';
import { generateContentFromPrompt, rewriteTechnicalContent } from '../services/geminiService';

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authChecking, setAuthChecking] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'blog' | 'site_config'>('dashboard');
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');
  const [isUploading, setIsUploading] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  
  const [projects, setProjects] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [siteConfigs, setSiteConfigs] = useState<any[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'project' | 'blog' | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('split');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

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
  }, [isModalOpen, editingItem]);

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
    } catch (err) {
      alert("AI 改寫暫時無法連線。");
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
      } else {
        const newMedia = [...(editingItem.media || [])];
        newMedia[target] = { ...newMedia[target], url: publicUrl };
        setEditingItem({ ...editingItem, media: newMedia });
      }
    } catch (err: any) {
      alert(err?.message || '上傳失敗');
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
      } else {
        await api.create(payload);
      }

      setSaveStatus('success');
      setTimeout(() => {
        setSaveStatus('idle');
        setIsModalOpen(false);
        fetchAllData();
      }, 1500);
    } catch (err: any) {
      setSaveStatus('idle');
      alert(`儲存失敗: ${err?.message || err}`);
    }
  };

  const handleSaveConfig = async (key: string, value: string) => {
    try {
      await ConfigAPI.set(key, value);
      setSiteConfigs(prev => prev.map(c => c.key === key ? { ...c, value } : c));
    } catch (err: any) {
      console.error(`Config save error for ${key}:`, err);
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

  if (authChecking) {
    return (
      <>
      <SEOMeta title="管理後台" description="Woody 維運實踐．管理主控台" path="/admin" noindex />
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#050608]">
        <Loader2 className="animate-spin text-white/20" size={48} strokeWidth={1} />
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Verifying Access Token...</span>
      </div>
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
      <SEOMeta title="管理後台 — 認證" description="請透過 Cloudflare Access 登入管理後台。" path="/admin" noindex />
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#050608]">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel p-12 max-w-md w-full text-center border-white/5 bg-black/40 shadow-2xl">
          <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-10 border border-white/10 text-white/40"><Lock size={32} /></div>
          <h2 className="text-3xl font-black text-white mb-6 tracking-tighter uppercase leading-tight">Woody Wu<br/>管理主控台</h2>
          <p className="text-white/40 text-[11px] font-bold uppercase tracking-[0.3em] mb-10 leading-relaxed">
            本區域受 Cloudflare Access 守護<br/>請透過組織 SSO 登入後繼續
          </p>
          <button onClick={handleLoginRedirect} className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
            啟動認證
          </button>
          <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.3em] mt-8">
            若已登入，重新整理即可載入主控台
          </p>
        </motion.div>
      </div>
      </>
    );
  }

  return (
    <>
    <SEOMeta title="管理後台" description="Woody 維運實踐．網站內容管理系統" path="/admin" noindex />
    <div className="min-h-screen pt-[130px] pb-32 px-6 max-w-[1700px] mx-auto flex flex-col lg:flex-row gap-10 overflow-x-hidden">
      <aside className="lg:w-72 shrink-0">
        <div className="glass-panel p-3 flex lg:flex-col gap-2 sticky top-32 bg-black/60 border-white/10 shadow-2xl">
          <NavBtn active={activeTab === 'dashboard'} icon={<LayoutDashboard size={18} />} label="資產概覽" onClick={() => setActiveTab('dashboard')} />
          <NavBtn active={activeTab === 'projects'} icon={<Briefcase size={18} />} label="作品管理" onClick={() => setActiveTab('projects')} />
          <NavBtn active={activeTab === 'blog'} icon={<BookOpen size={18} />} label="技術文章" onClick={() => setActiveTab('blog')} />
          <NavBtn active={activeTab === 'site_config'} icon={<Settings size={18} />} label="網站設定" onClick={() => setActiveTab('site_config')} />
          <div className="hidden lg:block h-px bg-white/10 my-2" />
          <button onClick={() => { setIsAuthenticated(false); setAuthEmail(''); }} className="flex items-center gap-4 px-6 py-4 rounded-xl font-black text-[10px] uppercase text-rose-500 hover:bg-rose-500/10 transition-all"><LogOut size={18} /> 登出本機</button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <Section>
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="flex flex-col items-center justify-center gap-6 bg-black/60 !border-white/10 shadow-2xl p-12 group hover:!border-white/30 transition-all text-center">
              <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-white/40 mb-2 border border-white/10 group-hover:scale-110 transition-transform group-hover:text-white"><Briefcase size={32} /></div>
              <Text type="display-2" className="!text-white font-[900] tracking-tighter">{projects.length}</Text>
              <Text size="sm" className="!text-white/40 font-black uppercase tracking-[0.5em]">部署專案</Text>
            </Card>
            <Card className="flex flex-col items-center justify-center gap-6 bg-black/60 !border-white/10 shadow-2xl p-12 group hover:!border-white/30 transition-all text-center">
              <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-white/40 mb-2 border border-white/10 group-hover:scale-110 transition-transform group-hover:text-white"><BookOpen size={32} /></div>
              <Text type="display-2" className="!text-white font-[900] tracking-tighter">{posts.length}</Text>
              <Text size="sm" className="!text-white/40 font-black uppercase tracking-[0.5em]">技術文章</Text>
            </Card>
            <Card className="flex flex-col items-center justify-center gap-6 bg-black/60 !border-white/10 shadow-2xl p-12 group hover:!border-white/30 transition-all text-center">
              <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-white/40 mb-2 border border-white/10 group-hover:scale-110 transition-transform group-hover:text-emerald-400"><Activity size={32} /></div>
              <Text type="display-2" className="!text-emerald-400 font-[900] tracking-tighter">ONLINE</Text>
              <Text size="sm" className="!text-white/40 font-black uppercase tracking-[0.5em]">核心狀態</Text>
            </Card>
          </div>
        )}

        {(activeTab === 'projects' || activeTab === 'blog') && (
          <VStack gap={6}>
            <HStack justify="between" align="center" className="px-2">
              <Text type="display-1" className="!text-white font-black uppercase tracking-widest !text-2xl">{activeTab === 'projects' ? '部署資產清單' : '技術文章清單'}</Text>
              <button onClick={() => openEditor(activeTab === 'projects' ? 'project' : 'blog')} className="bg-white text-black px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl">
                <Plus size={18} /> 新增內容
              </button>
            </HStack>
            <VStack gap={3}>
              {(activeTab === 'projects' ? projects : posts).map(item => (
                <Card key={item.id} padding={6} className="bg-black/40 !border-white/5 shadow-lg group hover:bg-white/[0.05] transition-all">
                  <HStack justify="between" align="center">
                    <HStack gap={6} align="center">
                      <img src={item.image} className="w-20 h-20 rounded-2xl object-cover bg-black shadow-inner border border-white/5 shrink-0" />
                      <VStack gap={2}>
                        <Text type="large" className="!text-white font-black uppercase tracking-tight">{item.title}</Text>
                        <Text size="sm" className="!text-white/40 font-bold uppercase tracking-widest">{activeTab === 'projects' ? item.tags?.join(' • ') : `${item.category} • ${item.date}`}</Text>
                      </VStack>
                    </HStack>
                    <HStack gap={3}>
                      <button onClick={() => openEditor(activeTab === 'projects' ? 'project' : 'blog', item)} className="p-4 rounded-xl bg-white/5 text-white hover:text-emerald-400 hover:bg-white/10 transition-all border border-white/5"><Edit3 size={20} /></button>
                      <button onClick={async () => { if(confirm('確定移除？')) { const api = activeTab === 'projects' ? ProjectsAPI : BlogAPI; await api.remove(item.id); fetchAllData(); } }} className="p-4 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-all border border-rose-500/20"><Trash2 size={20} /></button>
                    </HStack>
                  </HStack>
                </Card>
              ))}
            </VStack>
          </VStack>
        )}

        {activeTab === 'site_config' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {['hero_title', 'hero_intro', 'stat_vm', 'stat_uptime', 'stat_defense'].map(key => {
               const config = siteConfigs.find(c => c.key === key);
               return (
                 <Card key={key} padding={8} className="bg-black/60 !border-white/10 shadow-2xl space-y-6">
                    <HStack gap={4} align="center">
                      <div className="w-1.5 h-5 bg-emerald-500 rounded-full" />
                      <Text type="label" className="!text-white font-black uppercase tracking-[0.4em]">{key.replace(/_/g, ' ')}</Text>
                    </HStack>
                    <textarea 
                      defaultValue={config?.value || ''} 
                      onBlur={(e) => handleSaveConfig(key, e.target.value)}
                      placeholder={`輸入 ${key} 內容...`}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-white text-sm outline-none focus:border-emerald-500/40 transition-all font-light leading-relaxed h-[120px]"
                    />
                 </Card>
               );
             })}
          </div>
        )}
        </Section>
      </main>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel w-full max-w-[1550px] h-[92vh] flex flex-col bg-[#0a0b10] border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.9)] overflow-hidden"
            >
              <div className="px-12 py-8 border-b border-white/10 flex justify-between items-center bg-black/40">
                <div className="flex items-center gap-8">
                   <div className="space-y-1">
                      <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em]">{editingItem.id ? '更新部署' : '建立節點'}</h2>
                      <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Protocol Version v4.2 — Engineer Mode (Ctrl+S to save)</p>
                   </div>
                   <div className="flex bg-white/5 rounded-2xl p-1.5 border border-white/10">
                     <button onClick={() => setViewMode('edit')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'edit' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}>編輯</button>
                     <button onClick={() => setViewMode('split')} className={`hidden lg:block px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'split' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}>雙欄</button>
                     <button onClick={() => setViewMode('preview')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'preview' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}>預覽</button>
                   </div>
                </div>
                <div className="flex items-center gap-6">
                   <button onClick={() => setIsModalOpen(false)} className="text-white/30 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors"><X size={20} /> 取消</button>
                   <button 
                    onClick={handleSaveItem} 
                    className={`px-12 py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.4em] flex items-center gap-4 transition-all shadow-2xl ${saveStatus === 'success' ? 'bg-emerald-500 text-white' : 'bg-white text-black hover:scale-105 active:scale-95'}`}
                   >
                     {saveStatus === 'saving' ? <Loader2 className="animate-spin" size={18} /> : saveStatus === 'success' ? <CheckCircle2 size={18} /> : <Save size={18} />}
                     {saveStatus === 'success' ? 'DEPLOYED' : 'COMMIT & PUSH'}
                   </button>
                </div>
              </div>

              <div className="flex-1 flex overflow-hidden">
                <div className="w-[450px] border-r border-white/10 p-10 overflow-y-auto no-scrollbar space-y-12 bg-black/20">
                   <div className="space-y-10">
                      <Inp label="標題 / Title" value={editingItem.title} onChange={(v: string) => setEditingItem({...editingItem, title: v})} />
                      <Inp label={modalType === 'project' ? "標籤 (逗號分隔)" : "文章分類"} value={modalType === 'project' ? editingItem.tagsString : editingItem.category} onChange={(v: string) => modalType === 'project' ? setEditingItem({...editingItem, tagsString: v}) : setEditingItem({...editingItem, category: v})} />
                      
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-2">封面預覽 / Cover Preview</label>
                        <div className="aspect-[16/10] bg-black rounded-[2rem] border border-white/10 overflow-hidden relative group">
                          {editingItem.image ? (
                            <img src={editingItem.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-white/10 gap-4"><ImageIcon size={48} /></div>
                          )}
                          <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-3">
                            <Upload size={24} />
                            <span className="text-[10px] font-black tracking-widest uppercase">上傳封面</span>
                          </button>
                        </div>
                      </div>

                      {modalType === 'project' && (
                        <div className="space-y-6">
                          <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-2">多媒體資產庫 / Gallery</label>
                          <div className="space-y-4">
                            {(editingItem.media || []).map((m: any, idx: number) => (
                              <div key={idx} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4 relative">
                                <img src={m.url} className="w-12 h-12 rounded-xl object-cover bg-black" />
                                <div className="flex-1">
                                  <p className="text-[9px] font-black text-white uppercase tracking-widest">{m.type} • {m.frame}</p>
                                </div>
                                <button onClick={() => removeMediaItem(idx)} className="text-white/20 hover:text-rose-500 p-2"><Trash2 size={16} /></button>
                              </div>
                            ))}
                            <button onClick={addMediaItem} className="w-full py-4 border border-dashed border-white/10 rounded-2xl text-white/20 hover:text-white hover:border-white/30 transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3">
                              <PlusCircle size={16} /> 新增項目
                            </button>
                          </div>
                        </div>
                      )}
                   </div>
                </div>

                <div className="flex-1 flex flex-col overflow-hidden">
                   <div className="px-10 py-5 border-b border-white/5 bg-white/5 flex items-center gap-8">
                      <div className="flex items-center gap-2">
                        <ToolBtn onClick={() => insertMarkdown('## ')} icon={<Heading2 size={16} />} title="標題 H2" />
                        <ToolBtn onClick={() => insertMarkdown('### ')} icon={<Heading3 size={16} />} title="標題 H3" />
                      </div>
                      <div className="w-px h-6 bg-white/10" />
                      <div className="flex items-center gap-2">
                        <ToolBtn onClick={() => insertMarkdown('**', '**')} icon={<Bold size={16} />} title="粗體" />
                        <ToolBtn onClick={() => insertMarkdown('- ')} icon={<List size={16} />} title="清單" />
                      </div>
                      <div className="w-px h-6 bg-white/10" />
                      <div className="flex items-center gap-2">
                        <ToolBtn onClick={() => insertMarkdown('```bash\n', '\n```')} icon={<Code size={16} />} title="代碼塊" />
                        <ToolBtn onClick={() => insertMarkdown('[', '](url)')} icon={<LinkIcon size={16} />} title="連結" />
                        <ToolBtn onClick={() => insertMarkdown('\n---\n')} icon={<Minus size={16} />} title="水平線" />
                      </div>
                      <div className="w-px h-6 bg-white/10" />
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={handleAiRewrite}
                          disabled={isAiProcessing}
                          className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all border ${isAiProcessing ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/40' : 'text-emerald-500/60 hover:text-emerald-500 hover:bg-emerald-500/10 border-transparent hover:border-emerald-500/20'}`}
                          title="AI 智慧改寫文案"
                        >
                          {isAiProcessing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                        </button>
                        <span className="text-[10px] font-black text-emerald-500/40 uppercase tracking-widest hidden sm:block">AI ASSISTANT</span>
                      </div>
                      <div className="flex-1" />
                      <div className="text-[10px] font-black text-white/20 tracking-widest uppercase flex items-center gap-2">
                         <Type size={14} /> Markdown Engine v4.2
                      </div>
                   </div>

                   <div className="flex-1 flex overflow-hidden">
                      {(viewMode === 'edit' || viewMode === 'split') && (
                        <textarea 
                          ref={textareaRef}
                          value={modalType === 'project' ? editingItem.details : editingItem.content}
                          onScroll={handleScroll}
                          onChange={e => setEditingItem({...editingItem, [modalType === 'project' ? 'details' : 'content']: e.target.value})}
                          className="flex-1 bg-transparent p-12 text-slate-300 font-mono text-base leading-loose outline-none resize-none no-scrollbar selection:bg-emerald-500 selection:text-black custom-scrollbar"
                          placeholder="開始撰寫技術細節..."
                        />
                      )}

                      {viewMode === 'split' && <div className="w-px bg-white/10" />}

                      {(viewMode === 'preview' || viewMode === 'split') && (
                        <div 
                          ref={previewRef}
                          className="flex-1 p-12 overflow-y-auto no-scrollbar bg-black/20"
                        >
                           <div className="max-w-4xl mx-auto">
                              <div className="flex items-center gap-4 mb-10 opacity-30">
                                <Info size={18} />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Live System Preview</span>
                              </div>
                              {renderPreview(modalType === 'project' ? editingItem.details : editingItem.content)}
                           </div>
                        </div>
                      )}
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
    </div>
    </>
  );
};

const ToolBtn = ({ onClick, icon, title }: any) => (
  <button 
    onClick={onClick} 
    title={title}
    className="w-10 h-10 flex items-center justify-center rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
  >
    {icon}
  </button>
);

const NavBtn = ({ active, icon, label, onClick }: any) => (
  <button onClick={onClick} className={`flex items-center gap-5 px-8 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all shrink-0 ${active ? 'bg-white text-black shadow-2xl scale-105' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
    <span className={active ? 'text-black' : 'text-white/40 group-hover:text-white'}>{icon}</span> {label}
  </button>
);

const Inp = ({ label, value, onChange }: any) => (
  <div className="space-y-4 w-full">
    <label className="text-[11px] font-black text-white/60 uppercase tracking-widest ml-3">{label}</label>
    <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-5 text-white text-sm focus:border-white/40 transition-all outline-none shadow-inner" />
  </div>
);

export default AdminPage;
