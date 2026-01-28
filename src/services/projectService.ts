import type { Project, ProjectFilters } from '@/types/projects';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getItem, setItem, StorageKeys, generateId } from './storage';

function dbRowToProject(row: any): Project {
  return {
    id: row.id,
    name: row.name,
    description: row.description || undefined,
    clientId: row.client_id,
    status: row.status,
    startDate: row.start_date || undefined,
    endDate: row.end_date || undefined,
    budgetCents: row.budget_cents || undefined,
    budgetCurrency: row.budget_currency || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    clientName: row.clients?.company_name || undefined,
  };
}

function getLocalProjects(): Project[] {
  return getItem<Project[]>(StorageKeys.PROJECTS) || [];
}

function saveLocalProjects(projects: Project[]): void {
  setItem(StorageKeys.PROJECTS, projects);
}

export const projectService = {
  async getAll(filters?: ProjectFilters): Promise<Project[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('projects').select('*, clients(company_name)');

      if (filters) {
        if (filters.clientId) {
          query = query.eq('client_id', filters.clientId);
        }
        if (filters.status && filters.status !== 'all') {
          query = query.eq('status', filters.status);
        }
        if (filters.search) {
          query = query.ilike('name', `%${filters.search}%`);
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }

      return (data || []).map(dbRowToProject);
    }

    let projects = getLocalProjects();

    if (filters) {
      if (filters.clientId) {
        projects = projects.filter((p) => p.clientId === filters.clientId);
      }
      if (filters.status && filters.status !== 'all') {
        projects = projects.filter((p) => p.status === filters.status);
      }
      if (filters.search) {
        const s = filters.search.toLowerCase();
        projects = projects.filter((p) => p.name.toLowerCase().includes(s));
      }
    }

    return projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getById(id: string): Promise<Project | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('projects')
        .select('*, clients(company_name)')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        console.error('Error fetching project:', error);
        throw error;
      }

      return data ? dbRowToProject(data) : null;
    }

    const projects = getLocalProjects();
    return projects.find((p) => p.id === id) || null;
  },

  async getByClientId(clientId: string): Promise<Project[]> {
    return this.getAll({ clientId });
  },

  async create(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'clientName'>): Promise<Project> {
    if (isSupabaseConfigured && supabase) {
      const { data: newProject, error } = await supabase
        .from('projects')
        .insert({
          name: data.name,
          description: data.description || null,
          client_id: data.clientId,
          status: data.status,
          start_date: data.startDate || null,
          end_date: data.endDate || null,
          budget_cents: data.budgetCents || null,
          budget_currency: data.budgetCurrency || null,
        })
        .select('*, clients(company_name)')
        .single();

      if (error) {
        console.error('Error creating project:', error);
        throw error;
      }

      return dbRowToProject(newProject);
    }

    const projects = getLocalProjects();
    const now = new Date().toISOString();

    const newProject: Project = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };

    projects.push(newProject);
    saveLocalProjects(projects);
    return newProject;
  },

  async update(id: string, data: Partial<Project>): Promise<Project | null> {
    if (isSupabaseConfigured && supabase) {
      const updateData: any = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.description !== undefined) updateData.description = data.description || null;
      if (data.clientId !== undefined) updateData.client_id = data.clientId;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.startDate !== undefined) updateData.start_date = data.startDate || null;
      if (data.endDate !== undefined) updateData.end_date = data.endDate || null;
      if (data.budgetCents !== undefined) updateData.budget_cents = data.budgetCents || null;
      if (data.budgetCurrency !== undefined) updateData.budget_currency = data.budgetCurrency || null;

      const { data: updated, error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', id)
        .select('*, clients(company_name)')
        .single();

      if (error) {
        console.error('Error updating project:', error);
        throw error;
      }

      return updated ? dbRowToProject(updated) : null;
    }

    const projects = getLocalProjects();
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const updatedProject: Project = {
      ...projects[index],
      ...data,
      id: projects[index].id,
      createdAt: projects[index].createdAt,
      updatedAt: new Date().toISOString(),
    };

    projects[index] = updatedProject;
    saveLocalProjects(projects);
    return updatedProject;
  },

  async delete(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('projects').delete().eq('id', id);

      if (error) {
        console.error('Error deleting project:', error);
        throw error;
      }

      return true;
    }

    const projects = getLocalProjects();
    const filtered = projects.filter((p) => p.id !== id);
    if (filtered.length === projects.length) return false;
    saveLocalProjects(filtered);
    return true;
  },

  async getStats(): Promise<{ total: number; active: number; completed: number }> {
    const projects = await this.getAll();
    return {
      total: projects.length,
      active: projects.filter((p) => p.status === 'active').length,
      completed: projects.filter((p) => p.status === 'completed').length,
    };
  },
};
