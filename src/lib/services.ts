import { User, BusinessListing } from '../types';
import { getSupabaseClient, supabase } from './supabase';

/**
 * Service Layer for Supabase Database Operations
 * Implements CRUD operations for User Profiles ('users' table) and Business Listings ('businesses' table).
 */

// Helper to get active Supabase client instance
const getClient = () => getSupabaseClient() || supabase;

// ==========================================
// USER PROFILES SERVICE ('users' table)
// ==========================================

export const UserService = {
  /**
   * Fetch all user profiles from Supabase
   */
  async getAllUsers(): Promise<{ data: User[] | null; error: string | null }> {
    const client = getClient();
    if (!client) {
      return { data: null, error: 'Supabase client is not configured.' };
    }

    try {
      const { data, error } = await client
        .from('users')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) {
        console.warn('UserService.getAllUsers notice:', error.message);
        return { data: null, error: error.message };
      }

      return { data: data as User[], error: null };
    } catch (err: any) {
      console.warn('UserService.getAllUsers exception:', err?.message || err);
      return { data: null, error: err?.message || 'Failed to fetch users' };
    }
  },

  /**
   * Fetch a single user profile by ID
   */
  async getUserById(id: string): Promise<{ data: User | null; error: string | null }> {
    const client = getClient();
    if (!client) {
      return { data: null, error: 'Supabase client is not configured.' };
    }

    try {
      const { data, error } = await client
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.warn(`UserService.getUserById error (${id}):`, error.message);
        return { data: null, error: error.message };
      }

      return { data: data as User, error: null };
    } catch (err: any) {
      console.warn(`UserService.getUserById exception (${id}):`, err?.message || err);
      return { data: null, error: err?.message || 'Failed to fetch user profile' };
    }
  },

  /**
   * Create a new user profile
   */
  async createUser(user: Partial<User> & { id: string; fullName: string; email: string }): Promise<{ data: User | null; error: string | null }> {
    const client = getClient();
    if (!client) {
      return { data: null, error: 'Supabase client is not configured.' };
    }

    try {
      const payload = {
        createdAt: new Date().toISOString(),
        role: 'Member',
        status: 'Active',
        isVerified: false,
        ...user,
      };

      const { data, error } = await client
        .from('users')
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.warn('UserService.createUser error:', error.message);
        return { data: null, error: error.message };
      }

      return { data: data as User, error: null };
    } catch (err: any) {
      console.warn('UserService.createUser exception:', err?.message || err);
      return { data: null, error: err?.message || 'Failed to create user profile' };
    }
  },

  /**
   * Update an existing user profile
   */
  async updateUser(id: string, updates: Partial<User>): Promise<{ data: User | null; error: string | null }> {
    const client = getClient();
    if (!client) {
      return { data: null, error: 'Supabase client is not configured.' };
    }

    try {
      const { data, error } = await client
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.warn(`UserService.updateUser error (${id}):`, error.message);
        return { data: null, error: error.message };
      }

      return { data: data as User, error: null };
    } catch (err: any) {
      console.warn(`UserService.updateUser exception (${id}):`, err?.message || err);
      return { data: null, error: err?.message || 'Failed to update user profile' };
    }
  },

  /**
   * Delete a user profile by ID
   */
  async deleteUser(id: string): Promise<{ success: boolean; error: string | null }> {
    const client = getClient();
    if (!client) {
      return { success: false, error: 'Supabase client is not configured.' };
    }

    try {
      const { error } = await client
        .from('users')
        .delete()
        .eq('id', id);

      if (error) {
        console.warn(`UserService.deleteUser error (${id}):`, error.message);
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (err: any) {
      console.warn(`UserService.deleteUser exception (${id}):`, err?.message || err);
      return { success: false, error: err?.message || 'Failed to delete user profile' };
    }
  },
};

// ==========================================
// BUSINESS LISTINGS SERVICE ('businesses' table)
// ==========================================

export const BusinessService = {
  /**
   * Fetch all business listings from Supabase
   */
  async getAllBusinesses(): Promise<{ data: BusinessListing[] | null; error: string | null }> {
    const client = getClient();
    if (!client) {
      return { data: null, error: 'Supabase client is not configured.' };
    }

    try {
      const { data, error } = await client
        .from('businesses')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) {
        console.warn('BusinessService.getAllBusinesses error:', error.message);
        return { data: null, error: error.message };
      }

      return { data: data as BusinessListing[], error: null };
    } catch (err: any) {
      console.warn('BusinessService.getAllBusinesses exception:', err?.message || err);
      return { data: null, error: err?.message || 'Failed to fetch business listings' };
    }
  },

  /**
   * Fetch a single business listing by ID
   */
  async getBusinessById(id: string): Promise<{ data: BusinessListing | null; error: string | null }> {
    const client = getClient();
    if (!client) {
      return { data: null, error: 'Supabase client is not configured.' };
    }

    try {
      const { data, error } = await client
        .from('businesses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.warn(`BusinessService.getBusinessById error (${id}):`, error.message);
        return { data: null, error: error.message };
      }

      return { data: data as BusinessListing, error: null };
    } catch (err: any) {
      console.warn(`BusinessService.getBusinessById exception (${id}):`, err?.message || err);
      return { data: null, error: err?.message || 'Failed to fetch business listing' };
    }
  },

  /**
   * Fetch all business listings for a specific owner ID
   */
  async getBusinessesByOwner(ownerId: string): Promise<{ data: BusinessListing[] | null; error: string | null }> {
    const client = getClient();
    if (!client) {
      return { data: null, error: 'Supabase client is not configured.' };
    }

    try {
      const { data, error } = await client
        .from('businesses')
        .select('*')
        .eq('ownerId', ownerId);

      if (error) {
        console.warn(`BusinessService.getBusinessesByOwner error (${ownerId}):`, error.message);
        return { data: null, error: error.message };
      }

      return { data: data as BusinessListing[], error: null };
    } catch (err: any) {
      console.warn(`BusinessService.getBusinessesByOwner exception (${ownerId}):`, err?.message || err);
      return { data: null, error: err?.message || 'Failed to fetch owner businesses' };
    }
  },

  /**
   * Create a new business listing
   */
  async createBusiness(business: Partial<BusinessListing> & { id: string; businessName: string; category: string }): Promise<{ data: BusinessListing | null; error: string | null }> {
    const client = getClient();
    if (!client) {
      return { data: null, error: 'Supabase client is not configured.' };
    }

    try {
      const payload = {
        createdAt: new Date().toISOString(),
        status: 'Approved',
        isVerified: false,
        isSponsored: false,
        rating: 5.0,
        reviewCount: 1,
        galleryUrls: [],
        productsAndServices: [],
        ...business,
      };

      const { data, error } = await client
        .from('businesses')
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.warn('BusinessService.createBusiness error:', error.message);
        return { data: null, error: error.message };
      }

      return { data: data as BusinessListing, error: null };
    } catch (err: any) {
      console.warn('BusinessService.createBusiness exception:', err?.message || err);
      return { data: null, error: err?.message || 'Failed to create business listing' };
    }
  },

  /**
   * Update an existing business listing
   */
  async updateBusiness(id: string, updates: Partial<BusinessListing>): Promise<{ data: BusinessListing | null; error: string | null }> {
    const client = getClient();
    if (!client) {
      return { data: null, error: 'Supabase client is not configured.' };
    }

    try {
      const { data, error } = await client
        .from('businesses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.warn(`BusinessService.updateBusiness error (${id}):`, error.message);
        return { data: null, error: error.message };
      }

      return { data: data as BusinessListing, error: null };
    } catch (err: any) {
      console.warn(`BusinessService.updateBusiness exception (${id}):`, err?.message || err);
      return { data: null, error: err?.message || 'Failed to update business listing' };
    }
  },

  /**
   * Delete a business listing by ID
   */
  async deleteBusiness(id: string): Promise<{ success: boolean; error: string | null }> {
    const client = getClient();
    if (!client) {
      return { success: false, error: 'Supabase client is not configured.' };
    }

    try {
      const { error } = await client
        .from('businesses')
        .delete()
        .eq('id', id);

      if (error) {
        console.warn(`BusinessService.deleteBusiness error (${id}):`, error.message);
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (err: any) {
      console.warn(`BusinessService.deleteBusiness exception (${id}):`, err?.message || err);
      return { success: false, error: err?.message || 'Failed to delete business listing' };
    }
  },
};

// ==========================================
// JOB OPENINGS SERVICE ('jobs' table)
// ==========================================

export const JobService = {
  /**
   * Post a new job opening to Supabase
   */
  async createJob(job: any): Promise<{ data: any; error: string | null }> {
    const client = getClient();
    if (!client) {
      return { data: null, error: 'Supabase client is not configured.' };
    }

    try {
      const { data, error } = await client
        .from('jobs')
        .insert([job])
        .select()
        .single();

      if (error) {
        console.warn('JobService.createJob error:', error.message);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err: any) {
      console.warn('JobService.createJob exception:', err?.message || err);
      return { data: null, error: err?.message || 'Failed to post job opening' };
    }
  },

  /**
   * Fetch all job openings from Supabase
   */
  async getAllJobs(): Promise<{ data: any[] | null; error: string | null }> {
    const client = getClient();
    if (!client) {
      return { data: null, error: 'Supabase client is not configured.' };
    }

    try {
      const { data, error } = await client
        .from('jobs')
        .select('*')
        .order('postedDate', { ascending: false });

      if (error) {
        console.warn('JobService.getAllJobs error:', error.message);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err: any) {
      console.warn('JobService.getAllJobs exception:', err?.message || err);
      return { data: null, error: err?.message || 'Failed to fetch job openings' };
    }
  },
};

// ==========================================
// SUPABASE AUTHENTICATION SERVICE
// ==========================================

export const AuthService = {
  /**
   * Sign up user using email & password with optional profile metadata
   */
  async signUp(email: string, pass: string, profileData?: { fullName?: string; mobile?: string; city?: string }) {
    const client = getClient();
    if (!client) {
      return { user: null, session: null, error: 'Supabase client is not configured.' };
    }

    try {
      const { data, error } = await client.auth.signUp({
        email,
        password: pass,
        options: {
          data: profileData || {},
        },
      });

      if (error) {
        console.warn('AuthService.signUp notice:', error.message);
        return { user: null, session: null, error: error.message };
      }

      return { user: data.user, session: data.session, error: null };
    } catch (err: any) {
      console.warn('AuthService.signUp exception:', err?.message || err);
      return { user: null, session: null, error: err?.message || 'Failed to sign up with Supabase Auth' };
    }
  },

  /**
   * Sign in user using email & password
   */
  async signIn(email: string, pass: string) {
    const client = getClient();
    if (!client) {
      return { user: null, session: null, error: 'Supabase client is not configured.' };
    }

    try {
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) {
        console.warn('AuthService.signIn notice:', error.message);
        return { user: null, session: null, error: error.message };
      }

      return { user: data.user, session: data.session, error: null };
    } catch (err: any) {
      console.warn('AuthService.signIn exception:', err?.message || err);
      return { user: null, session: null, error: err?.message || 'Failed to log in with Supabase Auth' };
    }
  },

  /**
   * Sign out current user session
   */
  async signOut() {
    const client = getClient();
    if (!client) return { error: null };

    try {
      const { error } = await client.auth.signOut();
      if (error) console.error('AuthService.signOut error:', error);
      return { error: error ? error.message : null };
    } catch (err: any) {
      console.error('AuthService.signOut exception:', err);
      return { error: err.message || 'Failed to sign out' };
    }
  },

  /**
   * Get current authenticated user session
   */
  async getSession() {
    const client = getClient();
    if (!client) return { session: null, error: 'Supabase client not configured' };

    try {
      const { data, error } = await client.auth.getSession();
      return { session: data.session, error: error ? error.message : null };
    } catch (err: any) {
      return { session: null, error: err.message };
    }
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    const client = getClient();
    if (!client) return { unsubscribe: () => {} };

    const { data: { subscription } } = client.auth.onAuthStateChange(callback);
    return subscription;
  }
};

