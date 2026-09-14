import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Info,
  Maximize2,
  Volume2,
  Check,
  Flame,
  Droplets,
  Feather,
  Sun,
  Shield,
  Compass
} from 'lucide-react';

export type ProceduralAnimationType =
  | 'lamp_flame'
  | 'aarti_circle'
  | 'jal_dhara'
  | 'chandan_touch'
  | 'dhoop_smoke'
  | 'akshat_swastika'
  | 'charavalo_sweep'
  | 'flower_petal'
  | 'bell_chime';

interface PujaProceduralAnimationProps {
  type: ProceduralAnimationType;
  title?: string;
  compact?: boolean;
  className?: string;
  onEnlarge?: () => void;
}

export const PujaProceduralAnimation: React.FC<PujaProceduralAnimationProps> = ({
  type,
  title,
  compact = false,
  className = '',
  onEnlarge
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [swastikaStep, setSwastikaStep] = useState<number>(3); // for akshat drawing
  const [aartiCycle, setAartiCycle] = useState<number>(1);
  const [activeChandanPoint, setActiveChandanPoint] = useState<number>(0);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // Aarti 7-cycle progression loop
  useEffect(() => {
    if (!isPlaying || type !== 'aarti_circle') return;
    const interval = setInterval(() => {
      setAartiCycle((prev) => (prev % 7) + 1);
    }, 6500 / speed);
    return () => clearInterval(interval);
  }, [isPlaying, speed, type]);

  // Akshat drawing step progression
  useEffect(() => {
    if (!isPlaying || type !== 'akshat_swastika') return;
    const interval = setInterval(() => {
      setSwastikaStep((prev) => (prev % 3) + 1);
    }, 4000 / speed);
    return () => clearInterval(interval);
  }, [isPlaying, speed, type]);

  // Chandan 9-point progression
  useEffect(() => {
    if (!isPlaying || type !== 'chandan_touch') return;
    const interval = setInterval(() => {
      setActiveChandanPoint((prev) => (prev + 1) % 9);
    }, 3000 / speed);
    return () => clearInterval(interval);
  }, [isPlaying, speed, type]);

  // Titles and procedural guide notes
  const meta: Record<
    ProceduralAnimationType,
    { label: string; proceduralTip: string; icon: React.ReactNode }
  > = {
    lamp_flame: {
      label: 'Deepak Lighting (दीपक प्रज्वलन)',
      proceduralTip:
        'Ignite the pure cow-ghee cotton wick with serenity. The unwavering vertical flame symbolizes the supreme illuminating light of Kevalgyan.',
      icon: <Flame className="w-3.5 h-3.5 text-amber-500" />
    },
    aarti_circle: {
      label: 'Clockwise Aarti Waving (आरती प्रदक्षिणा)',
      proceduralTip:
        'Hold the five-flame Pancha-Pradeep thali reverently with both hands and rotate in 7 gentle clockwise cycles, keeping the lamp level with the chest and throat.',
      icon: <Compass className="w-3.5 h-3.5 text-amber-500" />
    },
    jal_dhara: {
      label: 'Akhand Jal Dhara (अखण्ड जल धारा)',
      proceduralTip:
        'Tilt both consecrated kalash together to maintain a steady, crystal-clear, unbroken stream over the Meru throne without abrupt splashing.',
      icon: <Droplets className="w-3.5 h-3.5 text-sky-500" />
    },
    chandan_touch: {
      label: 'Nav-Anga Chandan Anointing (नवांग चन्दन पूजा)',
      proceduralTip:
        'Apply fragrant keshar chandan softly using the ring finger at the 9 sacred limbs, moving from the feet upward to the crown to cultivate equanimity.',
      icon: <Sparkles className="w-3.5 h-3.5 text-amber-600" />
    },
    akshat_swastika: {
      label: 'Akshat Sathiya Formation (अक्षत साथिया आलेखन)',
      proceduralTip:
        'Form the 4 arms of the Swastika (4 gatis), 3 heaps of Ratnatraya (Right Faith, Knowledge, Conduct), and the Siddha Shila crescent with unbroken rice.',
      icon: <Sun className="w-3.5 h-3.5 text-amber-400" />
    },
    dhoop_smoke: {
      label: 'Fragrant Dhoop Offering (धूप पूजा तरंग)',
      proceduralTip:
        'Gently wave the brass incense burner so fragrant smoke ascends in tranquil swirls, contemplating the dissolution of the 8 binding karmas.',
      icon: <Feather className="w-3.5 h-3.5 text-orange-400" />
    },
    charavalo_sweep: {
      label: 'Charavalo Ahimsa Sweeping (चरवला अहिंसा प्रमार्जन)',
      proceduralTip:
        'Gently stroke the soft white woolen Charavalo in smooth, mindful sweeps before sitting or placing books to protect micro-insects unconditionally.',
      icon: <Shield className="w-3.5 h-3.5 text-emerald-500" />
    },
    flower_petal: {
      label: 'Pushpa Offering (पुष्प समर्पण)',
      proceduralTip:
        'Place spotless, naturally fallen fragrant petals gently at the lotus feet, meditating on the blooming fragrance of soul virtues.',
      icon: <Sparkles className="w-3.5 h-3.5 text-rose-400" />
    },
    bell_chime: {
      label: 'Ghanta Naad (घंटा नाद)',
      proceduralTip:
        'Strike the sacred bronze bell with rhythmic devotion to awaken spiritual wakefulness and dispel dullness.',
      icon: <Volume2 className="w-3.5 h-3.5 text-amber-500" />
    }
  };

  const currentMeta = meta[type] || meta.lamp_flame;

  const chandanPoints = [
    { name: '1. Angutha (Toes)', meaning: 'Subduing wandering earthly desires' },
    { name: '2. Janu (Knees)', meaning: 'Humility and reverence' },
    { name: '3. Kar (Forearms)', meaning: 'Generosity and non-attachment' },
    { name: '4. Skandha (Shoulders)', meaning: 'Bearing ascetic endurance' },
    { name: '5. Moli (Crown)', meaning: 'Attaining Supreme Liberation (Siddha)' },
    { name: '6. Bhal (Forehead)', meaning: 'Enlightenment of Third Eye (Kevalgyan)' },
    { name: '7. Kanth (Throat)', meaning: 'True, nectar-like auspicious speech' },
    { name: '8. Hriday (Heart)', meaning: 'Universal compassion & Ahimsa' },
    { name: '9. Nabhi (Navel)', meaning: 'Spiritual equilibrium and composure' }
  ];

  return (
    <div
      className={`rounded-2xl border border-amber-300/80 dark:border-amber-700/80 bg-linear-to-b from-amber-50/70 via-slate-900/5 to-amber-100/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 shadow-sm overflow-hidden flex flex-col ${className}`}
    >
      {/* Top Header Bar */}
      <div className="px-3.5 py-2.5 bg-amber-500/10 dark:bg-amber-500/15 border-b border-amber-200/60 dark:border-amber-900/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {currentMeta.icon}
          <span className="text-[11px] sm:text-xs font-bold text-amber-900 dark:text-amber-200 font-serif">
            {title || currentMeta.label}
          </span>
          <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-200/60 dark:bg-amber-800/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 uppercase tracking-wider">
            Procedural Animation
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowExplanation(!showExplanation)}
            className="p-1 rounded-md text-amber-700 dark:text-amber-300 hover:bg-amber-200/50 dark:hover:bg-slate-800 transition-colors text-[10px] flex items-center gap-1 font-semibold"
            title="Procedural Guidelines"
          >
            <Info className="w-3 h-3" />
            <span className="hidden sm:inline">Tips</span>
          </button>
          {onEnlarge && (
            <button
              type="button"
              onClick={onEnlarge}
              className="p-1 rounded-md text-amber-700 dark:text-amber-300 hover:bg-amber-200/50 dark:hover:bg-slate-800 transition-colors"
              title="Full Visual Guide"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Procedural Instruction Tip Banner */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-3.5 py-2 bg-amber-100/80 dark:bg-amber-950/60 border-b border-amber-200 dark:border-amber-800 text-[11px] text-amber-950 dark:text-amber-200 leading-relaxed font-sans"
          >
            <strong className="font-bold text-amber-900 dark:text-amber-300 block mb-0.5">
              Ritual Movement Protocol:
            </strong>
            {currentMeta.proceduralTip}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animation Stage Canvas */}
      <div className="relative w-full h-44 sm:h-52 bg-radial from-amber-950/30 via-slate-950/90 to-slate-950 flex items-center justify-center overflow-hidden select-none">
        {/* Soft Background Temple Grid / Altar Atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

        {/* ===================================================================
            1. LAMP FLAME ANIMATION (DEEPAK PUJA / MANGAL DIVO)
            =================================================================== */}
        {type === 'lamp_flame' && (
          <div className="relative flex flex-col items-center justify-center">
            {/* Ambient Pulsing Aura */}
            {isPlaying && (
              <div
                className="absolute w-36 h-36 rounded-full bg-radial from-amber-400/40 via-orange-500/20 to-transparent blur-xl pointer-events-none animate-diya-glow"
                style={{ animationDuration: `${2.8 / speed}s` }}
              />
            )}

            {/* Rising Spiritual Golden Embers */}
            {isPlaying && (
              <div className="absolute -top-12 inset-x-0 h-16 pointer-events-none flex justify-center">
                <span className="w-1 h-1 rounded-full bg-amber-300 shadow-[0_0_8px_#f59e0b] animate-bounce opacity-70" />
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-200 shadow-[0_0_8px_#f59e0b] animate-ping opacity-60 ml-4" />
                <span className="w-1 h-1 rounded-full bg-orange-300 shadow-[0_0_8px_#f59e0b] animate-pulse opacity-80 -ml-6" />
              </div>
            )}

            {/* SVG Diya with Animated Wick Flame */}
            <svg
              viewBox="0 0 160 140"
              className="w-36 h-32 overflow-visible filter drop-shadow-[0_8px_16px_rgba(245,158,11,0.25)]"
            >
              {/* Diya Base - Traditional Brass Lamp */}
              <defs>
                <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="35%" stopColor="#d97706" />
                  <stop offset="70%" stopColor="#b45309" />
                  <stop offset="100%" stopColor="#78350f" />
                </linearGradient>
                <radialGradient id="flameInnerGrad" cx="50%" cy="75%" r="70%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="35%" stopColor="#fef08a" />
                  <stop offset="70%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#dc2626" />
                </radialGradient>
                <radialGradient id="flameOuterGrad" cx="50%" cy="80%" r="80%">
                  <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Lamp Stand and Pedestal */}
              <ellipse cx="80" cy="122" rx="34" ry="7" fill="#451a03" opacity="0.6" />
              <path
                d="M 58 118 C 58 114 68 112 80 112 C 92 112 102 114 102 118 L 94 122 C 94 124 66 124 66 122 Z"
                fill="url(#brassGrad)"
              />
              <path
                d="M 76 112 L 76 96 L 84 96 L 84 112 Z"
                fill="url(#brassGrad)"
              />
              {/* Diya Bowl */}
              <path
                d="M 40 92 Q 80 120 120 92 Q 130 84 120 80 Q 80 86 40 80 Q 30 84 40 92 Z"
                fill="url(#brassGrad)"
                stroke="#fef08a"
                strokeWidth="0.75"
              />
              {/* Pure Ghee Reservoir */}
              <ellipse cx="80" cy="83" rx="35" ry="5" fill="#fef08a" opacity="0.45" />

              {/* Cotton Wick Point */}
              <line x1="80" y1="83" x2="80" y2="70" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />

              {/* Animated Flame */}
              {isPlaying && (
                <g
                  className="animate-diya-flame"
                  style={{ transformOrigin: '80px 70px', animationDuration: `${1.8 / speed}s` }}
                >
                  {/* Outer Warm Flare */}
                  <path
                    d="M 80 14 C 70 38 62 50 62 65 C 62 76 70 78 80 78 C 90 78 98 76 98 65 C 98 50 90 38 80 14 Z"
                    fill="url(#flameOuterGrad)"
                    filter="blur(1px)"
                  />
                  {/* Inner Brilliant Flame Core */}
                  <path
                    d="M 80 24 C 73 42 68 53 68 64 C 68 73 73 74 80 74 C 87 74 92 73 92 64 C 92 53 87 42 80 24 Z"
                    fill="url(#flameInnerGrad)"
                  />
                  {/* Heart Core Blue/White Base */}
                  <ellipse cx="80" cy="68" rx="4" ry="5" fill="#bae6fd" opacity="0.85" />
                </g>
              )}
            </svg>

            <span className="mt-1 text-[10px] font-bold tracking-wider text-amber-300/90 font-mono">
              {isPlaying ? '• JYOTI PRAGAT (STEADY FLAME)' : 'FLAME PAUSED'}
            </span>
          </div>
        )}

        {/* ===================================================================
            2. AARTI CIRCULAR ROTATION ANIMATION (7-FOLD CLOCKWISE WAVING)
            =================================================================== */}
        {type === 'aarti_circle' && (
          <div className="relative flex flex-col items-center justify-center w-full h-full">
            {/* Center Altar Marker (Bhagwan's Murti Position) */}
            <div className="absolute w-12 h-12 rounded-full border border-dashed border-amber-400/40 flex flex-col items-center justify-center text-center">
              <span className="text-[9px] font-bold text-amber-300/80 font-serif">प्रभु</span>
              <span className="text-[7px] text-amber-400/60 uppercase">Center</span>
            </div>

            {/* Clockwise Directional Circular Track & Indicator */}
            <svg viewBox="0 0 160 160" className="w-48 h-48 absolute pointer-events-none">
              <circle
                cx="80"
                cy="80"
                r="44"
                fill="none"
                stroke="rgba(245, 158, 11, 0.25)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              {/* Clockwise Directional Arrowheads along the perimeter */}
              <path
                d="M 80 36 L 86 36 L 83 31 Z"
                fill="#f59e0b"
                opacity="0.7"
              />
              <path
                d="M 124 80 L 124 86 L 129 83 Z"
                fill="#f59e0b"
                opacity="0.7"
              />
              <path
                d="M 80 124 L 74 124 L 77 129 Z"
                fill="#f59e0b"
                opacity="0.7"
              />
              <path
                d="M 36 80 L 36 74 L 31 77 Z"
                fill="#f59e0b"
                opacity="0.7"
              />
            </svg>

            {/* Rotating Aarti Thali with 5 Lamps (Orbiting Clockwise) */}
            <div
              className={`absolute w-16 h-16 ${isPlaying ? 'animate-aarti-orbit' : ''}`}
              style={{
                animationDuration: `${6.5 / speed}s`,
                transform: isPlaying ? undefined : 'rotate(45deg) translateX(44px) rotate(-45deg)'
              }}
            >
              {/* Pancha-Pradeep 5-Flame Aarti Tray */}
              <div className="relative w-16 h-16 flex items-center justify-center">
                {/* Silver Thali plate */}
                <div className="w-14 h-14 rounded-full bg-linear-to-br from-amber-200 via-amber-400 to-amber-600 border-2 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.6)] flex items-center justify-center">
                  {/* 5 Flames on the rim */}
                  <span className="absolute -top-1 w-2.5 h-3 bg-linear-to-t from-orange-500 to-yellow-200 rounded-full animate-diya-flame" />
                  <span className="absolute -bottom-1 w-2.5 h-3 bg-linear-to-t from-orange-500 to-yellow-200 rounded-full animate-diya-flame" />
                  <span className="absolute -left-1 w-2.5 h-3 bg-linear-to-t from-orange-500 to-yellow-200 rounded-full animate-diya-flame" />
                  <span className="absolute -right-1 w-2.5 h-3 bg-linear-to-t from-orange-500 to-yellow-200 rounded-full animate-diya-flame" />
                  <span className="w-3 h-4 bg-linear-to-t from-red-500 via-orange-400 to-yellow-100 rounded-full animate-diya-flame" />
                </div>
              </div>
            </div>

            {/* Cycle Counter Badge */}
            <div className="absolute bottom-2.5 px-3 py-1 rounded-full bg-slate-900/90 border border-amber-400/40 text-amber-200 text-[10px] font-bold flex items-center gap-1.5 shadow-md">
              <Compass className="w-3 h-3 text-amber-400" />
              <span>प्रदक्षिणा (Clockwise Cycle): {aartiCycle} / 7</span>
            </div>
          </div>
        )}

        {/* ===================================================================
            3. JAL DHARA ANIMATION (HOLY ABHISHEK WATER STREAM)
            =================================================================== */}
        {type === 'jal_dhara' && (
          <div className="relative flex flex-col items-center justify-center w-full h-full">
            <svg viewBox="0 0 200 160" className="w-56 h-44 overflow-visible">
              <defs>
                <linearGradient id="silverKalashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="40%" stopColor="#cbd5e1" />
                  <stop offset="80%" stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#475569" />
                </linearGradient>
                <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#e0f2fe" stopOpacity="1" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.95" />
                </linearGradient>
              </defs>

              {/* Tilted Kalash Vessel (Left top pouring downwards) */}
              <g transform="translate(60, 20) rotate(-35)">
                <ellipse cx="20" cy="10" rx="12" ry="4" fill="#64748b" />
                <path
                  d="M 8 10 C 6 22 2 30 2 40 C 2 54 10 60 20 60 C 30 60 38 54 38 40 C 38 30 34 22 32 10 Z"
                  fill="url(#silverKalashGrad)"
                  stroke="#e2e8f0"
                  strokeWidth="0.8"
                />
                <circle cx="20" cy="38" r="4" fill="#f59e0b" opacity="0.8" />
              </g>

              {/* Twin Kalash Vessel (Right top pouring downwards) */}
              <g transform="translate(140, 20) rotate(35)">
                <ellipse cx="-20" cy="10" rx="12" ry="4" fill="#64748b" />
                <path
                  d="M -32 10 C -34 22 -38 30 -38 40 C -38 54 -30 60 -20 60 C -10 60 -2 54 -2 40 C -2 30 -6 22 -8 10 Z"
                  fill="url(#silverKalashGrad)"
                  stroke="#e2e8f0"
                  strokeWidth="0.8"
                />
                <circle cx="-20" cy="38" r="4" fill="#f59e0b" opacity="0.8" />
              </g>

              {/* Unbroken Jal Dhara Stream (Continuous flow path) */}
              {isPlaying ? (
                <path
                  d="M 100 48 Q 100 80 100 120"
                  stroke="url(#waterGrad)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                  className="animate-stream-flow"
                  style={{ animationDuration: `${1.2 / speed}s` }}
                />
              ) : (
                <path
                  d="M 100 48 Q 100 80 100 120"
                  stroke="#38bdf8"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.6"
                />
              )}

              {/* Crystal Shimmer Drops around the Stream */}
              {isPlaying && (
                <>
                  <circle cx="97" cy="70" r="1.5" fill="#ffffff" opacity="0.9" />
                  <circle cx="103" cy="95" r="1.5" fill="#ffffff" opacity="0.9" />
                  <circle cx="98" cy="110" r="2" fill="#e0f2fe" opacity="0.8" />
                </>
              )}

              {/* Lotus Marble Jaladhari Pedestal Basin */}
              <ellipse cx="100" cy="125" rx="44" ry="12" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
              <ellipse cx="100" cy="123" rx="36" ry="8" fill="#0369a1" opacity="0.5" />

              {/* Expanding Concentric Ripple Rings at Base */}
              {isPlaying && (
                <>
                  <ellipse
                    cx="100"
                    cy="123"
                    rx="14"
                    ry="4"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    className="animate-ping"
                    style={{ animationDuration: `${1.8 / speed}s` }}
                  />
                  <ellipse
                    cx="100"
                    cy="123"
                    rx="26"
                    ry="7"
                    fill="none"
                    stroke="#e0f2fe"
                    strokeWidth="1"
                    className="animate-pulse"
                  />
                </>
              )}
            </svg>

            <span className="text-[10px] font-bold tracking-wider text-sky-300 font-mono">
              {isPlaying ? '• AKHAND JAL DHARA (CONTINUOUS STREAM)' : 'STREAM PAUSED'}
            </span>
          </div>
        )}

        {/* ===================================================================
            4. CHANDAN ANNOINTING ANIMATION (NAV-ANGA PUJA)
            =================================================================== */}
        {type === 'chandan_touch' && (
          <div className="relative flex flex-col items-center justify-center w-full h-full">
            {/* Tirthankara Padmasana Meditative Figure Outline */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg viewBox="0 0 120 120" className="w-full h-full">
                {/* Spiritual Halo (Bhamandala) */}
                <circle
                  cx="60"
                  cy="32"
                  r="18"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  className="animate-pulse"
                />

                {/* Seated Jina Silhouette */}
                {/* Head */}
                <ellipse cx="60" cy="32" rx="10" ry="12" fill="#334155" />
                {/* Ushnisha Crown */}
                <circle cx="60" cy="18" r="3.5" fill="#f59e0b" />
                {/* Neck & Shoulders */}
                <path
                  d="M 40 48 Q 60 42 80 48 L 86 78 Q 60 84 34 78 Z"
                  fill="#334155"
                />
                {/* Crossed Legs (Padmasana) */}
                <path
                  d="M 22 84 Q 60 98 98 84 Q 106 94 92 98 Q 60 102 28 98 Q 14 94 22 84 Z"
                  fill="#1e293b"
                  stroke="#475569"
                  strokeWidth="0.8"
                />

                {/* 9 Sacred Chandan Points Coordinates */}
                {[
                  { id: 0, cx: 60, cy: 96, label: 'Angutha' }, // Toes
                  { id: 1, cx: 40, cy: 88, label: 'Janu' },    // Left Knee
                  { id: 2, cx: 44, cy: 68, label: 'Kar' },     // Forearms
                  { id: 3, cx: 40, cy: 48, label: 'Skandha' }, // Shoulders
                  { id: 4, cx: 60, cy: 18, label: 'Moli' },    // Crown
                  { id: 5, cx: 60, cy: 29, label: 'Bhal' },    // Forehead
                  { id: 6, cx: 60, cy: 44, label: 'Kanth' },   // Throat
                  { id: 7, cx: 60, cy: 58, label: 'Hriday' },  // Heart
                  { id: 8, cx: 60, cy: 74, label: 'Nabhi' }    // Navel
                ].map((pt) => {
                  const isActive = activeChandanPoint === pt.id;
                  return (
                    <g key={pt.id} onClick={() => setActiveChandanPoint(pt.id)} className="cursor-pointer">
                      {isActive && (
                        <circle
                          cx={pt.cx}
                          cy={pt.cy}
                          r="7"
                          fill="#fef08a"
                          opacity="0.4"
                          className="animate-ping"
                        />
                      )}
                      <circle
                        cx={pt.cx}
                        cy={pt.cy}
                        r={isActive ? '4' : '2.5'}
                        fill={isActive ? '#f59e0b' : '#d97706'}
                        stroke="#ffffff"
                        strokeWidth="0.8"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Current Point Indicator Badge */}
            <div className="mt-1 px-3 py-1 rounded-full bg-slate-900/90 border border-amber-500/40 text-amber-200 text-[10px] font-bold flex items-center gap-1.5 shadow-md">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>
                {chandanPoints[activeChandanPoint]?.name}: {chandanPoints[activeChandanPoint]?.meaning}
              </span>
            </div>
          </div>
        )}

        {/* ===================================================================
            5. AKSHAT SWASTIKA & RATNATRAYA FORMATION
            =================================================================== */}
        {type === 'akshat_swastika' && (
          <div className="relative flex flex-col items-center justify-center w-full h-full">
            {/* Patila Board SVG */}
            <svg viewBox="0 0 160 140" className="w-48 h-40">
              <defs>
                <radialGradient id="patilaGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </radialGradient>
              </defs>

              {/* Silver Patila Board Base */}
              <rect
                x="20"
                y="10"
                width="120"
                height="120"
                rx="14"
                fill="url(#patilaGrad)"
                stroke="#f59e0b"
                strokeWidth="1.5"
              />

              {/* Step 1: 4 Arms of Swastika (4 Gatis) */}
              <g
                className="transition-opacity duration-500"
                style={{ opacity: swastikaStep >= 1 ? 1 : 0.25 }}
              >
                {/* Central Cross */}
                <line x1="80" y1="52" x2="80" y2="108" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
                <line x1="52" y1="80" x2="108" y2="80" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
                {/* 4 Clockwise Arms */}
                <line x1="80" y1="52" x2="98" y2="52" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
                <line x1="108" y1="80" x2="108" y2="98" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
                <line x1="80" y1="108" x2="62" y2="108" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
                <line x1="52" y1="80" x2="52" y2="62" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
              </g>

              {/* Step 2: 3 Dots of Ratnatraya (Samyak Darshan, Gyan, Charitra) */}
              <g
                className="transition-opacity duration-500"
                style={{ opacity: swastikaStep >= 2 ? 1 : 0.2 }}
              >
                <circle cx="68" cy="38" r="3.5" fill="#fef08a" stroke="#d97706" strokeWidth="0.75" />
                <circle cx="80" cy="38" r="3.5" fill="#fef08a" stroke="#d97706" strokeWidth="0.75" />
                <circle cx="92" cy="38" r="3.5" fill="#fef08a" stroke="#d97706" strokeWidth="0.75" />
              </g>

              {/* Step 3: Siddha Shila Crescent & Liberated Soul Bindu */}
              <g
                className="transition-opacity duration-500"
                style={{ opacity: swastikaStep >= 3 ? 1 : 0.2 }}
              >
                {/* Crescent Moon (Siddha Shila) */}
                <path
                  d="M 66 26 Q 80 34 94 26 Q 80 29 66 26 Z"
                  fill="#ffffff"
                  stroke="#e2e8f0"
                  strokeWidth="0.75"
                />
                {/* Liberation Bindu (Moksha) */}
                <circle cx="80" cy="22" r="3" fill="#38bdf8" className="animate-pulse" />
              </g>
            </svg>

            {/* Explanation Indicator */}
            <div className="mt-0.5 px-3 py-1 rounded-full bg-slate-900/90 border border-amber-500/40 text-amber-200 text-[10px] font-bold flex items-center gap-1.5 shadow-md">
              <Check className="w-3 h-3 text-emerald-400" />
              <span>
                {swastikaStep === 1 && 'Step 1: 4 Arms of Sathiya (Four Gatis of Samsara)'}
                {swastikaStep === 2 && 'Step 2: 3 Heaps of Ratnatraya (Right Faith, Knowledge, Conduct)'}
                {swastikaStep === 3 && 'Step 3: Siddha Shila & Soul Liberation (Moksha)'}
              </span>
            </div>
          </div>
        )}

        {/* ===================================================================
            6. DHOOP INCENSE SMOKE ANIMATION
            =================================================================== */}
        {type === 'dhoop_smoke' && (
          <div className="relative flex flex-col items-center justify-center w-full h-full">
            {/* Soft rising smoke plumes */}
            {isPlaying && (
              <div className="absolute top-2 w-28 h-28 pointer-events-none flex justify-center">
                <div className="absolute w-5 h-20 bg-radial from-amber-200/40 to-transparent blur-md rounded-full animate-incense-smoke-1" />
                <div className="absolute w-7 h-24 bg-radial from-amber-100/30 to-transparent blur-lg rounded-full animate-incense-smoke-2" />
                <div className="absolute w-6 h-22 bg-radial from-orange-200/35 to-transparent blur-md rounded-full animate-incense-smoke-3" />
              </div>
            )}

            {/* Dhupeliyu Incense Burner SVG */}
            <svg viewBox="0 0 140 120" className="w-36 h-28">
              <defs>
                <linearGradient id="dhupGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fde047" />
                  <stop offset="40%" stopColor="#b45309" />
                  <stop offset="100%" stopColor="#78350f" />
                </linearGradient>
              </defs>

              <ellipse cx="70" cy="105" rx="28" ry="6" fill="#451a03" opacity="0.6" />
              {/* Stand */}
              <path d="M 58 102 L 64 86 L 76 86 L 82 102 Z" fill="url(#dhupGrad)" />
              {/* Burner Pot */}
              <ellipse cx="70" cy="74" rx="26" ry="12" fill="url(#dhupGrad)" />
              {/* Glowing Embers */}
              <ellipse cx="70" cy="72" rx="20" ry="7" fill="#dc2626" opacity="0.85" className="animate-pulse" />
              <ellipse cx="70" cy="72" rx="12" ry="4" fill="#f59e0b" opacity="0.9" />
              {/* Handle */}
              <path d="M 44 74 Q 24 74 20 86 Q 22 92 44 80" fill="none" stroke="url(#dhupGrad)" strokeWidth="3" strokeLinecap="round" />
            </svg>

            <span className="text-[10px] font-bold tracking-wider text-amber-300/90 font-mono">
              {isPlaying ? '• DHOOP SUGANDH (FRAGRANT ASCENT)' : 'OFFERING PAUSED'}
            </span>
          </div>
        )}

        {/* ===================================================================
            7. CHARAVALO AHIMSA SWEEPING ANIMATION
            =================================================================== */}
        {type === 'charavalo_sweep' && (
          <div className="relative flex flex-col items-center justify-center w-full h-full">
            {/* Katasanu Floor Mat */}
            <div className="absolute bottom-6 w-44 h-8 rounded-lg bg-amber-100/15 border border-amber-300/30 flex items-center justify-center">
              <span className="text-[8px] uppercase tracking-widest text-amber-200/50">Katasanu Mat Area</span>
            </div>

            {/* Whisking Charavalo Brush */}
            <div
              className={`relative w-28 h-32 flex flex-col items-center origin-top ${
                isPlaying ? 'animate-charavalo-whisk' : ''
              }`}
              style={{ animationDuration: `${2.4 / speed}s` }}
            >
              {/* Wooden Handle */}
              <div className="w-3 h-14 bg-linear-to-b from-amber-700 to-amber-900 rounded-t-full border border-amber-600 shadow-sm" />
              {/* Soft White Wool Tassels (Charavalo head) */}
              <div className="w-14 h-16 -mt-1 bg-linear-to-b from-white via-slate-100 to-slate-200 rounded-b-2xl shadow-lg border border-slate-300/70 flex justify-around px-1">
                <span className="w-0.5 h-full bg-slate-300/40" />
                <span className="w-0.5 h-full bg-slate-300/40" />
                <span className="w-0.5 h-full bg-slate-300/40" />
                <span className="w-0.5 h-full bg-slate-300/40" />
              </div>
            </div>

            <span className="text-[10px] font-bold tracking-wider text-emerald-400 font-mono mt-1">
              • AHIMSA PRAMARJAN (PROTECTING MICRO-BEINGS)
            </span>
          </div>
        )}

        {/* ===================================================================
            8. PUSHPA PETAL FALL ANIMATION
            =================================================================== */}
        {type === 'flower_petal' && (
          <div className="relative flex flex-col items-center justify-center w-full h-full">
            {/* Sacred Lotus Base */}
            <div className="absolute bottom-5 w-32 h-8 rounded-full border border-amber-400/40 bg-amber-500/10 flex items-center justify-center">
              <span className="text-[9px] font-serif font-bold text-amber-300">चरण कमल (Lotus Feet)</span>
            </div>

            {/* Floating flower petals */}
            {isPlaying && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-4 left-1/3 w-3 h-4 bg-yellow-300 rounded-full animate-bounce opacity-80 rotate-12" />
                <div className="absolute top-8 right-1/3 w-3.5 h-4.5 bg-rose-200 rounded-full animate-pulse opacity-90 -rotate-12" />
                <div className="absolute top-14 left-1/2 w-4 h-4 bg-white rounded-full shadow-xs animate-ping opacity-60" />
              </div>
            )}

            <div className="text-center space-y-1">
              <Sparkles className="w-8 h-8 text-amber-400 mx-auto animate-spin" style={{ animationDuration: '8s' }} />
              <span className="text-[10px] font-bold tracking-wider text-amber-200 font-mono block">
                • PUSHPA SAMARPAN (DEVOTION BLOOM)
              </span>
            </div>
          </div>
        )}

        {/* ===================================================================
            9. BELL CHIME ANIMATION
            =================================================================== */}
        {type === 'bell_chime' && (
          <div className="relative flex flex-col items-center justify-center w-full h-full">
            {/* Swinging Bronze Bell */}
            <div
              className={`relative w-20 h-24 flex flex-col items-center origin-top ${
                isPlaying ? 'animate-bell-swing' : ''
              }`}
              style={{ animationDuration: `${2.2 / speed}s` }}
            >
              {/* Chain */}
              <div className="w-1 h-8 bg-amber-600" />
              {/* Bell Body */}
              <div className="w-14 h-12 bg-linear-to-b from-amber-300 via-amber-500 to-amber-700 rounded-t-full border border-amber-200 shadow-md flex items-end justify-center">
                {/* Clapper */}
                <div className="w-3 h-3 rounded-full bg-amber-900 mb-0.5" />
              </div>
            </div>

            {/* Acoustic Resonant Ripple Waves */}
            {isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-24 h-24 rounded-full border border-amber-400/50 animate-ping opacity-40" />
              </div>
            )}

            <span className="text-[10px] font-bold tracking-wider text-amber-300 font-mono mt-2">
              • GHANTA NAAD (SOUND OF AWAKENING)
            </span>
          </div>
        )}
      </div>

      {/* Bottom Interactive Control Toolbar */}
      <div className="px-3.5 py-2 bg-white/90 dark:bg-slate-900/90 border-t border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] flex items-center gap-1.5 shadow-xs transition-colors"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3 h-3 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>Play Animation</span>
              </>
            )}
          </button>

          {/* Reset / Re-run */}
          <button
            type="button"
            onClick={() => {
              setIsPlaying(true);
              setAartiCycle(1);
              setSwastikaStep(1);
            }}
            className="p-1 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            title="Restart Animation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
            Tempo:
          </span>
          {[
            { rate: 0.75, label: 'Calm' },
            { rate: 1, label: '1x' },
            { rate: 1.5, label: 'Brisk' }
          ].map((sp) => (
            <button
              key={sp.rate}
              type="button"
              onClick={() => setSpeed(sp.rate)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors ${
                speed === sp.rate
                  ? 'bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-400/50'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {sp.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
