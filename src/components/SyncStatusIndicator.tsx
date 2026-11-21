import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Database,
  Clock,
  ChevronDown,
  Zap,
  CloudOff,
  GitMerge,
} from 'lucide-react';

interface SyncStatusIndicatorProps {
  variant?: 'topbar' | 'header';
  className?: string;
}

type SyncVisualState = 'synced' | 'syncing' | 'failed';

export const SyncStatusIndicator: React.FC<SyncStatusIndicatorProps> = ({
  variant = 'topbar',
  className = '',
}) => {
  const {
    isSupabaseConnected,
    isSyncingSupabase,
    isAutoSyncing,
    lastSupabaseSyncStatus,
    lastSupabaseSyncTime,
    lastSupabaseSyncMessage,
    lastSupabaseSyncDetails,
    autoSyncEnabled,
    setAutoSyncEnabled,
    lastAutoSyncTime,
    lastAutoSyncCollections,
    syncAllDataToSupabase,
    pendingSyncConflicts,
    setIsConflictModalOpen,
    isSuperAdmin,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  if (!isSuperAdmin) {
    return null;
  }

  const isSyncing = isSyncingSupabase || isAutoSyncing;
  const hasFailure =
    !isSupabaseConnected ||
    lastSupabaseSyncStatus === 'failed' ||
    lastSupabaseSyncStatus === 'partial';

  const syncState: SyncVisualState = isSyncing
    ? 'syncing'
    : hasFailure
    ? 'failed'
    : 'synced';

  const stateConfig: Record<
    SyncVisualState,
    {
      label: string;
      shortDesc: string;
      pillClasses: string;
      dotClasses: string;
      borderClasses: string;
      badgeClasses: string;
    }
  > = {
    syncing: {
      label: 'Syncing',
      shortDesc: 'Pushing local changes to Supabase PostgreSQL...',
      pillClasses:
        variant === 'topbar'
          ? 'bg-amber-950/90 hover:bg-amber-900 text-amber-100 border-amber-400/70'
          : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-500/60',
      dotClasses: 'bg-amber-400 animate-ping',
      borderClasses: 'border-amber-400/60',
      badgeClasses: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
    },
    failed: {
      label: 'Sync Failed',
      shortDesc: !isSupabaseConnected
        ? 'Supabase credentials not configured in environment.'
        : lastSupabaseSyncStatus === 'partial'
        ? 'Some records synced with table warnings.'
        : 'Unable to sync local data with Supabase.',
      pillClasses:
        variant === 'topbar'
          ? 'bg-rose-950/95 hover:bg-rose-900 text-rose-100 border-rose-500/70 hover:border-rose-400'
          : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/80 dark:text-rose-200 dark:border-rose-500/60',
      dotClasses: 'bg-rose-400',
      borderClasses: 'border-rose-500/60',
      badgeClasses: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
    },
    synced: {
      label: 'Synced',
      shortDesc: 'Local data is synchronized with Supabase.',
      pillClasses:
        variant === 'topbar'
          ? 'bg-emerald-950/90 hover:bg-emerald-900/95 text-emerald-100 border-emerald-500/50 hover:border-emerald-400'
          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-500/50',
      dotClasses: 'bg-emerald-400',
      borderClasses: 'border-emerald-500/50',
      badgeClasses: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
    },
  };

  const current = stateConfig[syncState];
  const lastSyncTimestamp = lastAutoSyncTime || lastSupabaseSyncTime;
  const tableErrors = lastSupabaseSyncDetails?.tableErrors || [];

  const handleManualSync = async () => {
    if (isSyncing) return;
    await syncAllDataToSupabase();
  };

  return (
    <div className={`relative inline-block ${className}`} ref={containerRef}>
      <button
        type="button"
        id="header-supabase-sync-status-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label={`Supabase Sync Status: ${current.label}`}
        title={`Supabase Sync Status: ${current.label} — Click for details`}
        className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold border transition-all shadow-sm cursor-pointer shrink-0 ${current.pillClasses}`}
      >
        <span className="relative flex h-2 w-2 shrink-0">
          {syncState === 'syncing' && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75" />
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              syncState === 'syncing'
                ? 'bg-amber-400'
                : syncState === 'failed'
                ? 'bg-rose-400'
                : 'bg-emerald-400'
            }`}
          />
        </span>

        {syncState === 'syncing' ? (
          <RefreshCw className="w-3 h-3 text-amber-300 animate-spin shrink-0" />
        ) : syncState === 'failed' ? (
          !isSupabaseConnected ? (
            <CloudOff className="w-3 h-3 text-rose-300 shrink-0" />
          ) : (
            <AlertCircle className="w-3 h-3 text-rose-300 shrink-0" />
          )
        ) : (
          <CheckCircle2 className="w-3 h-3 text-emerald-300 shrink-0" />
        )}

        <span className="font-extrabold tracking-tight whitespace-nowrap">
          {current.label}
        </span>

        {pendingSyncConflicts.length > 0 && (
          <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black leading-tight shrink-0">
            {pendingSyncConflicts.length}
          </span>
        )}

        <ChevronDown
          className={`w-3 h-3 opacity-80 transition-transform shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Supabase Sync Details"
          className={`absolute right-0 mt-2 bg-slate-900/95 backdrop-blur-xl text-white rounded-2xl shadow-2xl border-2 ${current.borderClasses} p-3.5 w-72 sm:w-80 z-50`}
        >
          {/* Popover Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-extrabold text-white leading-tight">
                  Supabase Data Sync
                </p>
                <p className="text-[10px] text-slate-400">
                  {isSupabaseConnected ? 'PostgreSQL Connected' : 'Offline / Config Missing'}
                </p>
              </div>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${current.badgeClasses}`}
            >
              {current.label}
            </span>
          </div>

          {/* Status Summary */}
          <div className="py-2.5 space-y-2 border-b border-slate-800/80">
            <p className="text-[11px] text-slate-200 leading-relaxed">
              {current.shortDesc}
            </p>

            <div className="flex items-center justify-between text-[11px] bg-slate-800/70 rounded-xl px-2.5 py-1.5 border border-slate-700/60">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Last Sync</span>
              </span>
              <span className="font-bold text-slate-100">
                {isSyncing
                  ? 'In progress...'
                  : lastSyncTimestamp || (isSupabaseConnected ? 'Active & Monitoring' : 'Not Synced')}
              </span>
            </div>

            {/* Auto-Sync Toggle */}
            <div className="flex items-center justify-between text-[11px] bg-slate-800/70 rounded-xl px-2.5 py-1.5 border border-slate-700/60">
              <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <Zap className={`w-3.5 h-3.5 ${autoSyncEnabled ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>Auto-Sync</span>
              </span>
              <button
                type="button"
                onClick={() => setAutoSyncEnabled(!autoSyncEnabled)}
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border transition-colors cursor-pointer ${
                  autoSyncEnabled
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'bg-slate-700/70 text-slate-300 border-slate-600 hover:bg-slate-700'
                }`}
              >
                {autoSyncEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Updated Tables or Error Message */}
          {lastAutoSyncCollections.length > 0 && syncState !== 'failed' && (
            <div className="py-2 border-b border-slate-800/80">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Recent Collections
              </p>
              <div className="flex flex-wrap gap-1">
                {lastAutoSyncCollections.slice(0, 6).map((col) => (
                  <span
                    key={col}
                    className="px-1.5 py-0.5 rounded-md bg-slate-800 text-emerald-300 border border-slate-700 text-[10px] font-mono"
                  >
                    {col}
                  </span>
                ))}
                {lastAutoSyncCollections.length > 6 && (
                  <span className="px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-mono">
                    +{lastAutoSyncCollections.length - 6} more
                  </span>
                )}
              </div>
            </div>
          )}

          {(lastSupabaseSyncMessage || tableErrors.length > 0) && syncState === 'failed' && (
            <div className="my-2 p-2 rounded-xl bg-rose-950/60 border border-rose-500/40 text-[10px] text-rose-200 space-y-1 max-h-28 overflow-y-auto">
              {lastSupabaseSyncMessage && (
                <p className="font-semibold leading-snug">{lastSupabaseSyncMessage}</p>
              )}
              {tableErrors.slice(0, 3).map((err, idx) => (
                <p key={idx} className="text-rose-300/90 font-mono break-words">
                  • {err}
                </p>
              ))}
            </div>
          )}

          {/* Conflict Resolution Prompt if pending conflicts exist */}
          {pendingSyncConflicts.length > 0 && (
            <div className="my-2 p-2.5 rounded-xl bg-amber-500/15 border border-amber-400/50 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-extrabold text-amber-200">
                <span className="flex items-center gap-1.5">
                  <GitMerge className="w-3.5 h-3.5 text-amber-300" />
                  <span>{pendingSyncConflicts.length} Data Conflict(s)</span>
                </span>
                <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300">
                  Action Needed
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsConflictModalOpen(true);
                }}
                className="w-full py-1.5 px-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <GitMerge className="w-3.5 h-3.5" />
                <span>Review &amp; Choose Versions</span>
              </button>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-2.5 flex items-center gap-2">
            <button
              type="button"
              onClick={handleManualSync}
              disabled={isSyncing || !isSupabaseConnected}
              className={`w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold transition-all ${
                isSyncing || !isSupabaseConnected
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : syncState === 'failed'
                  ? 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white shadow-md cursor-pointer'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md cursor-pointer'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>
                {isSyncing
                  ? 'Syncing with Supabase...'
                  : syncState === 'failed'
                  ? 'Retry Sync Now'
                  : 'Sync Now'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
