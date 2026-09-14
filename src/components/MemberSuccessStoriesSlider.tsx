import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Star,
  Heart,
  Sparkles,
  CheckCircle2,
  Quote,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Share2,
  Play,
  Pause,
  MapPin,
  Building2,
  Users,
  Award,
  GraduationCap,
  Building,
  Check,
  Send,
  MessageSquareQuote,
  ShieldCheck,
  ThumbsUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MemberSuccessStory, SuccessStoryCategory } from '../types';
import { INITIAL_MEMBER_SUCCESS_STORIES } from '../data/memberSuccessStories';

const STORAGE_KEY = 'jcg_community_member_success_stories_v1';
const LIKES_STORAGE_KEY = 'jcg_member_story_liked_ids_v1';

const CATEGORY_TABS: { id: SuccessStoryCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'All', label: 'All Stories', icon: Sparkles },
  { id: 'Matrimonial', label: 'Matrimonial & Family', icon: Heart },
  { id: 'Business', label: 'Business & Trade', icon: Building2 },
  { id: 'Temple & Tirth', label: 'Temple & Tirth', icon: Building },
  { id: 'Community & Seva', label: 'Community & Seva', icon: Users },
  { id: 'Youth & Mentorship', label: 'Youth & Mentorship', icon: GraduationCap },
];

