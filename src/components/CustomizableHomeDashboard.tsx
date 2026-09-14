import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DashboardWidgetConfig, DashboardWidgetId } from '../types';
import {
  GripVertical,
  Pin,
  ArrowUp,
  ArrowDown,
  EyeOff,
  SlidersHorizontal,
  Sparkles,
  Heart,
  Building2,
  MapPin,
  Calendar,
  Music,
  MessageSquare,
  Users,
  Award,
  Move
} from 'lucide-react';
import { reorderWidgets } from '../utils/dashboardWidgets';
import { PanchangWidget } from './PanchangWidget';
import { AudioPlayerWidget } from './widgets/AudioPlayerWidget';
import { CommunityFeed } from './CommunityFeed';
import { DailyJainWisdom } from './DailyJainWisdom';
import { GlobalSanghHighlights } from './GlobalSanghHighlights';
import { MatrimonialSection } from './MatrimonialSection';
import { BusinessSection } from './BusinessSection';
import { TempleSection } from './TempleSection';
import { VivahSuccessStoriesSection } from './VivahSuccessStoriesSection';
import { MemberSuccessStoriesSlider } from './MemberSuccessStoriesSlider';
import { AskPanditWidget } from './AskPanditWidget';
import { DashboardCustomizerToolbar } from './DashboardCustomizerToolbar';
import { DashboardCustomizerModal } from './DashboardCustomizerModal';

