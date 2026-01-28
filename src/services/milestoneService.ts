import type { ProjectMilestone } from '@/types/projects';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getItem, setItem, StorageKeys, generateId } from './storage';
import { projectService } from './projectService';

function dbRowToMilestone(row: any): ProjectMilestone {
  return {
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    description: row.description || undefined,
    status: row.status,
    targetDate: row.target_date || undefined,
    completedDate: row.completed_date || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function getLocal(): ProjectMilestone[] {
  return getItem<ProjectMilestone[]>(StorageKeys.PROJECT_MILESTONES) || [];
}

function saveLocal(items: ProjectMilestone[]): void {
  setItem(StorageKeys.PROJECT_MILESTONES, items);
}

export const milestoneService = {
  async getByProject(projectId: string): Promise<ProjectMilestone[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('project_milestones')
        .select('*')
        .eq('project_id', projectId)
        .order('target_date', { ascending: true, nullsFirst: false });

      if (error) {
        console.error('Error fetching milestones:', error);
        throw error;
      }

      return (data || []).map(dbRowToMilestone);
    }

    return getLocal().filter((m) => m.projectId === projectId);
  },

  async create(data: Omit<ProjectMilestone, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProjectMilestone> {
    if (isSupabaseConfigured && supabase) {
      const { data: newItem, error } = await supabase
        .from('project_milestones')
        .insert({
          project_id: data.projectId,
          title: data.title,
          description: data.description || null,
          status: data.status,
          target_date: data.targetDate || null,
          completed_date: data.completedDate || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating milestone:', error);
        throw error;
      }

      return dbRowToMilestone(newItem);
    }

    const items = getLocal();
    const now = new Date().toISOString();
    const newItem: ProjectMilestone = { ...data, id: generateId(), createdAt: now, updatedAt: now };
    items.push(newItem);
    saveLocal(items);
    return newItem;
  },

  async update(id: string, data: Partial<ProjectMilestone>): Promise<ProjectMilestone | null> {
    if (isSupabaseConfigured && supabase) {
      const updateData: any = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description || null;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.targetDate !== undefined) updateData.target_date = data.targetDate || null;
      if (data.completedDate !== undefined) updateData.completed_date = data.completedDate || null;

      const { data: updated, error } = await supabase
        .from('project_milestones')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating milestone:', error);
        throw error;
      }

      return updated ? dbRowToMilestone(updated) : null;
    }

    const items = getLocal();
    const index = items.findIndex((m) => m.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...data, updatedAt: new Date().toISOString() };
    saveLocal(items);
    return items[index];
  },

  async delete(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('project_milestones').delete().eq('id', id);
      if (error) { console.error('Error deleting milestone:', error); throw error; }
      return true;
    }

    const items = getLocal();
    const filtered = items.filter((m) => m.id !== id);
    if (filtered.length === items.length) return false;
    saveLocal(filtered);
    return true;
  },

  async getByClientId(clientId: string): Promise<ProjectMilestone[]> {
    if (isSupabaseConfigured && supabase) {
      // First fetch project IDs for this client
      const { data: projects, error: projectError } = await supabase
        .from('projects')
        .select('id')
        .eq('client_id', clientId);

      if (projectError) {
        console.error('Error fetching client projects:', projectError);
        throw projectError;
      }

      if (!projects || projects.length === 0) {
        return [];
      }

      const projectIds = projects.map((p) => p.id);

      // Fetch milestones for all projects
      const { data, error } = await supabase
        .from('project_milestones')
        .select('*')
        .in('project_id', projectIds)
        .order('target_date', { ascending: true, nullsFirst: false });

      if (error) {
        console.error('Error fetching client milestones:', error);
        throw error;
      }

      return (data || []).map(dbRowToMilestone);
    }

    // localStorage fallback
    const projects = await projectService.getByClientId(clientId);
    const projectIds = projects.map((p) => p.id);
    return getLocal().filter((m) => projectIds.includes(m.projectId));
  },
};
