import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve Supabase environment variables
const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

let supabaseClient: SupabaseClient | null = null;

export const isSupabaseConfigured = (): boolean => {
  const url = (supabaseUrl || '').trim();
  const key = (supabaseAnonKey || '').trim();
  return Boolean(
    url.length > 10 &&
    key.length > 20 &&
    url.startsWith('https://') &&
    !url.includes('MY_SUPABASE_URL') &&
    !url.includes('YOUR_SUPABASE')
  );
};

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!supabaseClient && isSupabaseConfigured()) {
    try {
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: true },
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      supabaseClient = null;
    }
  }
  return supabaseClient;
};

// Export singleton client reference (reusing getSupabaseClient to avoid multiple GoTrueClient instances)
export const supabase = getSupabaseClient();
export default supabase;

// Schema whitelist map for all 14 tables to avoid PostgREST column mismatch errors
const TABLE_COLUMNS: Record<string, string[]> = {
  users: [
    'id', 'applicationId', 'fullName', 'surname', 'email', 'mobile', 'whatsapp', 'role', 'status',
    'registrationType', 'gender', 'dob', 'age', 'maritalStatus', 'sect', 'subSect', 'gotra',
    'qualification', 'occupation', 'company', 'address', 'country', 'state', 'city', 'pincode',
    'profilePicture', 'profilePhoto', 'idProofUrl', 'isVerified', 'membershipTier', 'createdAt',
    'bloodGroup', 'qrCodeUrl', 'themePreference', 'extraData'
  ],
  matrimonials: [
    'id', 'userId', 'fullName', 'gender', 'age', 'birthDate', 'height', 'education', 'occupation',
    'income', 'city', 'state', 'gotra', 'sect', 'diet', 'bio', 'photos', 'contactNumber',
    'interestsReceived', 'interestsAccepted', 'isApproved', 'createdAt', 'extraData'
  ],
  businesses: [
    'id', 'ownerUserId', 'ownerId', 'businessName', 'category', 'description', 'city', 'state',
    'address', 'mobile', 'email', 'website', 'logoUrl', 'isVerified', 'status', 'createdAt',
    'productsAndServices', 'galleryUrls', 'isSponsored', 'rating', 'reviewCount', 'extraData'
  ],
  temples: [
    'id', 'templeName', 'sect', 'city', 'state', 'address', 'pincode', 'trustContact',
    'imageUrls', 'description', 'timings', 'isVerified', 'createdAt', 'dharamshalaAvailable',
    'bhojanalayaAvailable', 'googleMapUrl', 'extraData'
  ],
  members: [
    'id', 'name', 'city', 'state', 'mobile', 'email', 'gotra', 'sect', 'profession',
    'bloodGroup', 'createdAt', 'extraData'
  ],
  posts: [
    'id', 'authorId', 'authorName', 'authorAvatar', 'authorRole', 'content', 'imageUrl',
    'category', 'createdAt', 'likesCount', 'likedByUsers', 'comments', 'extraData'
  ],
  news: [
    'id', 'title', 'summary', 'content', 'category', 'imageUrl', 'publishedDate', 'author',
    'isPinned', 'extraData'
  ],
  ads: [
    'id', 'businessId', 'ownerUserId', 'title', 'imageUrl', 'sponsorName', 'offerDiscount',
    'contactMobile', 'startDate', 'expiryDate', 'isActive', 'clicksCount', 'extraData'
  ],
  panchang: [
    'id', 'date', 'tithi', 'sunrise', 'sunset', 'choghadiyaDay', 'choghadiyaNight',
    'kalyanak', 'quote', 'pravachan', 'updatedAt', 'extraData'
  ],
  blood_donors: [
    'id', 'userId', 'name', 'bloodGroup', 'city', 'state', 'mobile', 'available',
    'registeredDate', 'extraData'
  ],
  jobs: [
    'id', 'title', 'company', 'location', 'type', 'description', 'salary', 'contactEmail',
    'postedDate', 'extraData'
  ],
  bhajans: [
    'id', 'title', 'hindiTitle', 'category', 'audioUrl', 'singer', 'lyrics',
    'durationSeconds', 'isActive', 'extraData'
  ],
  pages: [
    'id', 'title', 'slug', 'category', 'bannerImage', 'content', 'isPublished',
    'createdAt', 'updatedAt', 'extraData'
  ],
  settings: [
    'id', 'appName', 'tagline', 'contactPhone', 'contactEmail', 'address', 'primaryColor',
    'secondaryColor', 'enableMatrimonialApproval', 'enableBusinessApproval', 'updatedAt', 'extraData'
  ],
};

// Runtime cache of columns known to be missing from remote PostgREST schema
const missingColumnsMap: Record<string, Set<string>> = {};

/**
 * Register a missing column for a table in memory
 */
function recordMissingColumn(tableName: string, columnName: string) {
  if (!missingColumnsMap[tableName]) {
    missingColumnsMap[tableName] = new Set();
  }
  missingColumnsMap[tableName].add(columnName);
}

/**
 * Ensures timestamp and date fields contain valid ISO strings expected by PostgreSQL.
 * Handles relative time strings like "3 hours ago", "Just now", "2 days ago".
 */
