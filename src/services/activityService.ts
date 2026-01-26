import type { Activity, ActivityType } from '@/types/crm';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getItem, setItem, StorageKeys, generateId } from './storage';

// Helper to convert database row to Activity type
function dbRowToActivity(row: any): Activity {
  return {
    id: row.id,
    leadId: row.lead_id,
    type: row.type,
    title: row.title,
    description: row.description || undefined,
    createdAt: row.created_at,
  };
}

// localStorage fallback functions
function getLocalActivities(): Activity[] {
  return getItem<Activity[]>(StorageKeys.ACTIVITIES) || [];
}

function saveLocalActivities(activities: Activity[]): void {
  setItem(StorageKeys.ACTIVITIES, activities);
}

export const activityService = {
  async getByLeadId(leadId: string): Promise<Activity[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching activities:', error);
        throw error;
      }

      return (data || []).map(dbRowToActivity);
    }

    // Fallback to localStorage
    const activities = getLocalActivities();
    return activities
      .filter((activity) => activity.leadId === leadId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async create(data: {
    leadId: string;
    type: ActivityType;
    title: string;
    description?: string;
  }): Promise<Activity> {
    if (isSupabaseConfigured && supabase) {
      const { data: newActivity, error } = await supabase
        .from('activities')
        .insert({
          lead_id: data.leadId,
          type: data.type,
          title: data.title,
          description: data.description || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating activity:', error);
        throw error;
      }

      return dbRowToActivity(newActivity);
    }

    // Fallback to localStorage
    const activities = getLocalActivities();

    const newActivity: Activity = {
      id: generateId(),
      leadId: data.leadId,
      type: data.type,
      title: data.title,
      description: data.description,
      createdAt: new Date().toISOString(),
    };

    activities.push(newActivity);
    saveLocalActivities(activities);

    return newActivity;
  },

  async delete(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('activities').delete().eq('id', id);

      if (error) {
        console.error('Error deleting activity:', error);
        throw error;
      }

      return true;
    }

    // Fallback to localStorage
    const activities = getLocalActivities();
    const filtered = activities.filter((activity) => activity.id !== id);

    if (filtered.length === activities.length) return false;

    saveLocalActivities(filtered);
    return true;
  },

  async deleteByLeadId(leadId: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('activities').delete().eq('lead_id', leadId);

      if (error) {
        console.error('Error deleting activities:', error);
        throw error;
      }

      return;
    }

    // Fallback to localStorage
    const activities = getLocalActivities();
    const filtered = activities.filter((activity) => activity.leadId !== leadId);
    saveLocalActivities(filtered);
  },

  async getRecent(limit: number = 10): Promise<Activity[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching recent activities:', error);
        throw error;
      }

      return (data || []).map(dbRowToActivity);
    }

    // Fallback to localStorage
    return getLocalActivities()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },
};
