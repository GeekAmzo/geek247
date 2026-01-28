import type { ProjectTask, TaskStatus } from '@/types/projects';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getItem, setItem, StorageKeys, generateId } from './storage';
import { projectService } from './projectService';

function dbRowToTask(row: any): ProjectTask {
  return {
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    description: row.description || undefined,
    status: row.status,
    priority: row.priority,
    position: row.position,
    assigneeId: row.assignee_id || undefined,
    parentTaskId: row.parent_task_id || undefined,
    dueDate: row.due_date || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    assigneeName: row.user_profiles?.full_name || undefined,
  };
}

function getLocalTasks(): ProjectTask[] {
  return getItem<ProjectTask[]>(StorageKeys.PROJECT_TASKS) || [];
}

function saveLocalTasks(tasks: ProjectTask[]): void {
  setItem(StorageKeys.PROJECT_TASKS, tasks);
}

export const taskService = {
  async getByProject(projectId: string): Promise<ProjectTask[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('project_tasks')
        .select('*, user_profiles(full_name)')
        .eq('project_id', projectId)
        .order('position', { ascending: true });

      if (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }

      return (data || []).map(dbRowToTask);
    }

    return getLocalTasks()
      .filter((t) => t.projectId === projectId)
      .sort((a, b) => a.position - b.position);
  },

  async getById(id: string): Promise<ProjectTask | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('project_tasks')
        .select('*, user_profiles(full_name)')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        console.error('Error fetching task:', error);
        throw error;
      }

      return data ? dbRowToTask(data) : null;
    }

    const tasks = getLocalTasks();
    return tasks.find((t) => t.id === id) || null;
  },

  async create(data: Omit<ProjectTask, 'id' | 'createdAt' | 'updatedAt' | 'assigneeName' | 'commentCount'>): Promise<ProjectTask> {
    if (isSupabaseConfigured && supabase) {
      const { data: newTask, error } = await supabase
        .from('project_tasks')
        .insert({
          project_id: data.projectId,
          title: data.title,
          description: data.description || null,
          status: data.status,
          priority: data.priority,
          position: data.position,
          assignee_id: data.assigneeId || null,
          parent_task_id: data.parentTaskId || null,
          due_date: data.dueDate || null,
        })
        .select('*, user_profiles(full_name)')
        .single();

      if (error) {
        console.error('Error creating task:', error);
        throw error;
      }

      return dbRowToTask(newTask);
    }

    const tasks = getLocalTasks();
    const now = new Date().toISOString();

    const newTask: ProjectTask = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };

    tasks.push(newTask);
    saveLocalTasks(tasks);
    return newTask;
  },

  async update(id: string, data: Partial<ProjectTask>): Promise<ProjectTask | null> {
    if (isSupabaseConfigured && supabase) {
      const updateData: any = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description || null;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.priority !== undefined) updateData.priority = data.priority;
      if (data.position !== undefined) updateData.position = data.position;
      if (data.assigneeId !== undefined) updateData.assignee_id = data.assigneeId || null;
      if (data.dueDate !== undefined) updateData.due_date = data.dueDate || null;

      const { data: updated, error } = await supabase
        .from('project_tasks')
        .update(updateData)
        .eq('id', id)
        .select('*, user_profiles(full_name)')
        .single();

      if (error) {
        console.error('Error updating task:', error);
        throw error;
      }

      return updated ? dbRowToTask(updated) : null;
    }

    const tasks = getLocalTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;

    const updatedTask: ProjectTask = {
      ...tasks[index],
      ...data,
      id: tasks[index].id,
      createdAt: tasks[index].createdAt,
      updatedAt: new Date().toISOString(),
    };

    tasks[index] = updatedTask;
    saveLocalTasks(tasks);
    return updatedTask;
  },

  async delete(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('project_tasks').delete().eq('id', id);

      if (error) {
        console.error('Error deleting task:', error);
        throw error;
      }

      return true;
    }

    const tasks = getLocalTasks();
    const filtered = tasks.filter((t) => t.id !== id);
    if (filtered.length === tasks.length) return false;
    saveLocalTasks(filtered);
    return true;
  },

  async reorder(taskId: string, newStatus: TaskStatus, newPosition: number): Promise<ProjectTask | null> {
    if (isSupabaseConfigured && supabase) {
      const { data: updated, error } = await supabase
        .from('project_tasks')
        .update({ status: newStatus, position: newPosition })
        .eq('id', taskId)
        .select('*, user_profiles(full_name)')
        .single();

      if (error) {
        console.error('Error reordering task:', error);
        throw error;
      }

      return updated ? dbRowToTask(updated) : null;
    }

    return this.update(taskId, { status: newStatus, position: newPosition });
  },

  async getKanbanBoard(projectId: string): Promise<Record<TaskStatus, ProjectTask[]>> {
    const tasks = await this.getByProject(projectId);
    const board: Record<TaskStatus, ProjectTask[]> = {
      backlog: [],
      todo: [],
      in_progress: [],
      in_review: [],
      done: [],
    };

    tasks.forEach((task) => {
      board[task.status].push(task);
    });

    Object.keys(board).forEach((status) => {
      board[status as TaskStatus].sort((a, b) => a.position - b.position);
    });

    return board;
  },

  async getByClientId(clientId: string): Promise<ProjectTask[]> {
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

      // Fetch tasks for all projects
      const { data, error } = await supabase
        .from('project_tasks')
        .select('*, user_profiles(full_name)')
        .in('project_id', projectIds)
        .order('due_date', { ascending: true, nullsFirst: false });

      if (error) {
        console.error('Error fetching client tasks:', error);
        throw error;
      }

      return (data || []).map(dbRowToTask);
    }

    // localStorage fallback
    const projects = await projectService.getByClientId(clientId);
    const projectIds = projects.map((p) => p.id);
    return getLocalTasks().filter((t) => projectIds.includes(t.projectId));
  },
};
