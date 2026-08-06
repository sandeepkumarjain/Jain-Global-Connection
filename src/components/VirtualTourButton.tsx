import React, { useState } from 'react';
import { Compass, Sparkles, Eye, Clock } from 'lucide-react';
import { TempleListing } from '../types';

interface VirtualTourButtonProps {
  temple: TempleListing;
  onOpenTour: (temple: TempleListing) => void;
  showToast?: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  className?: string;
  size?: 'sm' | 'md';
}

export const VirtualTourButton: React.FC<VirtualTourButtonProps> = ({
  temple,
  onOpenTour,
  showToast,
  className = '',
  size = 'md',
}) => {
  const [showComingSoonTooltip, setShowComingSoonTooltip] = useState(false);

  const isAvailable = Boolean(temple.is360Available);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAvailable) {
      onOpenTour(temple);
    } else {
      setShowComingSoonTooltip(true);
      if (showToast) {
        showToast(
          'Virtual 3D Tour Coming Soon',
          `360-degree interactive 3D tour for ${temple.templeName} is currently being mapped by our Tirth digitization team.`,
          'info'
        );
      }
      setTimeout(() => setShowComingSoonTooltip(false), 3500);
    }
  };

  if (isAvailable) {
    return (
      <button
        onClick={handleClick}
        className={`relative group bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 hover:text-white font-extrabold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 cursor-pointer border border-amber-300 dark:border-amber-600/80 ${
          size === 'sm' ? 'px-2.5 py-1.5 text-[10px] min-h-[32px]' : 'px-3 py-2 text-xs min-h-[40px]'
        } ${className}`}
        title="Open interactive 360° Virtual 3D Tour"
      >
        <span className="p-1 bg-slate-950 text-amber-300 rounded-lg group-hover:scale-110 transition-transform">
          <Compass className="w-3.5 h-3.5 animate-spin-slow" />
        </span>
        <span className="truncate">Virtual 3D Tour</span>
        <span className="px-1.5 py-0.5 bg-slate-950/20 text-[9px] font-black uppercase rounded text-amber-950 dark:text-amber-200">
          360°
        </span>
      </button>
    );
  }

  // Coming soon state
  return (
    <div className="relative inline-block" onMouseLeave={() => setShowComingSoonTooltip(false)}>
      <button
        onClick={handleClick}
        onMouseEnter={() => setShowComingSoonTooltip(true)}
        className={`bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
          size === 'sm' ? 'px-2.5 py-1.5 text-[10px] min-h-[32px]' : 'px-3 py-2 text-xs min-h-[40px]'
        } ${className}`}
        title="Virtual 3D Tour Under Creation — Coming Soon"
      >
        <Compass className="w-3.5 h-3.5 text-slate-400" />
        <span className="truncate">Virtual 3D Tour</span>
        <span className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-[9px] font-extrabold uppercase rounded">
          Soon
        </span>
      </button>

      {/* Floating Tooltip */}
      {showComingSoonTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-2.5 bg-slate-950 text-white text-[11px] font-normal rounded-xl shadow-2xl border border-amber-500/40 z-30 animate-fadeIn pointer-events-none">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>3D Tour Coming Soon</span>
          </div>
          <p className="text-[10px] text-slate-300 leading-snug">
            360° virtual digitization for <strong className="text-white">{temple.templeName}</strong> is under creation.
          </p>
          {/* Tooltip caret */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-950" />
        </div>
      )}
    </div>
  );
};
