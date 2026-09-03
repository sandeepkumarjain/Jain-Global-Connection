import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import {
  getDailyTithiAlert,
  DailyTithiAlertData,
  isNotificationSupported,
  getNotificationPermission,
  requestPushPermission,
  sendDailyTithiPushNotification,
  isDailyPushEnabled,
  setDailyPushEnabled,
  markAlertDismissedToday,
  hasAlertBeenDismissedToday,
} from '../utils/jainFestivalAlerts';
import {
  Bell,
  BellRing,
  Sparkles,
  Calendar,
  Sun,
  Moon,
  ChevronRight,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Compass,
  Volume2,
  Info,
  Flame,
  Utensils
} from 'lucide-react';

interface DailyTithiNotificationToastProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export const DailyTithiNotificationToast: React.FC<DailyTithiNotificationToastProps> = ({
  forceOpen,
  onClose,
}) => {
  const { setActiveTab, showToast } = useApp();

  const [alertData, setAlertData] = useState<DailyTithiAlertData | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  // Default to compact pill mode so it never covers or overlaps the hero/header
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [dontShowToday, setDontShowToday] = useState<boolean>(false);
  const [pushStatus, setPushStatus] = useState<'default' | 'granted' | 'denied' | 'unsupported'>('default');
  const [isPushActive, setIsPushActive] = useState<boolean>(false);
  const [isSendingTestPush, setIsSendingTestPush] = useState<boolean>(false);

  // Compute alert data on mount and interval
  useEffect(() => {
    const data = getDailyTithiAlert(new Date());
    setAlertData(data);

    // Check notification status
    const perm = getNotificationPermission();
    setPushStatus(perm);
    setIsPushActive(isDailyPushEnabled());

    // Check if dismissed today
    if (forceOpen) {
      setIsVisible(true);
      setIsExpanded(true);
    } else {
      const alreadyDismissed = hasAlertBeenDismissedToday();
      if (!alreadyDismissed) {
        // Show as a compact, unobtrusive bottom toast
        const timer = setTimeout(() => {
          setIsVisible(true);
          setIsExpanded(false); // keep compact!
          // Auto send push notification if user previously opted in
          if (perm === 'granted' && isDailyPushEnabled()) {
            sendDailyTithiPushNotification(data);
          }
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [forceOpen]);

  // Keep state synced if forceOpen changes
  useEffect(() => {
    if (forceOpen) {
      setIsVisible(true);
      setIsExpanded(true);
    }
  }, [forceOpen]);

  const handleDismiss = () => {
    if (dontShowToday) {
      markAlertDismissedToday();
    }
    setIsVisible(false);
    setIsExpanded(false);
    if (onClose) onClose();
  };

  const handleEnablePush = async () => {
    if (!isNotificationSupported()) {
      showToast('Notifications Not Supported', 'Your browser does not support web push notifications.', 'error');
      return;
    }

    setIsSendingTestPush(true);

    try {
      const perm = await requestPushPermission();
      setPushStatus(perm);

      if (perm === 'granted') {
        setIsPushActive(true);
        setDailyPushEnabled(true);

        if (alertData) {
          const sent = sendDailyTithiPushNotification(alertData);
          if (sent) {
            showToast(
              '🔔 Daily Push Active!',
              'You will now receive auspicious Jain Tithi & festival notifications.',
              'success'
            );
          } else {
            showToast('Push Enabled', 'Daily Jain Tithi notification preferences saved.', 'success');
          }
        }
      } else if (perm === 'denied') {
        setIsPushActive(false);
        setDailyPushEnabled(false);
        showToast(
          'Notifications Blocked',
          'Please allow notifications in browser site settings to receive daily Tithi alerts.',
          'error'
        );
      }
    } catch (err) {
      console.error(err);
      showToast('Push Notification Error', 'Unable to enable notifications.', 'error');
    } finally {
      setIsSendingTestPush(false);
    }
  };

  const handleTestPush = () => {
    if (!alertData) return;
    setIsSendingTestPush(true);
    const sent = sendDailyTithiPushNotification(alertData);
    if (sent) {
      showToast('Test Notification Sent', "Look at your system notification center for today's Jain Tithi alert.", 'success');
    } else {
      showToast('Could Not Send', 'Please ensure notification permissions are granted.', 'info');
    }
    setTimeout(() => setIsSendingTestPush(false), 500);
  };

  const handleOpenPanchang = () => {
    setActiveTab('panchang');
    handleDismiss();
  };

  if (!alertData) {
    return null;
  }

  const highlightFestival = alertData.todayFestival || alertData.nextFestival;

  // Render floating re-open pill when dismissed
  if (!isVisible) {
    return (
      <aside
        role="region"
        aria-label="Reopen Daily Jain Tithi Alert"
        className="fixed bottom-4 left-4 z-40"
      >
        <button
          type="button"
          onClick={() => {
            setIsVisible(true);
            setIsExpanded(false);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900/90 hover:bg-stone-900 text-amber-300 hover:text-amber-200 border border-amber-500/40 text-xs font-bold shadow-lg backdrop-blur-md transition-all active:scale-95 cursor-pointer group"
          title="Open Daily Jain Tithi & Festival Alert"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span className="font-serif">Tithi: {alertData.tithi.split('(')[0].trim()}</span>
          {highlightFestival && (
            <span className="text-[10px] bg-amber-500/20 text-amber-200 px-1.5 py-0.2 rounded-full border border-amber-500/30 ml-0.5">
              {highlightFestival.daysLabel}
            </span>
          )}
        </button>
      </aside>
    );
  }

  return (
    <AnimatePresence>
      <aside
        role="region"
        aria-label="Daily Jain Tithi and Festival Alert"
        className="fixed bottom-4 left-3 right-3 sm:right-auto sm:left-4 z-45 max-w-[calc(100vw-1.5rem)] sm:max-w-md w-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="bg-gradient-to-b from-stone-950/95 via-amber-950/95 to-stone-950/95 text-stone-100 rounded-2xl shadow-2xl border border-amber-500/50 backdrop-blur-xl overflow-hidden relative"
        >
          {/* Subtle Sacred Gold Pattern Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

          {/* ================= COMPACT SLIM BAR (Always visible, height ~46px) ================= */}
          <div className="relative z-10 px-3 py-2 flex flex-wrap items-center justify-between gap-2">
            <div
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 min-w-0 cursor-pointer select-none group flex-1"
              title={isExpanded ? 'Click to collapse' : 'Click to view full Tithi & Festival details'}
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-black text-amber-50 truncate font-serif">
                    {alertData.tithi.split('(')[0].trim()}
                  </span>
                  {highlightFestival && (
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full border truncate ${
                        highlightFestival.isToday
                          ? 'bg-rose-500/30 text-rose-200 border-rose-400/50 animate-pulse'
                          : 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                      }`}
                    >
                      {highlightFestival.title.split('(')[0].trim()} ({highlightFestival.daysLabel})
                    </span>
                  )}
                </div>
                {!isExpanded && (
                  <p className="text-[10px] text-amber-200/80 truncate">
                    {alertData.month} • {alertData.todayObservance.ruleTitle.split('—')[0].trim()}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="px-2 py-1 bg-amber-900/50 hover:bg-amber-800 text-amber-200 hover:text-amber-100 rounded-lg text-[10px] font-bold border border-amber-500/30 transition-all cursor-pointer flex items-center gap-0.5"
                title={isExpanded ? 'Collapse' : 'Expand Details'}
              >
                <span>{isExpanded ? 'Less' : 'Details'}</span>
                <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? '-rotate-90' : 'rotate-90'}`} />
              </button>

              <button
                type="button"
                onClick={handleDismiss}
                className="w-6 h-6 flex items-center justify-center rounded-lg bg-stone-900 hover:bg-amber-900 text-amber-300 hover:text-white border border-amber-500/30 transition-colors cursor-pointer"
                title="Dismiss Alert"
                aria-label="Close Alert"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ================= EXPANDED DETAILED VIEW (Only visible when user toggles 'Details') ================= */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="relative z-10 px-3.5 pb-3.5 pt-1 border-t border-amber-500/25 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-amber-500/30"
              >
                {/* Gregorian & Masa Line */}
                <div className="flex items-center justify-between text-[11px] text-amber-300 font-semibold mb-1.5 pt-1">
                  <span>{alertData.gregorianDateStr}</span>
                  <div className="flex items-center gap-2 text-[10px] text-amber-200/80">
                    <span className="flex items-center gap-0.5">
                      <Sun className="w-3 h-3 text-amber-400" /> {alertData.sunrise}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <Moon className="w-3 h-3 text-amber-400" /> {alertData.sunset}
                    </span>
                  </div>
                </div>

                {/* Today's Dietary Observance */}
                <div className="flex items-start gap-1.5 p-2 rounded-xl bg-amber-900/40 border border-amber-500/30 text-[11px] text-amber-100 mb-2">
                  <Utensils className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="font-bold text-amber-300 mr-1">
                      {alertData.todayObservance.ruleTitle}:
                    </span>
                    <span className="text-amber-100/90 text-[10.5px]">
                      {alertData.todayObservance.recommendedDiet}
                    </span>
                  </div>
                </div>

                {/* Significant Upcoming Festival Banner */}
                {highlightFestival && (
                  <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-600/30 via-orange-600/20 to-amber-700/30 border border-amber-400/40 shadow-xs mb-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <BellRing className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
                          {highlightFestival.isToday ? 'Today’s Mahaparv' : 'Upcoming Festival'}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-wide ${
                          highlightFestival.isToday
                            ? 'bg-rose-500 text-white animate-pulse'
                            : 'bg-amber-400 text-slate-950'
                        }`}
                      >
                        {highlightFestival.daysLabel}
                      </span>
                    </div>

                    <div className="mt-1">
                      <h5 className="text-xs sm:text-sm font-black text-amber-100 flex items-center gap-1.5">
                        <span>{highlightFestival.title}</span>
                        {highlightFestival.sect && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300 font-bold">
                            {highlightFestival.sect}
                          </span>
                        )}
                      </h5>
                      <p className="text-[11px] text-amber-200/90 line-clamp-2 mt-0.5">
                        {highlightFestival.significance}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-amber-300 font-semibold">
                        <Calendar className="w-3 h-3" />
                        <span>{highlightFestival.displayDate}</span>
                        <span>•</span>
                        <span>{highlightFestival.jainTithi}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Other Upcoming Festivals */}
                {alertData.upcomingFestivals.length > 1 && (
                  <div className="mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                      Next Festivals:
                    </span>
                    <div className="space-y-1">
                      {alertData.upcomingFestivals.slice(1, 3).map((f) => (
                        <div
                          key={f.id}
                          className="flex items-center justify-between text-[11px] bg-amber-950/60 p-1.5 rounded-lg border border-amber-500/20"
                        >
                          <span className="font-semibold text-amber-100 truncate mr-2">
                            {f.title}
                          </span>
                          <span className="text-[10px] font-bold text-amber-300 shrink-0 bg-amber-900/60 px-1.5 py-0.5 rounded">
                            {f.daysLabel}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Daily Agam Wisdom Line */}
                <div className="p-2 rounded-lg bg-stone-900/80 border border-amber-500/20 text-[10.5px] mb-2.5">
                  <span className="font-bold text-amber-300 block mb-0.5">Daily Agam Thought:</span>
                  <p className="italic text-stone-300">{alertData.dailyQuote.text}</p>
                  <span className="text-[9px] text-amber-400/80 block text-right mt-0.5">
                    — {alertData.dailyQuote.source}
                  </span>
                </div>

                {/* Controls Bar: Push Setup & Panchang Navigation */}
                <div className="pt-2 border-t border-amber-500/30 flex flex-col gap-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    {/* Push notification toggle / test button */}
                    {isPushActive ? (
                      <button
                        type="button"
                        onClick={handleTestPush}
                        disabled={isSendingTestPush}
                        className="px-2.5 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-[11px] font-bold border border-emerald-500/40 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                        title="Test sending today's native push notification"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Push Active (Test)</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleEnablePush}
                        disabled={isSendingTestPush}
                        className="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 text-[11px] font-black flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                        title="Receive daily Tithi alerts directly in your browser"
                      >
                        <Bell className="w-3.5 h-3.5 text-slate-950" />
                        <span>{isSendingTestPush ? 'Setting...' : 'Enable Push'}</span>
                      </button>
                    )}

                    {/* Full Panchang CTA */}
                    <button
                      type="button"
                      onClick={handleOpenPanchang}
                      className="px-3 py-1.5 rounded-xl bg-amber-900/80 hover:bg-amber-800 text-amber-100 hover:text-white text-[11px] font-bold border border-amber-500/40 flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                    >
                      <Compass className="w-3.5 h-3.5 text-amber-300" />
                      <span>Open Panchang</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Bottom Dismiss Options */}
                  <div className="flex items-center justify-between pt-1 text-[10px] text-amber-300/80">
                    <label className="flex items-center gap-1.5 cursor-pointer select-none hover:text-amber-200">
                      <input
                        type="checkbox"
                        checked={dontShowToday}
                        onChange={(e) => setDontShowToday(e.target.checked)}
                        className="rounded border-amber-500/50 text-amber-500 focus:ring-0 focus:ring-offset-0 bg-stone-900 cursor-pointer"
                      />
                      <span>Don't show again today</span>
                    </label>

                    <button
                      type="button"
                      onClick={handleDismiss}
                      className="underline hover:text-white cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </aside>
    </AnimatePresence>
  );
};
