import type { ProjectDeliverable } from '@/types/projects';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getItem, setItem, StorageKeys, generateId } from './storage';
import { projectService } from './projectService';

function dbRowToDeliverable(row: any): ProjectDeliverable {
  return {
    id: row.id,
    projectId: row.project_id,
    milestoneId: row.milestone_id || undefined,
    title: row.title,
    description: row.description || undefined,
    status: row.status,
    acceptanceCriteria: row.acceptance_criteria || undefined,
    dueDate: row.due_date || undefined,
    completedDate: row.completed_date || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function getLocal(): ProjectDeliverable[] {
  return getItem<ProjectDeliverable[]>(StorageKeys.PROJECT_DELIVERABLES) || [];
}

function saveLocal(items: ProjectDeliverable[]): void {
  setItem(StorageKeys.PROJECT_DELIVERABLES, items);
}

export const deliverableService = {
  async getByProject(projectId: string): Promise<ProjectDeliverable[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('project_deliverables')
        .select('*')
        .eq('project_id', projectId)
        .order('due_date', { ascending: true, nullsFirst: false });

      if (error) {
        console.error('Error fetching deliverables:', error);
        throw error;
      }

      return (data || []).map(dbRowToDeliverable);
    }

    return getLocal().filter((d) => d.projectId === projectId);
  },

  async create(data: Omit<ProjectDeliverable, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProjectDeliverable> {
    if (isSupabaseConfigured && supabase) {
      const { data: newItem, error } = await supabase
        .from('project_deliverables')
        .insert({
          project_id: data.projectId,
          milestone_id: data.milestoneId || null,
          title: data.title,
          description: data.description || null,
          status: data.status,
          acceptance_criteria: data.acceptanceCriteria || null,
          due_date: data.dueDate || null,
          completed_date: data.completedDate || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating deliverable:', error);
        throw error;
      }

      return dbRowToDeliverable(newItem);
    }

    const items = getLocal();
    const now = new Date().toISOString();
    const newItem: ProjectDeliverable = { ...data, id: generateId(), createdAt: now, updatedAt: now };
    items.push(newItem);
    saveLocal(items);
    return newItem;
  },

  async update(id: string, data: Partial<ProjectDeliverable>): Promise<ProjectDeliverable | null> {
    if (isSupabaseConfigured && supabase) {
      const updateData: any = {};
      if (data.milestoneId !== undefined) updateData.milestone_id = data.milestoneId || null;
      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description || null;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.acceptanceCriteria !== undefined) updateData.acceptance_criteria = data.acceptanceCriteria || null;
      if (data.dueDate !== undefined) updateData.due_date = data.dueDate || null;
      if (data.completedDate !== undefined) updateData.completed_date = data.completedDate || null;

      const { data: updated, error } = await supabase
        .from('project_deliverables')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating deliverable:', error);
        throw error;
      }

      return updated ? dbRowToDeliverable(updated) : null;
    }

    const items = getLocal();
    const index = items.findIndex((d) => d.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...data, updatedAt: new Date().toISOString() };
    saveLocal(items);
    return items[index];
  },

  async delete(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('project_deliverables').delete().eq('id', id);
      if (error) { console.error('Error deleting deliverable:', error); throw error; }
      return true;
    }

    const items = getLocal();
    const filtered = items.filter((d) => d.id !== id);
    if (filtered.length === items.length) return false;
    saveLocal(filtered);
    return true;
  },

  async getByClientId(clientId: string): Promise<ProjectDeliverable[]> {
    if (isSupabaseConfigured && supabase) {
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

      const { data, error } = await supabase
        .from('project_deliverables')
        .select('*')
        .in('project_id', projectIds)
        .order('due_date', { ascending: true, nullsFirst: false });

      if (error) {
        console.error('Error fetching client deliverables:', error);
        throw error;
      }

      return (data || []).map(dbRowToDeliverable);
    }

    const projects = await projectService.getByClientId(clientId);
    const projectIds = projects.map((p) => p.id);
    return getLocal().filter((d) => projectIds.includes(d.projectId));
  },
};
