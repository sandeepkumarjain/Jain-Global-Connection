import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Compass,
  RotateCcw,
  Volume2,
  VolumeX,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Sparkles,
  Info,
  MapPin,
  Eye,
  Camera,
  Layers,
  CheckCircle2,
  Navigation,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Share2
} from 'lucide-react';
import { TempleListing } from '../types';
import { playNavkarMantraAudio, stopNavkarMantraAudio } from '../utils/navkarAudio';

interface Virtual3DTourModalProps {
  temple: TempleListing | null;
  onClose: () => void;
  showToast?: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

interface Hotspot {
  id: string;
  title: string;
  description: string;
  xPercent: number; // 0 to 100
  yPercent: number; // 0 to 100
  icon?: string;
}

export const Virtual3DTourModal: React.FC<Virtual3DTourModalProps> = ({ temple, onClose, showToast }) => {
  if (!temple) return null;

  // Viewport 3D State
  const [rotationX, setRotationX] = useState(0); // -30 to 30 deg
  const [rotationY, setRotationY] = useState(0); // 0 to 360 deg
  const [zoom, setZoom] = useState(1); // 1 to 2.5
  const [autoRotate, setAutoRotate] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [showFactDrawer, setShowFactDrawer] = useState(false);

  // Mouse & Touch Dragging State
  const [isDragging, setIsDragging] = useState(false);
  const startMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // 3 Scenes for Virtual Tour
  const scenes = [
    {
      id: 'scene_garbhagriha',
      name: 'Main Sanctum (Garbhagriha)',
      subtitle: `Holy Shrine of ${temple.mainDeity}`,
      bgUrl: temple.images[0] || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=80',
      hotspots: [
        {
          id: 'hs_1',
          title: `Main Idol of ${temple.mainDeity}`,
          description: `Sacred moolnayak idol worshipped according to ancient Jain Vidhi and Pakshal Snatra Mahotsav rituals.`,
          xPercent: 48,
          yPercent: 42,
        },
        {
          id: 'hs_2',
          title: 'Ashtamangal & Pure Silver Prabhavali',
          description: 'Auspicious eight symbols (Swastika, Nandyavarta, Kalasha, etc.) carved in solid silver symbolizing soul purity.',
          xPercent: 28,
          yPercent: 55,
        },
        {
          id: 'hs_3',
          title: 'Akhand Deepak (Eternal Lamp)',
          description: 'Pure cow ghee lamp continuously burning in reverence to Bhagwan Mahavira / Tirthankaras for spiritual illumination.',
          xPercent: 72,
          yPercent: 60,
        },
      ],
    },
    {
      id: 'scene_rangmandap',
      name: 'Pillared Hall (Rang Mandap)',
      subtitle: 'Exquisite Marble Carvings & Dome Ceiling',
      bgUrl: temple.images[1] || 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=80',
      hotspots: [
        {
          id: 'hs_4',
          title: 'Carved Marble Lotus Ceiling',
          description: 'Architectural masterpiece depicting the celestial gods (Devas) dancing in joy during Tirthankara Janma Kalyanak.',
          xPercent: 50,
          yPercent: 25,
        },
        {
          id: 'hs_5',
          title: 'Siddhachakra Yantra Shrine',
          description: 'Sacred meditation disc representing Navpad (Arihant, Siddha, Acharya, Upadhyaya, Sadhu, Darsana, Jnana, Caritra, Tapa).',
          xPercent: 32,
          yPercent: 50,
        },
      ],
    },
    {
      id: 'scene_shikhara',
      name: 'Parikrama & Outer Shikhara',
      subtitle: 'Panoramic Spire View & Holy Courtyard',
      bgUrl: temple.images[0] || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
      hotspots: [
        {
          id: 'hs_6',
          title: 'Dhwaja Mastak & Golden Kalash',
          description: 'Sacred flag fluttering atop the main spire, symbolizing the triumph of Ahimsa and Truth across all directions.',
          xPercent: 50,
          yPercent: 20,
        },
        {
          id: 'hs_7',
          title: 'Dharamshala & Bhojanashala Complex',
          description: `Spacious lodging rooms (${temple.dharamshalaRooms || '100+'} rooms) and pure Sattvic Jain food dining hall.`,
          xPercent: 78,
          yPercent: 65,
        },
      ],
    },
  ];

  const currentScene = scenes[activeSceneIndex] || scenes[0];

  // Auto Rotation effect
  useEffect(() => {
    if (!autoRotate || isDragging) return;
    const timer = setInterval(() => {
      setRotationY((prev) => (prev + 0.4) % 360);
    }, 40);

    return () => clearInterval(timer);
  }, [autoRotate, isDragging]);

  // Audio Toggle
  const toggleAudio = () => {
    if (isPlayingAudio) {
      stopNavkarMantraAudio();
      setIsPlayingAudio(false);
      if (showToast) showToast('Audio Paused', 'Navkar Mantra chanting paused.', 'info');
    } else {
      setIsPlayingAudio(true);
      if (showToast) showToast('Playing Chanting', 'Namo Arihantanam... Namo Siddhanam...', 'info');
      playNavkarMantraAudio(() => setIsPlayingAudio(false));
    }
  };

  // Drag start handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    startMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startMousePos.current.x;
    const deltaY = e.clientY - startMousePos.current.y;

    startMousePos.current = { x: e.clientX, y: e.clientY };

    setRotationY((prev) => (prev + deltaX * 0.3) % 360);
    setRotationX((prev) => {
      const next = prev - deltaY * 0.2;
      return Math.max(-25, Math.min(25, next));
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setRotationX(0);
    setRotationY(0);
    setZoom(1);
    setSelectedHotspot(null);
  };

  const handleSnapshot = () => {
    if (showToast) {
      showToast('3D Tour Snapshot Captured', `Saved 360° view of ${temple.templeName}`, 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-2 sm:p-4 overflow-hidden animate-fadeIn">
      {/* Container Window */}
      <div
        ref={containerRef}
        className={`relative w-full max-w-6xl bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 ${
          isFullscreen ? 'h-screen max-w-none rounded-none border-none' : 'h-[90vh] max-h-[850px]'
        }`}
      >
        {/* Top Header Bar */}
        <div className="relative z-20 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 border-b border-amber-500/30 flex items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="p-2 bg-gradient-to-tr from-amber-500 to-amber-600 text-amber-950 rounded-xl shadow-md shrink-0">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </span>

            <div className="overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-extrabold uppercase rounded border border-amber-500/30">
                  360° Interactive 3D Tour
                </span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> {temple.sect}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold font-serif text-amber-100 truncate">
                {temple.templeName}
              </h2>
              <p className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>{temple.city}, {temple.state} • Main Deity: {temple.mainDeity}</span>
              </p>
            </div>
          </div>

          {/* Action Buttons Right */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleAudio}
              className={`p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer min-h-[40px] border ${
                isPlayingAudio
                  ? 'bg-amber-500 text-amber-950 border-amber-300 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-500/30'
              }`}
              title="Toggle Temple Audio Chanting"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{isPlayingAudio ? 'Mute' : 'Temple Audio'}</span>
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[40px]"
              title="Fullscreen View"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                stopNavkarMantraAudio();
                onClose();
              }}
              className="p-2.5 bg-amber-500/20 hover:bg-amber-500 text-amber-200 hover:text-amber-950 border border-amber-500/40 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[40px]"
              title="Close Virtual Tour"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 360 Interactive Panorama Viewport */}
        <div
          className="relative flex-1 w-full overflow-hidden bg-black select-none cursor-grab active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* Simulated 360 Panoramic Canvas Container */}
          <div
            className="absolute inset-0 w-full h-full transition-transform duration-75 ease-out"
            style={{
              backgroundImage: `url(${currentScene.bgUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: `${((rotationY % 360) / 360) * 100}% ${50 + rotationX}%`,
              transform: `scale(${zoom})`,
              filter: 'brightness(1.05) contrast(1.02)',
            }}
          />

          {/* Panoramic Spherical Depth Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/60 pointer-events-none" />

          {/* Interactive Hotspot Pointers overlaying panorama */}
          <div className="absolute inset-0 pointer-events-none">
            {currentScene.hotspots.map((hs) => {
              // Adjust hotspot X based on rotationY
              const adjustedX = (hs.xPercent + (rotationY / 360) * 100) % 100;
              const displayX = adjustedX < 0 ? adjustedX + 100 : adjustedX;

              return (
                <div
                  key={hs.id}
                  style={{
                    left: `${displayX}%`,
                    top: `${hs.yPercent + rotationX * 0.5}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="absolute pointer-events-auto transition-all duration-300"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedHotspot(hs);
                    }}
                    className="relative group cursor-pointer flex items-center justify-center p-2.5 bg-amber-500 text-slate-950 rounded-full shadow-2xl ring-4 ring-amber-300/50 hover:scale-125 transition-transform animate-bounce"
                  >
                    <Eye className="w-4 h-4 text-slate-950" />
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 bg-slate-950/90 text-amber-300 text-[10px] font-extrabold rounded-lg border border-amber-500/40 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                      {hs.title}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Compass & Orientation HUD */}
          <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md border border-amber-500/30 text-amber-300 p-2.5 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-bold pointer-events-none">
            <div className="relative w-8 h-8 rounded-full border border-amber-400 flex items-center justify-center bg-slate-900">
              <span
                className="text-amber-400 font-extrabold text-[10px] transition-transform"
                style={{ transform: `rotate(${-rotationY}deg)` }}
              >
                N
              </span>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Heading</p>
              <p className="text-amber-300 font-black font-mono">
                {Math.round((rotationY % 360 + 360) % 360)}° {rotationX > 0 ? '↑' : rotationX < 0 ? '↓' : ''}
              </p>
            </div>
          </div>

          {/* Drag Instruction Banner overlay */}
          <div className="absolute top-4 right-4 bg-slate-950/70 backdrop-blur-md border border-slate-700 text-slate-300 px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 pointer-events-none">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Click & Drag to rotate 360° view</span>
          </div>

          {/* Hotspot Information Popup Modal overlay */}
          {selectedHotspot && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-slate-950/95 backdrop-blur-xl border border-amber-500/50 p-4 rounded-2xl shadow-2xl text-white space-y-2 animate-fadeIn z-30">
              <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-amber-500 text-slate-950 rounded-lg">
                    <Info className="w-4 h-4" />
                  </span>
                  <h3 className="font-serif font-bold text-sm text-amber-200">
                    {selectedHotspot.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                {selectedHotspot.description}
              </p>
              <div className="pt-1 flex justify-end">
                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="px-3 py-1 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-lg cursor-pointer"
                >
                  Continue 3D Tour
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Scene Selection Switcher Tabs */}
        <div className="bg-slate-950 border-t border-slate-800 p-2 sm:p-3 flex items-center justify-center gap-2 overflow-x-auto no-scrollbar">
          {scenes.map((scene, idx) => (
            <button
              key={scene.id}
              onClick={() => {
                setActiveSceneIndex(idx);
                setSelectedHotspot(null);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer border min-h-[38px] ${
                activeSceneIndex === idx
                  ? 'bg-amber-500 text-amber-950 border-amber-300 shadow-lg scale-105'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Layers className={`w-3.5 h-3.5 ${activeSceneIndex === idx ? 'text-amber-950' : 'text-amber-400'}`} />
              <span>{scene.name}</span>
            </button>
          ))}
        </div>

        {/* Bottom Interactive Control Toolbar */}
        <div className="bg-slate-950 border-t border-amber-500/30 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 text-white">
          {/* Left: Direction Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setRotationY((prev) => prev - 25)}
              className="p-2 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 rounded-xl text-xs font-bold cursor-pointer transition-all"
              title="Pan Left 25°"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setRotationY((prev) => prev + 25)}
              className="p-2 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 rounded-xl text-xs font-bold cursor-pointer transition-all"
              title="Pan Right 25°"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={resetView}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>

          {/* Middle: Auto-Rotate & Zoom Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                autoRotate
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              {autoRotate ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-amber-400" />}
              <span>{autoRotate ? 'Pause 360° Auto-Spin' : 'Auto 360° Spin'}</span>
            </button>

            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1">
              <button
                onClick={() => setZoom((prev) => Math.max(1, prev - 0.25))}
                className="p-1.5 hover:bg-slate-800 text-slate-300 rounded-lg cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-[10px] font-mono font-bold text-amber-300 px-1">
                {zoom.toFixed(1)}x
              </span>
              <button
                onClick={() => setZoom((prev) => Math.min(2.5, prev + 0.25))}
                className="p-1.5 hover:bg-slate-800 text-slate-300 rounded-lg cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Snapshot & Info Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSnapshot}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Snapshot</span>
            </button>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(temple.templeName + ' ' + temple.city)}`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-amber-300" />
              <span>Google Earth 3D</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