export const MemberSuccessStoriesSlider: React.FC = () => {
  const { currentUser, showToast } = useApp();

  // Stories State (loaded from storage or default)
  const [stories, setStories] = useState<MemberSuccessStory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading saved member stories:', e);
    }
    return INITIAL_MEMBER_SUCCESS_STORIES;
  });

  // Track liked IDs
  const [likedStoryIds, setLikedStoryIds] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(LIKES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Category Filtering
  const [activeCategory, setActiveCategory] = useState<SuccessStoryCategory>('All');

  // Active Slide Index
  const [currentIndex, setCurrentIndex] = useState(0);

  // Autoplay State
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Modal State for submitting feedback / story
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState(currentUser?.fullName || '');
  const [formSurname, setFormSurname] = useState(currentUser?.surname || '');
  const [formCity, setFormCity] = useState(currentUser?.city || '');
  const [formCountry, setFormCountry] = useState(currentUser?.country || 'India');
  const [formCategory, setFormCategory] = useState<'Matrimonial' | 'Business' | 'Temple & Tirth' | 'Community & Seva' | 'Youth & Mentorship'>('Community & Seva');
  const [formTitle, setFormTitle] = useState('');
  const [formStory, setFormStory] = useState('');
  const [formOutcome, setFormOutcome] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formSangh, setFormSangh] = useState('');
  const [formPhoto, setFormPhoto] = useState(currentUser?.profilePhoto || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtered stories by selected category
  const filteredStories = useMemo(() => {
    if (activeCategory === 'All') return stories;
    return stories.filter((s) => s.category === activeCategory);
  }, [stories, activeCategory]);

  // Ensure currentIndex stays within bounds when category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);

  // Autoplay Interval Timer
  useEffect(() => {
    if (!isAutoplay || isHovered || filteredStories.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredStories.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isAutoplay, isHovered, filteredStories.length]);

  // Persist stories
  const saveStories = (newStories: MemberSuccessStory[]) => {
    setStories(newStories);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStories));
    } catch (e) {
      console.error('Failed to persist member stories:', e);
    }
  };

  // Like Story Handler
  const handleToggleLike = (storyId: string) => {
    const isLiked = !!likedStoryIds[storyId];
    const newLiked = { ...likedStoryIds, [storyId]: !isLiked };
    setLikedStoryIds(newLiked);
    try {
      localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(newLiked));
    } catch (e) {
      console.error('Error saving liked status:', e);
    }

    const updated = stories.map((s) => {
      if (s.id === storyId) {
        return {
          ...s,
          likesCount: (s.likesCount || 0) + (isLiked ? -1 : 1),
        };
      }
      return s;
    });
    saveStories(updated);

    if (!isLiked) {
      showToast('Thank You!', 'Story upvoted. Positive feedback strengthens our community.', 'success');
    }
  };

  // Navigation handlers
  const handlePrev = () => {
    if (filteredStories.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + filteredStories.length) % filteredStories.length);
  };

  const handleNext = () => {
    if (filteredStories.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % filteredStories.length);
  };

  // Copy Quote Handler
  const handleCopyStory = (story: MemberSuccessStory) => {
    const textToCopy = `"${story.title}"\n\n${story.story}\n\n— ${story.memberName} ${story.memberSurname || ''} (${story.city}, ${story.country}) | Jain Connect Global`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(story.id);
    showToast('Copied to Clipboard', 'Success story testimonial copied.', 'info');
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Submit New Story Handler
  const handleSubmitStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formTitle.trim() || !formStory.trim()) {
      showToast('Missing Fields', 'Please provide your name, story headline, and detailed feedback.', 'error');
      return;
    }

    setIsSubmitting(true);

    const newStory: MemberSuccessStory = {
      id: `story-${Date.now()}`,
      memberName: formName.trim(),
      memberSurname: formSurname.trim() || undefined,
      memberPhoto: formPhoto.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      memberId: currentUser?.id ? `JCG-MEM-${currentUser.id.slice(0, 4).toUpperCase()}` : `JCG-IND-${Math.floor(1000 + Math.random() * 9000)}`,
      city: formCity.trim() || 'India',
      country: formCountry.trim() || 'India',
      category: formCategory,
      title: formTitle.trim(),
      story: formStory.trim(),
      keyOutcome: formOutcome.trim() || 'Verified Positive Community Experience',
      rating: formRating,
      date: new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date()),
      isVerifiedMember: !!currentUser,
      sanghAffiliation: formSangh.trim() || undefined,
      likesCount: 1,
      featured: true,
    };

    const updated = [newStory, ...stories];
    saveStories(updated);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#f59e0b', '#10b981', '#fbbf24', '#059669'],
      });
    } catch {
      // Confetti fallback
    }

    // Switch to category to view the new story
    setActiveCategory(formCategory);
    setCurrentIndex(0);
    setIsSubmitModalOpen(false);
    setIsSubmitting(false);

    // Reset Form
    setFormTitle('');
    setFormStory('');
    setFormOutcome('');
    setFormSangh('');

    showToast('Success Story Published!', 'Jai Jinendra! Your positive feedback has been published to the community slider.', 'success');
  };

  const currentStory = filteredStories[currentIndex] || filteredStories[0];

  // Helper for category badge styling
  const getCategoryBadgeStyle = (category: string) => {
    switch (category) {
      case 'Matrimonial':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'Business':
        return 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Temple & Tirth':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Youth & Mentorship':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    }
  };

  return (
    <section
      id="member-success-stories-section"
      className="space-y-6 sm:space-y-8 print:hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100/90 dark:bg-amber-950/80 border border-amber-300/70 dark:border-amber-700/60 rounded-full text-amber-900 dark:text-amber-300 text-xs font-black uppercase tracking-wider shadow-2xs">
            <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Community Experiences & Positive Feedback</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white tracking-tight">
            Member Success Stories
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Real stories of blessed matrimonial unions, ethical trade partnerships, temple pilgrimage guidance, and compassionate emergency seva from verified Jain families across 120+ countries.
          </p>
        </div>

        {/* Share Story Action & Autoplay Toggle */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            id="toggle-autoplay-slider-btn"
            type="button"
            onClick={() => setIsAutoplay(!isAutoplay)}
            className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer ${
              isAutoplay
                ? 'bg-amber-50 dark:bg-slate-800 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-slate-700'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
            }`}
            title={isAutoplay ? 'Pause auto-sliding' : 'Resume auto-sliding'}
          >
            {isAutoplay ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span className="hidden sm:inline">Autoplay</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Paused</span>
              </>
            )}
          </button>

          <button
            id="open-share-story-modal-btn"
            type="button"
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-slate-950 font-black text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 border border-amber-300"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>Share Your Experience</span>
          </button>
        </div>
      </div>

      {/* Trust & Impact Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gradient-to-r from-amber-50/80 via-orange-50/50 to-amber-50/80 dark:from-slate-900/90 dark:via-amber-950/20 dark:to-slate-900/90 p-3 sm:p-4 rounded-2xl border border-amber-200/80 dark:border-slate-800 text-xs shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <p className="font-extrabold text-slate-900 dark:text-white">4.9 / 5.0 Rating</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Verified Member Reviews</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="font-extrabold text-slate-900 dark:text-white">1,200+ Verified</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Sangh Validated Stories</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="font-extrabold text-slate-900 dark:text-white">120+ Global Cities</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">India, USA, Belgium & More</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <ThumbsUp className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
          <div>
            <p className="font-extrabold text-slate-900 dark:text-white">98% Recommendation</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Community Trust Score</p>
          </div>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORY_TABS.map((tab) => {
          const Icon = tab.icon;
          const count = tab.id === 'All' ? stories.length : stories.filter((s) => s.category === tab.id).length;
          const isSelected = activeCategory === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategory(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer border ${
                isSelected
                  ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-amber-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-amber-600 dark:text-amber-400'}`} />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Slider Display Area */}
      {filteredStories.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center space-y-4">
          <MessageSquareQuote className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No Stories Found in "{activeCategory}"
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Be the first community member to share your inspiring journey in this category!
          </p>
          <button
            type="button"
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-5 py-2.5 bg-amber-600 text-white text-xs font-bold rounded-xl shadow-md hover:bg-amber-700 transition-colors"
          >
            Share Your Experience
          </button>
        </div>
      ) : (
        <div className="relative">
          {/* Main Card Slider with Smooth Transitions */}
          <div className="overflow-hidden rounded-3xl">
            <AnimatePresence mode="wait">
              {currentStory && (
                <motion.div
                  key={currentStory.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-amber-200/90 dark:border-slate-800 shadow-xl overflow-hidden"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                    
                    {/* Left Column: Member Profile & Visual Identity (4 cols) */}
                    <div className="lg:col-span-4 p-6 sm:p-8 bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent dark:from-slate-800/80 dark:to-slate-900 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 space-y-6">
                      <div className="space-y-4">
                        {/* Member Photo & Verified Badging */}
                        <div className="flex items-start gap-4">
                          <div className="relative shrink-0">
                            <img
                              src={
                                currentStory.memberPhoto ||
                                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
                              }
                              alt={currentStory.memberName}
                              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400/80 shadow-md"
                            />
                            {currentStory.isVerifiedMember && (
                              <div
                                className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md ring-2 ring-white dark:ring-slate-900"
                                title="Verified Sangh Member"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span
                                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${getCategoryBadgeStyle(
                                  currentStory.category
                                )}`}
                              >
                                {currentStory.category}
                              </span>
                              {currentStory.featured && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 flex items-center gap-1">
                                  <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                                  <span>Featured</span>
                                </span>
                              )}
                            </div>

                            <h4 className="text-lg font-bold text-slate-900 dark:text-white font-serif truncate">
                              {currentStory.memberName} {currentStory.memberSurname || ''}
                            </h4>

                            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate">
                              <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                              <span>
                                {currentStory.city}
                                {currentStory.state ? `, ${currentStory.state}` : ''}, {currentStory.country}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Member Code & Rating Block */}
                        <div className="p-3 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 font-medium">Digital ID:</span>
                            <span className="font-mono font-bold text-amber-900 dark:text-amber-300">
                              {currentStory.memberId || 'JCG-VERIFIED'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-700">
                            <span className="text-slate-500 font-medium">Satisfaction:</span>
                            <div className="flex items-center gap-1 text-amber-500">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < currentStory.rating
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-slate-300 dark:text-slate-600'
                                  }`}
                                />
                              ))}
                              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 ml-1">
                                {currentStory.rating}.0
                              </span>
                            </div>
                          </div>

                          {currentStory.sanghAffiliation && (
                            <div className="pt-1 border-t border-slate-100 dark:border-slate-700">
                              <p className="text-[11px] text-slate-600 dark:text-slate-300 truncate">
                                <strong className="text-slate-500 font-semibold">Sangh: </strong>
                                {currentStory.sanghAffiliation}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Date & Verified Badge */}
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                        <span>Submitted {currentStory.date}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Community Verified</span>
                        </span>
                      </div>
                    </div>

                    {/* Right Column: Testimonial Quote & Impact (8 cols) */}
                    <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                      <div className="space-y-4">
                        {/* Quote Icon & Title */}
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                            <Quote className="w-5 h-5 fill-amber-500/20" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-white leading-snug">
                              "{currentStory.title}"
                            </h4>
                          </div>
                        </div>

                        {/* Story Body */}
                        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed pl-1 sm:pl-2 border-l-2 border-amber-300/80 dark:border-amber-700/60 italic font-sans">
                          {currentStory.story}
                        </p>

                        {/* Measurable Key Outcome Banner */}
                        <div className="p-3.5 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 rounded-2xl flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                              Measurable Community Outcome
                            </p>
                            <p className="text-xs sm:text-sm font-extrabold text-emerald-950 dark:text-emerald-200 truncate">
                              {currentStory.keyOutcome}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Card Action Bar (Like, Share, Slide Counter) */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          {/* Like Button */}
                          <button
                            type="button"
                            onClick={() => handleToggleLike(currentStory.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                              likedStoryIds[currentStory.id]
                                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600'
                            }`}
                            title="Upvote / resonate with this community story"
                          >
                            <Heart
                              className={`w-3.5 h-3.5 ${
                                likedStoryIds[currentStory.id] ? 'fill-rose-500 text-rose-500' : ''
                              }`}
                            />
                            <span>{currentStory.likesCount || 0}</span>
                          </button>

                          {/* Share / Copy Button */}
                          <button
                            type="button"
                            onClick={() => handleCopyStory(currentStory)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                            title="Copy testimonial to share"
                          >
                            {copiedId === currentStory.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Share2 className="w-3.5 h-3.5" />
                                <span>Share Quote</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Slider Nav Controls */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 mr-1">
                            {String(currentIndex + 1).padStart(2, '0')} /{' '}
                            {String(filteredStories.length).padStart(2, '0')}
                          </span>

                          <button
                            id="slider-prev-story-btn"
                            type="button"
                            onClick={handlePrev}
                            className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 shadow-xs"
                            title="Previous Success Story"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>

                          <button
                            id="slider-next-story-btn"
                            type="button"
                            onClick={handleNext}
                            className="w-8 h-8 rounded-xl bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center transition-colors cursor-pointer shadow-md shadow-amber-600/20"
                            title="Next Success Story"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dots Pagination Below Card */}
          <div className="flex items-center justify-center gap-1.5 pt-4">
            {filteredStories.map((story, idx) => (
              <button
                key={story.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === currentIndex
                    ? 'w-6 h-2 bg-amber-600 dark:bg-amber-500'
                    : 'w-2 h-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                }`}
                title={`Jump to story ${idx + 1}: ${story.title}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Grid of Preview Mini Cards (Quick Thumbnails to jump between experiences) */}
      {filteredStories.length > 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {filteredStories.slice(0, 4).map((story, index) => {
            const isActive = filteredStories[currentIndex]?.id === story.id;
            return (
              <button
                key={story.id}
                type="button"
                onClick={() => {
                  const targetIdx = filteredStories.findIndex((s) => s.id === story.id);
                  if (targetIdx !== -1) setCurrentIndex(targetIdx);
                }}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between gap-2 shadow-xs ${
                  isActive
                    ? 'bg-amber-50/80 dark:bg-slate-800 border-amber-400 dark:border-amber-600 ring-2 ring-amber-400/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-amber-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={story.memberPhoto}
                    alt={story.memberName}
                    className="w-8 h-8 rounded-xl object-cover border border-amber-300 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {story.memberName} {story.memberSurname || ''}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">{story.city}</p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-snug">
                  "{story.title}"
                </p>
                <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-100 dark:border-slate-800 text-slate-400">
                  <span className="font-semibold text-amber-700 dark:text-amber-400">{story.category}</span>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    <Star className="w-2.5 h-2.5 fill-amber-400" />
                    <span>{story.rating}.0</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Share Your Story / Experience Submission Modal */}
      {isSubmitModalOpen && (
        <div
          id="member-story-submission-modal"
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto"
          onClick={() => setIsSubmitModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-amber-300/80 dark:border-slate-800 rounded-3xl w-full max-w-xl p-5 sm:p-7 shadow-2xl space-y-4 text-slate-800 dark:text-slate-100 relative my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs">
                  <MessageSquareQuote className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-serif">
                    Share Your Community Success Story
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Inspire the global Jain community with your positive feedback & blessings.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Submission Form */}
            <form onSubmit={handleSubmitStory} className="space-y-4 text-xs">
              
              {/* Row 1: Name & Surname */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    First / Family Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Paras & Vidhi"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Surname / Gotra</label>
                  <input
                    type="text"
                    value={formSurname}
                    onChange={(e) => setFormSurname(e.target.value)}
                    placeholder="e.g. Shah / Lodha"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 2: Location & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    placeholder="e.g. Mumbai"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Country</label>
                  <input
                    type="text"
                    value={formCountry}
                    onChange={(e) => setFormCountry(e.target.value)}
                    placeholder="e.g. India"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="Matrimonial">Matrimonial & Family</option>
                    <option value="Business">Business & Trade</option>
                    <option value="Temple & Tirth">Temple & Tirth</option>
                    <option value="Community & Seva">Community & Seva</option>
                    <option value="Youth & Mentorship">Youth & Mentorship</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Rating Selection */}
              <div className="space-y-1.5 p-3 rounded-xl bg-amber-50/70 dark:bg-slate-800/60 border border-amber-200/80 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">Your Experience Rating</p>
                  <p className="text-[11px] text-slate-500">How would you rate Jain Connect Global?</p>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormRating(star)}
                      className="p-1 cursor-pointer hover:scale-115 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= formRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-bold text-slate-700 dark:text-slate-300 ml-1 text-xs">
                    {formRating} / 5
                  </span>
                </div>
              </div>

              {/* Row 4: Story Title */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Headline / Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Found our ideal life partner with aligned values and Gotra traditions"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Row 5: Detailed Story Feedback */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Detailed Story & Experience <span className="text-rose-500">*</span></span>
                  <span className="text-[10px] text-slate-400 font-mono">{formStory.length}/500</span>
                </label>
                <textarea
                  required
                  rows={4}
                  maxLength={500}
                  value={formStory}
                  onChange={(e) => setFormStory(e.target.value)}
                  placeholder="Share how the platform helped you or your family (e.g. how you connected, verification comfort, community trust, sangh guidance)..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
                />
              </div>

              {/* Row 6: Key Measurable Outcome */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Measurable Key Outcome / Milestone
                </label>
                <input
                  type="text"
                  value={formOutcome}
                  onChange={(e) => setFormOutcome(e.target.value)}
                  placeholder="e.g. Blessed Vivah within 3 months • ₹10L Business Synergy • Successful Tirth Yatra"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Row 7: Sangh Affiliation & Photo URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Sangh Affiliation (Optional)</label>
                  <input
                    type="text"
                    value={formSangh}
                    onChange={(e) => setFormSangh(e.target.value)}
                    placeholder="e.g. Shree Jain Swetambar Sangh, Walkeshwar"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Photo URL (Optional)</label>
                  <input
                    type="url"
                    value={formPhoto}
                    onChange={(e) => setFormPhoto(e.target.value)}
                    placeholder="https://... (or leaves default avatar)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-slate-950 font-black shadow-md shadow-amber-600/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 hover:scale-[1.02] active:scale-95 border border-amber-300"
                >
                  {isSubmitting ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Publish Story</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
