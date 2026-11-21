import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  ConflictResolutionChoice,
  ConflictResolutionSelection,
  SyncConflict,
} from '../types';
import { formatFieldLabel, formatFieldValue } from '../utils/syncConflicts';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Cloud,
  Database,
  GitMerge,
  Laptop,
  RefreshCw,
  X,
  Eye,
  Layers,
} from 'lucide-react';

interface PerConflictDraft {
  choice: ConflictResolutionChoice | null;
  fieldOverrides: Record<string, 'local' | 'server'>;
}

export const DataConflictModal: React.FC = () => {
  const {
    pendingSyncConflicts,
    isConflictModalOpen,
    dismissSyncConflicts,
    resolveSyncConflicts,
    isResolvingConflicts,
    isSuperAdmin,
  } = useApp();

  const [activeConflictId, setActiveConflictId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, PerConflictDraft>>({});
  const [showAllFields, setShowAllFields] = useState(false);

  useEffect(() => {
    if (pendingSyncConflicts.length === 0) {
      setActiveConflictId(null);
      setDrafts({});
      return;
    }

    if (
      !activeConflictId ||
      !pendingSyncConflicts.some((c) => c.id === activeConflictId)
    ) {
      setActiveConflictId(pendingSyncConflicts[0].id);
    }

    setDrafts((prev) => {
      const next: Record<string, PerConflictDraft> = {};
      for (const conflict of pendingSyncConflicts) {
        next[conflict.id] = prev[conflict.id] || {
          choice: null,
          fieldOverrides: {},
        };
      }
      return next;
    });
  }, [pendingSyncConflicts, activeConflictId]);

  useEffect(() => {
    if (!isConflictModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isResolvingConflicts) {
        dismissSyncConflicts();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isConflictModalOpen, isResolvingConflicts, dismissSyncConflicts]);

  const activeConflict: SyncConflict | null = useMemo(() => {
    if (pendingSyncConflicts.length === 0) return null;
    return (
      pendingSyncConflicts.find((c) => c.id === activeConflictId) ||
      pendingSyncConflicts[0]
    );
  }, [pendingSyncConflicts, activeConflictId]);

  const activeDraft: PerConflictDraft = useMemo(() => {
    if (!activeConflict) return { choice: null, fieldOverrides: {} };
    return drafts[activeConflict.id] || { choice: null, fieldOverrides: {} };
  }, [activeConflict, drafts]);

  const allFieldKeys = useMemo(() => {
    if (!activeConflict) return [];
    if (!showAllFields) {
      return activeConflict.differingFields.map((d) => d.field);
    }
    const keys = new Set<string>([
      ...Object.keys(activeConflict.localRecord || {}),
      ...Object.keys(activeConflict.serverRecord || {}),
    ]);
    return Array.from(keys)
      .filter((k) => k !== 'extraData' && k !== 'password')
      .sort();
  }, [activeConflict, showAllFields]);

  const differingFieldSet = useMemo(() => {
    if (!activeConflict) return new Set<string>();
    return new Set(activeConflict.differingFields.map((d) => d.field));
  }, [activeConflict]);

  const selectWholeVersion = (
    conflict: SyncConflict,
    choice: 'local' | 'server'
  ) => {
    const overrides: Record<string, 'local' | 'server'> = {};
    for (const diff of conflict.differingFields) {
      overrides[diff.field] = choice;
    }
    setDrafts((prev) => ({
      ...prev,
      [conflict.id]: {
        choice,
        fieldOverrides: overrides,
      },
    }));
  };

  const selectFieldSide = (
    conflict: SyncConflict,
    field: string,
    side: 'local' | 'server'
  ) => {
    setDrafts((prev) => {
      const current = prev[conflict.id] || { choice: null, fieldOverrides: {} };
      const baseSide: 'local' | 'server' =
        current.choice === 'server' ? 'server' : 'local';

      const nextOverrides: Record<string, 'local' | 'server'> = {};
      for (const diff of conflict.differingFields) {
        nextOverrides[diff.field] = current.fieldOverrides[diff.field] || baseSide;
      }
      nextOverrides[field] = side;

      const selectedSides = new Set(Object.values(nextOverrides));
      let nextChoice: ConflictResolutionChoice = 'custom';
      if (selectedSides.size === 1) {
        nextChoice = selectedSides.has('server') ? 'server' : 'local';
      }

      return {
        ...prev,
        [conflict.id]: {
          choice: nextChoice,
          fieldOverrides: nextOverrides,
        },
      };
    });
  };

  const handleBulkSelect = (choice: 'local' | 'server') => {
    const next: Record<string, PerConflictDraft> = {};
    for (const conflict of pendingSyncConflicts) {
      const overrides: Record<string, 'local' | 'server'> = {};
      for (const diff of conflict.differingFields) {
        overrides[diff.field] = choice;
      }
      next[conflict.id] = { choice, fieldOverrides: overrides };
    }
    setDrafts(next);
  };

  const resolvedDraftCount = useMemo(() => {
    return pendingSyncConflicts.filter((c) => Boolean(drafts[c.id]?.choice)).length;
  }, [pendingSyncConflicts, drafts]);

  const handleApplyResolutions = async () => {
    const selections: ConflictResolutionSelection[] = [];

    for (const conflict of pendingSyncConflicts) {
      const draft = drafts[conflict.id];
      if (!draft || !draft.choice) continue;

      if (draft.choice === 'custom') {
        const merged: Record<string, any> = {
          ...conflict.localRecord,
        };
        for (const diff of conflict.differingFields) {
          const picked = draft.fieldOverrides[diff.field] || 'local';
          if (picked === 'server') {
            if (diff.field in conflict.serverRecord) {
              merged[diff.field] = conflict.serverRecord[diff.field];
            } else {
              delete merged[diff.field];
            }
          } else {
            if (diff.field in conflict.localRecord) {
              merged[diff.field] = conflict.localRecord[diff.field];
            } else {
              delete merged[diff.field];
            }
          }
        }
        selections.push({
          conflictId: conflict.id,
          choice: 'custom',
          mergedRecord: merged,
        });
      } else {
        selections.push({
          conflictId: conflict.id,
          choice: draft.choice,
        });
      }
    }

    if (selections.length === 0) return;
    await resolveSyncConflicts(selections);
  };

  if (!isSuperAdmin || !isConflictModalOpen || pendingSyncConflicts.length === 0 || !activeConflict) {
    return null;
  }

  const conflictTypeBadge =
    activeConflict.conflictType === 'both_modified'
      ? {
          label: 'Modified Locally & on Server',
          classes:
            'bg-rose-500/20 text-rose-300 border-rose-500/40',
        }
      : activeConflict.conflictType === 'server_updated'
      ? {
          label: 'Updated on Server',
          classes:
            'bg-sky-500/20 text-sky-300 border-sky-500/40',
        }
      : {
          label: 'Local vs Server Mismatch',
          classes:
            'bg-amber-500/20 text-amber-300 border-amber-500/40',
        };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sync-conflict-modal-title"
    >
      <div className="bg-slate-900 text-slate-100 w-full max-w-6xl max-h-[92vh] rounded-3xl border border-amber-500/40 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 shrink-0">
              <GitMerge className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2
                  id="sync-conflict-modal-title"
                  className="text-base sm:text-lg font-extrabold text-white font-serif"
                >
                  Data Conflict Resolution
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-400/40">
                  {pendingSyncConflicts.length} Conflict{pendingSyncConflicts.length > 1 ? 's' : ''} Found
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Local changes conflict with server-side Supabase data. Choose which version to keep before finalizing the sync.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              disabled={isResolvingConflicts}
              onClick={() => handleBulkSelect('local')}
              className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Keep All Local</span>
            </button>
            <button
              type="button"
              disabled={isResolvingConflicts}
              onClick={() => handleBulkSelect('server')}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-200 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>Use All Server</span>
            </button>
            <button
              type="button"
              disabled={isResolvingConflicts}
              onClick={dismissSyncConflicts}
              aria-label="Close conflict resolution dialog"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
          {/* Left Queue List */}
          <aside className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950/60 p-3 overflow-y-auto max-h-44 lg:max-h-none shrink-0 space-y-2">
            <div className="flex items-center justify-between px-1 pb-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Conflicted Records</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                {resolvedDraftCount}/{pendingSyncConflicts.length} selected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              {pendingSyncConflicts.map((conflict) => {
                const isSelected = conflict.id === activeConflict.id;
                const draftChoice = drafts[conflict.id]?.choice;

                return (
                  <button
                    key={conflict.id}
                    type="button"
                    onClick={() => setActiveConflictId(conflict.id)}
                    className={`w-full text-left p-2.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800/95 border-amber-400/70 shadow-lg'
                        : 'bg-slate-900/80 hover:bg-slate-800/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1.5 mb-1">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700 text-[9px] font-extrabold uppercase truncate">
                        {conflict.tableLabel}
                      </span>
                      {draftChoice ? (
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase border shrink-0 ${
                            draftChoice === 'local'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : draftChoice === 'server'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                          }`}
                        >
                          {draftChoice === 'local'
                            ? 'Local'
                            : draftChoice === 'server'
                            ? 'Server'
                            : 'Merged'}
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 shrink-0">
                          Pending
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-white truncate">
                      {conflict.recordTitle}
                    </p>
                    <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                      <span className="font-mono truncate max-w-[120px]">{conflict.recordId}</span>
                      <span>
                        {conflict.differingFields.length} diff{conflict.differingFields.length === 1 ? '' : 's'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Right Comparison Workspace */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* Active Record Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                    {activeConflict.tableLabel}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-[11px] font-mono text-slate-400">
                    ID: {activeConflict.recordId}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-white mt-0.5">
                  {activeConflict.recordTitle}
                </h3>
              </div>

              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border flex items-center gap-1.5 ${conflictTypeBadge.classes}`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{conflictTypeBadge.label}</span>
              </span>
            </div>

            {/* Side-by-Side Primary Choice Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Local Version Card */}
              <div
                className={`rounded-2xl p-4 border-2 transition-all flex flex-col justify-between gap-3 ${
                  activeDraft.choice === 'local'
                    ? 'bg-amber-950/40 border-amber-400 shadow-lg shadow-amber-950/30'
                    : 'bg-slate-800/40 border-slate-700/80 hover:border-amber-500/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
                      <Laptop className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-white">
                        Local Version (This Device)
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {activeConflict.localUpdatedAt
                          ? `Timestamp: ${activeConflict.localUpdatedAt}`
                          : 'Current browser / local state'}
                      </p>
                    </div>
                  </div>
                  {activeDraft.choice === 'local' && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase flex items-center gap-1">
                      <Check className="w-3 h-3 stroke-[3]" />
                      Selected
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => selectWholeVersion(activeConflict, 'local')}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeDraft.choice === 'local'
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {activeDraft.choice === 'local'
                      ? 'Keeping Local Version'
                      : 'Choose Local Version'}
                  </span>
                </button>
              </div>

              {/* Server Version Card */}
              <div
                className={`rounded-2xl p-4 border-2 transition-all flex flex-col justify-between gap-3 ${
                  activeDraft.choice === 'server'
                    ? 'bg-emerald-950/40 border-emerald-400 shadow-lg shadow-emerald-950/30'
                    : 'bg-slate-800/40 border-slate-700/80 hover:border-emerald-500/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-white">
                        Server Version (Supabase Cloud)
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {activeConflict.serverUpdatedAt
                          ? `Timestamp: ${activeConflict.serverUpdatedAt}`
                          : 'Stored in remote PostgreSQL'}
                      </p>
                    </div>
                  </div>
                  {activeDraft.choice === 'server' && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black uppercase flex items-center gap-1">
                      <Check className="w-3 h-3 stroke-[3]" />
                      Selected
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => selectWholeVersion(activeConflict, 'server')}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeDraft.choice === 'server'
                      ? 'bg-emerald-400 text-slate-950 shadow-md'
                      : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-400/40'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {activeDraft.choice === 'server'
                      ? 'Using Server Version'
                      : 'Choose Server Version'}
                  </span>
                </button>
              </div>
            </div>

            {/* Field-Level Comparison Table */}
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">
                    Field Comparison ({activeConflict.differingFields.length} difference{activeConflict.differingFields.length === 1 ? '' : 's'})
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Click individual Local or Server cells below to mix fields into a custom merge.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAllFields((v) => !v)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {showAllFields
                      ? `Show Differing Only (${activeConflict.differingFields.length})`
                      : 'Show All Record Fields'}
                  </span>
                </button>
              </div>

              <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950/60">
                <div className="grid grid-cols-12 bg-slate-900 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <div className="col-span-12 sm:col-span-3">Field</div>
                  <div className="hidden sm:block sm:col-span-4 text-amber-300">
                    Local Value
                  </div>
                  <div className="hidden sm:block sm:col-span-5 text-emerald-300">
                    Server Value
                  </div>
                </div>

                <div className="divide-y divide-slate-800/80 max-h-72 overflow-y-auto">
                  {allFieldKeys.map((fieldKey) => {
                    const isDiff = differingFieldSet.has(fieldKey);
                    const localVal = activeConflict.localRecord?.[fieldKey];
                    const serverVal = activeConflict.serverRecord?.[fieldKey];

                    const pickedSide: 'local' | 'server' | null = isDiff
                      ? activeDraft.fieldOverrides[fieldKey] ||
                        (activeDraft.choice === 'server'
                          ? 'server'
                          : activeDraft.choice === 'local'
                          ? 'local'
                          : null)
                      : null;

                    return (
                      <div
                        key={fieldKey}
                        className={`grid grid-cols-12 gap-2 px-3 py-2.5 text-xs items-start ${
                          isDiff ? 'bg-slate-900/40' : 'opacity-70'
                        }`}
                      >
                        <div className="col-span-12 sm:col-span-3 flex items-center gap-1.5">
                          <span
                            className={`font-bold ${
                              isDiff ? 'text-white' : 'text-slate-400'
                            }`}
                          >
                            {formatFieldLabel(fieldKey)}
                          </span>
                          {isDiff && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                          )}
                        </div>

                        {/* Local Cell */}
                        <div className="col-span-12 sm:col-span-4">
                          {isDiff ? (
                            <button
                              type="button"
                              onClick={() =>
                                selectFieldSide(activeConflict, fieldKey, 'local')
                              }
                              className={`w-full text-left p-2 rounded-xl border text-[11px] font-mono break-words transition-all cursor-pointer flex items-start justify-between gap-2 ${
                                pickedSide === 'local'
                                  ? 'bg-amber-500/20 border-amber-400 text-amber-100 shadow-sm'
                                  : 'bg-slate-900/80 hover:bg-slate-800 border-slate-700/70 text-slate-200'
                              }`}
                            >
                              <span className="whitespace-pre-wrap break-words">
                                {formatFieldValue(localVal)}
                              </span>
                              {pickedSide === 'local' && (
                                <Check className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
                              )}
                            </button>
                          ) : (
                            <div className="p-2 rounded-xl bg-slate-900/40 text-[11px] font-mono text-slate-400 whitespace-pre-wrap break-words">
                              {formatFieldValue(localVal)}
                            </div>
                          )}
                        </div>

                        {/* Server Cell */}
                        <div className="col-span-12 sm:col-span-5">
                          {isDiff ? (
                            <button
                              type="button"
                              onClick={() =>
                                selectFieldSide(activeConflict, fieldKey, 'server')
                              }
                              className={`w-full text-left p-2 rounded-xl border text-[11px] font-mono break-words transition-all cursor-pointer flex items-start justify-between gap-2 ${
                                pickedSide === 'server'
                                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-100 shadow-sm'
                                  : 'bg-slate-900/80 hover:bg-slate-800 border-slate-700/70 text-slate-200'
                              }`}
                            >
                              <span className="whitespace-pre-wrap break-words">
                                {formatFieldValue(serverVal)}
                              </span>
                              {pickedSide === 'server' && (
                                <Check className="w-3.5 h-3.5 text-emerald-300 shrink-0 mt-0.5" />
                              )}
                            </button>
                          ) : (
                            <div className="p-2 rounded-xl bg-slate-900/40 text-[11px] font-mono text-slate-400 whitespace-pre-wrap break-words">
                              {formatFieldValue(serverVal)}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-950/90 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                resolvedDraftCount === pendingSyncConflicts.length
                  ? 'bg-emerald-400'
                  : 'bg-amber-400 animate-pulse'
              }`}
            />
            <span>
              <strong>{resolvedDraftCount}</strong> of{' '}
              <strong>{pendingSyncConflicts.length}</strong> conflict
              {pendingSyncConflicts.length === 1 ? '' : 's'} resolved
            </span>
            {activeDraft.choice === 'custom' && (
              <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[10px] font-extrabold">
                Custom Field Merge Active
              </span>
            )}
          </div>

          <div className="flex items-center justify-end gap-2.5">
            <button
              type="button"
              disabled={isResolvingConflicts}
              onClick={dismissSyncConflicts}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              Resolve Later
            </button>

            <button
              type="button"
              disabled={resolvedDraftCount === 0 || isResolvingConflicts}
              onClick={handleApplyResolutions}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 text-xs font-black shadow-lg flex items-center gap-2 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isResolvingConflicts ? 'animate-spin' : ''}`}
              />
              <span>
                {isResolvingConflicts
                  ? 'Applying & Syncing...'
                  : resolvedDraftCount === pendingSyncConflicts.length
                  ? `Apply All (${resolvedDraftCount}) & Finish Sync`
                  : `Apply Selected (${resolvedDraftCount})`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
