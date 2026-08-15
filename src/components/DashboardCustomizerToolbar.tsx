import React from 'react';
import { useApp } from '../context/AppContext';
import {
  SlidersHorizontal,
  Pin,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  LayoutGrid,
  Move
} from 'lucide-react';

interface DashboardCustomizerToolbarProps {
  onOpenCustomizer: () => void;
  isDragModeActive: boolean;
  onToggleDragMode: () => void;
}

export const DashboardCustomizerToolbar: React.FC<DashboardCustomizerToolbarProps> = ({
  onOpenCustomizer,
  isDragModeActive,
  onToggleDragMode
}) => {
  const { dashboardWidgets, resetDashboardLayout, showToast, currentUser } = useApp();

  const visibleCount = dashboardWidgets.filter((w) => w.isVisible).length;
  const pinnedCount = dashboardWidgets.filter((w) => w.isPinned && w.isVisible).length;

  const handleReset = () => {
    resetDashboardLayout();
    showToast(
      'Layout Reset',
      'Restored standard recommended dashboard widget order.',
      'info'
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Left Info */}
      <div className="flex items-center gap-3.5">
        <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20 shrink-0">
          <LayoutGrid className="w-5 h-5" />
        </div>

        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm sm:text-base font-bold font-serif text-slate-900 dark:text-white">
              {currentUser?.fullName ? `${currentUser.fullName}'s Personal Dashboard` : 'Customized Home Dashboard'}
            </h3>
            <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[10px] font-extrabold uppercase rounded-full border border-amber-300 dark:border-amber-800">
              Personalized
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap pt-0.5">
            <span>
              <strong>{visibleCount}</strong> active widgets
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
              <Pin className="w-3 h-3 fill-current" />
              <span>{pinnedCount} pinned to top</span>
            </span>
            <span>•</span>
            <span>Drag or pin widgets according to your daily devotional routine.</span>
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={onToggleDragMode}
          className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer border ${
            isDragModeActive
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md animate-pulse'
              : 'bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
          }`}
          title="Toggle inline drag handles on all widgets"
        >
          <Move className="w-3.5 h-3.5" />
          <span>{isDragModeActive ? 'Exit Drag Mode' : 'Quick Drag Mode'}</span>
        </button>

        <button
          onClick={onOpenCustomizer}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-black text-xs rounded-xl shadow-md hover:shadow-amber-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Customize Layout</span>
        </button>
      </div>
    </div>
  );
};
