import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  PanditTradition,
  PanditCategory,
  PanditMessage,
  SavedPanditGuidance,
  PanditStepGuide
} from '../types';
import {
  CURATED_PANDIT_PROMPTS,
  ASHTAPRAKARI_PUJA_GUIDE,
  JAIN_CLASSICAL_SCRIPTURES,
  SACRED_JAIN_MANTRAS,
  getOfflinePanditAnswer
} from '../data/panditKnowledgeBase';
import { COMMON_PUJA_STEP_GUIDES } from '../data/pujaStepGuides';
import { StructuredPujaStepGuide } from './StructuredPujaStepGuide';
import { speechNarrator, SpeechNarratorState } from '../utils/speechNarrator';
import {
  Send,
  Sparkles,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Copy,
  Check,
  Volume2,
  VolumeX,
  RefreshCw,
  Flame,
  Award,
  ShieldAlert,
  Heart,
  Home,
  Clock,
  Compass,
  Info,
  ChevronRight,
  Share2,
  Trash2,
  FileText,
  SlidersHorizontal,
  ArrowRight,
  Pause,
  Play,
  Square,
  Radio
} from 'lucide-react';

const STORAGE_SAVED_KEY = 'jcg_saved_pandit_guidance';

export const AskPanditChatbot: React.FC<{
  embedded?: boolean;
  initialQuestion?: string;
  onClose?: () => void;
}> = ({ embedded = false, initialQuestion = '', onClose }) => {
  const { showToast, panditInitialQuestion, setPanditInitialQuestion } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'guides' | 'scriptures' | 'saved'>('chat');
  const [selectedTradition, setSelectedTradition] = useState<PanditTradition>('All Traditions');
  const [selectedCategory, setSelectedCategory] = useState<PanditCategory>('All');
  const [inputQuestion, setInputQuestion] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [activeGuideStep, setActiveGuideStep] = useState<number>(1);
  const [selectedGuideKey, setSelectedGuideKey] = useState<string>('ashtaprakari_puja');

  // Web Speech API Narrator state
  const [speechState, setSpeechState] = useState<SpeechNarratorState>(speechNarrator.getState());
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [speakingType, setSpeakingType] = useState<'explanation' | 'guide'>('explanation');
  const [speakingSavedId, setSpeakingSavedId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = speechNarrator.subscribe((state) => {
      setSpeechState(state);
      if (!state.isPlaying) {
        setSpeakingMsgId(null);
        setSpeakingSavedId(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Helper to match procedural questions with structured visual guides
  const getMatchingGuideForText = (text: string): PanditStepGuide | null => {
    const q = text.toLowerCase();
    if (q.includes('ashtaprakari') || (q.includes('puja') && (q.includes('jal') || q.includes('chandan') || q.includes('akshat') || q.includes('8') || q.includes('eight')))) {
      return COMMON_PUJA_STEP_GUIDES.ashtaprakari_puja;
    }
    if (q.includes('snatra') || (q.includes('abhishek') && (q.includes('jinendra') || q.includes('shanti') || q.includes('pakshal')))) {
      return COMMON_PUJA_STEP_GUIDES.jinendra_abhishek_snatra;
    }
    if (q.includes('samayik') || q.includes('muhpatti') || q.includes('padilehan') || q.includes('karemi bhante')) {
      return COMMON_PUJA_STEP_GUIDES.samayik_vidhi;
    }
    if (q.includes('griha pravesh') || q.includes('home entry') || q.includes('vastu') || q.includes('new house')) {
      return COMMON_PUJA_STEP_GUIDES.griha_pravesh_shanti;
    }
    if (q.includes('aarti') || q.includes('mangal divo') || q.includes('deepak')) {
      return COMMON_PUJA_STEP_GUIDES.aarti_mangal_divo;
    }
    if (q.includes('chaitya vandan') || q.includes('chaityavandan') || q.includes('devavandan')) {
      return COMMON_PUJA_STEP_GUIDES.chaitya_vandan_vidhi;
    }
    return null;
  };

  // Saved bookmark guidance in local storage
  const [savedGuidance, setSavedGuidance] = useState<SavedPanditGuidance[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_SAVED_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (_e) {
      return [];
    }
  });

  // Conversation history
  const [messages, setMessages] = useState<PanditMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'pandit',
      text: `🙏 **जय जिनेन्द्र! Jai Jinendra!**\n\nI am your **AI Pandit & Dharma Guide**, dedicated to illuminating questions on Jain rituals, temple puja procedures, daily Pachkan vows, and scriptural teachings.\n\n### What would you like to inquire about today?\n- **Temple Puja & Abhishek**: The exact vidhi of Ashtaprakari Puja, Snattra Puja, and Jinendra Abhishek.\n- **Spiritual Practices**: Samayik, Muhpatti Padilehan, Pratikraman, and Michhami Dukkadam.\n- **Fasting & Pachkan**: Navpad Oli Ayambil rules, Chauvihar, and Ekashana.\n- **Dietary Wisdom**: Why root vegetables (*kandmool*) are prohibited according to Agamas.\n- **Householder Sanskars**: Griha Pravesh (new home entry), Shanti Snatra, and Navkar Jaap.\n- **Scriptural Study**: Tattvartha Sutra (7 Tattvas), Samayasara, and Chhah Dhala.\n\n*Choose a suggested question below or enter your inquiry:*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      scripturalReferences: [
        'Tattvartha Sutra (Acharya Umasvati)',
        'Ratnakaranda Shravakachara (Acharya Samantabhadra)',
        'Yoga Shastra (Acharya Hemachandra)'
      ],
      followUpQuestions: [
        'How to perform morning Ashtaprakari Puja step-by-step?',
        'What is the exact vidhi for Samayik and Muhpatti Padilehan?',
        'Why are root vegetables (kandmool) prohibited in Jainism?'
      ]
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to latest message
  useEffect(() => {
    if (activeSubTab === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeSubTab, isGenerating]);

  // Handle external initialQuestion or context question
  useEffect(() => {
    const qToAsk = initialQuestion || panditInitialQuestion;
    if (qToAsk) {
      handleAskQuestion(qToAsk);
      if (panditInitialQuestion) {
        setPanditInitialQuestion('');
      }
    }
  }, [initialQuestion, panditInitialQuestion]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      speechNarrator.stop();
    };
  }, []);

  const handleAskQuestion = async (userQuestion: string) => {
    const q = userQuestion.trim();
    if (!q || isGenerating) return;

    // Add user message
    const userMsg: PanditMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tradition: selectedTradition,
      category: selectedCategory
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsGenerating(true);

    try {
      // Build conversation history for context
      const historyPayload = messages
        .filter((m) => m.id !== 'welcome-msg')
        .map((m) => ({
          role: m.sender,
          content: m.text
        }));

      const res = await fetch('/api/ai/ask-pandit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          category: selectedCategory,
          tradition: selectedTradition,
          history: historyPayload
        })
      });

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      const data = await res.json();

      const panditReply: PanditMessage = {
        id: `pandit-${Date.now()}`,
        sender: 'pandit',
        text: data.reply || '🙏 Jai Jinendra! May peace and spiritual knowledge guide you.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tradition: selectedTradition,
        category: selectedCategory,
        scripturalReferences: data.scripturalReferences || [],
        recommendedPachkanOrVow: data.recommendedPachkanOrVow || null,
        mantras: data.mantras || [],
        stepGuide: data.stepGuide || getMatchingGuideForText(q) || null,
        followUpQuestions: data.followUpQuestions || []
      };

      setMessages((prev) => [...prev, panditReply]);
    } catch (err) {
      console.warn('Network error, applying client-side scriptural fallback:', err);
      const fallback = getOfflinePanditAnswer(q, selectedTradition, selectedCategory);

      const panditReply: PanditMessage = {
        id: `pandit-${Date.now()}`,
        sender: 'pandit',
        text: fallback.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tradition: selectedTradition,
        category: selectedCategory,
        scripturalReferences: fallback.scripturalReferences,
        recommendedPachkanOrVow: fallback.recommendedPachkanOrVow || null,
        mantras: fallback.mantras || [],
        stepGuide: fallback.stepGuide || getMatchingGuideForText(q) || null,
        followUpQuestions: fallback.followUpQuestions
      };

      setMessages((prev) => [...prev, panditReply]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    showToast('Copied to Clipboard', 'Pandit Ji’s guidance copied to clipboard.', 'success');
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleSaveGuidance = (msg: PanditMessage) => {
    const isAlreadySaved = savedGuidance.some((item) => item.id === msg.id);
    if (isAlreadySaved) {
      const updated = savedGuidance.filter((item) => item.id !== msg.id);
      setSavedGuidance(updated);
      localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(updated));
      showToast('Bookmark Removed', 'Guidance removed from saved bookmarks.', 'info');
    } else {
      // Find matching user question if possible
      const msgIndex = messages.findIndex((m) => m.id === msg.id);
      const userQ = msgIndex > 0 && messages[msgIndex - 1].sender === 'user'
        ? messages[msgIndex - 1].text
        : 'Spiritual Guidance';

      const newEntry: SavedPanditGuidance = {
        id: msg.id,
        question: userQ,
        reply: msg.text,
        savedAt: new Date().toLocaleDateString(),
        scripturalReferences: msg.scripturalReferences,
        tradition: msg.tradition,
        category: msg.category
      };
      const updated = [newEntry, ...savedGuidance];
      setSavedGuidance(updated);
      localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(updated));
      showToast('Guidance Saved', 'Saved to your personal scriptural library.', 'success');
    }
  };

  const handleToggleSpeakExplanation = (msg: PanditMessage) => {
    if (!speechNarrator.isSupported()) {
      showToast('Speech Not Supported', 'Text-to-speech is not supported in this browser.', 'info');
      return;
    }

    const sessionId = `msg-${msg.id}-text`;
    if (speakingMsgId === msg.id && speakingType === 'explanation') {
      if (speechState.isPaused) {
        speechNarrator.resume();
      } else {
        speechNarrator.pause();
      }
      return;
    }

    setSpeakingMsgId(msg.id);
    setSpeakingType('explanation');
    setSpeakingSavedId(null);

    // Construct spoken script with context
    let spokenText = msg.text;
    if (msg.recommendedPachkanOrVow) {
      spokenText += `. Recommended Vow or Pachkan: ${msg.recommendedPachkanOrVow}.`;
    }
    if (msg.mantras && msg.mantras.length > 0) {
      spokenText += `. Sacred verse: ${msg.mantras.map((m) => `${m.verse}. Meaning: ${m.meaning}`).join('. ')}.`;
    }
    if (msg.scripturalReferences && msg.scripturalReferences.length > 0) {
      spokenText += `. Classical scriptural sources: ${msg.scripturalReferences.join(', ')}.`;
    }

    speechNarrator.speakText(spokenText, sessionId);
  };

  const handleToggleSpeakGuide = (msg: PanditMessage, guide: PanditStepGuide) => {
    if (!speechNarrator.isSupported()) {
      showToast('Speech Not Supported', 'Text-to-speech is not supported in this browser.', 'info');
      return;
    }

    const sessionId = `msg-${msg.id}-guide`;
    if (speakingMsgId === msg.id && speakingType === 'guide') {
      if (speechState.isPaused) {
        speechNarrator.resume();
      } else {
        speechNarrator.pause();
      }
      return;
    }

    setSpeakingMsgId(msg.id);
    setSpeakingType('guide');
    setSpeakingSavedId(null);

    const segments = speechNarrator.buildGuideSpeechScript(guide);
    speechNarrator.speakSegments(segments, sessionId);
  };

  const handleStopSpeech = () => {
    speechNarrator.stop();
    setSpeakingMsgId(null);
    setSpeakingSavedId(null);
  };

  const handleToggleSpeakSaved = (item: SavedPanditGuidance) => {
    if (!speechNarrator.isSupported()) {
      showToast('Speech Not Supported', 'Text-to-speech is not supported in this browser.', 'info');
      return;
    }

    const sessionId = `saved-${item.id}`;
    if (speakingSavedId === item.id) {
      if (speechState.isPaused) {
        speechNarrator.resume();
      } else {
        speechNarrator.stop();
        setSpeakingSavedId(null);
      }
      return;
    }

    setSpeakingSavedId(item.id);
    setSpeakingMsgId(null);
    const spoken = `Question: ${item.question}. Scriptural guidance from Pandit Ji: ${item.reply}`;
    speechNarrator.speakText(spoken, sessionId);
  };

  const handleSetSpeechRate = (newRate: number) => {
    speechNarrator.setRate(newRate);
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear this conversation?')) {
      setMessages([messages[0]]);
      showToast('Chat Cleared', 'Conversation history reset.', 'info');
    }
  };

  const TRADITIONS: PanditTradition[] = [
    'All Traditions',
    'Swetambar Murtipujak',
    'Digambar',
    'Sthanakvasi',
    'Terapanthi'
  ];

  const CATEGORIES: { id: PanditCategory; label: string; icon: any }[] = [
    { id: 'All', label: 'All Topics', icon: Sparkles },
    { id: 'Puja & Abhishek', label: 'Puja & Abhishek', icon: Flame },
    { id: 'Agamas & Philosophy', label: 'Agamas & Philosophy', icon: BookOpen },
    { id: 'Pachkan & Fasting', label: 'Pachkan & Fasting', icon: Award },
    { id: 'Samayik & Pratikraman', label: 'Samayik & Pratikraman', icon: Heart },
    { id: 'Dietary & Kandmool', label: 'Dietary & Kandmool', icon: ShieldAlert },
    { id: 'Sanskars & Griha Pravesh', label: 'Sanskars & Griha Pravesh', icon: Home }
  ];

  const filteredPrompts = CURATED_PANDIT_PROMPTS.filter((p) => {
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className={`w-full ${embedded ? '' : 'max-w-7xl mx-auto px-4 py-8'}`}>
      {/* Top Banner & Title Bar */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-amber-950/20 mb-6 border border-amber-500/30 relative overflow-hidden">
        {/* Subtle decorative motif */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-400/20 border-2 border-amber-300/60 flex items-center justify-center shrink-0 shadow-inner backdrop-blur-sm">
              <span className="text-3xl select-none" role="img" aria-label="Pandit Ji">🙏</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-white">
                  Ask a Pandit (पंडित जी से पूछें)
                </h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-200 border border-amber-300/30">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-amber-100/90 text-sm sm:text-base mt-1.5 max-w-2xl leading-relaxed">
                Revered scriptural answers on Jain rituals, Ashtaprakari Puja, Pachkan vows, Agamas, and daily householder ethics grounded in Classical Jain texts.
              </p>
            </div>
          </div>

          {/* Sub-tabs Navigation */}
          <div className="flex items-center gap-1.5 bg-amber-950/60 p-1.5 rounded-2xl border border-amber-400/30 backdrop-blur-md self-stretch md:self-auto justify-center overflow-x-auto">
            <button
              onClick={() => setActiveSubTab('chat')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeSubTab === 'chat'
                  ? 'bg-amber-400 text-amber-950 shadow-md shadow-amber-950/30 font-bold'
                  : 'text-amber-100 hover:text-white hover:bg-amber-900/40'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Chatbot
            </button>
            <button
              onClick={() => setActiveSubTab('guides')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeSubTab === 'guides'
                  ? 'bg-amber-400 text-amber-950 shadow-md shadow-amber-950/30 font-bold'
                  : 'text-amber-100 hover:text-white hover:bg-amber-900/40'
              }`}
            >
              <Flame className="w-4 h-4" />
              Puja Guides
            </button>
            <button
              onClick={() => setActiveSubTab('scriptures')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeSubTab === 'scriptures'
                  ? 'bg-amber-400 text-amber-950 shadow-md shadow-amber-950/30 font-bold'
                  : 'text-amber-100 hover:text-white hover:bg-amber-900/40'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Agam Canon
            </button>
            <button
              onClick={() => setActiveSubTab('saved')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeSubTab === 'saved'
                  ? 'bg-amber-400 text-amber-950 shadow-md shadow-amber-950/30 font-bold'
                  : 'text-amber-100 hover:text-white hover:bg-amber-900/40'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              Saved ({savedGuidance.length})
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: CHAT INTERFACE */}
      {activeSubTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column: Traditions, Filters & Curated Questions */}
          <div className="lg:col-span-1 space-y-4">
            {/* Tradition Selector */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-2.5">
                <Compass className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Jain Tradition / सम्प्रदाय
              </label>
              <select
                value={selectedTradition}
                onChange={(e) => setSelectedTradition(e.target.value as PanditTradition)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-100 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                {TRADITIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                Tailors ritual specifics and liturgical phrasing to your preferred tradition while honoring common tenets.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-2.5">
                <SlidersHorizontal className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Filter by Topic Category
              </label>
              <div className="flex flex-col gap-1">
                {CATEGORIES.map((cat) => {
                  const IconComponent = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-700/60'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`} />
                        {cat.label}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Visual Ritual Guides Quick Section */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-2.5">
                <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Visual Ritual Guides (विधि संग्रह)
              </label>
              <div className="space-y-1.5">
                {[
                  {
                    title: 'Ashtaprakari Puja (८ पूजा)',
                    query: 'How to perform morning Ashtaprakari Puja step-by-step with 8 offerings?',
                    guideKey: 'ashtaprakari_puja',
                    icon: '✨'
                  },
                  {
                    title: 'Jinendra Abhishek & Snatra',
                    query: 'What is the step-by-step procedure for Jinendra Abhishek and Snatra Puja?',
                    guideKey: 'jinendra_abhishek_snatra',
                    icon: '💧'
                  },
                  {
                    title: 'Samayik & Muhpatti Vidhi',
                    query: 'What is the exact step-by-step vidhi for Samayik and Muhpatti Padilehan?',
                    guideKey: 'samayik_vidhi',
                    icon: '🕊️'
                  },
                  {
                    title: 'Evening Aarti & Mangal Divo',
                    query: 'How to perform evening Aarti and Mangal Divo with deepak vidhi?',
                    guideKey: 'aarti_mangal_divo',
                    icon: '🪔'
                  },
                  {
                    title: 'Griha Pravesh Shanti Vidhan',
                    query: 'What is the auspicious Jain Griha Pravesh vidhi for entering a new home?',
                    guideKey: 'griha_pravesh_shanti',
                    icon: '🏡'
                  }
                ].map((g, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedGuideKey(g.guideKey);
                      handleAskQuestion(g.query);
                    }}
                    disabled={isGenerating}
                    className="w-full text-left p-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-slate-200/80 dark:border-slate-700/80 hover:border-amber-300 dark:hover:border-amber-700 transition-all flex items-center justify-between group disabled:opacity-50"
                  >
                    <span className="flex items-center gap-2 truncate font-medium text-slate-800 dark:text-slate-200 group-hover:text-amber-700 dark:group-hover:text-amber-300">
                      <span>{g.icon}</span>
                      <span className="truncate">{g.title}</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Starters / Curated Questions */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Suggested Inquiries
              </label>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {filteredPrompts.slice(0, 5).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleAskQuestion(p.question)}
                    disabled={isGenerating}
                    className="w-full text-left p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-600 transition-all group disabled:opacity-50"
                  >
                    <p className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-amber-700 dark:group-hover:text-amber-300 leading-snug">
                      {p.question}
                    </p>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">
                      {p.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Clear conversation button */}
            {messages.length > 1 && (
              <button
                onClick={handleClearChat}
                className="w-full py-2.5 text-xs text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center justify-center gap-1.5 transition-colors border border-dashed border-slate-300 dark:border-slate-700 rounded-xl"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Reset Conversation
              </button>
            )}
          </div>

          {/* Right Column: Chat History and Input Field */}
          <div className="lg:col-span-3 flex flex-col h-[700px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
            {/* Chat header status bar */}
            <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                <div className="text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Pujya Pandit Ji Active
                  </span>
                  <span className="text-slate-400 mx-1.5">•</span>
                  <span className="text-slate-500 dark:text-slate-400">
                    Focus: {selectedTradition}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-amber-700 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800/50">
                  {selectedCategory}
                </span>
              </div>
            </div>

            {/* Message Thread Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {messages.map((msg) => {
                const isPandit = msg.sender === 'pandit';
                const isSaved = savedGuidance.some((item) => item.id === msg.id);

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isPandit ? 'justify-start' : 'justify-end'}`}
                  >
                    {isPandit && (
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-white flex items-center justify-center font-serif text-lg font-bold shadow-md shadow-amber-900/20 shrink-0 select-none">
                        🙏
                      </div>
                    )}

                    <div
                      className={`max-w-2xl rounded-3xl p-5 sm:p-6 text-sm leading-relaxed ${
                        isPandit
                          ? 'bg-slate-50 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 shadow-sm'
                          : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-medium shadow-md shadow-amber-950/10'
                      }`}
                    >
                      {/* Sender & Timestamp */}
                      <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-2.5 mb-3 text-xs">
                        <span className={`font-bold ${isPandit ? 'text-amber-700 dark:text-amber-400' : 'text-slate-950'}`}>
                          {isPandit ? 'Pujya Pandit Ji (पूज्य विद्वान)' : 'Seeker (जिज्ञासु श्रावक)'}
                        </span>
                        <span className={`text-[11px] ${isPandit ? 'text-slate-400' : 'text-slate-900/70'}`}>
                          {msg.timestamp}
                        </span>
                      </div>

                      {/* Main Message Body with clean formatting */}
                      <div className="space-y-3 whitespace-pre-line text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                        {msg.text}
                      </div>

                      {/* Structured Step-by-Step Visual Puja Guide */}
                      {isPandit && (msg.stepGuide || (msg.id !== 'welcome-msg' && getMatchingGuideForText(msg.text))) && (
                        <div className="mt-4">
                          <StructuredPujaStepGuide
                            guide={(msg.stepGuide || getMatchingGuideForText(msg.text))!}
                            onAskFollowUp={(followUpQ) => handleAskQuestion(followUpQ)}
                          />
                        </div>
                      )}

                      {/* Mantras Box if provided */}
                      {msg.mantras && msg.mantras.length > 0 && (
                        <div className="mt-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                            <Flame className="w-3.5 h-3.5 text-amber-600" />
                            Sacred Shloka / Sutra
                          </span>
                          {msg.mantras.map((m, idx) => (
                            <div key={idx} className="space-y-1">
                              <p className="font-serif font-bold text-amber-900 dark:text-amber-200 whitespace-pre-line text-sm">
                                {m.verse}
                              </p>
                              <p className="text-xs text-amber-800/90 dark:text-amber-300/90 italic">
                                {m.meaning}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Recommended Pachkan / Vow highlight */}
                      {msg.recommendedPachkanOrVow && (
                        <div className="mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2.5">
                          <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <div className="text-xs text-emerald-900 dark:text-emerald-200">
                            <span className="font-bold">Recommended Pachkan:</span> {msg.recommendedPachkanOrVow}
                          </div>
                        </div>
                      )}

                      {/* Scriptural References Badges */}
                      {msg.scripturalReferences && msg.scripturalReferences.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5 flex items-center gap-1">
                            <BookOpen className="w-3 h-3 text-amber-600" />
                            Authoritative Scriptural References:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.scripturalReferences.map((ref, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium"
                              >
                                📜 {ref}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Follow-up Suggested Inquiries */}
                      {msg.followUpQuestions && msg.followUpQuestions.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-2">
                            Explore Further with Pandit Ji:
                          </span>
                          <div className="flex flex-col gap-1.5">
                            {msg.followUpQuestions.map((fq, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleAskQuestion(fq)}
                                disabled={isGenerating}
                                className="text-left text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-900/90 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-700 dark:text-slate-300 hover:text-amber-800 dark:hover:text-amber-200 border border-slate-200 dark:border-slate-700 hover:border-amber-300 transition-all flex items-center justify-between group disabled:opacity-50"
                              >
                                <span>{fq}</span>
                                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 shrink-0 transition-transform group-hover:translate-x-0.5" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Pandit Message Action Toolbar */}
                      {isPandit && msg.id !== 'welcome-msg' && (
                        <>
                          <div className="flex items-center gap-3 mt-4 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                            <button
                              onClick={() => handleCopyText(msg.text, msg.id)}
                              className="flex items-center gap-1 text-slate-500 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                              title="Copy Guidance"
                            >
                              {copiedMessageId === msg.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-emerald-600 font-semibold">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => handleSaveGuidance(msg)}
                              className={`flex items-center gap-1 transition-colors ${
                                isSaved
                                  ? 'text-amber-700 dark:text-amber-400 font-bold'
                                  : 'text-slate-500 hover:text-amber-700 dark:hover:text-amber-400'
                              }`}
                              title={isSaved ? 'Remove Bookmark' : 'Save to Library'}
                            >
                              {isSaved ? (
                                <>
                                  <BookmarkCheck className="w-3.5 h-3.5 text-amber-600" />
                                  <span>Saved</span>
                                </>
                              ) : (
                                <>
                                  <Bookmark className="w-3.5 h-3.5" />
                                  <span>Bookmark</span>
                                </>
                              )}
                            </button>

                            {/* Listen Buttons */}
                            {(() => {
                              const matchingGuide = msg.stepGuide || getMatchingGuideForText(msg.text);
                              const isThisMsgSpeaking = speakingMsgId === msg.id && speechState.isPlaying;

                              return (
                                <div className="flex items-center gap-2 flex-wrap">
                                  {/* Listen to Scriptural Explanation */}
                                  <button
                                    type="button"
                                    onClick={() => handleToggleSpeakExplanation(msg)}
                                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                                      isThisMsgSpeaking && speakingType === 'explanation'
                                        ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                                        : 'text-slate-600 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-800'
                                    }`}
                                    title="Read aloud scriptural explanation using Web Speech API"
                                  >
                                    {isThisMsgSpeaking && speakingType === 'explanation' ? (
                                      speechState.isPaused ? (
                                        <>
                                          <Play className="w-3.5 h-3.5 fill-current" />
                                          <span>Resume</span>
                                        </>
                                      ) : (
                                        <>
                                          <Pause className="w-3.5 h-3.5 fill-current" />
                                          <span>Pause</span>
                                        </>
                                      )
                                    ) : (
                                      <>
                                        <Volume2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                                        <span>{matchingGuide ? 'Listen Explanation' : 'Listen (सुनें)'}</span>
                                      </>
                                    )}
                                  </button>

                                  {/* If message has a step-by-step puja guide, offer listening to the whole procedure */}
                                  {matchingGuide && (
                                    <button
                                      type="button"
                                      onClick={() => handleToggleSpeakGuide(msg, matchingGuide)}
                                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                                        isThisMsgSpeaking && speakingType === 'guide'
                                          ? 'bg-emerald-600 text-white font-bold shadow-xs'
                                          : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                                      }`}
                                      title="Read aloud the step-by-step puja procedure"
                                    >
                                      {isThisMsgSpeaking && speakingType === 'guide' ? (
                                        speechState.isPaused ? (
                                          <>
                                            <Play className="w-3.5 h-3.5 fill-current" />
                                            <span>Resume Guide</span>
                                          </>
                                        ) : (
                                          <>
                                            <Pause className="w-3.5 h-3.5 fill-current" />
                                            <span>Pause Guide</span>
                                          </>
                                        )
                                      ) : (
                                        <>
                                          <Volume2 className="w-3.5 h-3.5" />
                                          <span>Listen Puja Guide</span>
                                        </>
                                      )}
                                    </button>
                                  )}

                                  {isThisMsgSpeaking && (
                                    <button
                                      type="button"
                                      onClick={handleStopSpeech}
                                      className="p-1 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                      title="Stop Audio"
                                    >
                                      <Square className="w-3.5 h-3.5 fill-current" />
                                    </button>
                                  )}
                                </div>
                              );
                            })()}
                          </div>

                          {/* Inline Audio Player Ribbon when this message is being recited */}
                          {speakingMsgId === msg.id && speechState.isPlaying && (
                            <div className="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-between flex-wrap gap-2 text-xs">
                              <div className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                </span>
                                <span className="font-semibold text-amber-900 dark:text-amber-200">
                                  {speechState.isPaused
                                    ? 'Speech Narration Paused'
                                    : speakingType === 'guide'
                                    ? 'Reading Puja Procedure Step-by-Step...'
                                    : 'Reading Scriptural Guidance Aloud...'}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-slate-500 font-medium">Speed:</span>
                                {[0.85, 1.0, 1.15].map((rate) => (
                                  <button
                                    key={rate}
                                    type="button"
                                    onClick={() => handleSetSpeechRate(rate)}
                                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                      Math.abs(speechState.rate - rate) < 0.05
                                        ? 'bg-amber-500 text-slate-950'
                                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                    }`}
                                  >
                                    {rate === 0.85 ? '0.85x' : rate === 1.0 ? '1.0x' : '1.15x'}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Generating Animation Indicator */}
              {isGenerating && (
                <div className="flex items-start gap-3 justify-start">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-white flex items-center justify-center font-serif text-lg font-bold shadow-md shadow-amber-900/20 shrink-0">
                    🙏
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 max-w-md shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 bg-amber-600 rounded-full animate-bounce"></div>
                        <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                      </div>
                      <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                        Pujya Pandit Ji is consulting Agamas & scriptures...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAskQuestion(inputQuestion);
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inputQuestion}
                    onChange={(e) => setInputQuestion(e.target.value)}
                    placeholder="Ask about rituals, Ashtaprakari Puja, Samayik, Pachkan, Agamas..."
                    disabled={isGenerating}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl px-4 py-3.5 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!inputQuestion.trim() || isGenerating}
                  className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm shadow-md shadow-amber-950/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 shrink-0"
                >
                  <span>Ask</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* Reverent Disclaimer */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2 px-1">
                <span>
                  ⚖️ Based on standard Jain Agamas, Tattvartha Sutra & classical Puja Paddhati.
                </span>
                <span>Jai Jinendra 🙏</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: PUJA GUIDES TAB */}
      {activeSubTab === 'guides' && (
        <div className="space-y-6">
          {/* Ritual Selector Navigation */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  Jain Vidhi & Ritual Compendium (विधि संग्रह)
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-white mt-1">
                  Step-by-Step Puja Procedures
                </h2>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Interactive checklist & icon-based visual guides
              </span>
            </div>

            {/* Guide Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {[
                { key: 'ashtaprakari_puja', label: 'Ashtaprakari', hindi: '८ प्रकार पूजा', icon: '✨' },
                { key: 'jinendra_abhishek_snatra', label: 'Abhishek & Snatra', hindi: 'अभिषेक व स्नात्र', icon: '💧' },
                { key: 'samayik_vidhi', label: 'Samayik Sadhana', hindi: 'सामायिक विधि', icon: '🕊️' },
                { key: 'aarti_mangal_divo', label: 'Evening Aarti', hindi: 'आरती व दीवो', icon: '🪔' },
                { key: 'griha_pravesh_shanti', label: 'Griha Pravesh', hindi: 'गृह प्रवेश विधान', icon: '🏡' },
                { key: 'chaitya_vandan_vidhi', label: 'Chaitya Vandan', hindi: 'चैत्यवंदन विधि', icon: '🔔' }
              ].map((item) => {
                const isSelected = selectedGuideKey === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => setSelectedGuideKey(item.key)}
                    className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-600 shadow-sm shadow-amber-950/20'
                        : 'bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <span className="text-xl mb-1">{item.icon}</span>
                    <div>
                      <div className="text-xs font-bold leading-tight">{item.label}</div>
                      <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-slate-900/80 font-semibold' : 'text-slate-400'}`}>
                        {item.hindi}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Guide Display using StructuredPujaStepGuide */}
          <StructuredPujaStepGuide
            guide={COMMON_PUJA_STEP_GUIDES[selectedGuideKey] || COMMON_PUJA_STEP_GUIDES.ashtaprakari_puja}
            onAskFollowUp={(q) => {
              setActiveSubTab('chat');
              handleAskQuestion(q);
            }}
          />
        </div>
      )}

      {/* VIEW 3: CLASSICAL SCRIPTURES CANON */}
      {activeSubTab === 'scriptures' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-white mb-2">
              Jain Canonical Scriptures Compendium (आगम एवं ग्रंथ सार)
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm max-w-3xl mb-6">
              The sacred scriptures that form the foundational bedrock for Jain rituals, metaphysics, epistemology, and ethical conduct.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {JAIN_CLASSICAL_SCRIPTURES.map((scrip, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 space-y-4 hover:border-amber-400 dark:hover:border-amber-600 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-semibold">
                        {scrip.tradition}
                      </span>
                      <span className="text-slate-400">{scrip.period}</span>
                    </div>

                    <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
                      {scrip.title}
                    </h3>

                    <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                      Composed by: {scrip.author}
                    </p>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {scrip.coreTheme}
                    </p>

                    <div className="space-y-1.5 pt-2">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Key Sections:
                      </span>
                      <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                        {scrip.keyChapters.map((ch, cIdx) => (
                          <li key={cIdx} className="flex items-start gap-1.5">
                            <span className="text-amber-500 font-bold">•</span>
                            <span>{ch}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => {
                        setActiveSubTab('chat');
                        handleAskQuestion(`Tell me in detail about ${scrip.title} by ${scrip.author} and its spiritual teachings.`);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-amber-200 dark:border-amber-800/40"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Ask Pandit Ji about this scripture →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: SAVED GUIDANCE BOOKMARKS */}
      {activeSubTab === 'saved' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
                Saved Scriptural Guidance ({savedGuidance.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Your bookmarked responses from Pandit Ji for personal reflection and study.
              </p>
            </div>

            {savedGuidance.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Clear all saved bookmarks?')) {
                    setSavedGuidance([]);
                    localStorage.removeItem(STORAGE_SAVED_KEY);
                    showToast('Bookmarks Cleared', 'All saved guidance entries cleared.', 'info');
                  }
                }}
                className="text-xs text-rose-600 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All
              </button>
            )}
          </div>

          {savedGuidance.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto text-2xl">
                🔖
              </div>
              <h3 className="font-serif font-bold text-lg text-slate-800 dark:text-slate-200">
                No Saved Guidance Yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                While chatting with Pandit Ji, click the "Bookmark" icon on any answer to store it here for future reference.
              </p>
              <button
                onClick={() => setActiveSubTab('chat')}
                className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-600 transition-colors inline-flex items-center gap-1.5"
              >
                Go to Pandit Chat →
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {savedGuidance.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="font-bold text-base text-slate-900 dark:text-white font-serif">
                      {item.question}
                    </h4>
                    <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                      <span className="text-[11px] text-slate-400">{item.savedAt}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleSpeakSaved(item)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          speakingSavedId === item.id && speechState.isPlaying
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-amber-50 border border-slate-200 dark:border-slate-600'
                        }`}
                        title="Listen to saved guidance using Web Speech API"
                      >
                        {speakingSavedId === item.id && speechState.isPlaying ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5" />
                            <span>Stop Audio</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                            <span>Listen (सुनें)</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          const updated = savedGuidance.filter((g) => g.id !== item.id);
                          setSavedGuidance(updated);
                          localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(updated));
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {speakingSavedId === item.id && speechState.isPlaying && (
                    <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-400/30 flex items-center justify-between text-xs">
                      <span className="font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                        <Radio className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                        Reading saved guidance...
                      </span>
                      <div className="flex items-center gap-1">
                        {[0.85, 1.0, 1.15].map((rate) => (
                          <button
                            key={rate}
                            type="button"
                            onClick={() => handleSetSpeechRate(rate)}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              Math.abs(speechState.rate - rate) < 0.05
                                ? 'bg-amber-500 text-slate-950'
                                : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {rate === 0.85 ? '0.85x' : rate === 1.0 ? '1.0x' : '1.15x'}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                    {item.reply}
                  </p>

                  {item.scripturalReferences && item.scripturalReferences.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {item.scripturalReferences.map((ref, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                        >
                          📜 {ref}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
