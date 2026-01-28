import type { ProjectAttachment } from '@/types/projects';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getItem, setItem, StorageKeys, generateId } from './storage';

function dbRowToAttachment(row: any): ProjectAttachment {
  return {
    id: row.id,
    projectId: row.project_id,
    taskId: row.task_id || undefined,
    deliverableId: row.deliverable_id || undefined,
    fileName: row.file_name,
    fileSize: row.file_size,
    fileType: row.file_type,
    storagePath: row.storage_path,
    uploadedBy: row.uploaded_by || undefined,
    createdAt: row.created_at,
  };
}

function getLocal(): ProjectAttachment[] {
  return getItem<ProjectAttachment[]>(StorageKeys.PROJECT_ATTACHMENTS) || [];
}

function saveLocal(items: ProjectAttachment[]): void {
  setItem(StorageKeys.PROJECT_ATTACHMENTS, items);
}

export const projectAttachmentService = {
  async getByProject(projectId: string): Promise<ProjectAttachment[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('project_attachments')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching attachments:', error);
        throw error;
      }

      return (data || []).map(dbRowToAttachment);
    }

    return getLocal().filter((a) => a.projectId === projectId);
  },

  async getByTask(taskId: string): Promise<ProjectAttachment[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('project_attachments')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching attachments:', error);
        throw error;
      }

      return (data || []).map(dbRowToAttachment);
    }

    return getLocal().filter((a) => a.taskId === taskId);
  },

  async upload(
    file: File,
    projectId: string,
    uploadedBy?: string,
    taskId?: string,
    deliverableId?: string
  ): Promise<ProjectAttachment> {
    const storagePath = `${projectId}/${Date.now()}-${file.name}`;

    if (isSupabaseConfigured && supabase) {
      const { error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(storagePath, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw uploadError;
      }

      const { data: newItem, error } = await supabase
        .from('project_attachments')
        .insert({
          project_id: projectId,
          task_id: taskId || null,
          deliverable_id: deliverableId || null,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          storage_path: storagePath,
          uploaded_by: uploadedBy || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating attachment record:', error);
        throw error;
      }

      return dbRowToAttachment(newItem);
    }

    const items = getLocal();
    const newItem: ProjectAttachment = {
      id: generateId(),
      projectId,
      taskId,
      deliverableId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      storagePath,
      uploadedBy,
      createdAt: new Date().toISOString(),
    };

    items.push(newItem);
    saveLocal(items);
    return newItem;
  },

  async delete(id: string, storagePath: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      await supabase.storage.from('project-files').remove([storagePath]);

      const { error } = await supabase.from('project_attachments').delete().eq('id', id);

      if (error) {
        console.error('Error deleting attachment:', error);
        throw error;
      }

      return true;
    }

    const items = getLocal();
    const filtered = items.filter((a) => a.id !== id);
    if (filtered.length === items.length) return false;
    saveLocal(filtered);
    return true;
  },

  async getDownloadUrl(storagePath: string): Promise<string | null> {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.storage
        .from('project-files')
        .createSignedUrl(storagePath, 3600);

      return data?.signedUrl || null;
    }

    return null;
  },
};
