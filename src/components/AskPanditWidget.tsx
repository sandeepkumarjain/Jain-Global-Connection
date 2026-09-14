import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Send, Flame, BookOpen, Heart, ArrowRight, ShieldCheck } from 'lucide-react';
import { CURATED_PANDIT_PROMPTS } from '../data/panditKnowledgeBase';

export const AskPanditWidget: React.FC = () => {
  const { openAskPanditWithQuestion, setActiveTab } = useApp();
  const [quickQuestion, setQuickQuestion] = useState('');

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuestion.trim()) return;
    openAskPanditWithQuestion(quickQuestion);
  };

  const handlePromptClick = (question: string) => {
    openAskPanditWithQuestion(question);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 text-white flex items-center justify-center font-serif text-lg font-bold shadow-sm shrink-0">
            🙏
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base font-serif text-slate-900 dark:text-white">
                Ask a Pandit (AI Dharma Guide)
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/40">
                Gemini 3.8
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Instant scriptural answers on rituals, Ashtaprakari Puja, Pachkan vows & Agamas
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('pandit')}
          className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 flex items-center gap-1 transition-colors whitespace-nowrap pt-1"
        >
          <span>Full Suite</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Inline Quick Search/Ask Box */}
      <form onSubmit={handleQuickSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={quickQuestion}
            onChange={(e) => setQuickQuestion(e.target.value)}
            placeholder="Ask Pandit Ji a ritual or scriptural question..."
            className="w-full bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <button
          type="submit"
          disabled={!quickQuestion.trim()}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 shrink-0"
        >
          <span>Ask</span>
          <Send className="w-3 h-3" />
        </button>
      </form>

      {/* Curated Quick Question Chips */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          Popular Scriptural Inquiries:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {CURATED_PANDIT_PROMPTS.slice(0, 4).map((p) => (
            <button
              key={p.id}
              onClick={() => handlePromptClick(p.question)}
              className="text-left p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-slate-200/80 dark:border-slate-700/80 hover:border-amber-300 dark:hover:border-amber-700 transition-all flex items-start gap-2 group"
            >
              <span className="text-amber-500 mt-0.5">•</span>
              <span className="text-slate-700 dark:text-slate-300 group-hover:text-amber-800 dark:group-hover:text-amber-300 font-medium leading-snug line-clamp-2">
                {p.question}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Scriptural Authority Trust Badge */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          Grounded in Tattvartha Sutra, Yoga Shastra & Agamas
        </span>
        <button
          onClick={() => setActiveTab('pandit')}
          className="text-amber-700 dark:text-amber-400 hover:underline font-medium"
        >
          View 8-Fold Puja Guide →
        </button>
      </div>
    </div>
  );
};
