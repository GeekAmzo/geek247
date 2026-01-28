import type { Client, ClientFilters, ClientStatus } from '@/types/clients';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getItem, setItem, StorageKeys, generateId } from './storage';

function dbRowToClient(row: any): Client {
  return {
    id: row.id,
    companyName: row.company_name,
    contactName: row.contact_name,
    email: row.email,
    phone: row.phone || undefined,
    website: row.website || undefined,
    industry: row.industry || undefined,
    status: row.status,
    notes: row.notes || undefined,
    userProfileId: row.user_profile_id || undefined,
    leadId: row.lead_id || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function getLocalClients(): Client[] {
  return getItem<Client[]>(StorageKeys.CLIENTS) || [];
}

function saveLocalClients(clients: Client[]): void {
  setItem(StorageKeys.CLIENTS, clients);
}

export const clientService = {
  async getAll(filters?: ClientFilters): Promise<Client[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('clients').select('*');

      if (filters) {
        if (filters.status && filters.status !== 'all') {
          query = query.eq('status', filters.status);
        }
        if (filters.search) {
          query = query.or(
            `company_name.ilike.%${filters.search}%,contact_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
          );
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching clients:', error);
        throw error;
      }

      return (data || []).map(dbRowToClient);
    }

    let clients = getLocalClients();

    if (filters) {
      if (filters.status && filters.status !== 'all') {
        clients = clients.filter((c) => c.status === filters.status);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        clients = clients.filter(
          (c) =>
            c.companyName.toLowerCase().includes(searchLower) ||
            c.contactName.toLowerCase().includes(searchLower) ||
            c.email.toLowerCase().includes(searchLower)
        );
      }
    }

    return clients.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getById(id: string): Promise<Client | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        console.error('Error fetching client:', error);
        throw error;
      }

      return data ? dbRowToClient(data) : null;
    }

    const clients = getLocalClients();
    return clients.find((c) => c.id === id) || null;
  },

  async getByLeadId(leadId: string): Promise<Client | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('lead_id', leadId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        console.error('Error fetching client by lead:', error);
        throw error;
      }

      return data ? dbRowToClient(data) : null;
    }

    const clients = getLocalClients();
    return clients.find((c) => c.leadId === leadId) || null;
  },

  async create(data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    if (isSupabaseConfigured && supabase) {
      const { data: newClient, error } = await supabase
        .from('clients')
        .insert({
          company_name: data.companyName,
          contact_name: data.contactName,
          email: data.email,
          phone: data.phone || null,
          website: data.website || null,
          industry: data.industry || null,
          status: data.status,
          notes: data.notes || null,
          user_profile_id: data.userProfileId || null,
          lead_id: data.leadId || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating client:', error);
        throw error;
      }

      return dbRowToClient(newClient);
    }

    const clients = getLocalClients();
    const now = new Date().toISOString();

    const newClient: Client = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };

    clients.push(newClient);
    saveLocalClients(clients);
    return newClient;
  },

  async update(id: string, data: Partial<Client>): Promise<Client | null> {
    if (isSupabaseConfigured && supabase) {
      const updateData: any = {};
      if (data.companyName !== undefined) updateData.company_name = data.companyName;
      if (data.contactName !== undefined) updateData.contact_name = data.contactName;
      if (data.email !== undefined) updateData.email = data.email;
      if (data.phone !== undefined) updateData.phone = data.phone || null;
      if (data.website !== undefined) updateData.website = data.website || null;
      if (data.industry !== undefined) updateData.industry = data.industry || null;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.notes !== undefined) updateData.notes = data.notes || null;
      if (data.userProfileId !== undefined) updateData.user_profile_id = data.userProfileId || null;

      const { data: updated, error } = await supabase
        .from('clients')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating client:', error);
        throw error;
      }

      return updated ? dbRowToClient(updated) : null;
    }

    const clients = getLocalClients();
    const index = clients.findIndex((c) => c.id === id);
    if (index === -1) return null;

    const updatedClient: Client = {
      ...clients[index],
      ...data,
      id: clients[index].id,
      createdAt: clients[index].createdAt,
      updatedAt: new Date().toISOString(),
    };

    clients[index] = updatedClient;
    saveLocalClients(clients);
    return updatedClient;
  },

  async delete(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('clients').delete().eq('id', id);

      if (error) {
        console.error('Error deleting client:', error);
        throw error;
      }

      return true;
    }

    const clients = getLocalClients();
    const filtered = clients.filter((c) => c.id !== id);
    if (filtered.length === clients.length) return false;
    saveLocalClients(filtered);
    return true;
  },
};
