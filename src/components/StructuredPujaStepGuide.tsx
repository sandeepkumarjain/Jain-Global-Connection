import React, { useState, useEffect, useId } from 'react';
import { PanditStepGuide, PanditPujaStep } from '../types';
import { speechNarrator, SpeechNarratorState } from '../utils/speechNarrator';
import {
  Droplets,
  Sparkles,
  Flower2,
  Flame,
  Sun,
  Star,
  Heart,
  ShieldCheck,
  Bell,
  Moon,
  Feather,
  CheckCircle2,
  Clock,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  Copy,
  Layers,
  ListOrdered,
  BookOpen,
  Info,
  HelpCircle,
  RotateCcw,
  Volume2,
  VolumeX,
  Pause,
  Play,
  Square,
  Radio,
  Image as ImageIcon,
  Maximize2,
  Eye,
  X,
  Camera,
  Compass,
  Music,
  Sliders,
  Bookmark,
  BookmarkCheck,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PujaProceduralAnimation, ProceduralAnimationType } from './PujaProceduralAnimation';
import { pujaAmbientAudio, AmbientSoundMode } from '../utils/pujaAmbientAudio';

interface StructuredPujaStepGuideProps {
  guide: PanditStepGuide;
  compact?: boolean;
  onAskFollowUp?: (question: string) => void;
}

