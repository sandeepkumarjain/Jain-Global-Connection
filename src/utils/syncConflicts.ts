import { SyncConflict, SyncConflictFieldDiff } from '../types';

export const SERVER_BASELINE_STORAGE_KEY = 'jcg_server_baseline_v1';

export const TABLE_DISPLAY_LABELS: Record<string, string> = {
  users: 'Registered Users',
  sanghas: 'Sanghas & Mandals',
  matrimonials: 'Matrimonial Profiles',
  businesses: 'Business Directory',
  temples: 'Temple Directory',
  members: 'Community Directory',
  posts: 'Community Feed',
  news: 'News & Announcements',
  ads: 'Promotions & Ads',
  panchang: 'Daily Panchang',
  blood_donors: 'Blood Donors',
  jobs: 'Career & Jobs',
  bhajans: 'Bhajan Library',
  pages: 'Custom Pages',
  success_stories: 'Vivah Success Stories',
  notifications: 'Notifications',
  settings: 'Platform Settings',
};

const IGNORED_DIFF_FIELDS = new Set<string>([
  'extraData',
  'updatedAt',
  'qrCodeUrl',
  'password',
]);

const DATE_LIKE_FIELD_RE =
  /createdAt|updatedAt|publishedDate|startDate|expiryDate|registeredDate|postedDate|birthDate/i;

export function unwrapExtraData(record: Record<string, any> | null | undefined): Record<string, any> {
  if (!record || typeof record !== 'object') return {};
  if (record.extraData && typeof record.extraData === 'object' && !Array.isArray(record.extraData)) {
    const { extraData, ...rest } = record;
    return { ...rest, ...extraData };
  }
  return { ...record };
}

function isEmptyVal(val: unknown): boolean {
  return val === undefined || val === null || val === '';
}

function stableSortValue(val: unknown): unknown {
  if (Array.isArray(val)) {
    return val.map(stableSortValue);
  }
  if (val && typeof val === 'object') {
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(val as Record<string, unknown>).sort()) {
      const inner = (val as Record<string, unknown>)[key];
      if (inner !== undefined && typeof inner !== 'function') {
        sorted[key] = stableSortValue(inner);
      }
    }
    return sorted;
  }
  return val;
}

export function isEffectivelyEqual(a: unknown, b: unknown, fieldName?: string): boolean {
  if (isEmptyVal(a) && isEmptyVal(b)) return true;
  if (a === b) return true;

  // Handle date strings normalized by Postgres vs local ISO/relative strings
  if (fieldName && DATE_LIKE_FIELD_RE.test(fieldName) && typeof a === 'string' && typeof b === 'string') {
    const parsedA = Date.parse(a);
    const parsedB = Date.parse(b);
    if (!isNaN(parsedA) && !isNaN(parsedB)) {
      return Math.abs(parsedA - parsedB) < 2000;
    }
    // If one side was a relative label ("Just now", "2 hours ago") converted to ISO on sync, do not treat createdAt as a conflict alone
    if (fieldName === 'createdAt' && (isNaN(parsedA) || isNaN(parsedB))) {
      return true;
    }
  }

  if (typeof a !== typeof b) {
    return false;
  }

  if (typeof a === 'object' && a !== null && b !== null) {
    try {
      return JSON.stringify(stableSortValue(a)) === JSON.stringify(stableSortValue(b));
    } catch {
      return false;
    }
  }

  return false;
}

