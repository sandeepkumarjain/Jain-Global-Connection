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
        console.error('UserService.getAllUsers error:', error);
        return { data: null, error: error.message };
      }

      return { data: data as User[], error: null };
    } catch (err: any) {
      console.error('UserService.getAllUsers exception:', err);
      return { data: null, error: err.message || 'Failed to fetch users' };
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
        console.error(`UserService.getUserById error (${id}):`, error);
        return { data: null, error: error.message };
      }

      return { data: data as User, error: null };
    } catch (err: any) {
      console.error(`UserService.getUserById exception (${id}):`, err);
      return { data: null, error: err.message || 'Failed to fetch user profile' };
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
        console.error('UserService.createUser error:', error);
        return { data: null, error: error.message };
      }

      return { data: data as User, error: null };
    } catch (err: any) {
      console.error('UserService.createUser exception:', err);
      return { data: null, error: err.message || 'Failed to create user profile' };
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
        console.error(`UserService.updateUser error (${id}):`, error);
        return { data: null, error: error.message };
      }

      return { data: data as User, error: null };
    } catch (err: any) {
      console.error(`UserService.updateUser exception (${id}):`, err);
      return { data: null, error: err.message || 'Failed to update user profile' };
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
        console.error(`UserService.deleteUser error (${id}):`, error);
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (err: any) {
      console.error(`UserService.deleteUser exception (${id}):`, err);
      return { success: false, error: err.message || 'Failed to delete user profile' };
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
        console.error('BusinessService.getAllBusinesses error:', error);
        return { data: null, error: error.message };
      }

      return { data: data as BusinessListing[], error: null };
    } catch (err: any) {
      console.error('BusinessService.getAllBusinesses exception:', err);
      return { data: null, error: err.message || 'Failed to fetch business listings' };
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
        console.error(`BusinessService.getBusinessById error (${id}):`, error);
        return { data: null, error: error.message };
      }

      return { data: data as BusinessListing, error: null };
    } catch (err: any) {
      console.error(`BusinessService.getBusinessById exception (${id}):`, err);
      return { data: null, error: err.message || 'Failed to fetch business listing' };
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
        console.error(`BusinessService.getBusinessesByOwner error (${ownerId}):`, error);
        return { data: null, error: error.message };
      }

      return { data: data as BusinessListing[], error: null };
    } catch (err: any) {
      console.error(`BusinessService.getBusinessesByOwner exception (${ownerId}):`, err);
      return { data: null, error: err.message || 'Failed to fetch owner businesses' };
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
        console.error('BusinessService.createBusiness error:', error);
        return { data: null, error: error.message };
      }

      return { data: data as BusinessListing, error: null };
    } catch (err: any) {
      console.error('BusinessService.createBusiness exception:', err);
      return { data: null, error: err.message || 'Failed to create business listing' };
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
        console.error(`BusinessService.updateBusiness error (${id}):`, error);
        return { data: null, error: error.message };
      }

      return { data: data as BusinessListing, error: null };
    } catch (err: any) {
      console.error(`BusinessService.updateBusiness exception (${id}):`, err);
      return { data: null, error: err.message || 'Failed to update business listing' };
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
        console.error(`BusinessService.deleteBusiness error (${id}):`, error);
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (err: any) {
      console.error(`BusinessService.deleteBusiness exception (${id}):`, err);
      return { success: false, error: err.message || 'Failed to delete business listing' };
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

