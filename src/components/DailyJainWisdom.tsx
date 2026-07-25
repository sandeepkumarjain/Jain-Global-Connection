import React, { useState, useEffect, useRef } from 'react';
import {
  Quote,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Share2,
  Copy,
  Check,
  BookOpen,
  Volume2,
  VolumeX,
  Pause,
  Play
} from 'lucide-react';

interface JainQuote {
  id: string;
  source: string;
  speaker: string;
  principle: string;
  prakritText: string;
  prakritTransliteration: string;
  englishTranslation: string;
  meaningAndRelevance: string;
  themeColor: string;
}

const JAIN_QUOTES: JainQuote[] = [
  {
    id: 'quote_1',
    source: 'Acharanga Sutra (5.101)',
    speaker: 'Bhagwan Mahavir',
    principle: 'Ahimsa Parmo Dharma (Non-Violence)',
    prakritText: 'अहिंसा परमो धर्मः। सर्वभूतेषु दया विभोः।',
    prakritTransliteration: 'Ahimsa Paramo Dharmah. Sarvabhuteshu Daya Vibhoh.',
    englishTranslation: 'Non-violence is the supreme moral duty. Show compassion toward every living soul, big or small.',
    meaningAndRelevance: 'All living beings desire to live and fear pain. Treat every soul with the same tenderness you wish for yourself.',
    themeColor: 'from-amber-500/20 to-amber-900/30 text-amber-400 border-amber-500/40'
  },
  {
    id: 'quote_2',
    source: 'Dashavaikalika Sutra (6.9)',
    speaker: 'Bhagwan Mahavir',
    principle: 'Universal Friendship (Maitri Bhav)',
    prakritText: 'मित्ती मे सव्वभूएसु, वेरं मज्झं न केणइ।',
    prakritTransliteration: 'Mitti Me Savva-Bhuesu, Veram Majjham Na Kenai.',
    englishTranslation: 'I have friendship with all living beings; I harbor enmity toward none.',
    meaningAndRelevance: 'The foundational verse recited during Samvatsari Kshamavani, fostering absolute goodwill and unconditional forgiveness.',
    themeColor: 'from-emerald-500/20 to-emerald-900/30 text-emerald-400 border-emerald-500/40'
  },
  {
    id: 'quote_3',
    source: 'Tattvartha Sutra (5.21)',
    speaker: 'Acharya Umaswati',
    principle: 'Interconnectedness (Parasparopagraho Jivanam)',
    prakritText: 'परस्परोपग्रहो जीवानाम्।',
    prakritTransliteration: 'Parasparopagraho Jivanam.',
    englishTranslation: 'Souls render service to one another.',
    meaningAndRelevance: 'All life in the cosmos is interdependent. Environmental conservation, mutual aid, and harmony flow naturally from this truth.',
    themeColor: 'from-blue-500/20 to-blue-900/30 text-blue-400 border-blue-500/40'
  },
  {
    id: 'quote_4',
    source: 'Uttaradhyayana Sutra (20.37)',
    speaker: 'Bhagwan Mahavir',
    principle: 'Self-Conquest (Atmaban)',
    prakritText: 'अप्पा खलु विणेयव्वो, अप्पा हु दुज्जयो जयं।',
    prakritTransliteration: 'Appa Khalu Vineyavvo, Appa Hu Dujjayo Jayam.',
    englishTranslation: 'Conquer yourself, for self-conquest is far greater than conquering a million warriors on a battlefield.',
    meaningAndRelevance: 'True heroism is mastering anger, pride, deceit, and greed (Kashayas) within your own mind.',
    themeColor: 'from-purple-500/20 to-purple-900/30 text-purple-400 border-purple-500/40'
  },
  {
    id: 'quote_5',
    source: 'Samayasara (Verse 2)',
    speaker: 'Acharya Kundakunda',
    principle: 'Pure Consciousness (Shuddhatma)',
    prakritText: 'जीवाण सभावो णाणं, चेदणा-लक्खणो सुमग्गो।',
    prakritTransliteration: 'Jivana Sabhavo Nanam, Cedana-Lakkhano Sumaggo.',
    englishTranslation: 'The intrinsic nature of the soul is knowledge, characterized by pure consciousness.',
    meaningAndRelevance: 'Reminds us that beyond body, career, and possessions, our inner soul is eternally pure, peaceful, and omniscient.',
    themeColor: 'from-amber-600/20 to-red-900/30 text-amber-300 border-amber-600/40'
  }
];