function sanitizeValueForPostgres(key: string, val: any): any {
  if (val === null || val === undefined) return val;

  const isDateField = /createdAt|updatedAt|publishedDate|startDate|expiryDate|registeredDate|postedDate|birthDate/i.test(key);

  if (isDateField && typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return null;
    const parsed = Date.parse(trimmed);
    if (isNaN(parsed)) {
      // Relative date string or non-standard format (e.g. "3 hours ago")
      return new Date().toISOString();
    }
    return new Date(parsed).toISOString();
  }

  return val;
}

/**
 * Sanitize row object for Supabase PostgREST table insertion
 */
function sanitizeRowForTable(tableName: string, row: Record<string, any>): Record<string, any> {
  if (!row || typeof row !== 'object') return {};

  const allowedCols = TABLE_COLUMNS[tableName];
  const missingCols = missingColumnsMap[tableName] || new Set();
  const cleanRow: Record<string, any> = {};
  const extraData: Record<string, any> = { ...(row.extraData || {}) };

  Object.entries(row).forEach(([key, val]) => {
    if (val === undefined || typeof val === 'function') return;

    // Skip column if known to be missing in remote schema cache
    if (missingCols.has(key)) return;

    const cleanVal = sanitizeValueForPostgres(key, val);

    // Check if key is allowed in table columns
    if (!allowedCols || allowedCols.includes(key)) {
      cleanRow[key] = cleanVal;
    } else {
      extraData[key] = cleanVal;
    }
  });

  // Store extra unmapped properties into JSONB column if supported and present
  if (
    Object.keys(extraData).length > 0 &&
    (!allowedCols || allowedCols.includes('extraData')) &&
    !missingCols.has('extraData')
  ) {
    cleanRow.extraData = extraData;
  }

  return cleanRow;
}

// Generic database sync helper for Supabase tables
export async function syncToSupabaseTable<T extends { id?: string }>(
  tableName: string,
  data: T | T[]
): Promise<{ success: boolean; count: number; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, count: 0, error: 'Supabase URL and Anon Key are not configured in environment.' };
  }

  const client = getSupabaseClient();
  if (!client) {
    return { success: false, count: 0, error: 'Supabase client unavailable.' };
  }

  try {
    const rawRows = Array.isArray(data) ? data : [data];
    if (rawRows.length === 0) return { success: true, count: 0 };

    // Sanitize rows for Supabase SQL insert/upsert using cached schema rules
    let rows = rawRows.map((r) => sanitizeRowForTable(tableName, r as Record<string, any>));

    // Batch Upsert with silent auto-healing for missing schema columns in remote database
    let attempts = 0;
    const maxAttempts = 5;
    let lastError = '';

    while (attempts < maxAttempts) {
      attempts++;
      const { error } = await client.from(tableName).upsert(rows as any, { onConflict: 'id' });

      if (!error) {
        return { success: true, count: rows.length };
      }

      lastError = error.message;

      // Auto-heal if the remote Supabase schema is missing a column (e.g. 'extraData' or 'address')
      const missingColMatch = error.message.match(/Could not find the '([^']+)' column/i);
      if (missingColMatch && missingColMatch[1]) {
        const missingCol = missingColMatch[1];
        recordMissingColumn(tableName, missingCol);

        // Re-sanitize rows with the newly cached missing column rule
        rows = rawRows.map((r) => sanitizeRowForTable(tableName, r as Record<string, any>));
        continue;
      }

      break;
    }

    // Row-by-row fallback if batch has item-level error
    let successCount = 0;

    for (const rawSingleRow of rawRows) {
      let singleErr: any = null;
      let singleAttempts = 0;

      while (singleAttempts < 4) {
        singleAttempts++;
        const sanitizedSingle = sanitizeRowForTable(tableName, rawSingleRow as Record<string, any>);
        const { error: err } = await client.from(tableName).upsert([sanitizedSingle] as any, { onConflict: 'id' });
        singleErr = err;

        if (!singleErr) {
          successCount++;
          break;
        }

        const missingColMatch = singleErr.message.match(/Could not find the '([^']+)' column/i);
        if (missingColMatch && missingColMatch[1]) {
          const missingCol = missingColMatch[1];
          recordMissingColumn(tableName, missingCol);
          continue;
        }

        break;
      }

      if (singleErr) {
        lastError = singleErr.message;
      }
    }

    if (successCount > 0) {
      return {
        success: true,
        count: successCount,
        error: successCount < rawRows.length ? lastError : undefined
      };
    }

    return { success: false, count: 0, error: lastError };
  } catch (err: any) {
    return { success: false, count: 0, error: err?.message || 'Unknown Supabase sync notice' };
  }
}

// Generic delete helper for Supabase tables
export async function deleteFromSupabaseTable(tableName: string, id: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from(tableName).delete().eq('id', id);
    if (error) {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
}

// Generic fetch helper for Supabase tables
export async function fetchFromSupabaseTable<T>(tableName: string): Promise<T[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client.from(tableName).select('*');
    if (error) {
      return null;
    }
    if (!data) return [];

    // Re-hydrate extraData into root object if present
    const rehydrated = data.map((item: any) => {
      if (item && item.extraData && typeof item.extraData === 'object') {
        const { extraData, ...rest } = item;
        return { ...rest, ...extraData };
      }
      return item;
    });

    return rehydrated as T[];
  } catch (err) {
    return null;
  }
}
