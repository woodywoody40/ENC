import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Bot } from 'lucide-react';
import { getAiResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const AiChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '您好！我是 Woody 的 AI 維運小幫手。想了解機房架構、技術細節或我的工作筆記嗎？儘管問我吧！' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const userMsg = inputValue;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputValue('');
    setIsTyping(true);
    const aiMsg = await getAiResponse(userMsg);
    setMessages(prev => [...prev, { role: 'model', text: aiMsg || '系統通訊逾時，請檢查基礎架構連線狀態。' }]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-10 right-10 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="mb-8 w-[380px] md:w-[440px] h-[640px] glass-panel rounded-[3rem] overflow-hidden flex flex-col"
          >
            <div className={`p-8 border-b ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-black/5 border-black/5'} flex justify-between items-center`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-white/10 text-white' : 'bg-morandi-slate text-white'}`}>
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className={`text-[11px] font-black tracking-widest uppercase ${isDarkMode ? 'text-white' : 'text-morandi-slate'}`}>維運助理 (Bot)</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <p className={`text-[10px] font-bold uppercase ${isDarkMode ? 'text-white/40' : 'text-morandi-stone'}`}>系統在線</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className={`${isDarkMode ? 'text-white/30 hover:text-white' : 'text-morandi-stone hover:text-morandi-slate'} transition-colors p-2`}>
                <X size={24} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-5 rounded-3xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? (isDarkMode ? 'bg-white text-black' : 'bg-morandi-slate text-white') + ' rounded-tr-none shadow-xl' 
                      : (isDarkMode ? 'bg-white/5 border-white/10 text-white/90' : 'bg-black/5 border-black/5 text-morandi-slate') + ' rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className={`${isDarkMode ? 'bg-white/5' : 'bg-black/5'} p-5 rounded-3xl rounded-tl-none`}>
                    <div className="flex gap-2">
                      <span className="w-2 h-2 bg-morandi-stone rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-morandi-stone rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                      <span className="w-2 h-2 bg-morandi-stone rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className={`p-8 border-t ${isDarkMode ? 'bg-black/40 border-white/5' : 'bg-black/5 border-black/5'}`}>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="詢問技術或架構..."
                  className={`flex-1 rounded-2xl px-6 py-4 text-sm focus:outline-none transition-all ${
                    isDarkMode 
                    ? 'bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-white/30' 
                    : 'bg-white border-black/10 text-morandi-slate placeholder:text-morandi-stone/40 focus:border-morandi-slate/30 shadow-inner'
                  }`}
                />
                <button 
                  onClick={handleSend}
                  disabled={isTyping}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all disabled:opacity-50 active:scale-90 shadow-lg ${
                    isDarkMode ? 'bg-white text-black' : 'bg-morandi-slate text-white'
                  }`}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center shadow-2xl hover:scale-110 transition-all group border ${
          isDarkMode ? 'bg-white/10 border-white/20 text-white' : 'bg-morandi-slate border-black/5 text-white shadow-morandi-slate/30'
        }`}
      >
        <Sparkles size={32} className="group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
};

export default AiChat;