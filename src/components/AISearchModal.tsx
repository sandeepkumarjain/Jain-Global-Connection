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
  Heart,
  Building2,
  Landmark,
  Users,
  PhoneCall,
  Calendar,
  Filter,
  ArrowRight,
  Layers
} from 'lucide-react';

type SearchCategory = 'All' | 'Matrimonial' | 'Business' | 'Temple' | 'Directory' | 'Emergency' | 'Panchang';

export const AISearchModal: React.FC = () => {
  const { isAISearchOpen, setIsAISearchOpen, systemSettings, setActiveTab } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<SearchCategory>('All');
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string; category?: string }[]>([
    {
      sender: 'ai',
      text: '🙏 Jai Jinendra! Welcome to the Jain Connect Global AI Assistant. Select a portal category or ask any query across Matrimonial, Business Directory, Tirths, Member Directory, or Emergency Donors.',
      category: 'All Core Portals',
    },
  ]);
  const [loading, setLoading] = useState(false);

  if (!isAISearchOpen) return null;

  const categories: { id: SearchCategory; label: string; icon: React.ReactNode; tabKey?: 'matrimonial' | 'business' | 'temple' | 'directory' | 'emergency' | 'panchang' }[] = [
    { id: 'All', label: 'All Portals', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'Matrimonial', label: 'Matrimonial', icon: <Heart className="w-3.5 h-3.5 text-rose-500" />, tabKey: 'matrimonial' },
    { id: 'Business', label: 'Business Directory', icon: <Building2 className="w-3.5 h-3.5 text-blue-500" />, tabKey: 'business' },
    { id: 'Temple', label: 'Temples & Tirths', icon: <Landmark className="w-3.5 h-3.5 text-amber-500" />, tabKey: 'temple' },
    { id: 'Directory', label: 'Member Directory', icon: <Users className="w-3.5 h-3.5 text-emerald-500" />, tabKey: 'directory' },
    { id: 'Emergency', label: 'Emergency Donors', icon: <PhoneCall className="w-3.5 h-3.5 text-red-500" />, tabKey: 'emergency' },
    { id: 'Panchang', label: 'Jain Panchang', icon: <Calendar className="w-3.5 h-3.5 text-purple-500" />, tabKey: 'panchang' },
  ];

  const categoryPrompts: Record<SearchCategory, string[]> = {
    All: [
      'Top 5 Jain Tirths in Gujarat & Rajasthan',
      'How Gotra matching works in Matrimonial',
      'How to register a Jain Business on Directory',
      'Find O+ Blood Donors in Mumbai',
      'Navkarshi & Chouvihar timings rule',
    ],
    Matrimonial: [
      '4-Gotra exclusion rules in Jain Marriage',
      'Swetambar vs Digambar matrimonial matching criteria',
      'How to register a candidate profile for Jain Vivah',
      'Tips for inspecting verified Jain matrimonial profiles',
    ],
    Business: [
      'Verify GSTIN for a Jain Enterprise',
      'How to list my business in Jain Chamber of Commerce',
      'Find Jain textile & jewellery exporters in Ahmedabad',
      'B2B networking guidelines for Jain entrepreneurs',
    ],
    Temple: [
      'Palitana Shatrunjaya Tirth yatra rules & timing',
      'Sammed Shikharji Parasnath Hill travel guide',
      'Find temples with Dharamshala lodging & Bhojanashala',
      'Live Darshan stream & 360 Virtual Tour temples',
    ],
    Directory: [
      'Search community members by city and profession',
      'Digital QR ID Card verification for Sangh members',
      'How to update family member details in directory',
    ],
    Emergency: [
      'Find active O+ & AB+ volunteer blood donors',
      'How to register as a Jain emergency blood donor',
      '24/7 Jain Medical Helpline contacts',
    ],
    Panchang: [
      'Today\'s Navkarshi & Chouvihar sunset dinner rule',
      'Jain Kandmool prohibition & dietary guidelines',
      'Navkar Mantra breakdown & spiritual significance',
      'Samvatsari Pratikraman & Michhami Dukkadam meaning',
    ],
  };

  const getPlaceholder = (cat: SearchCategory) => {
    switch (cat) {
      case 'Matrimonial':
        return 'Search Matrimonial matches, Gotra rules, groom/bride criteria...';
      case 'Business':
        return 'Search Jain businesses, GST registered enterprises, B2B suppliers...';
      case 'Temple':
        return 'Search Tirths, Dharamshalas, Bhojanashalas, Live Darshan...';
      case 'Directory':
        return 'Search community members, family directory, professions...';
      case 'Emergency':
        return 'Search 24/7 volunteer blood donors by city and blood group...';
      case 'Panchang':
        return 'Search tithis, Chouvihar timings, Jain dietary rules, mantras...';
      default:
        return 'Ask AI across all core portals or any Jain knowledge topic...';
    }
  };

  const currentCategoryObj = categories.find((c) => c.id === selectedCategory);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || prompt;
    if (!textToSend.trim() || loading) return;

    const userMsg = textToSend.trim();
    const activeCategoryLabel = selectedCategory === 'All' ? 'All Core Portals' : selectedCategory;

    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: userMsg, category: activeCategoryLabel }
    ]);
    if (!customPrompt) setPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMsg,
          categoryFilter: selectedCategory,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: data.reply || '🙏 Jai Jinendra! Thank you for your inquiry.',
          category: data.portalCategory || activeCategoryLabel,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: '🙏 Jai Jinendra! Connection error. Please verify your internet connection or try again.',
          category: activeCategoryLabel,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleJumpToPortal = () => {
    if (currentCategoryObj?.tabKey) {
      setActiveTab(currentCategoryObj.tabKey);
      setIsAISearchOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800/80 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col h-[88vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 text-amber-100 p-4 flex items-center justify-between border-b border-amber-700/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-amber-950 flex items-center justify-center font-bold shadow-md shrink-0">
              <Sparkles className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold font-serif text-white tracking-wide">
                Jain Connect AI Search & Assistant
              </h2>
              <p className="text-[10px] text-amber-300">
                Filter by Core Portal | Powered by Gemini AI ({systemSettings.developerName})
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

        {/* Portal Category Filters Toolbar */}
        <div className="bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700/80 px-3 py-2.5">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Filter className="w-3 h-3 text-amber-500" /> Core Portal Filters:
            </span>

            {currentCategoryObj?.tabKey && (
              <button
                onClick={handleJumpToPortal}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 transition-colors"
              >
                <span>Jump to {currentCategoryObj.label} Portal</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-amber-600 text-white border-amber-500 shadow-md scale-102'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Suggested Quick Prompts based on Active Category Filter */}
        <div className="p-3 bg-amber-50/80 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-900/40 text-xs space-y-1.5 max-h-32 overflow-y-auto">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-amber-900 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-amber-600" />
              Suggested {selectedCategory === 'All' ? 'Cross-Portal' : selectedCategory} Prompts:
            </p>
            <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold">
              Click any question below to ask
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categoryPrompts[selectedCategory].map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-300 dark:border-amber-800 rounded-lg text-[11px] text-slate-800 dark:text-slate-200 transition-all text-left shadow-2xs font-medium"
              >
                {q}
              </button>
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
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'bg-amber-600 text-white font-bold shadow-xs'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-amber-600 text-white font-medium rounded-tr-none shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/60 rounded-tl-none whitespace-pre-wrap shadow-sm'
                }`}
              >
                {m.category && (
                  <div className={`text-[10px] font-extrabold mb-1.5 pb-1 border-b flex items-center justify-between ${
                    m.sender === 'user'
                      ? 'text-amber-100 border-amber-500/40'
                      : 'text-amber-700 dark:text-amber-400 border-slate-200 dark:border-slate-700'
                  }`}>
                    <span>Category Filter: <strong>{m.category}</strong></span>
                  </div>
                )}

                <div>{m.text}</div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 dark:bg-amber-900/40 border border-amber-400/40 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>

              <div className="flex-1 max-w-[80%] rounded-2xl p-4 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-tl-none space-y-2.5 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-3.5 bg-amber-300/80 dark:bg-amber-600/50 rounded-md w-36" />
                  <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-md w-24" />
                </div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-md w-full" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-md w-[92%]" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-md w-[75%]" />
                <div className="flex items-center gap-2 pt-1.5 text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Filtering {selectedCategory === 'All' ? 'all portals' : `${selectedCategory} portal`} via Jain AI...</span>
                </div>
              </div>
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
              placeholder={getPlaceholder(selectedCategory)}
              value={prompt}
              onChange={(e) => setPrompt(e.g.target.value)}
              className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-700 text-amber-950 font-bold text-xs rounded-xl shadow-md hover:from-amber-600 hover:to-amber-800 disabled:opacity-50 transition-all flex items-center gap-1 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