export const StructuredPujaStepGuide: React.FC<StructuredPujaStepGuideProps> = ({
  guide,
  compact = false,
  onAskFollowUp
}) => {
  const guideInstanceId = useId();
  const { toggleSavedRitual, isRitualSaved, currentUser, openSavedRitualsProfile } = useApp();
  const isSaved = isRitualSaved(guide.id);

  const handleToggleSave = () => {
    toggleSavedRitual({
      id: guide.id,
      title: guide.title,
      hindiTitle: guide.hindiTitle,
      tradition: guide.tradition,
      category: guide.category,
      durationMinutes: guide.estimatedDurationMinutes,
      totalSteps: guide.steps.length
    });
  };

  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'list' | 'stepper'>(compact ? 'list' : 'list');
  const [completedStepNumbers, setCompletedStepNumbers] = useState<number[]>([]);
  const [showPreps, setShowPreps] = useState<boolean>(!compact);
  const [copiedMantra, setCopiedMantra] = useState<string | null>(null);
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({});
  const [showVisualAidHero, setShowVisualAidHero] = useState<boolean>(true);
  const [stepMediaTab, setStepMediaTab] = useState<Record<number, 'animation' | 'photo'>>({});
  const [stepperMediaTab, setStepperMediaTab] = useState<'animation' | 'photo'>('animation');
  const [zoomedAnimation, setZoomedAnimation] = useState<{
    type: ProceduralAnimationType;
    title: string;
  } | null>(null);
  const [zoomedImage, setZoomedImage] = useState<{
    url: string;
    alt?: string;
    caption?: string;
    title?: string;
  } | null>(null);

  // Audio Speech state
  const [speechState, setSpeechState] = useState<SpeechNarratorState>(speechNarrator.getState());
  const [currentNarratingStep, setCurrentNarratingStep] = useState<number | undefined>(undefined);
  const [activeAudioSession, setActiveAudioSession] = useState<string | null>(null);
  const [singleStepId, setSingleStepId] = useState<number | null>(null);

  // Ambient Temple Soundscape state
  const [ambientAudioState, setAmbientAudioState] = useState(pujaAmbientAudio.getState());
  const [showAmbientSettings, setShowAmbientSettings] = useState<boolean>(false);

  useEffect(() => {
    const unsubAmbient = pujaAmbientAudio.subscribe((state) => {
      setAmbientAudioState(state);
    });
    return () => {
      unsubAmbient();
    };
  }, []);

  // Stop ambient sound on unmount if playing in this session
  useEffect(() => {
    return () => {
      pujaAmbientAudio.stop(false);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = speechNarrator.subscribe((state) => {
      setSpeechState(state);
      if (!state.isPlaying) {
        setCurrentNarratingStep(undefined);
        setSingleStepId(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // When unmounting, if this component was narrating, stop speech
  useEffect(() => {
    return () => {
      if (activeAudioSession && speechNarrator.getCurrentSessionId() === activeAudioSession) {
        speechNarrator.stop();
      }
    };
  }, [activeAudioSession]);

  const isCurrentGuidePlaying =
    speechState.isPlaying && activeAudioSession === `guide-${guideInstanceId}`;

  const handleToggleListenGuide = () => {
    if (!speechNarrator.isSupported()) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isCurrentGuidePlaying) {
      if (speechState.isPaused) {
        speechNarrator.resume();
      } else {
        speechNarrator.pause();
      }
      return;
    }

    // Start narrating this guide
    const sessionId = `guide-${guideInstanceId}`;
    setActiveAudioSession(sessionId);
    setSingleStepId(null);

    const segments = speechNarrator.buildGuideSpeechScript(guide);
    speechNarrator.speakSegments(segments, sessionId, (stepIdx) => {
      setCurrentNarratingStep(stepIdx);
      if (typeof stepIdx === 'number' && viewMode === 'stepper') {
        setActiveStepIndex(stepIdx);
      }
    });
  };

  const handleStopSpeech = () => {
    speechNarrator.stop();
    setActiveAudioSession(null);
    setCurrentNarratingStep(undefined);
    setSingleStepId(null);
  };

  const handleToggleListenStep = (step: PanditPujaStep, index: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!speechNarrator.isSupported()) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    const stepSession = `step-${guideInstanceId}-${step.stepNumber}`;
    if (speechState.isPlaying && singleStepId === step.stepNumber) {
      if (speechState.isPaused) {
        speechNarrator.resume();
      } else {
        handleStopSpeech();
      }
      return;
    }

    setActiveAudioSession(stepSession);
    setSingleStepId(step.stepNumber);
    setCurrentNarratingStep(index);

    const stepScript = speechNarrator.buildStepSpeechScript(step);
    speechNarrator.speakText(stepScript, stepSession);
  };

  const handleSetSpeechRate = (newRate: number) => {
    speechNarrator.setRate(newRate);
  };

  const totalSteps = guide.steps.length;
  const completedCount = completedStepNumbers.length;
  const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  const toggleStepCompleted = (stepNumber: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCompletedStepNumbers((prev) =>
      prev.includes(stepNumber) ? prev.filter((s) => s !== stepNumber) : [...prev, stepNumber]
    );
  };

  const toggleStepExpand = (stepNumber: number) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [stepNumber]: !prev[stepNumber]
    }));
  };

  const handleCopyMantra = (mantraText: string, id: string) => {
    navigator.clipboard.writeText(mantraText);
    setCopiedMantra(id);
    setTimeout(() => setCopiedMantra(null), 2000);
  };

  const handleResetProgress = () => {
    setCompletedStepNumbers([]);
    setActiveStepIndex(0);
  };

  // Helper to render distinct spiritual icons for each ritual step
  const renderStepIcon = (iconKey?: string, isCompleted = false) => {
    const key = (iconKey || '').toLowerCase();
    const baseClass = `w-5 h-5 sm:w-6 sm:h-6 transition-transform ${isCompleted ? 'text-emerald-500' : ''}`;

    switch (key) {
      case 'water':
      case 'jal':
      case 'droplets':
        return <Droplets className={`${baseClass} text-cyan-500`} />;
      case 'sparkles':
      case 'chandan':
      case 'keshar':
        return <Sparkles className={`${baseClass} text-amber-500`} />;
      case 'flower':
      case 'pushpa':
        return <Flower2 className={`${baseClass} text-rose-500`} />;
      case 'flame':
      case 'dhoop':
      case 'aarti':
        return <Flame className={`${baseClass} text-orange-500`} />;
      case 'sun':
      case 'deep':
      case 'light':
        return <Sun className={`${baseClass} text-amber-500`} />;
      case 'star':
      case 'akshat':
      case 'swastika':
        return <Star className={`${baseClass} text-purple-500`} />;
      case 'heart':
      case 'naivedya':
      case 'karuna':
        return <Heart className={`${baseClass} text-emerald-500`} />;
      case 'shield':
      case 'phal':
      case 'moksha':
        return <ShieldCheck className={`${baseClass} text-indigo-500`} />;
      case 'bell':
      case 'ghanta':
        return <Bell className={`${baseClass} text-yellow-500`} />;
      case 'moon':
      case 'dhyan':
        return <Moon className={`${baseClass} text-blue-400`} />;
      case 'feather':
      case 'vasakshep':
        return <Feather className={`${baseClass} text-amber-400`} />;
      default:
        return <CheckCircle2 className={`${baseClass} text-amber-600`} />;
    }
  };

  // Background tint for icon wrapper
  const getIconWrapperBg = (iconKey?: string, isCompleted = false) => {
    if (isCompleted) {
      return 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-600';
    }
    const key = (iconKey || '').toLowerCase();
    switch (key) {
      case 'water':
      case 'jal':
        return 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800';
      case 'sparkles':
      case 'chandan':
        return 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800';
      case 'flower':
      case 'pushpa':
        return 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800';
      case 'flame':
      case 'dhoop':
        return 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800';
      case 'sun':
      case 'deep':
        return 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800';
      case 'star':
      case 'akshat':
        return 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800';
      case 'heart':
      case 'naivedya':
        return 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800';
      case 'shield':
      case 'phal':
        return 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800';
      case 'bell':
        return 'bg-yellow-50 dark:bg-yellow-950/40 border-yellow-200 dark:border-yellow-800';
      default:
        return 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800';
    }
  };

  const activeStep = guide.steps[activeStepIndex] || guide.steps[0];

  return (
    <div className="w-full my-4 rounded-3xl bg-white dark:bg-slate-900 border border-amber-200/90 dark:border-amber-900/60 shadow-lg shadow-amber-950/5 overflow-hidden transition-all">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/15 via-amber-600/10 to-transparent p-5 sm:p-6 border-b border-amber-200/70 dark:border-amber-900/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-400/30">
                <Flame className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                {guide.procedureType || 'Ritual Step-by-Step Guide'}
              </span>
              {guide.estimatedDuration && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {guide.estimatedDuration}
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-amber-100 tracking-tight">
              {guide.title}
            </h3>
            {guide.subtitle && (
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                {guide.subtitle}
              </p>
            )}
          </div>

          {/* Action Buttons: Listen to Procedure, View Mode Toggle & Reset */}
          <div className="flex items-center gap-2 self-start sm:self-center shrink-0 flex-wrap">
            {/* Primary 'Listen to Procedure' Web Speech Button */}
            <button
              type="button"
              onClick={handleToggleListenGuide}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${
                isCurrentGuidePlaying
                  ? speechState.isPaused
                    ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950 dark:text-amber-200'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse'
                  : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
              }`}
              title="Read aloud this entire puja procedure step-by-step using Web Speech API"
            >
              {isCurrentGuidePlaying ? (
                speechState.isPaused ? (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Resume Audio</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Pause Audio</span>
                  </>
                )
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen (सुनें)</span>
                </>
              )}
            </button>

            {isCurrentGuidePlaying && (
              <button
                type="button"
                onClick={handleStopSpeech}
                className="p-1.5 rounded-xl bg-rose-100 dark:bg-rose-950/50 hover:bg-rose-200 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 transition-colors"
                title="Stop Audio"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </button>
            )}

            {/* Ambient Temple Audio (Temple Bell, Chanting, Tanpura) Toggle */}
            <div className="relative">
              <div className="inline-flex items-center rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-800/60 p-0.5 shadow-xs">
                <button
                  type="button"
                  onClick={() => pujaAmbientAudio.toggle()}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    ambientAudioState.isPlaying
                      ? 'bg-linear-to-r from-amber-500 to-orange-500 text-slate-950 shadow-xs animate-pulse'
                      : 'text-amber-900 dark:text-amber-200 hover:bg-amber-200/60 dark:hover:bg-amber-900/60'
                  }`}
                  title={
                    ambientAudioState.isPlaying
                      ? 'Pause soothing ambient temple sounds'
                      : 'Play soft temple bells, tanpura & gentle prayer chanting'
                  }
                >
                  <Bell
                    className={`w-3.5 h-3.5 transition-transform ${
                      ambientAudioState.isPlaying ? 'animate-bounce text-slate-950' : 'text-amber-600 dark:text-amber-400'
                    }`}
                  />
                  <span>{ambientAudioState.isPlaying ? 'Ambiance On' : 'Ambient Sound'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAmbientSettings((prev) => !prev)}
                  className={`p-1.5 rounded-lg text-xs transition-colors ${
                    showAmbientSettings
                      ? 'bg-amber-200 dark:bg-amber-900 text-amber-950 dark:text-white'
                      : 'text-amber-800 dark:text-amber-300 hover:bg-amber-200/50 dark:hover:bg-amber-900/50'
                  }`}
                  title="Choose ambient sound mode (Bell, Tanpura, Chanting) and volume"
                >
                  <Sliders className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Ambient Sound Settings Popover */}
              {showAmbientSettings && (
                <div className="absolute right-0 top-full mt-2 w-72 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 shadow-xl z-30 text-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                      <Music className="w-4 h-4 text-amber-600" />
                      <span>Sacred Temple Soundscape</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAmbientSettings(false)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Mode Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                      Sound Experience
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: 'temple_ambiance', label: 'Full Ambiance', sub: 'Bell + Drone + Chant' },
                        { id: 'bell', label: 'Temple Bell', sub: 'Sacred Brass Ghanta' },
                        { id: 'chant', label: 'Navkar Chant', sub: 'Gentle Recitation' },
                        { id: 'tanpura', label: 'Tanpura Drone', sub: 'Harmonic C# Drone' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => pujaAmbientAudio.setMode(item.id as AmbientSoundMode)}
                          className={`p-2 rounded-xl text-left border transition-all ${
                            ambientAudioState.mode === item.id
                              ? 'bg-amber-500/15 border-amber-500 text-amber-900 dark:text-amber-200 font-bold'
                              : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="text-xs">{item.label}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal leading-tight">
                            {item.sub}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Volume Slider */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">Ambiance Volume:</span>
                      <span className="font-bold text-amber-800 dark:text-amber-300">
                        {Math.round(ambientAudioState.volume * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="1.0"
                      step="0.05"
                      value={ambientAudioState.volume}
                      onChange={(e) => pujaAmbientAudio.setVolume(parseFloat(e.target.value))}
                      className="w-full accent-amber-500 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Manual Single Bell Ring Test */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => pujaAmbientAudio.ringTempleBell(true)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 text-amber-900 dark:text-amber-200 text-[11px] font-semibold transition-colors"
                    >
                      <Bell className="w-3 h-3 text-amber-600" />
                      <span>Ring Bell Once</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => pujaAmbientAudio.toggle()}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                        ambientAudioState.isPlaying
                          ? 'bg-rose-500 hover:bg-rose-600 text-white'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {ambientAudioState.isPlaying ? 'Mute' : 'Play'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Save to Rituals Bookmark Button */}
            <div className="inline-flex items-center gap-1">
              <button
                type="button"
                onClick={handleToggleSave}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                  isSaved
                    ? 'bg-amber-500/20 border-amber-500 text-amber-950 dark:text-amber-200 hover:bg-amber-500/30 shadow-xs'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400'
                }`}
                title={
                  currentUser
                    ? isSaved
                      ? 'Saved in your user profile rituals - click to remove'
                      : 'Bookmark this puja procedure to your profile rituals for quick future access'
                    : 'Sign in to bookmark this puja ritual to your user profile'
                }
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 fill-amber-500" />
                    <span>Saved to Rituals</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span>Save to Rituals</span>
                  </>
                )}
              </button>

              {isSaved && (
                <button
                  type="button"
                  onClick={openSavedRitualsProfile}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-slate-200 dark:border-slate-700 transition-colors"
                  title="View your saved rituals in User Profile"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'list'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Full Step-by-Step List"
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span>Full List</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('stepper')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'stepper'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Interactive Stepper"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Focus Step</span>
              </button>
            </div>

            {completedCount > 0 && (
              <button
                type="button"
                onClick={handleResetProgress}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Reset completed checklist"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Active Audio Narration Controller Bar when Playing */}
        {isCurrentGuidePlaying && (
          <div className="mt-3.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-400/40 dark:border-amber-700/50 flex items-center justify-between flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <span className="font-bold text-amber-900 dark:text-amber-200">
                {speechState.isPaused
                  ? 'Audio Narration Paused'
                  : currentNarratingStep !== undefined
                  ? `Narrating Step ${currentNarratingStep + 1}: ${guide.steps[currentNarratingStep]?.title}`
                  : 'Narrating Introduction & Derasar Protocols...'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Speed:</span>
              {[0.85, 1.0, 1.15].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => handleSetSpeechRate(rate)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-colors ${
                    Math.abs(speechState.rate - rate) < 0.05
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {rate === 0.85 ? '0.85x Calm' : rate === 1.0 ? '1.0x Normal' : '1.15x'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Ambient Temple Soundscape Active Strip */}
        {ambientAudioState.isPlaying && (
          <div className="mt-3 p-2.5 px-3.5 rounded-2xl bg-linear-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-300/80 dark:border-amber-700/70 flex items-center justify-between flex-wrap gap-2 text-xs animate-fadeIn">
            <div className="flex items-center gap-2">
              <Bell className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-bounce" />
              <span className="font-medium text-amber-950 dark:text-amber-100">
                Playing Sacred Ambiance:{' '}
                <strong className="font-bold text-amber-900 dark:text-amber-300">
                  {ambientAudioState.mode === 'temple_ambiance'
                    ? 'Temple Ambiance (Bell + Tanpura + Navkar Chanting)'
                    : ambientAudioState.mode === 'bell'
                    ? 'Temple Brass Bell Chime'
                    : ambientAudioState.mode === 'chant'
                    ? 'Gentle Navkar Mantra Chanting'
                    : 'Tanpura Meditative Drone'}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => pujaAmbientAudio.ringTempleBell(true)}
                className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 text-amber-900 dark:text-amber-200 text-[11px] font-semibold border border-amber-300/60 dark:border-amber-800 flex items-center gap-1 transition-colors"
                title="Ring brass bell"
              >
                <Bell className="w-3 h-3 text-amber-600" />
                <span>Ring Bell</span>
              </button>
              <button
                type="button"
                onClick={() => pujaAmbientAudio.stop()}
                className="px-2.5 py-0.5 rounded-lg bg-rose-100 dark:bg-rose-950/60 hover:bg-rose-200 text-rose-700 dark:text-rose-300 text-[11px] font-bold border border-rose-300 dark:border-rose-800 transition-colors"
              >
                Stop Ambiance
              </button>
            </div>
          </div>
        )}

        {/* Interactive Progress Tracking Bar */}
        <div className="mt-4 pt-4 border-t border-amber-200/50 dark:border-amber-900/40">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Puja Progress:</span>
              <strong className="text-slate-900 dark:text-white">
                {completedCount} of {totalSteps} steps completed
              </strong>
            </span>
            <span className="text-amber-700 dark:text-amber-400 font-bold">
              {progressPercent}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* RITUAL VISUAL AID HERO SHOWCASE BANNER */}
      {guide.coverImageUrl && (
        <div className="border-b border-amber-200/70 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20">
          <div className="px-5 sm:px-6 py-3 flex items-center justify-between border-b border-amber-200/50 dark:border-amber-900/40">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
                Sacred Ritual Visual Aid (चित्रमय मार्गदर्शन)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowVisualAidHero(!showVisualAidHero)}
              className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-900 flex items-center gap-1"
            >
              <span>{showVisualAidHero ? 'Hide Visual' : 'Show Visual'}</span>
              {showVisualAidHero ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {showVisualAidHero && (
            <div className="p-4 sm:p-6 flex flex-col md:flex-row items-center gap-5">
              <div
                className="relative group shrink-0 w-full md:w-64 lg:w-72 h-44 sm:h-48 rounded-2xl overflow-hidden border-2 border-amber-300/80 dark:border-amber-700/80 shadow-md bg-slate-950 cursor-pointer"
                onClick={() =>
                  setZoomedImage({
                    url: guide.coverImageUrl!,
                    alt: guide.coverImageAlt || guide.title,
                    caption: guide.coverImageCaption,
                    title: guide.title
                  })
                }
              >
                <img
                  src={guide.coverImageUrl}
                  alt={guide.coverImageAlt || guide.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-semibold backdrop-blur-xs">
                  <Maximize2 className="w-4 h-4" />
                  <span>Examine Altar Layout</span>
                </div>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-xs text-[10px] font-bold text-amber-300 border border-amber-400/30 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  <span>Click to Enlarge</span>
                </div>
              </div>

              <div className="flex-1 space-y-2 text-left w-full">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-400/30">
                    <Check className="w-3 h-3 text-emerald-500" />
                    Canonical Altar Layout Reference
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-serif">
                  {guide.coverImageAlt || guide.title}
                </h4>
                {guide.coverImageCaption && (
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                    {guide.coverImageCaption}
                  </p>
                )}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setZoomedImage({
                        url: guide.coverImageUrl!,
                        alt: guide.coverImageAlt || guide.title,
                        caption: guide.coverImageCaption,
                        title: guide.title
                      })
                    }
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-slate-700 border border-amber-300 dark:border-amber-700 transition-colors inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-600" />
                    <span>View High-Resolution Visual Guide</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preparations & Purity Protocols Accordion */}
      {(guide.preparations?.length || guide.rulesAndPurity?.length) && (
        <div className="border-b border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setShowPreps(!showPreps)}
            className="w-full px-5 sm:px-6 py-3 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Purity Protocols & Preparations (तैयारी व नियम)</span>
            </div>
            {showPreps ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showPreps && (
            <div className="px-5 sm:px-6 pb-5 pt-1 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 dark:bg-slate-900/40 text-xs">
              {guide.preparations && guide.preparations.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 text-xs">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    Essential Preparations (सामग्री व तैयारी)
                  </span>
                  <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                    {guide.preparations.map((prep, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{prep}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {guide.rulesAndPurity && guide.rulesAndPurity.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5 text-xs">
                    <Flame className="w-3.5 h-3.5 text-amber-600" />
                    Derasar Purity Rules (शुद्धि व मर्यादा)
                  </span>
                  <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                    {guide.rulesAndPurity.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE 1: STRUCTURED ICON-BASED LIST COMPONENT */}
      {viewMode === 'list' && (
        <div className="p-4 sm:p-6 space-y-4">
          {guide.steps.map((step, index) => {
            const isCompleted = completedStepNumbers.includes(step.stepNumber);
            const isLast = index === guide.steps.length - 1;
            const isExpanded = expandedSteps[step.stepNumber] !== false; // expanded by default
            const isCurrentlySpeakingThisStep =
              (isCurrentGuidePlaying && currentNarratingStep === index) ||
              (speechState.isPlaying && singleStepId === step.stepNumber);

            return (
              <div
                key={step.stepNumber}
                className={`relative rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isCurrentlySpeakingThisStep
                    ? 'ring-2 ring-amber-500 bg-amber-50/60 dark:bg-amber-950/40 border-amber-400 dark:border-amber-600 shadow-md'
                    : isCompleted
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80 shadow-sm'
                    : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700/80 shadow-sm'
                }`}
              >
                {/* Connecting subtle vertical line for list layout */}
                {!isLast && (
                  <div className="hidden sm:block absolute left-8 top-16 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700 -mb-4 z-0 pointer-events-none" />
                )}

                <div className="p-4 sm:p-5 relative z-10">
                  {/* Step Header Row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      {/* Icon Pill Component */}
                      <div
                        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl border-2 flex items-center justify-center shrink-0 shadow-sm transition-all ${getIconWrapperBg(
                          step.icon,
                          isCompleted
                        )}`}
                      >
                        {isCompleted ? (
                          <Check className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 font-bold" />
                        ) : (
                          renderStepIcon(step.icon, isCompleted)
                        )}
                      </div>

                      {/* Titles */}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                              isCompleted
                                ? 'bg-emerald-200/70 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-200'
                                : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                            }`}
                          >
                            Step {step.stepNumber} of {totalSteps}
                          </span>
                          {isCompleted && (
                            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              Completed
                            </span>
                          )}
                          {isCurrentlySpeakingThisStep && (
                            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1 animate-pulse">
                              <Radio className="w-3 h-3 text-amber-600" />
                              Reading Now
                            </span>
                          )}
                          {step.proceduralAnimation && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-900 dark:text-amber-200 border border-amber-300/80 dark:border-amber-700/80 shadow-2xs">
                              <Flame className="w-2.5 h-2.5 text-amber-500 animate-diya-flame" />
                              <span>{step.animationLabel || 'Animated Step'}</span>
                            </span>
                          )}
                        </div>
                        <h4 className="text-base sm:text-lg font-bold font-serif text-slate-900 dark:text-white mt-1">
                          {step.title}
                        </h4>
                        {step.subTitle && (
                          <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                            {step.subTitle}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Completion Checkbox, Listen to Step & Expand Button */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Individual Step Listen Button */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleListenStep(step, index, e)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          singleStepId === step.stepNumber && speechState.isPlaying
                            ? 'bg-amber-500 text-slate-950 font-bold animate-pulse shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-700 hover:bg-amber-100 dark:hover:bg-amber-950/60 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600'
                        }`}
                        title={
                          singleStepId === step.stepNumber && speechState.isPlaying
                            ? 'Stop reading this step'
                            : 'Listen to this step'
                        }
                      >
                        {singleStepId === step.stepNumber && speechState.isPlaying ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                            <span className="hidden sm:inline">Listen</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => toggleStepCompleted(step.stepNumber, e)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          isCompleted
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-700 hover:bg-amber-100 dark:hover:bg-amber-950/60 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600'
                        }`}
                        title={isCompleted ? 'Mark as Incomplete' : 'Mark as Done'}
                      >
                        <Check className={`w-3.5 h-3.5 ${isCompleted ? 'stroke-[3]' : ''}`} />
                        <span className="hidden sm:inline">{isCompleted ? 'Done' : 'Mark Done'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleStepExpand(step.stepNumber)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                        title={isExpanded ? 'Collapse' : 'Expand'}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Body Content */}
                  {isExpanded && (
                    <div className="mt-4 sm:ml-15">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                        {/* Textual & Mantra column */}
                        <div
                          className={`space-y-3.5 ${
                            step.imageUrl || step.proceduralAnimation
                              ? 'lg:col-span-7'
                              : 'lg:col-span-12'
                          }`}
                        >
                          {/* Textual Explanation */}
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs sm:text-sm">
                            {step.description}
                          </p>

                          {/* Inner Spiritual Bhavna Card */}
                          {step.bhavna && (
                            <div className="p-3.5 sm:p-4 rounded-2xl bg-linear-to-br from-amber-50 to-orange-50/30 dark:from-amber-950/40 dark:to-slate-800/80 border border-amber-200/80 dark:border-amber-800/60 text-xs">
                              <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-bold uppercase tracking-wider mb-1 text-[11px]">
                                <Heart className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                <span>आत्मिक भावना (Inner Spiritual Contemplation):</span>
                              </div>
                              <p className="text-amber-950 dark:text-amber-100 italic leading-relaxed font-serif">
                                "{step.bhavna}"
                              </p>
                            </div>
                          )}

                          {/* Sacred Mantra / Sutra */}
                          {step.mantraOrSutra && (
                            <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 flex items-start justify-between gap-3 text-xs">
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                                  Recitation Shloka / Mantra:
                                </span>
                                <p className="font-serif font-bold text-amber-900 dark:text-amber-200 text-xs sm:text-sm">
                                  {step.mantraOrSutra}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  handleCopyMantra(step.mantraOrSutra!, `mantra-${step.stepNumber}`)
                                }
                                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-white dark:hover:bg-slate-800 transition-colors shrink-0"
                                title="Copy Mantra"
                              >
                                {copiedMantra === `mantra-${step.stepNumber}` ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          )}

                          {/* Required items tags */}
                          {step.itemsRequired && step.itemsRequired.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap pt-1">
                              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                Required Items:
                              </span>
                              {step.itemsRequired.map((item, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 rounded-md text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Tradition nuance if any */}
                          {step.traditionNote && (
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                              ℹ️ {step.traditionNote}
                            </div>
                          )}
                        </div>

                        {/* Illustrative Step Visual Aid / Procedural Animation Column */}
                        {(step.imageUrl || step.proceduralAnimation) && (
                          <div className="lg:col-span-5 flex flex-col justify-start space-y-2">
                            {/* Media Switcher Tab if both Animation and Photo exist */}
                            {step.imageUrl && step.proceduralAnimation && (
                              <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 self-start">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setStepMediaTab((prev) => ({
                                      ...prev,
                                      [step.stepNumber]: 'animation'
                                    }))
                                  }
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-colors ${
                                    (stepMediaTab[step.stepNumber] || 'animation') === 'animation'
                                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                  }`}
                                >
                                  <Flame className="w-3 h-3 text-amber-950" />
                                  <span>Animation</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setStepMediaTab((prev) => ({
                                      ...prev,
                                      [step.stepNumber]: 'photo'
                                    }))
                                  }
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-colors ${
                                    (stepMediaTab[step.stepNumber] || 'animation') === 'photo'
                                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                  }`}
                                >
                                  <Camera className="w-3 h-3" />
                                  <span>Altar Reference</span>
                                </button>
                              </div>
                            )}

                            {/* Animation Display */}
                            {step.proceduralAnimation &&
                            (stepMediaTab[step.stepNumber] || 'animation') === 'animation' ? (
                              <PujaProceduralAnimation
                                type={step.proceduralAnimation}
                                title={step.animationLabel || step.title}
                                onEnlarge={() =>
                                  setZoomedAnimation({
                                    type: step.proceduralAnimation!,
                                    title: step.animationLabel || step.title
                                  })
                                }
                              />
                            ) : step.imageUrl ? (
                              <div>
                                <div
                                  className="relative group rounded-2xl overflow-hidden border border-amber-300/80 dark:border-amber-700/80 shadow-sm bg-slate-950 cursor-pointer aspect-4/3"
                                  onClick={() =>
                                    setZoomedImage({
                                      url: step.imageUrl!,
                                      alt: step.imageAlt || step.title,
                                      caption: step.imageCaption,
                                      title: `Step ${step.stepNumber}: ${step.title}`
                                    })
                                  }
                                >
                                  <img
                                    src={step.imageUrl}
                                    alt={step.imageAlt || step.title}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-semibold backdrop-blur-xs">
                                    <Maximize2 className="w-4 h-4" />
                                    <span>Enlarge Visual Aid</span>
                                  </div>
                                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-xs text-[10px] font-bold text-amber-300 border border-amber-400/30 flex items-center gap-1">
                                    <ImageIcon className="w-3 h-3" />
                                    <span>Ritual Visual Aid</span>
                                  </div>
                                </div>
                                {step.imageCaption && (
                                  <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 italic leading-relaxed">
                                    {step.imageCaption}
                                  </p>
                                )}
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 2: INTERACTIVE STEPPER / CAROUSEL FOCUS */}
      {viewMode === 'stepper' && activeStep && (
        <div className="p-5 sm:p-8 space-y-6">
          {/* Step Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {guide.steps.map((s, idx) => {
              const isSelected = idx === activeStepIndex;
              const isDone = completedStepNumbers.includes(s.stepNumber);

              return (
                <button
                  key={s.stepNumber}
                  type="button"
                  onClick={() => setActiveStepIndex(idx)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 border ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-950/20 scale-105'
                      : isDone
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span className="w-4 h-4 flex items-center justify-center text-[11px]">
                    {isDone ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : s.stepNumber}
                  </span>
                  <span className="whitespace-nowrap">{s.title.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Active Step Showcase Card */}
          <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/90 border border-amber-200 dark:border-amber-900/50 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-3xl border-2 flex items-center justify-center shrink-0 shadow-md ${getIconWrapperBg(
                    activeStep.icon,
                    completedStepNumbers.includes(activeStep.stepNumber)
                  )}`}
                >
                  {completedStepNumbers.includes(activeStep.stepNumber) ? (
                    <Check className="w-7 h-7 text-emerald-600 font-bold" />
                  ) : (
                    renderStepIcon(activeStep.icon, false)
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Step {activeStep.stepNumber} of {totalSteps}
                  </span>
                  <h4 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-white mt-0.5">
                    {activeStep.title}
                  </h4>
                  {activeStep.subTitle && (
                    <p className="text-xs sm:text-sm text-amber-700 dark:text-amber-400 font-medium">
                      {activeStep.subTitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons: Listen to Step & Mark Done Toggle */}
              <div className="flex items-center gap-2 flex-wrap justify-end">
                <button
                  type="button"
                  onClick={(e) => handleToggleListenStep(activeStep, activeStepIndex, e)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                    singleStepId === activeStep.stepNumber && speechState.isPlaying
                      ? 'bg-amber-500 text-slate-950 animate-pulse'
                      : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-600 hover:bg-amber-50 dark:hover:bg-slate-600'
                  }`}
                  title={
                    singleStepId === activeStep.stepNumber && speechState.isPlaying
                      ? 'Stop reading'
                      : 'Listen to this step'
                  }
                >
                  {singleStepId === activeStep.stepNumber && speechState.isPlaying ? (
                    <>
                      <VolumeX className="w-4 h-4 text-slate-950" />
                      <span>Stop Audio</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>Listen to Step</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => toggleStepCompleted(activeStep.stepNumber)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                    completedStepNumbers.includes(activeStep.stepNumber)
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-600 hover:bg-amber-50 dark:hover:bg-slate-600'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {completedStepNumbers.includes(activeStep.stepNumber) ? 'Completed' : 'Mark as Completed'}
                  </span>
                </button>
              </div>
            </div>

            {/* Description & Ritual Visual Aid / Procedural Animation layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              <div
                className={`space-y-4 ${
                  activeStep.proceduralAnimation || activeStep.imageUrl || guide.coverImageUrl
                    ? 'md:col-span-7 lg:col-span-7'
                    : 'md:col-span-12'
                }`}
              >
                {/* Description */}
                <p className="text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed">
                  {activeStep.description}
                </p>

                {/* Inner Spiritual Bhavna */}
                {activeStep.bhavna && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-amber-100/70 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-800/60 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-bold uppercase tracking-wider text-xs">
                      <Heart className="w-4 h-4 text-amber-600" />
                      <span>आत्मिक भावना (Spiritual Contemplation):</span>
                    </div>
                    <p className="font-serif italic text-amber-950 dark:text-amber-100 text-sm sm:text-base leading-relaxed">
                      "{activeStep.bhavna}"
                    </p>
                  </div>
                )}

                {/* Mantra Block */}
                {activeStep.mantraOrSutra && (
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                        Sacred Chanting Shloka:
                      </span>
                      <p className="font-serif font-bold text-amber-900 dark:text-amber-200 text-sm sm:text-base">
                        {activeStep.mantraOrSutra}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyMantra(activeStep.mantraOrSutra!, `stepper-${activeStep.stepNumber}`)
                      }
                      className="p-2 rounded-xl text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                      title="Copy Mantra"
                    >
                      {copiedMantra === `stepper-${activeStep.stepNumber}` ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Stepper Visual Aid / Procedural Animation Column */}
              {(activeStep.proceduralAnimation || activeStep.imageUrl || guide.coverImageUrl) && (
                <div className="md:col-span-5 lg:col-span-5 flex flex-col justify-start space-y-2.5">
                  {/* Media Switcher Tab if both Animation and Photo exist */}
                  {activeStep.proceduralAnimation && (activeStep.imageUrl || guide.coverImageUrl) && (
                    <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 self-start">
                      <button
                        type="button"
                        onClick={() => setStepperMediaTab('animation')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                          stepperMediaTab === 'animation'
                            ? 'bg-amber-500 text-slate-950 shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <Flame className="w-3.5 h-3.5 text-amber-950" />
                        <span>Animation</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setStepperMediaTab('photo')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                          stepperMediaTab === 'photo'
                            ? 'bg-amber-500 text-slate-950 shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Altar Reference</span>
                      </button>
                    </div>
                  )}

                  {/* Procedural Animation View */}
                  {activeStep.proceduralAnimation && stepperMediaTab === 'animation' ? (
                    <PujaProceduralAnimation
                      type={activeStep.proceduralAnimation}
                      title={activeStep.animationLabel || activeStep.title}
                      onEnlarge={() =>
                        setZoomedAnimation({
                          type: activeStep.proceduralAnimation!,
                          title: activeStep.animationLabel || activeStep.title
                        })
                      }
                    />
                  ) : activeStep.imageUrl || guide.coverImageUrl ? (
                    <div>
                      <div
                        className="relative group rounded-2xl overflow-hidden border-2 border-amber-300/80 dark:border-amber-700/80 shadow-md bg-slate-950 cursor-pointer aspect-4/3"
                        onClick={() => {
                          const imgToZoom = activeStep.imageUrl || guide.coverImageUrl!;
                          setZoomedImage({
                            url: imgToZoom,
                            alt: activeStep.imageAlt || guide.coverImageAlt || activeStep.title,
                            caption: activeStep.imageCaption || guide.coverImageCaption,
                            title: `Visual Aid: ${activeStep.title}`
                          });
                        }}
                      >
                        <img
                          src={activeStep.imageUrl || guide.coverImageUrl}
                          alt={activeStep.imageAlt || guide.coverImageAlt || activeStep.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-semibold backdrop-blur-xs">
                          <Maximize2 className="w-4 h-4" />
                          <span>Zoom Visual Aid</span>
                        </div>
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-xs text-[10px] font-bold text-amber-300 border border-amber-400/30 flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />
                          <span>
                            {activeStep.imageUrl ? 'Step Visual Aid' : 'Ritual Altar Reference'}
                          </span>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 font-medium italic leading-relaxed">
                        {activeStep.imageCaption || guide.coverImageCaption}
                      </p>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* Navigation Controls: Prev / Next */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                disabled={activeStepIndex === 0}
                onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>

              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Step {activeStepIndex + 1} of {totalSteps}
              </span>

              <button
                type="button"
                disabled={activeStepIndex === totalSteps - 1}
                onClick={() => setActiveStepIndex((prev) => Math.min(totalSteps - 1, prev + 1))}
                className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Concluding Bhavna & Follow-up Trigger */}
      {guide.concludingBhavna && (
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2 max-w-2xl">
            <BookOpen className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-slate-600 dark:text-slate-300 italic">
              <strong>Closing Dedication:</strong> {guide.concludingBhavna}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0 flex-wrap">
            <button
              type="button"
              onClick={handleToggleSave}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 border shadow-2xs ${
                isSaved
                  ? 'bg-amber-500/20 border-amber-500/80 text-amber-950 dark:text-amber-200 hover:bg-amber-500/30'
                  : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-amber-400 hover:text-amber-600'
              }`}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 fill-amber-500" />
                  <span>Saved in Profile</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Save to Rituals</span>
                </>
              )}
            </button>

            {onAskFollowUp && (
              <button
                type="button"
                onClick={() => onAskFollowUp(`Can you explain more details about ${guide.title}?`)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 hover:bg-amber-200 font-bold transition-all shrink-0 flex items-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Ask Pandit Ji</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* FULLSCREEN VISUAL AID LIGHTBOX MODAL */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setZoomedImage(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-white dark:bg-slate-900 rounded-3xl border border-amber-300 dark:border-amber-700 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-amber-500/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <h4 className="font-serif font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                  {zoomedImage.title || 'Sacred Jain Ritual Visual Aid'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setZoomedImage(null)}
                className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[72vh] overflow-y-auto p-4 sm:p-6 space-y-4">
              <div className="rounded-2xl overflow-hidden border border-amber-200 dark:border-amber-800/80 shadow-md bg-slate-950">
                <img
                  src={zoomedImage.url}
                  alt={zoomedImage.alt || 'Jain ritual guide visual'}
                  referrerPolicy="no-referrer"
                  className="w-full max-h-[480px] object-contain mx-auto"
                />
              </div>

              {zoomedImage.caption && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  <strong className="text-amber-900 dark:text-amber-300 font-bold block mb-1">
                    Canonical Ritual Arrangement & Meaning:
                  </strong>
                  {zoomedImage.caption}
                </div>
              )}
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setZoomedImage(null)}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN PROCEDURAL ANIMATION MODAL */}
      {zoomedAnimation && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setZoomedAnimation(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl border border-amber-400 dark:border-amber-600 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-linear-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-600 dark:text-amber-400 animate-diya-flame" />
                <h4 className="font-serif font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                  {zoomedAnimation.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setZoomedAnimation(null)}
                className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              <PujaProceduralAnimation
                type={zoomedAnimation.type}
                title={zoomedAnimation.title}
              />
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 italic">
                Interactive motion simulation with tempo controls
              </span>
              <button
                type="button"
                onClick={() => setZoomedAnimation(null)}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
