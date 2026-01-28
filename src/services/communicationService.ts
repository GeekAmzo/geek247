import type { ClientCommunication } from '@/types/projects';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getItem, setItem, StorageKeys, generateId } from './storage';

function dbRowToCommunication(row: any): ClientCommunication {
  return {
    id: row.id,
    clientId: row.client_id,
    projectId: row.project_id || undefined,
    authorId: row.author_id || undefined,
    type: row.type,
    direction: row.direction,
    subject: row.subject || undefined,
    content: row.content,
    createdAt: row.created_at,
    authorName: row.user_profiles?.full_name || undefined,
  };
}

function getLocalCommunications(): ClientCommunication[] {
  return getItem<ClientCommunication[]>(StorageKeys.CLIENT_COMMUNICATIONS) || [];
}

function saveLocalCommunications(items: ClientCommunication[]): void {
  setItem(StorageKeys.CLIENT_COMMUNICATIONS, items);
}

export const communicationService = {
  async getByClient(clientId: string): Promise<ClientCommunication[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('client_communications')
        .select('*, user_profiles(full_name)')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching communications:', error);
        throw error;
      }

      return (data || []).map(dbRowToCommunication);
    }

    return getLocalCommunications()
      .filter((c) => c.clientId === clientId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getByProject(projectId: string): Promise<ClientCommunication[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('client_communications')
        .select('*, user_profiles(full_name)')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching communications:', error);
        throw error;
      }

      return (data || []).map(dbRowToCommunication);
    }

    return getLocalCommunications()
      .filter((c) => c.projectId === projectId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async create(data: Omit<ClientCommunication, 'id' | 'createdAt' | 'authorName'>): Promise<ClientCommunication> {
    if (isSupabaseConfigured && supabase) {
      const { data: newItem, error } = await supabase
        .from('client_communications')
        .insert({
          client_id: data.clientId,
          project_id: data.projectId || null,
          author_id: data.authorId || null,
          type: data.type,
          direction: data.direction,
          subject: data.subject || null,
          content: data.content,
        })
        .select('*, user_profiles(full_name)')
        .single();

      if (error) {
        console.error('Error creating communication:', error);
        throw error;
      }

      return dbRowToCommunication(newItem);
    }

    const items = getLocalCommunications();
    const newItem: ClientCommunication = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    items.push(newItem);
    saveLocalCommunications(items);
    return newItem;
  },
};