export const CustomizableHomeDashboard: React.FC = () => {
  const {
    dashboardWidgets,
    updateDashboardWidgets,
    togglePinWidget,
    toggleWidgetVisibility,
    reorderDashboardWidgets,
    setActiveTab,
    showToast
  } = useApp();

  const [isCustomizerModalOpen, setIsCustomizerModalOpen] = useState(false);
  const [isDragModeActive, setIsDragModeActive] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Filter only visible widgets, sorted by order
  const visibleWidgets = dashboardWidgets
    .filter((w) => w.isVisible)
    .sort((a, b) => {
      // Pinned widgets always appear first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return a.order - b.order;
    });

  // Drag & Drop Handlers for In-Place Reordering
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const sourceWidget = visibleWidgets[draggedIndex];
    const targetWidget = visibleWidgets[targetIndex];

    const sourceGlobalIdx = dashboardWidgets.findIndex((w) => w.id === sourceWidget.id);
    const targetGlobalIdx = dashboardWidgets.findIndex((w) => w.id === targetWidget.id);

    if (sourceGlobalIdx !== -1 && targetGlobalIdx !== -1) {
      const reordered = reorderWidgets(dashboardWidgets, sourceGlobalIdx, targetGlobalIdx);
      updateDashboardWidgets(reordered);
      showToast('Widget Reordered', `Moved "${sourceWidget.title}"`, 'info');
    }

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const moveWidgetUpDown = (widgetId: DashboardWidgetId, direction: 'up' | 'down') => {
    const currentIdx = visibleWidgets.findIndex((w) => w.id === widgetId);
    if (currentIdx === -1) return;
    const targetIdx = direction === 'up' ? currentIdx - 1 : currentIdx + 1;
    if (targetIdx < 0 || targetIdx >= visibleWidgets.length) return;

    const sourceWidget = visibleWidgets[currentIdx];
    const targetWidget = visibleWidgets[targetIdx];

    const sourceGlobalIdx = dashboardWidgets.findIndex((w) => w.id === sourceWidget.id);
    const targetGlobalIdx = dashboardWidgets.findIndex((w) => w.id === targetWidget.id);

    if (sourceGlobalIdx !== -1 && targetGlobalIdx !== -1) {
      const reordered = reorderWidgets(dashboardWidgets, sourceGlobalIdx, targetGlobalIdx);
      updateDashboardWidgets(reordered);
      showToast('Widget Moved', `Shifted "${sourceWidget.title}" ${direction}`, 'info');
    }
  };

  const handleTogglePin = (widget: DashboardWidgetConfig) => {
    togglePinWidget(widget.id);
    showToast(
      widget.isPinned ? 'Widget Unpinned' : 'Widget Pinned to Top',
      `"${widget.title}" is now ${widget.isPinned ? 'in standard order' : 'pinned to the top of your dashboard.'}`,
      'success'
    );
  };

  const handleHideWidget = (widget: DashboardWidgetConfig) => {
    toggleWidgetVisibility(widget.id);
    showToast(
      'Widget Hidden',
      `"${widget.title}" hidden from dashboard. You can restore it in Customize Layout.`,
      'info'
    );
  };

  // Render individual widget component based on ID
  const renderWidgetContent = (widget: DashboardWidgetConfig) => {
    switch (widget.id) {
      case 'panchang':
        return <PanchangWidget />;

      case 'audio_player':
        return <AudioPlayerWidget />;

      case 'community_feed':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white">
                  Jain Community Feed & Live Bulletins
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('feed')}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
              >
                Open Full Feed →
              </button>
            </div>
            <CommunityFeed />
          </div>
        );

      case 'daily_wisdom':
        return <DailyJainWisdom />;

      case 'sangh_highlights':
        return <GlobalSanghHighlights />;

      case 'matrimonial_matches':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white">
                  Featured Jain Matrimonial Matches
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('matrimonial')}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
              >
                View All Profiles →
              </button>
            </div>
            <MatrimonialSection />
          </div>
        );

      case 'business_directory':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white">
                  Verified Jain Businesses & Trade Directory
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('business')}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
              >
                Explore Directory →
              </button>
            </div>
            <BusinessSection />
          </div>
        );

      case 'temple_directory':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-500" />
                <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white">
                  Holy Jain Temples, Tirths & Live Darshan
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('temple')}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
              >
                Browse All Temples →
              </button>
            </div>
            <TempleSection />
          </div>
        );

      case 'vivah_stories':
        return <MemberSuccessStoriesSlider />;

      case 'ask_pandit':
        return <AskPanditWidget />;

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Customizer Action Bar */}
      <DashboardCustomizerToolbar
        onOpenCustomizer={() => setIsCustomizerModalOpen(true)}
        isDragModeActive={isDragModeActive}
        onToggleDragMode={() => setIsDragModeActive(!isDragModeActive)}
      />

      {/* When no widgets are visible */}
      {visibleWidgets.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto">
            <SlidersHorizontal className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
            All Dashboard Widgets are Hidden
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            You have hidden all dashboard widgets. Open the dashboard customizer to select which widgets to display.
          </p>
          <button
            onClick={() => setIsCustomizerModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-700 text-slate-950 font-bold text-xs rounded-xl shadow-lg cursor-pointer"
          >
            Open Dashboard Customizer
          </button>
        </div>
      )}

      {/* Render All Visible Widgets in Order */}
      <div className="space-y-6 sm:space-y-8">
        {visibleWidgets.map((widget, visibleIdx) => {
          const isDraggingThis = draggedIndex === visibleIdx;
          const isDragOverThis = dragOverIndex === visibleIdx;

          return (
            <div
              key={widget.id}
              draggable={isDragModeActive}
              onDragStart={() => handleDragStart(visibleIdx)}
              onDragOver={(e) => handleDragOver(e, visibleIdx)}
              onDrop={(e) => handleDrop(e, visibleIdx)}
              onDragEnd={handleDragEnd}
              className={`transition-all duration-300 relative group rounded-3xl ${
                isDraggingThis
                  ? 'opacity-40 border-2 border-dashed border-amber-500 scale-[0.99]'
                  : isDragOverThis
                  ? 'border-2 border-amber-500 shadow-2xl scale-[1.01] bg-amber-500/5'
                  : ''
              }`}
            >
              {/* Widget Floating Control Bar (Always visible in Drag Mode or on hover) */}
              <div
                className={`flex items-center justify-between gap-2 px-4 py-2 mb-2 rounded-2xl bg-slate-900/90 text-white backdrop-blur-md border border-amber-500/30 text-xs shadow-lg transition-all duration-200 ${
                  isDragModeActive
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0'
                }`}
              >
                {/* Left: Drag Handle & Title */}
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="cursor-grab active:cursor-grabbing text-amber-400 hover:text-amber-300 p-1 rounded-md"
                    title="Drag and drop to reorder this widget"
                  >
                    <GripVertical className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-amber-300 truncate">{widget.title}</span>
                  {widget.isPinned && (
                    <span className="px-2 py-0.5 bg-amber-500 text-slate-950 text-[9px] font-black rounded-full uppercase flex items-center gap-0.5">
                      <Pin className="w-2.5 h-2.5 fill-slate-950" />
                      <span>Pinned</span>
                    </span>
                  )}
                </div>

                {/* Right: Quick Widget Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {/* Move Up */}
                  <button
                    onClick={() => moveWidgetUpDown(widget.id, 'up')}
                    disabled={visibleIdx === 0}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  {/* Move Down */}
                  <button
                    onClick={() => moveWidgetUpDown(widget.id, 'down')}
                    disabled={visibleIdx === visibleWidgets.length - 1}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Pin / Unpin */}
                  <button
                    onClick={() => handleTogglePin(widget)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      widget.isPinned
                        ? 'bg-amber-500 text-slate-950'
                        : 'hover:bg-slate-800 text-slate-300 hover:text-amber-400'
                    }`}
                    title={widget.isPinned ? 'Unpin from Top' : 'Pin to Top'}
                  >
                    <Pin className={`w-3.5 h-3.5 ${widget.isPinned ? 'fill-slate-950' : ''}`} />
                  </button>

                  {/* Hide */}
                  <button
                    onClick={() => handleHideWidget(widget)}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-rose-400 cursor-pointer transition-colors"
                    title="Hide widget from Dashboard"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                  </button>

                  {/* Customize Dialog */}
                  <button
                    onClick={() => setIsCustomizerModalOpen(true)}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-amber-400 cursor-pointer transition-colors"
                    title="Open Full Customizer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Render Widget Body */}
              <div className="relative">
                {renderWidgetContent(widget)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Modal Customizer Dialog */}
      {isCustomizerModalOpen && (
        <DashboardCustomizerModal
          isOpen={isCustomizerModalOpen}
          onClose={() => setIsCustomizerModalOpen(false)}
        />
      )}
    </div>
  );
};
