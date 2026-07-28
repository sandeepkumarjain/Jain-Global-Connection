import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve Supabase environment variables
const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

let supabaseClient: SupabaseClient | null = null;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.trim() !== '' && supabaseAnonKey.trim() !== '');
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

// Export direct client reference (lazy initialized if configured)
export const supabase = isSupabaseConfigured() ? createClient(supabaseUrl, supabaseAnonKey) : null;
export default supabase;

// Generic database sync helper for Supabase tables
export async function syncToSupabaseTable<T extends { id?: string }>(
  tableName: string,
  data: T | T[]
): Promise<{ success: boolean; count: number; error?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, count: 0, error: 'Supabase URL and Anon Key are not configured in environment.' };
  }

  try {
    const rows = Array.isArray(data) ? data : [data];
    if (rows.length === 0) return { success: true, count: 0 };

    const { error } = await client.from(tableName).upsert(rows as any, { onConflict: 'id' });
    if (error) {
      console.error(`Supabase sync error on table [${tableName}]:`, error);
      return { success: false, count: 0, error: error.message };
    }

    return { success: true, count: rows.length };
  } catch (err: any) {
    console.error(`Supabase exception on table [${tableName}]:`, err);
    return { success: false, count: 0, error: err.message || 'Unknown Supabase error' };
  }
}

// Generic delete helper for Supabase tables
export async function deleteFromSupabaseTable(tableName: string, id: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from(tableName).delete().eq('id', id);
    if (error) {
      console.error(`Supabase delete error on table [${tableName}]:`, error);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`Supabase delete exception on table [${tableName}]:`, err);
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
      console.error(`Supabase fetch error on table [${tableName}]:`, error);
      return null;
    }
    return data as T[];
  } catch (err) {
    console.error(`Supabase fetch exception on table [${tableName}]:`, err);
    return null;
  }
}