export function formatFieldLabel(field: string): string {
  const spaced = field
    .replace(/_/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function formatFieldValue(val: unknown): string {
  if (val === undefined || val === null || val === '') return '— (Empty)';
  if (typeof val === 'boolean') return val ? 'Yes (true)' : 'No (false)';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) {
    if (val.length === 0) return '[] (None)';
    return val
      .map((item) => (typeof item === 'object' && item !== null ? JSON.stringify(item) : String(item)))
      .join(', ');
  }
  try {
    return JSON.stringify(val, null, 2);
  } catch {
    return String(val);
  }
}

export function extractRecordTitle(tableName: string, record: Record<string, any>): string {
  const r = unwrapExtraData(record);
  return (
    r.fullName ||
    r.businessName ||
    r.templeName ||
    r.name ||
    r.title ||
    r.appName ||
    (r.brideName && r.groomName ? `${r.brideName} & ${r.groomName}` : '') ||
    (tableName === 'panchang' ? `Panchang (${r.date || 'Today'})` : '') ||
    (tableName === 'settings' ? 'Global Platform Settings' : '') ||
    r.email ||
    r.id ||
    'Untitled Record'
  );
}

export function computeDifferingFields(
  localRec: Record<string, any>,
  serverRec: Record<string, any>
): SyncConflictFieldDiff[] {
  const cleanLocal = unwrapExtraData(localRec);
  const cleanServer = unwrapExtraData(serverRec);

  const allKeys = new Set<string>([...Object.keys(cleanLocal), ...Object.keys(cleanServer)]);
  const diffs: SyncConflictFieldDiff[] = [];

  for (const key of Array.from(allKeys).sort()) {
    if (IGNORED_DIFF_FIELDS.has(key)) continue;

    const localVal = cleanLocal[key];
    const serverVal = cleanServer[key];

    // If a field is only present locally as undefined or empty, and missing on server, skip
    if (isEmptyVal(localVal) && isEmptyVal(serverVal)) continue;

    // Skip client-only fields that were never on server if server has no opinion AND they're undefined/false defaults?
    // Wait: if server has a column value or extraData value that differs from local, report it.
    if (!isEffectivelyEqual(localVal, serverVal, key)) {
      diffs.push({
        field: key,
        label: formatFieldLabel(key),
        localValue: localVal,
        serverValue: serverVal,
      });
    }
  }

  return diffs;
}

export function detectTableConflicts(
  tableName: string,
  localData: any,
  serverRows: any[] | null,
  baselineByTable: Record<string, Record<string, any>>
): SyncConflict[] {
  if (!serverRows || serverRows.length === 0 || !localData) return [];

  const localList: Record<string, any>[] = Array.isArray(localData) ? localData : [localData];
  const serverMap = new Map<string, Record<string, any>>();

  for (const rawServer of serverRows) {
    if (rawServer && rawServer.id) {
      serverMap.set(String(rawServer.id), unwrapExtraData(rawServer));
    }
  }

  const tableBaselines = baselineByTable[tableName] || {};
  const conflicts: SyncConflict[] = [];
  const tableLabel = TABLE_DISPLAY_LABELS[tableName] || formatFieldLabel(tableName);

  for (const rawLocal of localList) {
    if (!rawLocal || !rawLocal.id) continue;
    const recordId = String(rawLocal.id);
    const serverRec = serverMap.get(recordId);
    if (!serverRec) continue;

    const localRec = unwrapExtraData(rawLocal);
    const differingFields = computeDifferingFields(localRec, serverRec);

    if (differingFields.length === 0) continue;

    const baselineRec = tableBaselines[recordId] ? unwrapExtraData(tableBaselines[recordId]) : null;

    if (baselineRec) {
      const serverChangedFromBaseline = computeDifferingFields(serverRec, baselineRec).length > 0;
      const localChangedFromBaseline = computeDifferingFields(localRec, baselineRec).length > 0;

      // If server did NOT change since last sync, only local has newer edits -> no conflict, safe to push local
      if (!serverChangedFromBaseline) {
        continue;
      }

      const conflictType: SyncConflict['conflictType'] = localChangedFromBaseline
        ? 'both_modified'
        : 'server_updated';

      conflicts.push({
        id: `${tableName}:${recordId}`,
        tableName,
        tableLabel,
        recordId,
        recordTitle: extractRecordTitle(tableName, localRec) || extractRecordTitle(tableName, serverRec),
        conflictType,
        localRecord: localRec,
        serverRecord: serverRec,
        baselineRecord: baselineRec,
        differingFields,
        detectedAt: new Date().toLocaleTimeString(),
        localUpdatedAt: localRec.updatedAt || localRec.createdAt,
        serverUpdatedAt: serverRec.updatedAt || serverRec.createdAt,
      });
    } else {
      // No baseline saved on this browser yet, and server already has differing data for this ID
      conflicts.push({
        id: `${tableName}:${recordId}`,
        tableName,
        tableLabel,
        recordId,
        recordTitle: extractRecordTitle(tableName, localRec) || extractRecordTitle(tableName, serverRec),
        conflictType: 'mismatch',
        localRecord: localRec,
        serverRecord: serverRec,
        baselineRecord: null,
        differingFields,
        detectedAt: new Date().toLocaleTimeString(),
        localUpdatedAt: localRec.updatedAt || localRec.createdAt,
        serverUpdatedAt: serverRec.updatedAt || serverRec.createdAt,
      });
    }
  }

  return conflicts;
}

export function loadServerBaselines(): Record<string, Record<string, any>> {
  try {
    const raw = localStorage.getItem(SERVER_BASELINE_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function saveServerBaselines(baselines: Record<string, Record<string, any>>): void {
  try {
    localStorage.setItem(SERVER_BASELINE_STORAGE_KEY, JSON.stringify(baselines));
  } catch (err) {
    console.warn('Could not persist server sync baselines:', err);
  }
}
