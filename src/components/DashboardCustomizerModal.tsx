import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { DashboardWidgetConfig, DashboardWidgetId } from '../types';
import {
  GripVertical,
  Pin,
  Eye,
  EyeOff,
  RotateCcw,
  Check,
  X,
  SlidersHorizontal,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Calendar,
  Music,
  MessageSquare,
  Heart,
  Building2,
  MapPin,
  Users,
  Award,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { reorderWidgets } from '../utils/dashboardWidgets';

interface DashboardCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DashboardCustomizerModal: React.FC<DashboardCustomizerModalProps> = ({
  isOpen,
  onClose
}) => {
  const {
    dashboardWidgets,
    updateDashboardWidgets,
    resetDashboardLayout,
    showToast
  } = useApp();

  const [localWidgets, setLocalWidgets] = useState<DashboardWidgetConfig[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    if (isOpen) {
      setLocalWidgets([...dashboardWidgets]);
    }
  }, [isOpen, dashboardWidgets]);

  if (!isOpen) return null;

  const categories = ['All', 'Spiritual', 'Media', 'Community', 'Directory'];

  // Helper to render widget icon
  const getWidgetIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calendar':
        return <Calendar className="w-5 h-5 text-amber-500" />;
      case 'Music':
        return <Music className="w-5 h-5 text-amber-500" />;
      case 'MessageSquare':
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case 'Heart':
        return <Heart className="w-5 h-5 text-rose-500" />;
      case 'Building2':
        return <Building2 className="w-5 h-5 text-amber-500" />;
      case 'MapPin':
        return <MapPin className="w-5 h-5 text-emerald-500" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-purple-500" />;
      case 'Users':
        return <Users className="w-5 h-5 text-blue-500" />;
      case 'Award':
        return <Award className="w-5 h-5 text-emerald-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-amber-500" />;
    }
  };

  // Drag & Drop Handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    // Optional cleanup
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reordered = reorderWidgets(localWidgets, draggedIndex, targetIndex);
    setLocalWidgets(reordered);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Up/Down move buttons
  const moveWidget = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= localWidgets.length) return;

    const reordered = reorderWidgets(localWidgets, index, targetIndex);
    setLocalWidgets(reordered);
  };

  // Pin toggle
  const togglePin = (id: DashboardWidgetId) => {
    setLocalWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isPinned: !w.isPinned } : w))
    );
  };

  // Visibility toggle
  const toggleVisibility = (id: DashboardWidgetId) => {
    setLocalWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isVisible: !w.isVisible } : w))
    );
  };

  // Save changes
  const handleSave = () => {
    updateDashboardWidgets(localWidgets);
    showToast(
      'Dashboard Layout Saved',
      'Your home widgets have been reordered and pinned successfully!',
      'success'
    );
    onClose();
  };

  // Reset to default
  const handleReset = () => {
    resetDashboardLayout();
    showToast(
      'Layout Reset',
      'Restored standard recommended dashboard widget order.',
      'info'
    );
    onClose();
  };

  const pinnedCount = localWidgets.filter((w) => w.isPinned && w.isVisible).length;
  const visibleCount = localWidgets.filter((w) => w.isVisible).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-white dark:bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-slate-950 via-amber-950 to-slate-950 p-5 text-white flex items-center justify-between border-b border-amber-500/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold font-serif text-white">
                  Customize Home Dashboard
                </h3>
                <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-mono font-bold rounded-full">
                  Drag & Drop
                </span>
              </div>
              <p className="text-xs text-amber-200/80">
                Pin priority widgets to the top and drag items to reorder your daily workspace.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Close Customizer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dashboard Status Ribbon */}
        <div className="bg-amber-50/80 dark:bg-slate-800/80 border-b border-amber-200/60 dark:border-slate-700/60 px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200">
              <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>
                Active Widgets: <strong>{visibleCount} / {localWidgets.length}</strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5 font-semibold text-amber-800 dark:text-amber-300">
              <Pin className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>
                Pinned to Top: <strong>{pinnedCount}</strong>
              </span>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default Layout</span>
          </button>
        </div>

        {/* Category Filters */}
        <div className="px-5 pt-3 pb-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-slate-100 dark:border-slate-800 shrink-0">
          <span className="text-[11px] font-bold text-slate-400 mr-1 uppercase">Filter:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Scrollable Widget Reorder List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pb-1">
            <HelpCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>
              Grab the <strong>⠿ grip</strong> to drag up or down, or use the <strong>↑ ↓ arrows</strong>. Click <strong>📌 Pin</strong> to keep widgets stickied to the top.
            </span>
          </div>

          {localWidgets
            .filter((w) => activeCategory === 'All' || w.category === activeCategory)
            .map((widget) => {
              const originalIndex = localWidgets.findIndex((w) => w.id === widget.id);
              const isDraggingThis = draggedIndex === originalIndex;
              const isDragOverThis = dragOverIndex === originalIndex;

              return (
                <div
                  key={widget.id}
                  draggable={true}
                  onDragStart={() => handleDragStart(originalIndex)}
                  onDragOver={(e) => handleDragOver(e, originalIndex)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, originalIndex)}
                  onDragEnd={handleDragEnd}
                  className={`border rounded-2xl p-3.5 sm:p-4 transition-all duration-200 flex items-center justify-between gap-3 ${
                    isDraggingThis
                      ? 'opacity-40 border-amber-500 border-dashed scale-98 bg-amber-50/20'
                      : isDragOverThis
                      ? 'border-amber-500 bg-amber-500/10 shadow-lg scale-[1.01]'
                      : widget.isPinned
                      ? 'bg-gradient-to-r from-amber-500/10 via-white dark:via-slate-900 to-amber-500/5 border-amber-400/60 dark:border-amber-800/60 shadow-sm'
                      : !widget.isVisible
                      ? 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-60'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 shadow-xs hover:border-amber-400/50'
                  }`}
                >
                  {/* Left: Drag Handle & Widget Identity */}
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Drag Handle */}
                    <div
                      className="p-1.5 text-slate-400 hover:text-amber-500 cursor-grab active:cursor-grabbing rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shrink-0"
                      title="Click and drag to reorder"
                    >
                      <GripVertical className="w-5 h-5" />
                    </div>

                    {/* Widget Icon */}
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/80 shrink-0">
                      {getWidgetIcon(widget.icon)}
                    </div>

                    {/* Titles */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {widget.title}
                        </h4>

                        {widget.isPinned && (
                          <span className="px-2 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-black uppercase rounded-full flex items-center gap-1 shadow-xs">
                            <Pin className="w-3 h-3 fill-slate-950" />
                            <span>Pinned</span>
                          </span>
                        )}

                        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-400 px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded-md">
                          {widget.category}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {widget.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions (Up, Down, Pin, Hide) */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Move Up */}
                    <button
                      onClick={() => moveWidget(originalIndex, 'up')}
                      disabled={originalIndex === 0}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>

                    {/* Move Down */}
                    <button
                      onClick={() => moveWidget(originalIndex, 'down')}
                      disabled={originalIndex === localWidgets.length - 1}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    {/* Pin / Unpin Button */}
                    <button
                      onClick={() => togglePin(widget.id)}
                      className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 text-xs font-bold ${
                        widget.isPinned
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-amber-500'
                      }`}
                      title={widget.isPinned ? 'Unpin from Top' : 'Pin to Top of Dashboard'}
                    >
                      <Pin className={`w-4 h-4 ${widget.isPinned ? 'fill-slate-950' : ''}`} />
                    </button>

                    {/* Show / Hide Toggle */}
                    <button
                      onClick={() => toggleVisibility(widget.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        widget.isVisible
                          ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                      title={widget.isVisible ? 'Hide from Dashboard' : 'Show on Dashboard'}
                    >
                      {widget.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Modal Bottom Footer */}
        <div className="bg-slate-50 dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-700 p-4 sm:p-5 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Changes will be saved to your profile instantly.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-black text-xs rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Apply & Save Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
