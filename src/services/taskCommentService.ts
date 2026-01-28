import type { TaskComment } from '@/types/projects';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getItem, setItem, StorageKeys, generateId } from './storage';

function dbRowToComment(row: any): TaskComment {
  return {
    id: row.id,
    taskId: row.task_id,
    authorId: row.author_id,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    authorName: row.user_profiles?.full_name || undefined,
  };
}

function getLocal(): TaskComment[] {
  return getItem<TaskComment[]>(StorageKeys.TASK_COMMENTS) || [];
}

function saveLocal(items: TaskComment[]): void {
  setItem(StorageKeys.TASK_COMMENTS, items);
}

export const taskCommentService = {
  async getByTask(taskId: string): Promise<TaskComment[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('task_comments')
        .select('*, user_profiles(full_name)')
        .eq('task_id', taskId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching comments:', error);
        throw error;
      }

      return (data || []).map(dbRowToComment);
    }

    return getLocal()
      .filter((c) => c.taskId === taskId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },

  async create(data: Omit<TaskComment, 'id' | 'createdAt' | 'updatedAt' | 'authorName'>): Promise<TaskComment> {
    if (isSupabaseConfigured && supabase) {
      const { data: newItem, error } = await supabase
        .from('task_comments')
        .insert({
          task_id: data.taskId,
          author_id: data.authorId,
          content: data.content,
        })
        .select('*, user_profiles(full_name)')
        .single();

      if (error) {
        console.error('Error creating comment:', error);
        throw error;
      }

      return dbRowToComment(newItem);
    }

    const items = getLocal();
    const now = new Date().toISOString();
    const newItem: TaskComment = { ...data, id: generateId(), createdAt: now, updatedAt: now };
    items.push(newItem);
    saveLocal(items);
    return newItem;
  },

  async delete(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('task_comments').delete().eq('id', id);
      if (error) { console.error('Error deleting comment:', error); throw error; }
      return true;
    }

    const items = getLocal();
    const filtered = items.filter((c) => c.id !== id);
    if (filtered.length === items.length) return false;
    saveLocal(filtered);
    return true;
  },
};
