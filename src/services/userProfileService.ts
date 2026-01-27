import type { UserProfile, UserProfileUpdate } from '@/types/userProfile';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getItem, setItem, StorageKeys } from './storage';

function dbRowToProfile(row: any): UserProfile {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    company: row.company,
    phone: row.phone,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const userProfileService = {
  async getProfile(userId: string): Promise<UserProfile | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          if (error.code === 'PGRST116') return null;
          throw error;
        }
        return data ? dbRowToProfile(data) : null;
      } catch (err) {
        console.warn('Supabase profile query failed, falling back to localStorage:', err);
      }
    }

    const profile = getItem<UserProfile>(StorageKeys.USER_PROFILE);
    return profile?.id === userId ? profile : null;
  },

  async updateProfile(userId: string, data: UserProfileUpdate): Promise<UserProfile | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const updateData: any = {};
        if (data.fullName !== undefined) updateData.full_name = data.fullName;
        if (data.company !== undefined) updateData.company = data.company || null;
        if (data.phone !== undefined) updateData.phone = data.phone || null;

        const { data: updated, error } = await supabase
          .from('user_profiles')
          .update(updateData)
          .eq('id', userId)
          .select()
          .single();

        if (error) throw error;
        return updated ? dbRowToProfile(updated) : null;
      } catch (err) {
        console.warn('Supabase profile update failed, falling back to localStorage:', err);
      }
    }

    const profile = getItem<UserProfile>(StorageKeys.USER_PROFILE);
    if (!profile || profile.id !== userId) return null;

    const updated: UserProfile = {
      ...profile,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    setItem(StorageKeys.USER_PROFILE, updated);
    return updated;
  },

  async getAllProfiles(): Promise<UserProfile[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []).map(dbRowToProfile);
      } catch (err) {
        console.warn('Supabase profiles query failed, falling back to localStorage:', err);
      }
    }

    const profile = getItem<UserProfile>(StorageKeys.USER_PROFILE);
    return profile ? [profile] : [];
  },
};
