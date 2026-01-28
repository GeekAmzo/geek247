import type { ProjectGoal } from '@/types/projects';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getItem, setItem, StorageKeys, generateId } from './storage';
import { projectService } from './projectService';

function dbRowToGoal(row: any): ProjectGoal {
  return {
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    description: row.description || undefined,
    status: row.status,
    targetValue: row.target_value ?? undefined,
    currentValue: row.current_value ?? 0,
    unit: row.unit || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function getLocal(): ProjectGoal[] {
  return getItem<ProjectGoal[]>(StorageKeys.PROJECT_GOALS) || [];
}

function saveLocal(items: ProjectGoal[]): void {
  setItem(StorageKeys.PROJECT_GOALS, items);
}

export const goalService = {
  async getByProject(projectId: string): Promise<ProjectGoal[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('project_goals')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching goals:', error);
        throw error;
      }

      return (data || []).map(dbRowToGoal);
    }

    return getLocal().filter((g) => g.projectId === projectId);
  },

  async create(data: Omit<ProjectGoal, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProjectGoal> {
    if (isSupabaseConfigured && supabase) {
      const { data: newItem, error } = await supabase
        .from('project_goals')
        .insert({
          project_id: data.projectId,
          title: data.title,
          description: data.description || null,
          status: data.status,
          target_value: data.targetValue ?? null,
          current_value: data.currentValue ?? 0,
          unit: data.unit || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating goal:', error);
        throw error;
      }

      return dbRowToGoal(newItem);
    }

    const items = getLocal();
    const now = new Date().toISOString();
    const newItem: ProjectGoal = { ...data, id: generateId(), createdAt: now, updatedAt: now };
    items.push(newItem);
    saveLocal(items);
    return newItem;
  },

  async update(id: string, data: Partial<ProjectGoal>): Promise<ProjectGoal | null> {
    if (isSupabaseConfigured && supabase) {
      const updateData: any = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description || null;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.targetValue !== undefined) updateData.target_value = data.targetValue ?? null;
      if (data.currentValue !== undefined) updateData.current_value = data.currentValue;
      if (data.unit !== undefined) updateData.unit = data.unit || null;

      const { data: updated, error } = await supabase
        .from('project_goals')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating goal:', error);
        throw error;
      }

      return updated ? dbRowToGoal(updated) : null;
    }

    const items = getLocal();
    const index = items.findIndex((g) => g.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...data, updatedAt: new Date().toISOString() };
    saveLocal(items);
    return items[index];
  },

  async delete(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('project_goals').delete().eq('id', id);
      if (error) { console.error('Error deleting goal:', error); throw error; }
      return true;
    }

    const items = getLocal();
    const filtered = items.filter((g) => g.id !== id);
    if (filtered.length === items.length) return false;
    saveLocal(filtered);
    return true;
  },

  async getByClientId(clientId: string): Promise<ProjectGoal[]> {
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

      // Fetch goals for all projects
      const { data, error } = await supabase
        .from('project_goals')
        .select('*')
        .in('project_id', projectIds)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching client goals:', error);
        throw error;
      }

      return (data || []).map(dbRowToGoal);
    }

    // localStorage fallback
    const projects = await projectService.getByClientId(clientId);
    const projectIds = projects.map((p) => p.id);
    return getLocal().filter((g) => projectIds.includes(g.projectId));
  },
};
