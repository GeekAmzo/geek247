import type { Lead, LeadFilters, LeadStats, LeadStatus } from '@/types/crm';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getItem, setItem, StorageKeys, generateId } from './storage';
import { activityService } from './activityService';

// Helper to convert database row to Lead type
function dbRowToLead(row: any): Lead {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone || undefined,
    company: row.company || undefined,
    jobTitle: row.job_title || undefined,
    website: row.website || undefined,
    status: row.status,
    source: row.source,
    serviceInterest: row.service_interest || [],
    budgetRange: row.budget_range || undefined,
    timeline: row.timeline || undefined,
    message: row.message || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Helper to convert Lead to database insert format
function leadToDbRow(lead: Partial<Lead>) {
  return {
    first_name: lead.firstName,
    last_name: lead.lastName,
    email: lead.email,
    phone: lead.phone || null,
    company: lead.company || null,
    job_title: lead.jobTitle || null,
    website: lead.website || null,
    status: lead.status,
    source: lead.source,
    service_interest: lead.serviceInterest || [],
    budget_range: lead.budgetRange || null,
    timeline: lead.timeline || null,
    message: lead.message || null,
  };
}

// localStorage fallback functions
function getLocalLeads(): Lead[] {
  return getItem<Lead[]>(StorageKeys.LEADS) || [];
}

function saveLocalLeads(leads: Lead[]): void {
  setItem(StorageKeys.LEADS, leads);
}

export const leadService = {
  async getAll(filters?: LeadFilters): Promise<Lead[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('leads').select('*');

      if (filters) {
        if (filters.status && filters.status !== 'all') {
          query = query.eq('status', filters.status);
        }
        if (filters.source && filters.source !== 'all') {
          query = query.eq('source', filters.source);
        }
        if (filters.search) {
          query = query.or(
            `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,company.ilike.%${filters.search}%`
          );
        }
        if (filters.dateFrom) {
          query = query.gte('created_at', filters.dateFrom);
        }
        if (filters.dateTo) {
          query = query.lte('created_at', filters.dateTo);
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching leads:', error);
        throw error;
      }

      return (data || []).map(dbRowToLead);
    }

    // Fallback to localStorage
    let leads = getLocalLeads();

    if (filters) {
      if (filters.status && filters.status !== 'all') {
        leads = leads.filter((lead) => lead.status === filters.status);
      }
      if (filters.source && filters.source !== 'all') {
        leads = leads.filter((lead) => lead.source === filters.source);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        leads = leads.filter(
          (lead) =>
            lead.firstName.toLowerCase().includes(searchLower) ||
            lead.lastName.toLowerCase().includes(searchLower) ||
            lead.email.toLowerCase().includes(searchLower) ||
            lead.company?.toLowerCase().includes(searchLower)
        );
      }
      if (filters.dateFrom) {
        leads = leads.filter((lead) => lead.createdAt >= filters.dateFrom!);
      }
      if (filters.dateTo) {
        leads = leads.filter((lead) => lead.createdAt <= filters.dateTo!);
      }
    }

    return leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getById(id: string): Promise<Lead | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        console.error('Error fetching lead:', error);
        throw error;
      }

      return data ? dbRowToLead(data) : null;
    }

    const leads = getLocalLeads();
    return leads.find((lead) => lead.id === id) || null;
  },

  async create(data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Lead> {
    if (isSupabaseConfigured && supabase) {
      const { data: newLead, error } = await supabase
        .from('leads')
        .insert({
          ...leadToDbRow({ ...data, status: 'new' }),
          status: 'new',
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating lead:', error);
        throw error;
      }

      const lead = dbRowToLead(newLead);

      // Create initial activity
      await activityService.create({
        leadId: lead.id,
        type: 'created',
        title: 'Lead created',
        description: `Lead submitted via ${data.source} form`,
      });

      return lead;
    }

    // Fallback to localStorage
    const leads = getLocalLeads();
    const now = new Date().toISOString();

    const newLead: Lead = {
      ...data,
      id: generateId(),
      status: 'new',
      createdAt: now,
      updatedAt: now,
    };

    leads.push(newLead);
    saveLocalLeads(leads);

    await activityService.create({
      leadId: newLead.id,
      type: 'created',
      title: 'Lead created',
      description: `Lead submitted via ${data.source} form`,
    });

    return newLead;
  },

  async update(id: string, data: Partial<Lead>): Promise<Lead | null> {
    if (isSupabaseConfigured && supabase) {
      const updateData: any = {};
      if (data.firstName !== undefined) updateData.first_name = data.firstName;
      if (data.lastName !== undefined) updateData.last_name = data.lastName;
      if (data.email !== undefined) updateData.email = data.email;
      if (data.phone !== undefined) updateData.phone = data.phone || null;
      if (data.company !== undefined) updateData.company = data.company || null;
      if (data.jobTitle !== undefined) updateData.job_title = data.jobTitle || null;
      if (data.website !== undefined) updateData.website = data.website || null;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.source !== undefined) updateData.source = data.source;
      if (data.serviceInterest !== undefined) updateData.service_interest = data.serviceInterest;
      if (data.budgetRange !== undefined) updateData.budget_range = data.budgetRange || null;
      if (data.timeline !== undefined) updateData.timeline = data.timeline || null;
      if (data.message !== undefined) updateData.message = data.message || null;

      const { data: updatedLead, error } = await supabase
        .from('leads')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating lead:', error);
        throw error;
      }

      return updatedLead ? dbRowToLead(updatedLead) : null;
    }

    // Fallback to localStorage
    const leads = getLocalLeads();
    const index = leads.findIndex((lead) => lead.id === id);

    if (index === -1) return null;

    const oldLead = leads[index];
    const updatedLead: Lead = {
      ...oldLead,
      ...data,
      id: oldLead.id,
      createdAt: oldLead.createdAt,
      updatedAt: new Date().toISOString(),
    };

    leads[index] = updatedLead;
    saveLocalLeads(leads);

    return updatedLead;
  },

  async updateStatus(id: string, status: LeadStatus): Promise<Lead | null> {
    const lead = await this.getById(id);
    if (!lead) return null;

    const oldStatus = lead.status;
    const updatedLead = await this.update(id, { status });

    if (updatedLead) {
      await activityService.create({
        leadId: id,
        type: 'status_change',
        title: 'Status changed',
        description: `Changed from ${oldStatus} to ${status}`,
      });
    }

    return updatedLead;
  },

  async delete(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      // Activities are deleted automatically via CASCADE
      const { error } = await supabase.from('leads').delete().eq('id', id);

      if (error) {
        console.error('Error deleting lead:', error);
        throw error;
      }

      return true;
    }

    // Fallback to localStorage
    const leads = getLocalLeads();
    const filtered = leads.filter((lead) => lead.id !== id);

    if (filtered.length === leads.length) return false;

    saveLocalLeads(filtered);
    await activityService.deleteByLeadId(id);

    return true;
  },

  async getStats(): Promise<LeadStats> {
    const leads = await this.getAll();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const byStatus: Record<LeadStatus, number> = {
      new: 0,
      contacted: 0,
      qualified: 0,
      proposal: 0,
      won: 0,
      lost: 0,
    };

    leads.forEach((lead) => {
      byStatus[lead.status]++;
    });

    const thisMonth = leads.filter((lead) => lead.createdAt >= startOfMonth).length;
    const closedLeads = byStatus.won + byStatus.lost;
    const conversionRate = closedLeads > 0 ? (byStatus.won / closedLeads) * 100 : 0;

    return {
      total: leads.length,
      byStatus,
      thisMonth,
      conversionRate: Math.round(conversionRate),
    };
  },

  async getRecent(limit: number = 5): Promise<Lead[]> {
    const leads = await this.getAll();
    return leads.slice(0, limit);
  },
};