export const DailyJainWisdom: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [copied, setCopied] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const activeQuote = JAIN_QUOTES[currentIndex];

  // Auto transition timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % JAIN_QUOTES.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + JAIN_QUOTES.length) % JAIN_QUOTES.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % JAIN_QUOTES.length);
  };

  // Copy to clipboard
  const handleCopyQuote = () => {
    const text = `"${activeQuote.englishTranslation}"\n— ${activeQuote.speaker} (${activeQuote.source})\n\nShared via Jain Connect Global`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Share to WhatsApp
  const handleShareWhatsApp = () => {
    const text = `🙏🏻 *Daily Jain Wisdom*\n\n📜 *${activeQuote.prakritText}*\n_${activeQuote.prakritTransliteration}_\n\n" ${activeQuote.englishTranslation} "\n\n📖 *Source:* ${activeQuote.speaker} - ${activeQuote.source}\n💡 *Core Teaching:* ${activeQuote.meaningAndRelevance}\n\n*Jain Connect Global Platform*`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <section className="bg-slate-900/90 dark:bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl space-y-6 relative overflow-hidden my-6">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/15 border border-amber-500/30 rounded-2xl text-amber-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-300 text-[10px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Sacred Jain Scriptures & Agams</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold font-serif text-white tracking-tight">
              Daily Jain Wisdom
            </h2>
          </div>
        </div>

        {/* Play/Pause & Carousel Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2.5 min-h-[44px] min-w-[44px] rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-all flex items-center justify-center"
            title={isPlaying ? 'Pause auto-play' : 'Resume auto-play'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={handlePrev}
            className="p-2.5 min-h-[44px] min-w-[44px] rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all active:scale-95 flex items-center justify-center"
            title="Previous Quote"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={handleNext}
            className="p-2.5 min-h-[44px] min-w-[44px] rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all active:scale-95 flex items-center justify-center"
            title="Next Quote"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Quote Card Container */}
      <div
        className="relative z-10 bg-slate-950/80 border border-amber-500/20 rounded-2xl p-6 sm:p-8 space-y-6 shadow-inner transition-all duration-500 cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsPlaying(false)}
        onMouseLeave={() => setIsPlaying(true)}
      >
        {/* Top Tag & Speaker */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="px-3.5 py-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-xs rounded-full flex items-center gap-1.5">
            <Quote className="w-3.5 h-3.5 text-amber-400" />
            <span>{activeQuote.principle}</span>
          </span>

          <span className="text-xs font-semibold text-slate-400">
            Source: <strong className="text-amber-200">{activeQuote.speaker}</strong> ({activeQuote.source})
          </span>
        </div>

        {/* Verse Display */}
        <div className="space-y-3 text-center sm:text-left">
          <p className="text-2xl sm:text-3xl font-extrabold font-serif text-amber-300 tracking-wide leading-relaxed">
            {activeQuote.prakritText}
          </p>
          <p className="text-xs font-medium text-slate-400 italic">
            Transliteration: "{activeQuote.prakritTransliteration}"
          </p>
        </div>

        {/* English Translation */}
        <div className="bg-slate-900/90 border-l-4 border-amber-500 p-4 rounded-r-xl space-y-1">
          <p className="text-base sm:text-lg font-semibold text-slate-100 italic leading-relaxed">
            "{activeQuote.englishTranslation}"
          </p>
          <p className="text-xs text-slate-400 pt-1">
            <strong className="text-amber-400">Practical Guidance:</strong> {activeQuote.meaningAndRelevance}
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800">
          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-2">
            {JAIN_QUOTES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all ${
                  currentIndex === idx
                    ? 'w-8 bg-amber-500'
                    : 'w-2.5 bg-slate-700 hover:bg-slate-600'
                }`}
                title={`Quote ${idx + 1}`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleCopyQuote}
              className="flex-1 sm:flex-none px-4 py-2.5 min-h-[44px] bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Quote'}</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="flex-1 sm:flex-none px-5 py-2.5 min-h-[44px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Share2 className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
