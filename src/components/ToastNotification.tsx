import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toast, toastMessage, hideToast } = useApp();
  const activeToast = toast || toastMessage;

  if (!activeToast) return null;

  const duration = activeToast.duration || 4000;
  const toastId = activeToast.id || `${activeToast.title}_${activeToast.desc}`;

  return (
    <div
      key={toastId}
      className="fixed bottom-5 right-4 sm:right-6 z-50 max-w-sm w-full px-2 sm:px-0 pointer-events-auto animate-slide-in-right"
    >
      <div
        className={`relative overflow-hidden rounded-2xl shadow-2xl border backdrop-blur-md p-4 transition-all ${
          activeToast.type === 'success'
            ? 'bg-slate-900/95 text-white border-emerald-500/80 shadow-emerald-950/40'
            : activeToast.type === 'error'
            ? 'bg-slate-900/95 text-white border-red-500/80 shadow-red-950/40'
            : 'bg-slate-900/95 text-white border-amber-500/80 shadow-amber-950/40'
        }`}
      >
        <div className="flex items-start gap-3">
          {/* Icon Badge */}
          <div
            className={`p-2 rounded-xl shrink-0 ${
              activeToast.type === 'success'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : activeToast.type === 'error'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}
          >
            {activeToast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : activeToast.type === 'error' ? (
              <AlertCircle className="w-5 h-5" />
            ) : (
              <Info className="w-5 h-5" />
            )}
          </div>

          {/* Toast Text Content */}
          <div className="flex-1 min-w-0 pr-1">
            <h4 className="font-bold text-sm text-white leading-tight truncate">
              {activeToast.title}
            </h4>
            <p className="text-slate-300 text-xs mt-1 leading-snug break-words">
              {activeToast.desc}
            </p>
          </div>

          {/* Dismiss Button */}
          <button
            onClick={hideToast}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors shrink-0 -mt-0.5 -mr-1"
            title="Dismiss Notification"
            aria-label="Dismiss Notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Animated Remaining Time Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800/80 overflow-hidden">
          <div
            className={`h-full animate-toast-progress ${
              activeToast.type === 'success'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                : activeToast.type === 'error'
                ? 'bg-gradient-to-r from-red-500 to-rose-400'
                : 'bg-gradient-to-r from-amber-400 to-yellow-500'
            }`}
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>
      </div>
    </div>
  );
};
