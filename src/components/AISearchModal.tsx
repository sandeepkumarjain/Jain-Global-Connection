import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  X,
  Send,
  Loader2,
  BookOpen,
  Bot,
  User,
  ShieldCheck
} from 'lucide-react';

export const AISearchModal: React.FC = () => {
  const { isAISearchOpen, setIsAISearchOpen, systemSettings } = useApp();
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    {
      sender: 'ai',
      text: '🙏 Jai Jinendra! Welcome to the Jain Connect Global AI Assistant. I can help you locate Tirths, answer questions about Jain Panchang tithis, Matrimonial matches, or Jain business guidelines. How may I serve you today?',
    },
  ]);
  const [loading, setLoading] = useState(false);

  if (!isAISearchOpen) return null;

  const sampleCategories = [
    {
      category: 'Tirths & Pilgrimages',
      questions: [
        'History & significance of Palitana Shatrunjaya Tirth',
        'Shikharji Parasnath Hill yatra guidelines',
        'Girnar Tirth Neminath Bhagwan history',
      ],
    },
    {
      category: 'Jain Philosophy & Scriptures',
      questions: [
        'Core 5 Mahavratas taught by Lord Mahavira',
        'Navkar Mantra meaning and spiritual benefit',
        'Samvatsari Pratikraman and Michhami Dukkadam',
      ],
    },
    {
      category: 'Panchang & Food Rules',
      questions: [
        'Navkarshi, Porshi and Chouvihar timings rule',
        'Jain Dietary guidelines & Kandmool prohibition',
      ],
    },
    {
      category: 'Directory & Matrimonial',
      questions: [
        'How Jain Gotra matching works in Matrimonial',
        'How to register a Jain Business on Directory',
      ],
    },
  ];

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || prompt;
    if (!textToSend.trim() || loading) return;

    const userMsg = textToSend.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    if (!customPrompt) setPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: data.reply || '🙏 Jai Jinendra! Thank you for your question.' },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: '🙏 Jai Jinendra! Connection error. Please verify your internet or try again later.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 text-amber-100 p-4 flex items-center justify-between border-b border-amber-700/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-amber-950 flex items-center justify-center font-bold shadow-md">
              <Sparkles className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-serif text-white tracking-wide">
                Jain Connect AI Assistant
              </h2>
              <p className="text-[10px] text-amber-300">
                Powered by Gemini AI | {systemSettings.developerName}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAISearchOpen(false)}
            className="p-1.5 rounded-lg hover:bg-amber-800 text-amber-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggested Quick Questions */}
        <div className="p-3 bg-amber-50/80 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-900/40 text-xs space-y-2 max-h-36 overflow-y-auto">
          <p className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            Explore Jain Knowledge Topics & AI Assistant Prompts:
          </p>
          <div className="space-y-1.5">
            {sampleCategories.map((cat, idx) => (
              <div key={idx} className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold text-amber-900 dark:text-amber-300 bg-amber-200/60 dark:bg-amber-900/60 px-2 py-0.5 rounded-md">
                  {cat.category}:
                </span>
                {cat.questions.map((q, qIdx) => (
                  <button
                    key={qIdx}
                    onClick={() => handleSend(q)}
                    className="px-2 py-0.5 bg-white dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-300 dark:border-amber-800 rounded-full text-[10px] text-slate-700 dark:text-slate-200 transition-all text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  m.sender === 'user'
                    ? 'bg-slate-800 text-white'
                    : 'bg-amber-600 text-amber-950 font-bold'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-amber-600 text-white font-medium rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/60 rounded-tl-none whitespace-pre-wrap'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 font-bold p-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Consulting Jain AI Knowledge Base...</span>
            </div>
          )}
        </div>

        {/* Input Footer */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about Jainism, Tirths, Matrimonial or Businesses..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-700 text-amber-950 font-bold text-xs rounded-xl shadow-md hover:from-amber-600 hover:to-amber-800 disabled:opacity-50 transition-all flex items-center gap-1"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
